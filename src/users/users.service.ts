import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, In } from 'typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SendGridService } from '@anchan828/nest-sendgrid';
import * as admin from 'firebase-admin';
import { getResponse } from 'src/utils/response';
import { CreateByAdmin } from './dto/create-by-admin.dto';
import { CreateOnWeb } from './dto/create-on-web.dto';
import { CsvParser } from 'nest-csv-parser';
import { createReadStream } from 'fs';
import { extname, join } from 'path';
import { UserCsv } from './dto/user-csv.dto';
import * as EmailValidator from 'email-validator';
import { Role } from './entities/role.entity';
import { Department } from 'src/department/entities/department.entity';
import { v4 as uuidv4 } from 'uuid';
import { readFileSync, writeFileSync } from "fs";
import { FileAssetsService } from 'src/file-assets/file-assets.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly sendGrid: SendGridService,
    private readonly csvParser: CsvParser,
    private readonly fileAssetsService: FileAssetsService,
  ) { }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findById(id: number): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
      relations: ['role', 'dept'],
    });
  }

  async viewUser(ids: string) {
    const idsToNumber = ids.split(',').map(Number);
    const users = await this.usersRepository.find({
      where: {
        id: In(idsToNumber),
      },
      relations: ['role', 'dept', 'updated_by'],
    });
    return getResponse('00', users);
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
      relations: ['role', 'dept'],
    });
    return user;
  }

  async remove(id: number) {
    const user = await this.findById(id);
    const result = await admin.auth().getUserByEmail(user.email);
    await admin.auth().deleteUser(result.uid);
    await this.usersRepository.delete(id);
    return getResponse('00', null);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async createByAdmin(createByAdmin: CreateByAdmin, actorId) {
    for (let i = 0; i < createByAdmin.email.length; i++) {
      const user = this.usersRepository.create({
        email: createByAdmin.email[i],
        status: 'Approved',
        role: createByAdmin.role,
        dept: createByAdmin.dept,
        updated_by: actorId,
      });
      await this.usersRepository.save(user);
    }
    return getResponse('00', null);
  }

  async createUserOnWeb(createOnWeb: CreateOnWeb[], actor: any) {
    let hasPermission = false;
    if (actor.role.role == 'super_admin') {
      hasPermission = true;
    } else if (actor.role.role == 'admin') {
      for (let i = 0; i < createOnWeb.length; i++) {
        if (createOnWeb[i].dept == actor.dept.id && (Number(createOnWeb[i].role) == 2 || Number(createOnWeb[i].role) == 5)) {
          hasPermission = true;
        } else {
          throw new HttpException(getResponse('29', null), HttpStatus.FORBIDDEN);
        }
      }
    }
    if (hasPermission) {
      for (let i = 0; i < createOnWeb.length; i++) {
        let user = this.usersRepository.create({
          ...createOnWeb[i],
          status: 'Approved',
          updated_by: actor.id,
        });
        await this.usersRepository.save(user);
      }
    }
    return getResponse('00', null);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto, actorId) {
    await this.usersRepository.save({
      ...updateUserDto,
      id: Number(id),
      updated_by: actorId,
    });
    const result = await this.usersRepository.findOne(id);
    return getResponse('00', result);
  }

  async findRole(id: number) {
    const result = await this.usersRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    return result.role.role;
  }

  async findByRole(role: string[], dept_id: number, status?: any) {
    const result = await this.usersRepository.find({
      relations: ['role', 'dept'],
      where: {
        role: {
          role: In(role),
        },
        dept: {
          id: dept_id,
        },
        ...status,
      },
    });
    return result;
  }

  async approve(id: number, actorId) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: ['dept'],
    });
    if (user.status == 'WaitingForApprove') {
      this.usersRepository.update(id, {
        status: 'Approved',
        updated_by: actorId,
      });
      this.sendNotiToOne(user.fcm_token);
      this.sendMail(user.email);
      return getResponse('00', null);
    } else {
      throw new HttpException(getResponse('05', null), HttpStatus.FORBIDDEN);
    }
  }

  async sendMail(email: string): Promise<any> {
    const result = await this.sendGrid.send({
      to: email,
      from: '6101013@kmitl.ac.th',
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    });
    return result;
  }

  async sendNotiToOne(token: string): Promise<any> {
    const message = {
      notification: {
        title: 'Your account has been approved',
        body: '12345',
      },
      token: token,
    };
    admin
      .messaging()
      .send(message)
      .then((response) => {
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  }

  async block(id: number, actorId) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: ['dept'],
    });
    if (user.status == 'Blocked') {
      throw new HttpException(getResponse('07', null), HttpStatus.FORBIDDEN);
    } else {
      this.usersRepository.update(id, {
        status: 'Blocked',
        updated_by: actorId,
      });
      return getResponse('00', null);
    }
  }

  async unBlock(id: number, actorId) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: ['dept'],
    });
    if (user.status == 'Blocked') {
      this.usersRepository.update(id, {
        status: 'SignedOut',
        updated_by: actorId,
      });
      return getResponse('00', null);
    } else {
      throw new HttpException(getResponse('06', null), HttpStatus.FORBIDDEN);
    }
  }

  async findByfaceid(filename: string) {
    const result = await this.usersRepository.findOne({
      where: {
        face_id: filename,
      },
      relations: ['dept'],
    });
    console.log('->findByFaceIdResult:', result);
    return result;
  }

  async addFaceid(id: number, imagebase64: string, actor: any) {
    const fileName = this.fileAssetsService.saveFaceeId(imagebase64, id);
    await this.usersRepository.update(id, { face_id: fileName, updated_by: actor });
    return getResponse('00', null);
  }

  async parse(actor: any) {
    // Create stream from file (or get it from S3)
    const csvPath = getCSVFile();
    // console.log('filename: ', csvPath);
    const stream = createReadStream(csvPath)
    // console.log('stream: ', stream);
    let entities: any = await this.csvParser.parse(
      stream,
      UserCsv,
      null,
      null,
      { strict: true, separator: ',' }
    )
    let data = entities.list;
    for (let i in data) {
      let key = Object.keys(data[i]);
      data[i].firstName = data[i][key[0]];
      delete data[i][key[0]];
      data[i].tel = data[i].tel.split('-').join('');
    }
    const role = await this.getAllRole();
    // console.log('role: ', role);

    const dept = await this.getAllDept();
    console.log('data: ', typeof data[0].role);

    var mapFunction = {
      firstName: (...args) => {
        // console.log('firstName: ', isNull(args[0]) || isString(args[0]))
        return isNull(args[0]) || isString(args[0]);
      },
      lastName: (...args) => {
        // console.log('lastName: ', isNull(args[0]) || isString(args[0]))
        return isNull(args[0]) || isString(args[0]);
      },
      email: (...args) => {
        // console.log('email: ', isNotEmpty(args[0]) && EmailValidator.validate(args[0]))
        return isNotEmpty(args[0]) && EmailValidator.validate(args[0]);
      },
      role: (...args) => {
        // console.log('role: ', isNotEmpty(args[0]) && checkRole(args[0], args[1]));
        return isNotEmpty(args[0]) && checkRole(args[0], args[1]);
      },
      dept: (...args) => {
        // console.log('dept: ', isNotEmpty(args[0]) && checkDept(args[0], args[2]))
        return isNotEmpty(args[0]) && checkDept(args[0], args[2]);
      },
      tel: (...args) => {
        // console.log('tel: ', isNull(args[0]) || isTel(args[0]))
        return isNull(args[0]) || isTel(args[0]);
      }
    }

    for (const i in data) {
      let key = Object.keys(data[i]);
      for (const j in key) {
        const checkData = mapFunction[key[j]](data[i][key[j]], role, dept);
        if (checkData == false) {
          const err = `row ${Number(i) + 2} column ${key[j]}`;
          throw new HttpException(getResponse('30', err), HttpStatus.FORBIDDEN);
        }

        if (key[j] == 'role') {
          const roleName = data[i][key[j]];
          data[i][key[j]] = await this.getRoleByName(roleName);
          console.log('data', typeof data[i][key[j]]);
        } else if (key[j] == 'dept') {
          const deptName = data[i][key[j]];
          data[i][key[j]] = await this.getDeptByName(deptName);
        }
      }
    }
    return this.createUserOnWeb(data, actor);
  }

  async getAllRole() {
    const role = await createQueryBuilder().select("role").from(Role, "role")
      .getMany()
    return role;
  }

  async getRoleByName(name: string) {
    const role = await createQueryBuilder().select("role").from(Role, "role")
      .where("role.role = :name", { name })
      .getOne()
    return role.id;
  }
  async getAllDept() {
    const dept = await createQueryBuilder().select("dept").from(Department, "dept")
      .getMany()
    return dept;
  }

  async getDeptByName(name: string) {
    const dept = await createQueryBuilder().select("dept").from(Department, "dept")
      .where("dept.dept_name = :name", { name })
      .getOne()
    return dept.id;
  }
}

export const csvFileName = (req, file, callback) => {
  //const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  callback(null, `data${fileExtName}`);
};

export const getCSVFile = () => {
  //const name = file.originalname.split('.')[0];
  const filePath = join(__dirname, "..", "..", "uploads/csv", "data.csv");
  return filePath;
};

export const csvFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(csv)$/)) {
    return callback(new Error('Only CSV files are allowed!'), false);
  }
  callback(null, true);
};

const isNull = (data) => {
  return data === '';
}

const isNotEmpty = (data) => {
  return data != '';
}

const isString = (data) => {
  const reg = /[a-zA-z]{3,20}/;
  return Boolean(data.match(reg));
}

const isTel = (data) => {
  const reg = /^06|08|09\d{8}/;
  return Boolean(data.match(reg));
}

const checkRole = (data, role) => {
  for (let i in role) {
    if (role[i].role == data) {
      return true;
    }
  }
  return false;
}

const checkDept = (data, dept) => {
  for (let i in dept) {
    if (dept[i].dept_name == data) {
      return true;
    }
  }
  return false;
}
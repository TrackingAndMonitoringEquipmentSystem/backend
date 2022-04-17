import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EquipmentService } from 'src/equipment/equipment.service';
import { getResponse } from 'src/utils/response';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    private readonly equipmentService: EquipmentService,
  ) { }

  async create(id: number, createReportDto: CreateReportDto, actor: any) {
    const today = new Date();
    let equip = await this.equipmentService.findOne(id);
    let report = this.reportRepository.create({
      reported_at: today,
      status: 'ยังไม่ได้รับเรื่อง',
      description: createReportDto.description,
      user: actor,
      equipment: equip,
    });
    await this.reportRepository.save(report);
    return getResponse('00', report);
  }

  async findAll() {
    let result = await this.reportRepository.find();
    return getResponse('00', result);
  }

  async findOne(id: number) {
    let report = await this.reportRepository.findOne(id);
    return report;
  }

  async view(ids: string) {
    let reportIds = ids.split(',').map(Number);
    let report = await this.reportRepository.findByIds(reportIds,
      {
        relations: ['equipment', 'user']
      });
      if(report.length == reportIds.length) {
        return getResponse('00', report);
      } else {
        throw new HttpException(getResponse('27', null), HttpStatus.FORBIDDEN);
      }
  }
  
  async update(id: number, updateReportDto: UpdateReportDto) {
    await this.reportRepository.update(id, updateReportDto);
    let report = await this.findOne(id);
    if(report) {
      return getResponse('00', report);
    } else {
      throw new HttpException(getResponse('27', null), HttpStatus.FORBIDDEN);
    }
  }

  async remove(id: number) {
    await this.reportRepository.delete(id);
    return getResponse('00', null);
  }
}

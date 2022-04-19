import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BorrowReturnService } from 'src/borrow-return/borrow-return.service';
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
    private readonly borrowReturnService: BorrowReturnService
  ) { }

  async create(equipmentId: number, borrowId: number, createReportDto: CreateReportDto, actor: any) {
    const today = new Date();
    let report;
    let equip = await this.equipmentService.findOne(equipmentId);
    if (borrowId == null) {
      report = this.reportRepository.create({
        reported_at: today,
        status: 'ยังไม่ได้รับเรื่อง',
        description: createReportDto.description,
        user: actor,
        equipment: equip,
        borrowReturn: null
      });
      await this.reportRepository.save(report);
    } else {
      const borrow = await this.borrowReturnService.findOne(borrowId);
      report = this.reportRepository.create({
        reported_at: today,
        status: 'ยังไม่ได้รับเรื่อง',
        description: createReportDto.description,
        user: actor,
        equipment: equip,
        borrowReturn: borrow,
      });
      await this.reportRepository.save(report);
      await this.borrowReturnService.updateStatus(borrowId, 'ผิดพลาด');
    }
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
    if (report.length == reportIds.length) {
      return getResponse('00', report);
    } else {
      throw new HttpException(getResponse('27', null), HttpStatus.FORBIDDEN);
    }
  }

  async update(id: number, updateReportDto: UpdateReportDto, actor: any) {
    let report = await this.reportRepository.findOne(id,{
      relations: ['equipment', 'borrowReturn'],
    });
    console.log('report', report);
    if(updateReportDto.status == 'พร้อมใช้งาน') {
      await this.equipmentService.updateStatus(report.equipment.equipment_id, 'พร้อมใช้งาน', actor)
      await this.borrowReturnService.updateStatus(+report.borrowReturn, 'คืนแล้ว')
    } else if(updateReportDto.status == 'ถูกยืม') {
      await this.equipmentService.updateStatus(+report.equipment, 'ถูกยืมอยู่', actor)
      await this.borrowReturnService.updateStatus(+report.borrowReturn, 'ยืมอยู่')
    } else if(updateReportDto.status == 'ส่งซ่อม') {
      await this.equipmentService.updateStatus(+report.equipment, 'แจ้งซ่อม', actor)
      await this.borrowReturnService.updateStatus(+report.borrowReturn, 'คืนแล้ว')
    }
    await this.reportRepository.update(id, {status: 'เสร็จสิ้น'});
    report = await this.reportRepository.findOne(id);
    return getResponse('00', report);
    // if (report) {
    //   return getResponse('00', report);
    // } else {
    //   throw new HttpException(getResponse('27', null), HttpStatus.FORBIDDEN);
    // }
  }

  async remove(id: number) {
    await this.reportRepository.delete(id);
    return getResponse('00', null);
  }
}

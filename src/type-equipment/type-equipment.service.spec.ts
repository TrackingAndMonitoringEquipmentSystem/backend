import { Test, TestingModule } from '@nestjs/testing';
import { TypeEquipmentService } from './type-equipment.service';

describe('TypeEquipmentService', () => {
  let service: TypeEquipmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeEquipmentService],
    }).compile();

    service = module.get<TypeEquipmentService>(TypeEquipmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

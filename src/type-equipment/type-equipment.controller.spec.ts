import { Test, TestingModule } from '@nestjs/testing';
import { TypeEquipmentController } from './type-equipment.controller';
import { TypeEquipmentService } from './type-equipment.service';

describe('TypeEquipmentController', () => {
  let controller: TypeEquipmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeEquipmentController],
      providers: [TypeEquipmentService],
    }).compile();

    controller = module.get<TypeEquipmentController>(TypeEquipmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

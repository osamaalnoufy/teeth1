import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from 'src/entities/doctor.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateDoctorDto } from './dto/createDoctorDto';
// import * as bcrypt from 'bcrypt';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    private dataSource: DataSource,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const { email, name, phone } = createDoctorDto;

    // بداية المعاملة
    const queryRunner =
      this.doctorRepository.manager.connection.createQueryRunner();

    // إنشاء معاملة جديدة وحصول قفل على البيانات
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const [emailExists, nameExists, phoneExists] = await Promise.all([
        queryRunner.manager.findOne(Doctor, { where: { email } }),
        queryRunner.manager.findOne(Doctor, { where: { name } }),
        queryRunner.manager.findOne(Doctor, { where: { phone } }),
      ]);

      if (emailExists || nameExists || phoneExists) {
        let existsMessage = '';
        if (emailExists) {
          existsMessage += 'The email is already in use.';
        }
        if (nameExists) {
          existsMessage += 'The name is already in use.';
        }
        if (phoneExists) {
          existsMessage += 'The phone number is already in use.';
        }
        throw new ConflictException(existsMessage.trim());
      }

      const newDoctor = queryRunner.manager.create(Doctor, createDoctorDto);
      await queryRunner.manager.save(newDoctor);

      // تأكيد التغييرات
      await queryRunner.commitTransaction();

      // إرجاع الدكتور الجديد
      return newDoctor;
    } catch (err) {
      // في حالة وجود خطأ، إلغاء كل التغييرات
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // إنهاء القفل وفصل المعاملة
      await queryRunner.release();
    }
  }

  // async validateDoctor(email: string, pass: string): Promise<any> {
  //   const doctor = await this.doctorRepository.findOne({ where: { email } });
  //   if (doctor && (await bcrypt.compare(pass, doctor.password))) {
  //     const { password, ...result } = doctor;
  //     return result;
  //   }
  //   return null;
  // }
  
  async findOne(email: string): Promise<Doctor | undefined> {
    return await this.doctorRepository.findOne({ where: { email } });
  }
 

 

  async deleteUser(id: number): Promise<any> {
    const result = await this.doctorRepository.delete(id);
    return result;
  }
}

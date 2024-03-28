import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
 
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  // findAll(): Promise<User[]> {
  //   return this.userRepository.find();
  // }
  // findOne(id: number): Promise<User | null> {
  //   return this.userRepository.findOneBy({ id });
  // }
  // async remove(id: number): Promise<void> {
  //   await this.userRepository.delete(id);
  // }

  findtne(id: string) {
    return {
      id: id,
    };
  }
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, phone } = createUserDto;

    const queryRunner =
      this.userRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const [nameExists, phoneExists] = await Promise.all([
        queryRunner.manager.findOne(User, { where: { name } }),
        queryRunner.manager.findOne(User, { where: { phone } }),
      ]);

      if (nameExists || phoneExists) {
        let existsMessage = '';
        if (nameExists) {
          existsMessage += 'The name is already in use.';
        }
        if (phoneExists) {
          existsMessage += 'The phone number is already in use.';
        }
        throw new ConflictException(existsMessage.trim());
      }

      const newDoctor = queryRunner.manager.create(User, createUserDto);
      await queryRunner.manager.save(newDoctor);

      await queryRunner.commitTransaction();

      return newDoctor;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async validateDoctor(phone: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { phone } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}

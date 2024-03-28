import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
// import { DoctorModule } from 'src/doctor/doctor.module';


@Module({
  imports:[TypeOrmModule.forFeature([User])],
  exports:[TypeOrmModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
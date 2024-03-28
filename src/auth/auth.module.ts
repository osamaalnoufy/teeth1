import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DoctorService } from 'src/doctor/doctor.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStratrgy } from './strategies/local-strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from 'src/entities/doctor.entity';
// import { LocalAuthGuard } from './guards/local-auth.guard';

@Module({
  providers: [AuthService, DoctorService, LocalStratrgy, DoctorService],
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([Doctor]),
    JwtModule.register({
      secret: `${process.env.jwt_secret}`, //jwt_secret=secretjwt4565
      signOptions: { expiresIn: '7d' },
    }),
  ],
})
export class AuthModule {}

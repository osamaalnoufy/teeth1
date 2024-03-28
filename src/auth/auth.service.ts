import { Injectable } from '@nestjs/common';
import { DoctorService } from 'src/doctor/doctor.service';
import * as bcrypt from 'bcrypt';
import { Doctor } from 'src/entities/doctor.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly doctorService: DoctorService,
    private jwtService: JwtService,
  ) {}
  async validateDoctor(email: string, password: string): Promise<any> {
    const doctor = await this.doctorService.findOne(email);
    if (doctor && (await bcrypt.compare(password, doctor.password))) {
      const { password, ...result } = doctor;
      return result;
    }
    return null;
  }

  // async validateDoctor(email: string, pass: string): Promise<any> {
  //   const doctor = await this.doctorRepository.findOne({ where: { email } });
  //   if (doctor && (await bcrypt.compare(pass, doctor.password))) {
  //     const { password, ...result } = doctor;
  //     return result;
  //   }
  //   return null;
  // }
  async login(doctor: Doctor): Promise<{ accessToken: string }> {
    const payload = {
      email: doctor.email,
      sub: doctor.id,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      // refreshToken: this.jwtService.sign(payload, {expiresIn:'7d'})
    };
  }

  // async refershToken(doctor: Doctor): Promise<{ accessToken: string }> {
  //   const payload = {
  //     email: doctor.email,
  //     sub: doctor.id,
  //   };
  //   return {
  //     accessToken: this.jwtService.sign(payload),
  //   };
  // }

}

import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateDoctorDto } from 'src/doctor/dto/createDoctorDto';
import { DoctorService } from 'src/doctor/doctor.service';
// import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private doctorService: DoctorService,
  ) {}
  @Post('sign-up')
  async registerDoctor(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorService.create(createDoctorDto);
  }

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const doctor = await this.authService.validateDoctor(email, password);
    if (!doctor) {
      throw new UnauthorizedException('الإيميل أو كلمة السر غير صحيحة');
    }
    return await this.authService.login(doctor);
  }

  // @Post('refresh')
  // async refreshToken(
  //   @Body('email') email: string,
  //   @Body('password') password: string,
  // ) {
  //   const doctor = await this.authService.validateDoctor(email, password);
  //   if (!doctor) {
  //     throw new UnauthorizedException('الإيميل أو كلمة السر غير صحيحة');
  //   }
  //   return this.authService.refershToken(doctor)
  // }
}

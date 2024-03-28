import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStratrgy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  // async validate(email: string, password: string) {
  //   const doctor = await this.authService.validateDoctor(email, password);
  //   if (!doctor) {
  //     throw new UnauthorizedException('error');
  //   }
  //   return doctor;
  // }

}

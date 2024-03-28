import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  findAll() {
    return 'all users';
  }
  // @Get(':id')
  // findOne(@Param('id') id: number) {
  //   return this.userService.findOne(id);
  //   };

  @Post('sing-up')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Post('login')
  async login(
    @Body('phone') phone: string,
    @Body('password') password: string,
  ) {
    const user = await this.userService.validateDoctor(phone, password);
    if (!user) {
      throw new UnauthorizedException('الإيميل أو كلمة السر غير صحيحة');
    }
    return user; // تعديل بالمستقبل مع الفرونت ايند
  }
}

import { UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/database/entities/users.entity';
import { UserRegisterDTO } from './dtos/user-register.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  getUsers(): string {
    return 'Hello Users!';
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.usersRepository.findOne({ email });
      // if (!user) throw new Error();
      return user;
    } catch (error) {
      throw new BadRequestException('해당하는 사용자를 찾을 수 없습니다.');
    }
  }

  async getUserById(id: number) {
    try {
      const user = await this.usersRepository.findOne({ id });
      if (!user) throw new Error();
      return user;
    } catch (error) {
      throw new BadRequestException('해당하는 사용자를 찾을 수 없습니다.');
    }
  }

  // 에러처리하기
  async registerUser(userRegisterDTO: UserRegisterDTO) {
    const { email } = userRegisterDTO;
    const user = await this.usersRepository.findOne({ email });
    if (user) {
      throw new UnauthorizedException('해당하는 이메일은 이미 존재합니다.');
    }
    const newUser = await this.usersRepository.save({
      ...userRegisterDTO,
    });
    return newUser;
  }

  // id, afterSignUpUpdateUserDTO에 타입주기, 에러처리하기
  async afterSignUpUpdateUser(id, afterSignUpUpdateUserDTO) {
    const updateUser = await this.usersRepository.findOne(id);
    updateUser.schoolName = afterSignUpUpdateUserDTO.schoolName;
    updateUser.studentNumber = afterSignUpUpdateUserDTO.studentNumber;
    updateUser.major1 = afterSignUpUpdateUserDTO.major1;
    updateUser.major2 = afterSignUpUpdateUserDTO.major2;
    updateUser.profileImgUrl = afterSignUpUpdateUserDTO.profileImgUrl;

    return await this.usersRepository.save(updateUser);
  }
}

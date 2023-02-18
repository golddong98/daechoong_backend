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
  async afterSignUpUpdateUser({ userId, afterSocialSignUpDTO }) {
    const updateUser = await this.usersRepository.findOne({ id: userId });
    updateUser.schoolName = afterSocialSignUpDTO.schoolName;
    updateUser.studentNumber = afterSocialSignUpDTO.studentNumber;
    updateUser.major1 = afterSocialSignUpDTO.major1;
    updateUser.major2 = afterSocialSignUpDTO.major2;
    updateUser.profileImgUrl = afterSocialSignUpDTO.profileImgUrl;

    return await this.usersRepository.update(userId, updateUser);
  }

  async checkPermissionLargeCate({ userId, largeCateId }) {
    try {
      const userByUserId = await this.usersRepository.findOne({
        id: userId,
      });

      const largeCatesFromUser = await userByUserId.largeCates;

      // const largeCatesByUserId = await this.usersService.getLargeCatesByUserId({
      //   id: userId,
      // });

      const permission = largeCatesFromUser.some((el) => {
        largeCateId === el.id;
      });

      if (permission) {
        throw new Error();
      }

      return userByUserId;
    } catch (error) {
      throw new BadRequestException('중분류에 항목을 추가할 권한이 없습니다.');
    }
  }

  async checkPermissionMediumCate({ userId, mediumCateId }) {
    try {
      const userByUserId = await this.usersRepository.findOne({
        id: userId,
      });

      const mediumCatesFromUser = await userByUserId.mediumCates;

      const permission = mediumCatesFromUser.some((el) => {
        mediumCateId === el.id;
      });
      if (permission) {
        throw new Error();
      }
      return userByUserId;
    } catch (error) {
      throw new BadRequestException('중분류를 변경할 권한이 없습니다.');
    }
  }
}

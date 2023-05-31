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

  // async getUserByEmail(email: string) {
  //   try {
  //     const user = await this.usersRepository.findOne({ email });
  //     // if (!user) throw new Error();
  //     return user;
  //   } catch (error) {
  //     throw new BadRequestException('해당하는 사용자를 찾을 수 없습니다.');
  //   }
  // }

  async getUserByIdAtFirst({ id }) {
    try {
      const user = await this.usersRepository.findOne({ id });
      return user;
    } catch (error) {
      throw new BadRequestException('해당하는 사용자를 찾을 수 없습니다.');
    }
  }

  async getUserById({ id }) {
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
    const { id } = userRegisterDTO;
    const user = await this.usersRepository.findOne({ id });
    if (user) {
      throw new UnauthorizedException('해당하는 유저는 이미 존재합니다.');
    }
    const newUser = await this.usersRepository.save({
      ...userRegisterDTO,
    });
    return newUser;
  }

  // id, afterSignUpUpdateUserDTO에 타입주기, 에러처리하기
  // async afterSignUpUpdateUser({ userId, afterSocialSignUpDTO }) {
  //   const updateUser = await this.usersRepository.findOne({ id: userId });
  //   updateUser.schoolName = afterSocialSignUpDTO.schoolName;
  //   updateUser.studentNumber = afterSocialSignUpDTO.studentNumber;
  //   updateUser.major1 = afterSocialSignUpDTO.major1;
  //   updateUser.major2 = afterSocialSignUpDTO.major2;
  //   updateUser.profileImgUrl = afterSocialSignUpDTO.profileImgUrl;
  //   updateUser.isActive = true;

  //   return await this.usersRepository.update(userId, updateUser);
  // }

  async getUser({ userId }) {
    return await this.usersRepository.findOne({
      select: ['id', 'name', 'profileImgUrl'],
      where: { id: userId },
    });
  }

  // async updateUser({ userId, updateDTO }) {
  //   const updateUser = this.usersRepository.create({
  //     schoolName: updateDTO.schoolName,
  //     studentNumber: updateDTO.studentNumber,
  //     major1: updateDTO.major1,
  //     major2: updateDTO.major2,
  //     profileImgUrl: updateDTO.profileImgUrl,
  //   });

  //   return await this.usersRepository.update(userId, updateUser);
  // }

  // const newContentInNote = this.notesRepository.create({
  //   content: updateNoteBodyDTO.content,
  // });
  // return await this.notesRepository.update(noteId, newContentInNote);
}

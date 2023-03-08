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
    updateUser.isActive = true;

    return await this.usersRepository.update(userId, updateUser);
  }

  async checkPermissionLargeCate({ userId, largeCateId }) {
    try {
      const confirmedUser = await this.usersRepository.findOne({
        id: userId,
      });

      const largeCatesFromUser = await confirmedUser.largeCates;

      // const largeCatesByUserId = await this.usersService.getLargeCatesByUserId({
      //   id: userId,
      // });

      const confirmedLargeCate = largeCatesFromUser.find((el) => {
        if (largeCateId === el.id) {
          return el;
        }
      });

      if (!confirmedLargeCate) {
        throw new Error();
      }

      return { confirmedUser, confirmedLargeCate };
    } catch (error) {
      throw new BadRequestException('중분류에 항목을 추가할 권한이 없습니다.');
    }
  }

  async checkPermissionMediumCate({ userId, mediumCateId }) {
    try {
      const confirmedUser = await this.usersRepository.findOne({
        id: userId,
      });

      const mediumCatesFromUser = await confirmedUser.mediumCates;

      const confirmedMediumCate = mediumCatesFromUser.find((el) => {
        if (mediumCateId === el.id) {
          return el;
        }
      });
      if (!confirmedMediumCate) {
        throw new Error();
      }
      return { confirmedUser, confirmedMediumCate };
    } catch (error) {
      throw new BadRequestException('중분류를 변경할 권한이 없습니다.');
    }
  }

  async checkPermissionSmallCate({ userId, smallCateId }) {
    try {
      const confirmedUser = await this.usersRepository.findOne({
        id: userId,
      });

      const smallCatesFromUser = await confirmedUser.smallCates;

      const confirmedSmallCate = smallCatesFromUser.find((el) => {
        if (smallCateId === el.id) {
          return el;
        }
      });
      if (!confirmedSmallCate) {
        throw new Error();
      }
      return { confirmedUser, confirmedSmallCate };
    } catch (error) {
      throw new BadRequestException('소분류를 변경할 권한이 없습니다.');
    }
  }

  async checkPermissionNotes({ userId, noteId }) {
    try {
      const confirmedUser = await this.usersRepository.findOne({
        id: userId,
      });

      const notesFromUser = await confirmedUser.notes;

      const confirmedNote = notesFromUser.find((el) => {
        if (noteId === el.id) {
          return el;
        }
      });
      if (!confirmedNote) {
        throw new Error();
      }
      return { confirmedUser, confirmedNote };
    } catch (error) {
      throw new BadRequestException('노트의 글을 변경할 권한이 없습니다.');
    }
  }

  async checkPermissionFile({ userId, fileId }) {
    try {
      const confirmedUser = await this.usersRepository.findOne({
        id: userId,
      });

      const filesFromUser = await confirmedUser.files;

      const confirmedFile = filesFromUser.find((el) => {
        if (fileId === el.id) {
          return el;
        }
      });
      if (!confirmedFile) {
        throw new Error();
      }
      return { confirmedUser, confirmedFile };
    } catch (error) {
      throw new BadRequestException('파일을 변경할 권한이 없습니다.');
    }
  }

  async getUser({ userId }) {
    return await this.usersRepository.findOne({ id: userId });
  }
}

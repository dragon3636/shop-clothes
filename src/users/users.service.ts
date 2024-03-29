import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './user.entity';
import { Repository } from 'typeorm';
import CreateUserDto from './dto/createUser.dto';
import { FilesService } from 'src/files/files.service';
import { FOLDER_AVATAR } from 'src/constant';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly filesService: FilesService
  ) { }
  async getByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      return user;
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  }
  async create(userData: CreateUserDto) {
    const newUser = await this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (user) {
      return user;
    }
    user.password = undefined;
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
    const folder = FOLDER_AVATAR;
    const avatar = await this.filesService.uploadPublicFile(imageBuffer, filename, folder);
    const user = await this.getById(userId);
    await this.usersRepository.update(userId, {
      ...user,
      avatar
    });
    return avatar;
  }
  async getAvatar(idFile: number) {
    if (idFile) {
      const file = this.filesService.getDetailPublicFile(idFile);
      return file;
    }
    return null;
  }
  async deleteAvatar(userId: number) {
    const user = await this.getById(userId);
    const fileId = user.avatar?.id
    if (fileId) {
      await this.usersRepository.update({ id: userId }, {
        ...user,
        avatar: null,
      })
      await this.filesService.deletePublicFile(fileId)
    }
  }
}

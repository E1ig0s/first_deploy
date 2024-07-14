import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
    IUsersServiceCreate,
    IUsersServiceFindOneByEmail,
} from './interfaces/users-service.interface';
import * as bcrypt from 'bcrypt';
import { FilesService } from '../file/files.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly filesService: FilesService,
        private readonly mailService: MailService,
    ) {}

    findOneByEmail({ email }: IUsersServiceFindOneByEmail) {
        return this.usersRepository.findOne({
            where: { email },
            relations: ['boards'],
        });
    }

    async create({
        createUserInput,
        profileImage,
    }: IUsersServiceCreate): Promise<User> {
        const { email, name, password, description } = createUserInput;

        const user = await this.findOneByEmail({ email });

        if (user) throw new ConflictException('이미 등록된 이메일입니다.');

        const hashedPassword = await bcrypt.hash(password, 10);

        let url;
        if (profileImage) {
            url = this.filesService.upload({ file: profileImage });
        }

        const createdUser = await this.usersRepository.save({
            email,
            password: hashedPassword,
            name,
            description,
            profileImage: url,
        });

        this.mailService.sendEmail({
            name: createdUser.name,
            email: createdUser.email,
        });

        return createdUser;
    }
}

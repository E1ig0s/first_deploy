import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { FilesModule } from '../file/files.module';
import { MailModule } from '../mail/mail.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]), FilesModule, MailModule],
    providers: [UsersResolver, UsersService],
    exports: [UsersService],
})
export class UsersModule {}

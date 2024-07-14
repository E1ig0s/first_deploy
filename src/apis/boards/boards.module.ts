import { Module } from '@nestjs/common';
import { BoardsResolver } from './boards.resolver';
import { BoardsService } from './boards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Board]), UsersModule],
    providers: [BoardsResolver, BoardsService],
})
export class BoardsModule {}

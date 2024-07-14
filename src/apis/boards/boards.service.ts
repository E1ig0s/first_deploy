import { Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { Board } from './entities/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    IBoardsServiceCreate,
    IBoardsServiceDelete,
    IBoardsServiceFindByQuery,
    IBoardsServiceFindOne,
    IBoardsServiceUpdate,
} from './interfaces/boards-service.interface';
import { UsersService } from '../users/users.service';

@Injectable({ scope: Scope.DEFAULT })
export class BoardsService {
    constructor(
        @InjectRepository(Board)
        private boardsRepository: Repository<Board>,
        private readonly usersService: UsersService,
    ) {}

    async findByTitle({ query }: IBoardsServiceFindByQuery): Promise<Board[]> {
        const boards = await this.boardsRepository
            .createQueryBuilder('board')
            .where('board.title LIKE :query', {
                query: `%${query}%`,
            })
            .orWhere('board.contents LIKE :query', {
                query: `%${query}%`,
            })
            .take(10)
            .getMany();

        return boards;
    }

    findAll(): Promise<Board[]> {
        return this.boardsRepository.find();
    }

    findOne({ id }: IBoardsServiceFindOne): Promise<Board> {
        return this.boardsRepository.findOne({
            where: { number: id },
            relations: ['author'],
        });
    }

    async create({
        createBoardInput,
        email,
    }: IBoardsServiceCreate): Promise<Board> {
        const user = await this.usersService.findOneByEmail({ email });

        const createdBoard = await this.boardsRepository.save({
            writer: user.name,
            ...createBoardInput,
            author: user,
        });

        return createdBoard;
    }

    async update({
        boardId,
        updateBoardInput,
        userId,
    }: IBoardsServiceUpdate): Promise<Board> {
        const board = await this.findOne({ id: boardId });

        if (board.author.id !== userId) {
            throw new UnauthorizedException('수정 권한이 없습니다');
        }

        const updatedBoard = await this.boardsRepository.save({
            ...board,
            ...updateBoardInput,
        });

        return updatedBoard;
    }

    async delete({ boardId, userId }: IBoardsServiceDelete): Promise<boolean> {
        const board = await this.findOne({ id: boardId });

        if (board.author.id !== userId) {
            throw new UnauthorizedException('삭제 권한이 없습니다');
        }

        const deletedBoard = await this.boardsRepository.softDelete({
            number: boardId,
        });

        return deletedBoard.affected ? true : false;
    }
}

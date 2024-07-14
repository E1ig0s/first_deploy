import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BoardsService } from './boards.service';
import { Board } from './entities/board.entity';
import { CreateBoardInput } from './dto/create-board.input';
import { UpdateBoardInput } from './dto/update-board.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { IContext } from 'src/common/interfaces/context';

@Resolver()
export class BoardsResolver {
    constructor(private readonly boardsService: BoardsService) {}

    @Query(() => [Board])
    searchBoards(@Args('query') query: string): Promise<Board[]> {
        return this.boardsService.findByTitle({ query });
    }

    @Query(() => [Board])
    fetchBoards(): Promise<Board[]> {
        return this.boardsService.findAll();
    }

    @Query(() => Board)
    fetchBoard(@Args('id') id: number): Promise<Board> {
        return this.boardsService.findOne({ id });
    }

    @UseGuards(GqlAuthGuard('access'))
    @Mutation(() => Board)
    createBoard(
        @Args('createBoardInput') createBoardInput: CreateBoardInput,
        @Context() context: IContext,
    ): Promise<Board> {
        return this.boardsService.create({
            createBoardInput,
            email: context.req.user.email,
        });
    }

    @UseGuards(GqlAuthGuard('access'))
    @Mutation(() => Board)
    updateBoard(
        @Args('boardId') boardId: number,
        @Args('updateBoardInput') updateBoardInput: UpdateBoardInput,
        @Context() context: IContext,
    ): Promise<Board> {
        return this.boardsService.update({
            boardId,
            updateBoardInput,
            userId: context.req.user.id,
        });
    }

    @UseGuards(GqlAuthGuard('access'))
    @Mutation(() => Boolean)
    deleteBoard(
        @Args('boardId') boardId: number,
        @Context() context: IContext,
    ): Promise<boolean> {
        return this.boardsService.delete({
            boardId,
            userId: context.req.user.id,
        });
    }
}

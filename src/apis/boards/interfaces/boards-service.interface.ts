import { CreateBoardInput } from '../dto/create-board.input';
import { UpdateBoardInput } from '../dto/update-board.input';

export interface IBoardsServiceCreate {
    createBoardInput: CreateBoardInput;
    email: string;
}

export interface IBoardsServiceFindOne {
    id: number;
}

export interface IBoardsServiceUpdate {
    boardId: number;
    updateBoardInput: UpdateBoardInput;
    userId: string;
}

export interface IBoardsServiceDelete {
    boardId: number;
    userId: string;
}

export interface IBoardsServiceFindByQuery {
    query: string;
}

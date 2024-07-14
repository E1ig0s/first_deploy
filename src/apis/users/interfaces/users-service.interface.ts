import { FileUpload } from 'graphql-upload';
import { CreateUserInput } from '../dto/create-user.input';

export interface IUsersServiceCreate {
    createUserInput: CreateUserInput;
    profileImage: FileUpload;
}

export interface IUsersServiceFindOneByEmail {
    email: string;
}

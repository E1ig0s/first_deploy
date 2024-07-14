import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UseGuards } from '@nestjs/common';
import { IContext } from 'src/common/interfaces/context';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver()
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(GqlAuthGuard('access'))
    @Query(() => User)
    fetchUser(@Context() context: IContext): Promise<User> {
        return this.usersService.findOneByEmail({
            email: context.req.user.email,
        });
    }

    @Mutation(() => User)
    createUser(
        @Args('createUserInput') createUserInput: CreateUserInput,
        @Args({
            name: 'profileImage',
            type: () => GraphQLUpload,
            nullable: true,
        })
        profileImage: FileUpload,
    ): Promise<User> {
        return this.usersService.create({ createUserInput, profileImage });
    }
}

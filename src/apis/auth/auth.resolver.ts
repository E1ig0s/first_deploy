import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { IContext } from 'src/common/interfaces/context';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => String)
    login(
        @Args('email') email: string,
        @Args('password') password: string,
        @Context() context: IContext,
    ): Promise<string> {
        return this.authService.login({ email, password, context });
    }

    @UseGuards(GqlAuthGuard('refresh'))
    @Mutation(() => String)
    restoreAccessToken(@Context() context: IContext): string {
        return this.authService.restoreAccessToken({ user: context.req.user });
    }

    @UseGuards(GqlAuthGuard('access'))
    @Mutation(() => String)
    logout(@Context() context: IContext): Promise<string> {
        const accessToken = context.req.headers['authorization'].split(' ')[1];
        const refreshToken = context.req.headers['refresh-token'] as string;

        return this.authService.logout({ accessToken, refreshToken });
    }
}

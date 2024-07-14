import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
    imports: [JwtModule.register({}), UsersModule],
    providers: [
        JwtAccessStrategy,
        JwtRefreshStrategy,
        AuthResolver,
        AuthService,
    ],
})
export class AuthModule {}

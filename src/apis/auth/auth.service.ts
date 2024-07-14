import {
    Inject,
    Injectable,
    UnauthorizedException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
    IAuthServiceGetAccessToken,
    IAuthServiceLogin,
    IAuthServiceLogout,
    IAuthServiceRestoreAccessToken,
    IAuthServiceSetRefreshToken,
} from './interfaces/auth-service.interface';
import * as jwt from 'jsonwebtoken';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async login({
        email,
        password,
        context,
    }: IAuthServiceLogin): Promise<string> {
        const user = await this.usersService.findOneByEmail({ email });
        if (!user)
            throw new UnprocessableEntityException('해당 이메일이 없습니다.');

        const isAuth = await bcrypt.compare(password, user.password);
        if (!isAuth) throw new UnprocessableEntityException('틀린 암호입니다.');

        this.setRefreshToken({ user, context });

        return this.getAccessToken({ user });
    }

    restoreAccessToken({ user }: IAuthServiceRestoreAccessToken): string {
        return this.getAccessToken({ user });
    }

    setRefreshToken({ user, context }: IAuthServiceSetRefreshToken): void {
        const refreshToken = this.jwtService.sign(
            { sub: user.id },
            { secret: process.env.JWT_SECRET_REFRESH, expiresIn: '2w' },
        );

        context.res.setHeader(
            'set-Cookie',
            `refreshToken=${refreshToken}; path=/;`,
        );

        // 배포환경
        // context.res.setHeader('set-Cookie', `refreshToken=${refreshToken}; path=/; domain=.mybacksite.com; SameSite=None; Secure; httpOnly`);
        // context.res.setHeader('Access-Control-Allow-Origin', 'https://myfrontsite.com');
    }

    getAccessToken({ user }: IAuthServiceGetAccessToken): string {
        return this.jwtService.sign(
            { sub: user.id, email: user.email },
            { secret: process.env.JWT_SECRET_ACCESS, expiresIn: '2h' },
        );
    }

    async logout({
        accessToken,
        refreshToken,
    }: IAuthServiceLogout): Promise<string> {
        try {
            const decodedAccessToken = jwt.verify(
                accessToken,
                process.env.JWT_SECRET_ACCESS,
            ) as jwt.JwtPayload;
            const decodedRefreshToken = jwt.verify(
                refreshToken,
                process.env.JWT_SECRET_REFRESH,
            ) as jwt.JwtPayload;

            const accessTokenTTL =
                decodedAccessToken.exp - Math.floor(Date.now() / 1000);
            const refreshTokenTTL =
                decodedRefreshToken.exp - Math.floor(Date.now() / 1000);

            await this.cacheManager.set(
                `accessToken:${accessToken}`,
                'accessToken',
                { ttl: accessTokenTTL },
            );
            await this.cacheManager.set(
                `refreshToken:${refreshToken}`,
                'refreshToken',
                { ttl: refreshTokenTTL },
            );

            return '로그아웃에 성공했습니다.';
        } catch {
            throw new UnauthorizedException('Invalid token');
        }
    }
}

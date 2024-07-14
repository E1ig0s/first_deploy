import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_ACCESS,
            passReqToCallback: true,
        });
    }

    async validate(req, payload) {
        const accessToken = req.headers['authorization'].split(' ')[1];

        if (await this.isTokenInBlacklist(accessToken)) {
            throw new UnauthorizedException(
                '이미 로그아웃된 엑세스 토큰입니다.',
            );
        }

        return {
            id: payload.sub,
            email: payload.email,
        };
    }

    async isTokenInBlacklist(accessToken: string): Promise<boolean> {
        const isBlacklisted = await this.cacheManager.get(
            `accessToken:${accessToken}`,
        );
        return !!isBlacklisted;
    }
}

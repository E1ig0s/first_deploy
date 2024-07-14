import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { Strategy } from 'passport-jwt';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
        super({
            jwtFromRequest: (req) => {
                const cookie = req.headers.cookie;
                if (cookie) return cookie.replace('refreshToken=', '');
            },
            secretOrKey: process.env.JWT_SECRET_REFRESH,
            passReqToCallback: true,
        });
    }

    async validate(req, payload) {
        const refreshToken = req.headers.cookie.split('=')[1];

        if (await this.isTokenInBlacklist(refreshToken)) {
            throw new UnauthorizedException(
                '이미 로그아웃된 리프레쉬 토큰입니다.',
            );
        }

        return {
            id: payload.sub,
            email: payload.email,
        };
    }

    async isTokenInBlacklist(refreshToken: string): Promise<boolean> {
        const isBlacklisted = await this.cacheManager.get(
            `refreshToken:${refreshToken}`,
        );
        return !!isBlacklisted;
    }
}

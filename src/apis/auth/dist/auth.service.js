"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var cache_manager_1 = require("@nestjs/cache-manager");
var AuthService = /** @class */ (function () {
    function AuthService(jwtService, usersService, cacheManager) {
        this.jwtService = jwtService;
        this.usersService = usersService;
        this.cacheManager = cacheManager;
    }
    AuthService.prototype.login = function (_a) {
        var email = _a.email, password = _a.password, context = _a.context;
        return __awaiter(this, void 0, Promise, function () {
            var user, isAuth;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.usersService.findOneByEmail({ email: email })];
                    case 1:
                        user = _b.sent();
                        if (!user)
                            throw new common_1.UnprocessableEntityException('해당 이메일이 없습니다.');
                        return [4 /*yield*/, bcrypt.compare(password, user.password)];
                    case 2:
                        isAuth = _b.sent();
                        if (!isAuth)
                            throw new common_1.UnprocessableEntityException('틀린 암호입니다.');
                        this.setRefreshToken({ user: user, context: context });
                        return [2 /*return*/, this.getAccessToken({ user: user })];
                }
            });
        });
    };
    AuthService.prototype.restoreAccessToken = function (_a) {
        var user = _a.user;
        return this.getAccessToken({ user: user });
    };
    AuthService.prototype.setRefreshToken = function (_a) {
        var user = _a.user, context = _a.context;
        var refreshToken = this.jwtService.sign({ sub: user.id }, { secret: process.env.JWT_SECRET_REFRESH, expiresIn: '2w' });
        context.res.setHeader('set-Cookie', "refreshToken=" + refreshToken + "; path=/;");
        // 배포환경
        // context.res.setHeader('set-Cookie', `refreshToken=${refreshToken}; path=/; domain=.mybacksite.com; SameSite=None; Secure; httpOnly`);
        // context.res.setHeader('Access-Control-Allow-Origin', 'https://myfrontsite.com');
    };
    AuthService.prototype.getAccessToken = function (_a) {
        var user = _a.user;
        return this.jwtService.sign({ sub: user.id, email: user.email }, { secret: process.env.JWT_SECRET_ACCESS, expiresIn: '2h' });
    };
    AuthService.prototype.logout = function (_a) {
        var accessToken = _a.accessToken, refreshToken = _a.refreshToken;
        return __awaiter(this, void 0, Promise, function () {
            var decodedAccessToken, decodedRefreshToken, accessTokenTTL, refreshTokenTTL, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        decodedAccessToken = jwt.verify(accessToken, process.env.JWT_SECRET_ACCESS);
                        decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
                        accessTokenTTL = decodedAccessToken.exp - Math.floor(Date.now() / 1000);
                        refreshTokenTTL = decodedRefreshToken.exp - Math.floor(Date.now() / 1000);
                        return [4 /*yield*/, this.cacheManager.set("accessToken:" + accessToken, 'accessToken', { ttl: accessTokenTTL })];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, this.cacheManager.set("refreshToken:" + refreshToken, 'refreshToken', { ttl: refreshTokenTTL })];
                    case 2:
                        _c.sent();
                        return [2 /*return*/, '로그아웃에 성공했습니다.'];
                    case 3:
                        _b = _c.sent();
                        throw new common_1.UnauthorizedException('Invalid token');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthService = __decorate([
        common_1.Injectable(),
        __param(2, common_1.Inject(cache_manager_1.CACHE_MANAGER))
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;

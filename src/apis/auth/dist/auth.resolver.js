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
exports.__esModule = true;
exports.AuthResolver = void 0;
var graphql_1 = require("@nestjs/graphql");
var gql_auth_guard_1 = require("./guards/gql-auth.guard");
var common_1 = require("@nestjs/common");
var AuthResolver = /** @class */ (function () {
    function AuthResolver(authService) {
        this.authService = authService;
    }
    AuthResolver.prototype.login = function (email, password, context) {
        return this.authService.login({ email: email, password: password, context: context });
    };
    AuthResolver.prototype.restoreAccessToken = function (context) {
        return this.authService.restoreAccessToken({ user: context.req.user });
    };
    AuthResolver.prototype.logout = function (context) {
        var accessToken = context.req.headers['authorization'].split(' ')[1];
        var refreshToken = context.req.headers['refresh-token'];
        return this.authService.logout({ accessToken: accessToken, refreshToken: refreshToken });
    };
    __decorate([
        graphql_1.Mutation(function () { return String; }),
        __param(0, graphql_1.Args('email')),
        __param(1, graphql_1.Args('password')),
        __param(2, graphql_1.Context())
    ], AuthResolver.prototype, "login");
    __decorate([
        common_1.UseGuards(gql_auth_guard_1.GqlAuthGuard('refresh')),
        graphql_1.Mutation(function () { return String; }),
        __param(0, graphql_1.Context())
    ], AuthResolver.prototype, "restoreAccessToken");
    __decorate([
        common_1.UseGuards(gql_auth_guard_1.GqlAuthGuard('access')),
        graphql_1.Mutation(function () { return String; }),
        __param(0, graphql_1.Context())
    ], AuthResolver.prototype, "logout");
    AuthResolver = __decorate([
        graphql_1.Resolver()
    ], AuthResolver);
    return AuthResolver;
}());
exports.AuthResolver = AuthResolver;

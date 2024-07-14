"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var graphql_1 = require("@nestjs/graphql");
var apollo_1 = require("@nestjs/apollo");
var boards_module_1 = require("./apis/boards/boards.module");
var typeorm_1 = require("@nestjs/typeorm");
var users_module_1 = require("./apis/users/users.module");
var config_1 = require("@nestjs/config");
var auth_module_1 = require("./apis/auth/auth.module");
var files_module_1 = require("./apis/file/files.module");
var mail_module_1 = require("./apis/mail/mail.module");
var cache_manager_1 = require("@nestjs/cache-manager");
var redisStore = require("cache-manager-redis-store");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        common_1.Module({
            imports: [
                boards_module_1.BoardsModule,
                users_module_1.UsersModule,
                auth_module_1.AuthModule,
                files_module_1.FilesModule,
                mail_module_1.MailModule,
                config_1.ConfigModule.forRoot(),
                graphql_1.GraphQLModule.forRoot({
                    driver: apollo_1.ApolloDriver,
                    autoSchemaFile: 'src/common/graphql/schema.gql',
                    context: function (_a) {
                        var req = _a.req, res = _a.res;
                        return ({ req: req, res: res });
                    }
                }),
                typeorm_1.TypeOrmModule.forRoot({
                    type: 'mysql',
                    host: process.env.DATABASE_HOST,
                    port: Number(process.env.DATABASE_PORT),
                    username: process.env.DATABASE_USERNAME,
                    password: process.env.MYSQL_ROOT_PASSWORD,
                    database: process.env.MYSQL_DATABASE,
                    entities: [__dirname + '/apis/**/*.entity.*'],
                    synchronize: true,
                    logging: true
                }),
                cache_manager_1.CacheModule.register({
                    store: redisStore,
                    url: "redis://" + process.env.REDIS_HOST + ":6397",
                    isGlobal: true
                }),
            ]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;

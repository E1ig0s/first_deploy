import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { BoardsModule } from './apis/boards/boards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './apis/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './apis/auth/auth.module';
import { FilesModule } from './apis/file/files.module';
import { MailModule } from './apis/mail/mail.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

@Module({
    imports: [
        BoardsModule,
        UsersModule,
        AuthModule,
        FilesModule,
        MailModule,
        ConfigModule.forRoot(),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: 'src/common/graphql/schema.gql',
            context: ({ req, res }) => ({ req, res }),
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USERNAME,
            password: process.env.MYSQL_ROOT_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            entities: [__dirname + '/apis/**/*.entity.*'],
            synchronize: true,
            logging: true,
        }),
        CacheModule.register<RedisClientOptions>({
            store: redisStore,
            url: 'redis://redis:6379',
            isGlobal: true,
        }),
    ],
})
export class AppModule {}

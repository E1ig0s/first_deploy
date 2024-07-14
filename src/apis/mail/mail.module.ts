import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { MailResolver } from './mail.resolver';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    host: 'smtp.gmail.com',
                    port: 587,
                    auth: {
                        user: process.env.EMAILADDRESS,
                        pass: process.env.EMAILPASSWORD,
                    },
                },
                defaults: {
                    from: `'E1ig0s' <${process.env.EMAILADDRESS}>`,
                },
                template: {
                    dir: path.join(__dirname, 'templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
        }),
    ],
    providers: [MailResolver, MailService],
    exports: [MailService],
})
export class MailModule {}

import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { IMailServiceSendEmail } from './interfaces/mail-service';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendEmail({ name, email }: IMailServiceSendEmail): Promise<void> {
        await this.mailerService
            .sendMail({
                to: email,
                subject: 'Server',
                text: '저희 서비스에 가입해주셔서 감사합니다.',
                template: './email',
                context: {
                    username: name,
                },
            })
            .then((response) => {
                console.log(response);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

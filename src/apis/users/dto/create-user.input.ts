import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
    @Field(() => String)
    @IsEmail({}, { message: '유효한 이메일 주소를 입력해 주세요.' })
    email: string;

    @Field(() => String)
    @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
    @MaxLength(30, { message: '비밀번호는 30자 이하로 입력 가능합니다.' })
    password: string;

    @Field(() => String)
    @MaxLength(16, { message: '이름은 16자 이하로 입력 가능합니다.' })
    name: string;

    @Field(() => String)
    @MaxLength(50, { message: '설명은 50자 이하로 입력 가능합니다.' })
    description: string;
}

import { InputType, Field } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class CreateBoardInput {
    @Field(() => String)
    @MaxLength(45, { message: '제목은 45자 이하로 입력 가능합니다.' })
    title: string;

    @Field(() => String)
    @MaxLength(2000, { message: '내용은 2000자 이하로 입력 가능합니다.' })
    contents: string;
}

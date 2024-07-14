import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/boards/entities/board.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Field(() => String)
    email: string;

    @Column()
    password: string;

    @Column()
    @Field(() => String)
    name: string;

    @Column()
    @Field(() => String)
    description: string;

    @OneToMany(() => Board, (board) => board.author)
    @Field(() => [Board], { nullable: true })
    boards?: Board[];

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    profileImage?: string;
}

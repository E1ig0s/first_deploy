import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Board {
    @PrimaryGeneratedColumn('increment')
    @Field(() => Int)
    number: number;

    @Column()
    @Field(() => String)
    writer: string;

    @Column()
    @Field(() => String)
    @Index()
    title: string;

    @Column()
    @Field(() => String)
    @Index()
    contents: string;

    @CreateDateColumn()
    @Field()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne(() => User, (user) => user.boards)
    author: User;
}

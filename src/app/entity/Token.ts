import { User } from './User';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

////File that defines the Token entity
@Entity('tbl_token')
export class Token {
    @PrimaryGeneratedColumn({ name: 'id_token' })
    id: number;

    @Column({
        length: 500,
    })
    hash: string;

    @Column({ name: 'id_user' })
    idUser: number;

    @OneToOne(() => User)
    @JoinColumn({ name: 'id_user' })
    user: User;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

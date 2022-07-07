import {
    Binary,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BeforeInsert,
    BeforeUpdate,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { hashSync } from 'bcryptjs';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn({ name: 'id_user' })
    id: number;

    @Column({
        length: 100,
        unique: true,
    })
    email: string;

    @Column({ select: false })
    password: string;

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword() {
        this.password = hashSync(this.password, 8);
    }

    @Column({
        length: 255,
        nullable: true,
    })
    avatar: string;

    @Column({
        name: 'user_name',
        length: 50,
    })
    userName: string;

    @Column({
        name: 'permission_level',
        type: 'smallint',
        default: 0,
    })
    permission: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

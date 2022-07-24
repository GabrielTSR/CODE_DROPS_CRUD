import { Role } from './Role';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BeforeInsert,
    BeforeUpdate,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { hashSync } from 'bcryptjs';

//File that defines the User entity
@Entity('tbl_user')
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
        if (this.password) this.password = hashSync(this.password, 8);
    }

    @Column({
        name: 'password_reset_token',
        length: 100,
        nullable: true,
        select: false,
    })
    passwordResetToken: string;

    @Column({
        name: 'password_reset_expires',
        nullable: true,
        select: false,
    })
    passwordResetExpires: Date;

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
        name: 'birth_date',
    })
    birthDate: Date;

    @Column({
        name: 'id_role',
        default: 1,
    })
    idRole: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Role)
    @JoinColumn({ name: 'id_role' })
    role: Role;
}

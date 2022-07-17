import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Video } from './Video';

//File that defines the Like entity
@Entity('tbl_like')
export class Like {
    @PrimaryGeneratedColumn({ name: 'id_like' })
    id: number;

    @Column({
        unique: false,
    })
    id_video: number;

    @Column({ unique: false })
    id_user: number;

    @CreateDateColumn()
    created_at: Date;
}

import { Binary, Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { hashSync } from 'bcryptjs';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn({ name: 'id_user' })
    id: number;

    @Column({
        length: 100,
    })
    email: string;

    @Column({ select: false })
    password: string;

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword() {
        this.password = hashSync(this.password, 8);
    }
}

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tbl_category')
export class Category {
    @PrimaryGeneratedColumn({ name: 'id_category' })
    id: number;

    @Column({
        length: 50,
        type: 'varchar',
    })
    name: string;

    @Column({
        type: 'text',
    })
    description: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    //In some database id may not auto-increment
    // constructor() {
    //     if (!this.id) {
    //         this.id = Math.floor(Math.random() * 1000000);
    //     }
    // }
}

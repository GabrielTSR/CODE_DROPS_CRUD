import { Category } from './Category';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('video')
export class Video {
    @PrimaryGeneratedColumn({ name: 'id_video' })
    id: number;

    @Column({
        length: 100,
        unique: true,
    })
    name: string;

    @Column({
        type: 'text',
    })
    description: string;

    @Column({ name: 'duration_in_minutes' })
    duration: number;

    @Column()
    id_category: number;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'id_category' })
    category: Category;

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

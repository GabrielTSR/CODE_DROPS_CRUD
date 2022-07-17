import { Category } from './Category';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Studio } from './Studio';

////File that defines the Video entity
@Entity('tbl_video')
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

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    id_category: number;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'id_category' })
    category: Category;

    @ManyToMany(() => Studio)
    @JoinTable()
    studios: Studio[];

    //In some database id may not auto-increment
    // constructor() {
    //     if (!this.id) {
    //         this.id = Math.floor(Math.random() * 1000000);
    //     }
    // }
}

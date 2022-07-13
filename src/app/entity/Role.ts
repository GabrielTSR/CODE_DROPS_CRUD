import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_role')
export class Role {
    @PrimaryGeneratedColumn({ name: 'id_role' })
    id: number;

    @Column({
        length: 50,
        unique: true,
    })
    name: string;

    @Column({
        name: 'can_manipulate_videos',
    })
    canManipulateVideos: boolean;

    @Column({
        name: 'can_manipulate_categories',
    })
    canManipulateCategories: boolean;
}

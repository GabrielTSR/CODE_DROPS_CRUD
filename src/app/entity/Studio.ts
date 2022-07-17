import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { City } from './City';

//File that defines the Studio entity
@Entity('tbl_studio')
export class Studio {
    @PrimaryGeneratedColumn({ name: 'id_studio' })
    id: number;

    @Column({
        length: 100,
        unique: true,
    })
    name: string;

    @Column()
    id_city: number;

    @ManyToOne(() => City)
    @JoinColumn({ name: 'id_city' })
    city: City;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

//File that defines the City entity
@Entity('tbl_city')
export class City {
    @PrimaryGeneratedColumn({ name: 'id_city' })
    id: number;

    @Column({
        length: 100,
        unique: true,
    })
    name: string;
}

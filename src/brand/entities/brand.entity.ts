import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'brand' })
export class BrandEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ unique: true })
    name: string;

    @Column()
    image: string;
}

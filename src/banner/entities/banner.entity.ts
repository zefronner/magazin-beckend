import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'banner' })
export class BannerEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ unique: true })
    title: string;

    @Column({ unique: true })
    description: string;

    @Column()
    image: string;
}

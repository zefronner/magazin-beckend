import { BestsellerEntity } from "src/bestsellers/entities/bestseller.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'categories' })
export class CategoryEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ unique: true })
    name: string;

    @Column()
    image: string;

    @OneToMany(() => BestsellerEntity, (product) => product.category)
    products: BestsellerEntity[];
};
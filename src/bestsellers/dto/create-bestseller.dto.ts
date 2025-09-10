import { IsInt, IsString, Max, Min } from "class-validator";
import { CategoryEntity } from "src/categories/entities/category.entity";
import { JoinColumn, ManyToOne } from "typeorm";

export class CreateBestsellerDto {
    @IsInt()
    id: number;

    @IsString()
    name:string;

    @IsInt()
    price: number;
    
    @IsInt()
    discountPrice: number;

    @IsInt()
    @Min(0)
    @Max(5)
    rating: number;

    category_id: number;

    images: string[];

    tag: string;

}

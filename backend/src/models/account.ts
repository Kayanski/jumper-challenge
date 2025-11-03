import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int" })
    chainId: number;

    @Column({
        type: "varchar",
        length: 42,
    })
    address: string;
}
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { TokenBalance } from "./TokenBalance";

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

    @OneToMany(() => TokenBalance, (balance) => balance.user)
    balances: TokenBalance[]
}
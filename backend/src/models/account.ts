import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { TokenBalance } from "./TokenBalance";

@Entity()
@Index("account_unique", ["chainId", "address"], { unique: true })
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
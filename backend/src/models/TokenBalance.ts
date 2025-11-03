import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Account } from "./Account";
import { Token } from "./Token";

@Entity()
export class TokenBalance {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Account, (user) => user.balances)
    user: Account

    @ManyToOne(() => Token, (token) => token.balances)
    token: Token;

    @Column({ type: 'bigint' })
    userBalance: string;
}
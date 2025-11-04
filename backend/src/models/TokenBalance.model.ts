import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from './Account.model';
import { Token } from './Token.model';

@Entity()
@Index('token_balance_unique', ['user.id', 'token.id'], { unique: true })
export class TokenBalance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Account, (user) => user.balances, { onDelete: 'CASCADE' })
  user: Account;

  @ManyToOne(() => Token, (token) => token.balances, { onDelete: 'CASCADE' })
  token: Token;

  @Column({ type: 'varchar' })
  userBalance: string;
}

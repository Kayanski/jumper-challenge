import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from './Account';
import { TokenBalance } from './TokenBalance';

@Entity()
@Index('token_unique', ['chainId', 'contractAddress'], { unique: true })
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  chainId: number;

  @Column({
    type: 'varchar',
    length: 42,
  })
  contractAddress: string;

  @Column({
    type: 'int',
  })
  decimals: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  logo?: string;

  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({
    type: 'varchar',
  })
  symbol: string;

  @ManyToOne(() => TokenBalance, (balance) => balance.token)
  balances: TokenBalance[];
}

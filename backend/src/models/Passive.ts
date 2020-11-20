import { Column, Entity, getManager, ManyToOne, Not } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import Movement from './Movement';
import Account from './Account';

@Entity()
@ObjectType()
export default class Passive extends Movement {
  @Column()
  @Field()
  liquidated: boolean;

  @Column({ nullable: true })
  liquidatedAccountId?: number;

  @Column()
  root: boolean;

  @Field(() => Account, { nullable: true })
  @ManyToOne(() => Account, { eager: false, onDelete: 'CASCADE' })
  liquidatedAccount?: Account;

  async getPairedPassive(): Promise<Passive> {
    return getManager()
      .getRepository(Passive)
      .findOneOrFail({ id: Not(this.id), operationId: this.operationId });
  }

  constructor(passive: {
    amount: number;
    accountId: number;
    memo?: string;
    issuedAt?: Date;
    operationId?: string;
    root?: boolean;
  }) {
    super(passive);
    if (passive) {
      this.liquidated = false;
      this.root = passive.root || false;
    }
  }
}

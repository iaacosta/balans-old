import { Entity } from 'typeorm';
import { ObjectType } from 'type-graphql';
import Movement from './Movement';

@Entity()
@ObjectType()
export default class Transfer extends Movement {}

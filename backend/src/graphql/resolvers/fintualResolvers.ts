/* eslint-disable no-param-reassign */
import { AuthenticationError } from 'apollo-server-express';
import { Resolver, Mutation, Ctx, Authorized, Arg, Query } from 'type-graphql';
import { getManager } from 'typeorm';

import { Context } from '../../@types';
import roles from '../../constants/roles';
import User from '../../models/User';
import { CryptoUtil } from '../../utils';
import { FintualGoalParser } from '../../utils/parsers';
import { FintualAPI } from '../../utils/api';
import { RegisterFintualAPIInput } from '../helpers/inputs';
import { Goal } from '../objectTypes';

@Resolver()
export default class FintualResolvers {
  @Query(() => [Goal])
  @Authorized(roles.ADMIN)
  async myFintualGoals(@Ctx() { currentUser }: Context): Promise<Goal[]> {
    const { fintualEmail, fintualToken, initVector } = currentUser!;
    if (!fintualEmail || !fintualToken) {
      throw new AuthenticationError(
        'you must register your fintual credentials first',
      );
    }

    const [email, token] = await CryptoUtil.decryptData({
      batch: [fintualEmail, fintualToken],
      hexInitVector: initVector,
    });

    const fintual = new FintualAPI(email, token);
    const goals = await fintual.goals();

    return goals.map((goal) => FintualGoalParser.parse(goal));
  }

  @Mutation(() => Boolean)
  @Authorized(roles.ADMIN)
  async registerFintualCredentials(
    @Arg('input') { email, token }: RegisterFintualAPIInput,
    @Ctx() { currentUser }: Context,
  ): Promise<boolean> {
    if (!currentUser) return false;

    const [encryptedEmail, encryptedToken] = await CryptoUtil.encryptData({
      hexInitVector: currentUser.initVector,
      batch: [email, token],
    });

    currentUser.fintualEmail = encryptedEmail;
    currentUser.fintualToken = encryptedToken;

    await getManager().getRepository(User).save(currentUser);
    return true;
  }
}

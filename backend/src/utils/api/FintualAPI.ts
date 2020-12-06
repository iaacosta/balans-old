import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { URL } from 'url';
import { FintualGoal } from '../../@types';
import fintualConstants from '../../constants/fintualConstants';
import FintualAuthenticationError from '../../graphql/errors/FintualAuthenticationError';
import FintualUnknownError from '../../graphql/errors/FintualUnkownError';

export class FintualAPI {
  protected email: string;

  protected token: string;

  constructor(email: string, token: string) {
    this.email = email;
    this.token = token;
  }

  public async goals(): Promise<FintualGoal[]> {
    try {
      const { data: body } = await this.get<{ data: FintualGoal[] }>('/goals');
      return body.data;
    } catch (err) {
      if (err.response?.status === 401) throw new FintualAuthenticationError();
      else throw new FintualUnknownError();
    }
  }

  protected get<T extends { data: any }>(
    path: string,
  ): Promise<AxiosResponse<T>> {
    const uri = new URL(`/api${path}`, fintualConstants.apiUrl);
    const options: AxiosRequestConfig = {
      params: { user_email: this.email, user_token: this.token },
    };

    return axios.get<any, AxiosResponse<T>>(uri.toString(), options);
  }
}

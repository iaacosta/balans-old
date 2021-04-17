import axios from 'axios';

export default class ExchangeRateService {
  public static async getClpUsdExchangeRate(): Promise<number> {
    const { data } = await axios.get('https://mindicador.cl/api/dolar');
    const lastValue = data.serie[0];
    return Number(lastValue.valor);
  }
}

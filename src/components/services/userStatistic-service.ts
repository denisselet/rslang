import Service from '../constants/service';
import requestService from './request-service';

export default class UserStatisticService {
  static async getStatistic() {
    const user = JSON.parse(localStorage.getItem('user') as string);
    const url = `${Service.USERS}/${user.userId}/${Service.STATISTICS}`;
    try {
      const response = await requestService.get(url);
      if (response.status === 404) {
        throw new Error();
      }
      return response;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  static async upsertStatistic(data: object) {
    const user = JSON.parse(localStorage.getItem('user') as string);
    const url = `${Service.USERS}/${user.userId}/${Service.STATISTICS}`;
    try {
      return await requestService.put(url, data);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}

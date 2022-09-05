import Service from '../constants/service';
import requestService from './request-service';

export default class UsersAggregatedWordsService {
  static async getAllUserAggregatedWords(url = '') {
    const user = JSON.parse(localStorage.getItem('user') as string);
    try {
      return await requestService.get(`${Service.USERS}/${user.userId}/${Service.AGGREGATED}/${url}`);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  static async getAUserAggregatedWordById(wordId: string) {
    const user = JSON.parse(localStorage.getItem('user') as string);
    try {
      return await requestService.get(`${Service.USERS}/${user.userId}/${Service.AGGREGATED}/${wordId}`);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}

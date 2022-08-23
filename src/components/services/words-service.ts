import Service from '../constants/service';
import requestService from './request-service';

export default class WordsService {
  static async getWords(group = 0, page = 0) {
    const url = `${Service.WORDS}?${Service.GROUP}=${group}&${Service.PAGE}=${page}`;
    try {
      return await requestService.get(url);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  static async getWordById(id: string) {
    const url = `${Service.WORDS}/${id}`;
    try {
      return await requestService.get(url);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}

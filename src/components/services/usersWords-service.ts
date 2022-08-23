import Service from '../constants/service';
import requestService from './request-service';

export default class UsersWordsService {
  static async getAllUserWords() {
    const user = JSON.parse(localStorage.getItem('user') as string);
    const url = `${Service.USERS}/${user.userId}/${Service.WORDS}`;
    try {
      return await requestService.get(url);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  static async createUserWord(wordId: string, data: object) {
    const user = JSON.parse(localStorage.getItem('user') as string);
    const url = `${Service.USERS}/${user.userId}/${Service.WORDS}/${wordId}`;
    try {
      return await requestService.post(url, data);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  static async getUserWordById(wordId: string) {
    const user = JSON.parse(localStorage.getItem('user') as string);
    const url = `${Service.USERS}/${user.userId}/${Service.WORDS}/${wordId}`;
    try {
      return await requestService.get(url);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  static async updateUserWord(wordId: string, data: object) {
    const user = JSON.parse(localStorage.getItem('user') as string);
    const url = `${Service.USERS}/${user.userId}/${Service.WORDS}/${wordId}`;
    try {
      return await requestService.put(url, data);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  static async deleteUserWord(wordId: string) {
    const user = JSON.parse(localStorage.getItem('user') as string);
    const url = `${Service.USERS}/${user.userId}/${Service.WORDS}/${wordId}`;
    try {
      return await requestService.delete(url);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}

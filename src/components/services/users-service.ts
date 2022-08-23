import Service from '../constants/service';
import requestService from './request-service';

export default class UsersService {
  static async createNewUser(data: object) {
    try {
      return await requestService.post(`${Service.USERS}`, data);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  static async getUser() {
    const user = JSON.parse(localStorage.getItem('user') as string);
    try {
      return await requestService.get(`${Service.USERS}/${user.userId}`);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  static async updateUser(data: object) {
    const user = JSON.parse(localStorage.getItem('user') as string);
    try {
      return await requestService.put(`${Service.USERS}/${user.userId}`, data);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  static async deleteUser() {
    const user = JSON.parse(localStorage.getItem('user') as string);
    try {
      return await requestService.delete(`${Service.USERS}/${user.userId}`);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  static async getNewUserTokens() {
    const user = JSON.parse(localStorage.getItem('user') as string);
    try {
      return await requestService.get(`${Service.USERS}/${user.userId}/${Service.TOKENS}`);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}

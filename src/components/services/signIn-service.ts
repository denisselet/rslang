import Service from '../constants/service';
import requestService from './request-service';

export default class SignInService {
  static async userLogin(data: object) {
    try {
      const response = await requestService.post(Service.LOGIN, data);
      if (response.token) {
        localStorage.setItem('user', JSON.stringify(response));
      } else if (response.message) {
        throw new Error(response.message);
      }
      return response;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}

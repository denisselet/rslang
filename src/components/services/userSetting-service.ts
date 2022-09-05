import Service from '../constants/service';
import requestService from './request-service';

export default class UserSettingService {
  static async getSetting() {
    const user = JSON.parse(localStorage.getItem('user') as string);
    const url = `${Service.USERS}/${user.userId}/${Service.SETTINGS}`;
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

  static async upsertSetting(data: object) {
    const user = JSON.parse(localStorage.getItem('user') as string);
    const url = `${Service.USERS}/${user.userId}/${Service.SETTINGS}`;
    try {
      return await requestService.put(url, data);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}

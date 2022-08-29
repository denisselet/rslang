import Accept from '../constants/http-requests/accept';
import ContentType from '../constants/http-requests/content-type';
import HttpMethod from '../constants/http-requests/http-method';
import Service from '../constants/service';

class RequestService {
  response: (url: string, method: string, data?: object) => Promise<Response>;

  constructor() {
    const user = JSON.parse(localStorage.getItem('user') as string);
    this.response = async (url, method, data) => fetch(`${Service.LINK}/${url}`, {
      method,
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${(user) ? user.token : null}`,
        'Content-Type': ContentType.APPLICATION_JSON,
        Accept: Accept.APPLICATION_JSON
      }
    });
  }

  async get(url: string) {
    try {
      const response = await this.response(url, HttpMethod.GET);
      if (response.status === 404) {
        throw new Error();
      }
      return response.json();
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  async post(url: string, data: object) {
    try {
      const response = await this.response(url, HttpMethod.POST, data);
      if (!(response.status === 200 || response.status === 204)) {
        return response.statusText;
      }
      return response.json();
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  async put(url: string, data: object) {
    try {
      const response = await this.response(url, HttpMethod.PUT, data);
      return response.json();
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  async delete(url: string) {
    try {
      return await this.response(url, HttpMethod.DELETE);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}

const requestService = new RequestService();

export default requestService;

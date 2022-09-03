import { NotAuthorized } from './view';

export class NotAuthorizedService {
  private notAuthorized: NotAuthorized;

  constructor() {
    this.notAuthorized = new NotAuthorized();
  }

  start() {
    this.notAuthorized.draw();
  }
}

import { HeaderView } from './view';

export class HeaderService {
  private headerView: HeaderView;

  constructor() {
    this.headerView = new HeaderView();
  }

  private addListener(): void {
    // TODO: probably I would move this logic of window load to any service, for one load callback
    (window as Window).addEventListener('load', () => {
      const accountBlock = document.querySelector('.account-block');
      const login: HTMLElement = document.getElementById('login');

      accountBlock.addEventListener('click', () => {
        login.classList.toggle('login-visible');
      });
    });
  }

  start() {
    this.headerView.draw();
    this.addListener();
  }
}

import { authorization, registration } from '../../user/regAndAuth';
import { LoginView } from './view';

export class LoginService {
  private loginView: LoginView;

  constructor() {
    this.loginView = new LoginView();
  }

  public start(): void {
    this.loginView.draw();
    this.addListener();
  }

  private addListener(): void {
    const login: HTMLElement = document.getElementById('login');
    const flip = document.querySelector<HTMLElement>('.flip');

    flip.classList.toggle('flipped');

    registration();
    authorization();

    if (!login) {
      console.log('there is no login element');
    }

    login.addEventListener('click', (event) => {
      const target = event.target;

      if ((target as HTMLElement).className === 'button-cancel-form') {
        login.classList.remove('login-visible');
      }

      if ((target as HTMLElement).className === 'flipper') {
        flip.classList.toggle('flipped');
      }
    });
    /* end login form functionality */
  }
}

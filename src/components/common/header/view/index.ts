// TODO: add assets as img
import { checkAuth } from '../../../user/checkAuth';
import './style.scss';

export class HeaderView {
  public draw(): void {
    const template = this.getTemplate();
    const { body } = document;

    body.insertAdjacentHTML('afterbegin', template);
  }

  private getTemplate(): string {
    return `<header class="header">
        <div class="top-block-cap">
            <h1>RSLang</h1>
            <nav>
                <ul class="menu">
                    <li><a href="/">Главная</a></li>
                    <li><a href="/textbook">Учебник</a></li>
                    <li><a href="/audiocall">Аудиовызов</a></li>
                    <li><a href="/sprint">Спринт</a></li>
                    <li><a class="a-statistics" href="/statistics">Статистика</a></li>
                </ul>
            </nav>
            <div class="account-block">
                <img src="/assets/img/account.svg" alt="logo-account">
                <div>${(checkAuth()) ? 'Выйти' : 'Войти'}</div>
            </div>
        </div>
        
    </header>`;
  }
}

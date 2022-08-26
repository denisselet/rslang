// TODO: add assets as img
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
            <h2>RSLang</h2>
            <div class="account-block">
                <img src="./assets/img/account.svg" alt="logo-account">
                <div>Войти</div>
            </div>
        </div>
        <nav>
            <ul class="menu">
                <li><a href="/">Главная</a></li>
                <li><a href="/textbook">Учебник</a></li>
                <li><a href="/audiocall">Аудиовызов</a></li>
                <li><a href="/sprinter">Спринт</a></li>
                <li><a class="a-statistics" href="/statistics">Статистика</a></li>
            </ul>
        </nav>
    </header>`;
  }
}

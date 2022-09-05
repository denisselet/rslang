// TODO: add assets as img
import './style.scss';

export class NotAuthorized {
  public draw(): void {
    const template = this.getTemplate();
    const content = document.querySelector('.mutable-content-wrapper');

    content.insertAdjacentHTML('beforeend', template);
  }

  private getTemplate(): string {
    return `
        <div class="not-authorized">
            <h1>Для просмотра статистики Вам необходимо авторизоваться!</h1>
            <img src="/assets/img/not-authorized.png"/>
        </div>
    `;
  }
}

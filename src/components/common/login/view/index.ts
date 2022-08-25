import './style.scss';

export class LoginView {
  public draw(): void {
    const template = this.getTemplate();
    const { body } = document;

    body.insertAdjacentHTML('afterbegin', template);
  }

  private getTemplate(): string {
    return `<div id="login" class="login-hidden">
                <div class="flip">
                    <div class="form-signup">
                        <h1>Регистрация</h1>
                        <fieldset>
                        <p class="login-msg"></p>
                            <form>
                                <input type="email" placeholder="Введите Ваш email" required />
                                <input type="password" placeholder="Ваш пароль" required />
                                <input type="text" placeholder="Имя пользователя" required />
                                <input type="submit" value="Зарегистрироваться" />
                            </form>
                            <a href="#" class="flipper">Уже зарегистрированы? Войти.</a>
                            <button class="button-cancel-form">Отмена</button>
                        </fieldset>
                    </div>
                    <div class="form-login">
                        <h1>Авторизация</h1>
                        <fieldset>
                            <form>
                                <input type="email" placeholder="Логин или Email" required />
                                <input type="password" placeholder="Пароль" required />
                                <input type="submit" value="ВОЙТИ" />
                            </form>
                            <a href="#" class="flipper">Нет аккаунта? Регистрация.</a>
                            <button class="button-cancel-form">Отмена</button>
                        </fieldset>
                    </div>
                </div>
            </div>`;
  }
}

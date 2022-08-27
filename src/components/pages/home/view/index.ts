import './style.scss';

export class HomeView {
  public draw(): void {
    const template = this.getTemplate();
    const content = document.querySelector('.mutable-content-wrapper');
    content.innerHTML = '';

    content.insertAdjacentHTML('beforeend', template);
  }

  private getTemplate(): string {
    return `<main class="wrapper-home-page">
                <section class="section-description">
                    <p>
                        <span class="description-span-1">RSLang - приложение для изучения английского языка.</span><br>
                        <span class="description-span-2">Играйте в игры, слушайте произношение и запоминайте слова, совершенствуйте свои знания.</span>
                    </p>
                    <div>
                        <img class="BoyBooks-image" src="/assets/img/BoyBooks.png" alt="BoyBooks">
                    </div>
                </section>

                <section class="section-benefits">
                    <p class="text-section-benefits">
                        Возможности и преимущества RSLang:
                    </p>
                    <div class="wrapper-benefits-items">
                        <div class="benefits-item">
                            <img src="/assets/img/book.png" alt="logo-book">
                            <h3>Учебник</h3>
                            <p>
                                Электронный учебник поможет освоить произношение и перевод слов, состоит из шести разделов, 
                                в каждом разделе 30 страниц, на каждой странице 20 слов для изучения.
                            </p>
                        </div>

                        <div class="benefits-item">
                            <img src="/assets/img/games.png" alt="logo-games">
                            <h3>Игры</h3>
                            <p>
                                Мини-игры "Аудиовызов" и "Спринт" помогут изучать слова в интересной игровой форме.
                            </p>
                        </div>

                        <div class="benefits-item">
                            <img src="/assets/img/dictionary.png" alt="logo-dictionary">
                            <h3>Словарь</h3>
                            <p>
                                Словарь содержит: объяснение значения слов, перевод изучаемого слова, картинку-ассоциацию, произношение изучаемого слова.
                            </p>
                        </div>

                        <div class="benefits-item">
                            <img src="/assets/img/statistics.png" alt="logo-statistics">
                            <h3>Статистика</h3>
                            <p>
                                На странице статистики отображается  статистика по мини-играм и по словам за каждый день изучения.
                            </p>
                        </div>

                    </div>
                </section>

                <section class="section-team" id="team">
                    <p class="name-section-team">
                        Наша команда:
                    </p>
                    <div class="wrapper-team-items">
                        <div class="team-item">
                            <img src="/assets/img/Denis.jpg" alt="avatar">
                            <div class="block-link-team-item">
                                <a href="https://github.com/denisselet">denisselet</a>
                            </div>
                            <p>
                                что-то сделал, что-то сделал, что-то сделал, что-то сделал, что-то сделал, что-то сделал, что-то сделал
                            </p>
                        </div>

                        <div class="team-item">
                            <img src="/assets/img/Tanya.jpg" alt="avatar">
                            <div class="block-link-team-item">
                                <a href="https://github.com/lapkot">lapkot</a>
                            </div>
                            <p>
                                что-то сделала, что-то сделала, что-то сделала, что-то сделала, что-то сделала, что-то сделала, что-то сделала
                            </p>
                        </div>

                        <div class="team-item">
                            <img src="/assets/img/Zhenya.jpg" alt="avatar">
                            <div class="block-link-team-item">
                                <a href="https://github.com/Evgeniy652">Evgeniy652</a>
                            </div>
                            <p>
                                что-то сделал, что-то сделал, что-то сделал, что-то сделал, что-то сделал, что-то сделал , что-то сделал
                            </p>
                        </div>

                    </div>
                </section>
            </main>`;
  }
}

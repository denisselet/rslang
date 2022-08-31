import './style.scss';

export class StatisticsView {
  public draw(): void {
    const template = this.getTemplate();
    const content = document.querySelector('.mutable-content-wrapper');
    content.innerHTML = '';

    content.insertAdjacentHTML('beforeend', template);
  }

  private getTemplate(): string {
    return `<main class="block-statistics">
                <p>
								  Краткосрочная статистика по мини-играм и по словам за каждый день изучения:
                </p>
                <table class="table">
                    <tbody>
                        <tr class="main-table-section">
                            <td>Статистика по мини-играм</td>
                            <td>Количество новых слов за день</td>
                            <td>Процент правильных ответов</td>
                            <td>Самая длинная серия правильных ответов</td>
                        </tr>
                        <tr>
                            <td>Спринт</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Аудиовызов</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr class="main-table-section">
                            <td>Статистика по словам</td>
                            <td>Количество новых слов за день</td>
                            <td>Процент правильных ответов за день</td>
                            <td>Количество изученных слов за день</td>
                        </tr>
                        <tr>
                            <td>Слова</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </main>`;
  }
}

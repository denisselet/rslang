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
                    Общая статистика:
                </p>
                <table class="table">
                    <tbody>
                        <tr class="main-table-section">
                            <td>Игра</td>
                            <td>Изучено слов</td>
                            <td>Правильно(%)</td>
                            <td>Самая длинная серия</td>
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
                        <tr>
                            <td>Всего</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </main>`;
  }
}

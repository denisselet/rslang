import { Chart, registerables, ChartItem } from 'chart.js';
import './style.scss';

interface IDataForGraphForOneDay {
    days: string[];
    wordsForDay: number[];
}

interface IDrawData {
    element: string;
    title: string;
    apiMethod: () => IDataForGraphForOneDay;
    labelText: string;
}

export class StatisticsView {
  constructor() {
    Chart.register(...registerables);
  }

  public draw(): void {
    const template = this.getTemplate();
    const content = document.querySelector('.mutable-content-wrapper');
    content.innerHTML = '';

    content.insertAdjacentHTML('beforeend', template);
    this.drawGraphs();
  }

  private drawGraphs(): void {
    this.drawGraphChartWordsForOneDay({
      apiMethod: () => this.getDataForGraphForOneDay(),
      element: 'chart__words-for-day',
      labelText: 'Новых слов',
      title: 'Количество новых слов за каждый день изучения:'
    });
    this.drawGraphChartWordsForOneDay({
      apiMethod: () => this.getDataForGraphTotalWords(),
      element: 'chart__total-words',
      labelText: 'Изученных слов',
      title: 'Общее количество изученных слов за весь период обучения по дням:'
    });
  }

  // TODO: change to real API method
  private getDataForGraphForOneDay(): IDataForGraphForOneDay {
    return {
      days: ['01.08.2022', '02.08.2022', '03.08.2022', '04.08.2022', '05.08.2022', '06.08.2022', '07.08.2022'],
      wordsForDay: [10, 15, 131, 2, 6, 50, 5]
    };
  }

  // TODO: change to real API method
  private getDataForGraphTotalWords(): IDataForGraphForOneDay {
    return {
      days: ['01.08.2022', '02.08.2022', '03.08.2022', '04.08.2022', '05.08.2022', '06.08.2022', '07.08.2022'],
      wordsForDay: [40, 25, 121, 5, 1, 30, 80]
    };
  }

  private generateRandomInteger(max: number) {
    return Math.floor(Math.random() * max) + 1;
  }

  private drawGraphChartWordsForOneDay(drawData: IDrawData) {
    const chartWordsForDay = document.getElementById(drawData.element) as ChartItem;
    // TODO
    const data = drawData.apiMethod();
    const getRandomBackgroundColor = data.days.map(() => `rgba(${this.generateRandomInteger(255)}, ${this.generateRandomInteger(255)}, ${this.generateRandomInteger(255)}, 0.7)`);
    const getRandomBorderColor = data.days.map(() => `rgba(${this.generateRandomInteger(255)}, ${this.generateRandomInteger(255)}, ${this.generateRandomInteger(255)}, 0.7)`);

    // eslint-disable-next-line unused-imports/no-unused-vars
    const myChart = new Chart(chartWordsForDay, {
      type: 'bar',
      data: {
        labels: data.days,
        datasets: [{
          label: drawData.labelText,
          data: data.wordsForDay,
          backgroundColor: getRandomBackgroundColor,
          borderColor: getRandomBorderColor,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          title: {
            display: true,
            text: drawData.title,
            font: {
              size: 20
            }
          },
          legend: {
            display: false
          }
        }
      }
    });
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

                <div class="graph-section" style="position: relative; width:80vw">
                    <canvas id="chart__words-for-day"></canvas>
                    <canvas id="chart__total-words"></canvas>
                <div/>
            </main>`;
  }
}

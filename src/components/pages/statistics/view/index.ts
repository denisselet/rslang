import { Chart, ChartItem, registerables } from 'chart.js';
import { getDateToday } from '../../../user/date';
import { getStatistic } from '../../../user/statistic/getStatistic';
import './style.scss';

interface ILearnWordsEntity {
    newWord: number;
    proc: { true: number ; false: number };
    row: number;
}

interface IOptionalData {
    audioCall: ILearnWordsEntity;
    sprint: ILearnWordsEntity;
    learned: number;
}

interface IStatisticsDto {
    id: string;
    learnedWords: number;
    optional: Record<string, IOptionalData>;
}

interface IDataForGraphForOneDay {
    days: string[];
    wordsForDay: number[];
}

interface IDrawData {
    element: string;
    title: string;
    data: IDataForGraphForOneDay;
    labelText: string;
}

export class StatisticsView {
  private tableData: IOptionalData;

  private graphForNewWordData: IDataForGraphForOneDay;

  private graphForTotalWordsData: IDataForGraphForOneDay;

  constructor() {
    this.tableData = this.getDefaultSetting();
    this.graphForNewWordData = { days: [], wordsForDay: [] };
    this.graphForTotalWordsData = { days: [], wordsForDay: [] };

    Chart.register(...registerables);
  }

  public async draw(): Promise<void> {
    const content = document.querySelector('.mutable-content-wrapper');
    content.innerHTML = '';

    await this.getData();

    const template = this.getTemplate();

    content.insertAdjacentHTML('beforeend', template);
    this.drawGraphs();
  }

  private async getData(): Promise<void> {
    const today = getDateToday();
    try {
      const stats: IStatisticsDto = await getStatistic();
      this.tableData = stats.optional[today];

      this.graphForNewWordData = this.mapDataForGraphNewWords(stats);
      this.graphForTotalWordsData = this.mapDataForGraphLearned(stats);
    } catch (err) {
      console.log(err);
    }
  }

  private getDefaultSetting(): IOptionalData {
    return {
      audioCall: { newWord: 0, proc: { true: 0, false: 0 }, row: 0 },
      learned: 0,
      sprint: { newWord: 0, proc: { true: 0, false: 0 }, row: 0 }
    };
  }

  private drawGraphs(): void {
    this.drawChartWords({
      data: this.graphForNewWordData,
      element: 'chart__words-for-day',
      labelText: 'Новых слов',
      title: 'Количество новых слов за каждый день изучения:'
    });
    this.drawChartWords({
      data: this.graphForTotalWordsData,
      element: 'chart__total-words',
      labelText: 'Изученных слов',
      title: 'Общее количество изученных слов за весь период обучения по дням:'
    });
  }

  private mapDataForGraphNewWords(data: IStatisticsDto): IDataForGraphForOneDay {
    const days = Object.keys(data.optional);
    const wordsForDay = days.map((d) => {
      const option = data.optional[d];
      const newWords = option.audioCall.newWord + option.sprint.newWord;

      return newWords;
    });

    return {
      days: days.map((d) => d.replace('D', '')),
      wordsForDay
    };
  }

  private mapDataForGraphLearned(data: IStatisticsDto): IDataForGraphForOneDay {
    const days = Object.keys(data.optional);
    const wordsForDay = days.map((d) => {
      const option = data.optional[d];

      return option.learned;
    });

    return {
      days: days.map((d) => d.replace('D', '')),
      wordsForDay
    };
  }

  private generateRandomInteger(max: number) {
    return Math.floor(Math.random() * max) + 1;
  }

  private async drawChartWords(drawData: IDrawData) {
    const chartWordsForDay = document.getElementById(drawData.element) as ChartItem;
    const getRandomBackgroundColor = drawData.data.days.map(() => `rgba(${this.generateRandomInteger(255)}, ${this.generateRandomInteger(255)}, ${this.generateRandomInteger(255)}, 0.7)`);
    const getRandomBorderColor = drawData.data.days.map(() => `rgba(${this.generateRandomInteger(255)}, ${this.generateRandomInteger(255)}, ${this.generateRandomInteger(255)}, 0.7)`);

    // eslint-disable-next-line unused-imports/no-unused-vars
    const myChart = new Chart(chartWordsForDay, {
      type: 'bar',
      data: {
        labels: drawData.data.days,
        datasets: [{
          label: drawData.labelText,
          data: drawData.data.wordsForDay,
          backgroundColor: getRandomBackgroundColor,
          borderColor: getRandomBorderColor,
          borderWidth: 1,
          barThickness: 40
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
    const sprint = this.tableData.sprint;
    const audio = this.tableData.audioCall;
    const totalSprint = sprint.proc.true + sprint.proc.false;
    const totalAudio = audio.proc.true + audio.proc.false;
    const totalCorrect = sprint.proc.true + audio.proc.true;
    const totalInCorrect = sprint.proc.false + audio.proc.false;
    const procCorrectSprint = totalSprint ? +(+(sprint.proc.true / totalSprint) * 100).toFixed(2) : 0;
    const procCorrectAudio = totalAudio ? +(+(audio.proc.true / totalAudio) * 100).toFixed(2) : 0;
    const totalProcWords = totalInCorrect
        || totalCorrect ? +(+(totalCorrect / (totalCorrect + totalInCorrect)) * 100).toFixed(2) : 0;

    const statsForWords: { newWords: number; proc: number; learned: number; } = {
      learned: this.tableData.learned,
      newWords: this.tableData.audioCall.newWord + this.tableData.sprint.newWord,
      proc: totalProcWords
    };

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
                            <td>${sprint.newWord}</td>
                            <td>${procCorrectSprint} %</td>
                            <td>${sprint.row}</td>
                        </tr>
                        <tr>
                            <td>Аудиовызов</td>
                            <td>${audio.newWord}</td>
                            <td>${procCorrectAudio} %</td>
                            <td>${audio.row}</td>
                        </tr>
                        <tr class="main-table-section">
                            <td>Статистика по словам</td>
                            <td>Количество новых слов за день</td>
                            <td>Процент правильных ответов за день</td>
                            <td>Количество изученных слов за день</td>
                        </tr>
                        <tr>
                            <td>Слова</td>
                            <td>${statsForWords.newWords}</td>
                            <td>${statsForWords.proc} %</td>
                            <td>${statsForWords.learned}</td>
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

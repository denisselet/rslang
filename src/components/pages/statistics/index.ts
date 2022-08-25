import { StatisticsView } from './view';

export class StatisticsService {
  private statisticsView: StatisticsView;

  constructor() {
    this.statisticsView = new StatisticsView();
  }

  start() {
    this.statisticsView.draw();
  }
}

import { HomeView } from './view';

export class HomeService {
  private homeView: HomeView;

  constructor() {
    this.homeView = new HomeView();
  }

  start() {
    this.homeView.draw();
  }
}

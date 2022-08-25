import { FooterView } from './view';

export class FooterService {
  private footerView: FooterView;

  constructor() {
    this.footerView = new FooterView();
  }

  start() {
    this.footerView.draw();
  }
}

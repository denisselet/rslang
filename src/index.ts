import Navigo from 'navigo';

import { FooterService } from './components/common/footer';
import { HeaderService } from './components/common/header';
import { LoginService } from './components/common/login';
import { HomeService } from './components/pages/home';
import Sprint from './components/pages/sprint';
import { StatisticsService } from './components/pages/statistics';
import { TextbookService } from './components/pages/textbook';

import './style.scss';

const router = new Navigo('/');

class Main {
  public static start() {
    const home = new HomeService();
    const statistic = new StatisticsService();
    const sprint = new Sprint();
    const footer = new FooterService();
    const textbook = new TextbookService();

    Main.commonComponents();

    router
      .on('', () => {
        home.start();
        footer.start();
      })
      .on('/statistics', () => {
        statistic.start();
        footer.start();
      })
      .on('/sprint/:group/:page', ({ data }) => {
        const group = Number.isInteger(Number(data.group)) ? Number(data.group) : undefined;
        const page = Number.isInteger(Number(data.page)) ? Number(data.page) : undefined;
        sprint.start(group, page);
      })
      .on('/sprint/?', () => {
        sprint.start();
      })
      .on('/textbook', () => {
        textbook.start();
        footer.start();
      })
      .resolve();
  }

  private static commonComponents() {
    const login = new LoginService();
    const header = new HeaderService();

    login.start();
    header.start();
  }
}

Main.start();

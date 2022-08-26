import Navigo from 'navigo';

import { FooterService } from './components/common/footer';
import { HeaderService } from './components/common/header';
import { LoginService } from './components/common/login';
import { HomeService } from './components/pages/home';
import SprintService from './components/pages/sprinter';
import { StatisticsService } from './components/pages/statistics';

import './style.scss';

const router = new Navigo('/');

class Main {
  public static start() {
    const home = new HomeService();
    const statistic = new StatisticsService();
    const sprinter = new SprintService();

    Main.commonComponents();

    router
      .on('', () => {
        home.start();
      })
      .on('/statistics', () => {
        statistic.start();
      })
      .on('/sprinter', () => {
        sprinter.start();
      })
      .resolve();
  }

  private static commonComponents() {
    const header = new HeaderService();
    const login = new LoginService();
    const footer = new FooterService();

    login.start();
    header.start();
    footer.start();
  }
}

Main.start();

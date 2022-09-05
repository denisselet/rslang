import Navigo from 'navigo';

import { FooterService } from './components/common/footer';
import { HeaderService } from './components/common/header';
import { LoginService } from './components/common/login';
import { NotAuthorizedService } from './components/common/not-authorized';
import AudioCall from './components/pages/audiocall';
import { HomeService } from './components/pages/home';
import Sprint from './components/pages/sprint';
import { StatisticsService } from './components/pages/statistics';
import { TextbookService } from './components/pages/textbook';
import { checkAuth } from './components/user/checkAuth';

import './style.scss';

const router = new Navigo('/');

class Main {
  public static start() {
    const home = new HomeService();
    const statistic = new StatisticsService();
    const sprint = new Sprint();
    const audioCall = new AudioCall();
    const footer = new FooterService();
    const textbook = new TextbookService();
    const notAuthorized = new NotAuthorizedService();

    Main.commonComponents();

    router
      .on('', () => {
        home.start();
        footer.start();
      })
      .on('/statistics', () => {
        if (checkAuth()) {
          statistic.start();
        } else {
          notAuthorized.start();
        }

        footer.start();
      })
      .on('/sprint/:group/:page', ({ data }) => {
        const group = Number.isInteger(Number(data.group)) ? Number(data.group) : undefined;
        const page = Number.isInteger(Number(data.page)) ? Number(data.page) : undefined;
        sprint.start(group, page);
      })
      .on('/sprint/:group', ({ data }) => {
        const group = Number.isInteger(Number(data.group)) ? Number(data.group) : undefined;
        sprint.start(group);
      })
      .on('/sprint/?', () => {
        sprint.start();
      })
      .on('/audiocall/:group/:page', ({ data }) => {
        const group = Number.isInteger(Number(data.group)) ? Number(data.group) : undefined;
        const page = Number.isInteger(Number(data.page)) ? Number(data.page) : undefined;
        audioCall.start(group, page);
      })
      .on('/audiocall/:group', ({ data }) => {
        const group = Number.isInteger(Number(data.group)) ? Number(data.group) : undefined;
        audioCall.start(group);
      })
      .on('/audiocall/?', () => {
        audioCall.start();
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

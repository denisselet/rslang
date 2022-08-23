import SprintService from './components/pages/sprinter';

const pathname = window.location.pathname;
switch (true) {
  case pathname === '/': {
    // TODO: replace with home page component
    const main = document.createElement('main');
    main.innerHTML = '<h1>Home Page</h1>';
    document.body.append(main);
    break;
  }
  case pathname.startsWith('/sprinter'):
    new SprintService().start();
    break;
  default:
}

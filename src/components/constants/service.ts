export default class Service {
  static get LINK() {
    return 'https://learn-words-application.herokuapp.com';
    // return 'http://localhost:8000';
  }

  static get USERS() {
    return 'users';
  }

  static get WORDS() {
    return 'words';
  }

  static get LOGIN() {
    return 'signin';
  }

  static get TOKENS() {
    return 'tokens';
  }

  static get PAGE() {
    return '_page';
  }

  static get GROUP() {
    return '_group';
  }

  static get AGGREGATED() {
    return 'aggregatedWords';
  }

  static get STATISTICS() {
    return 'statistics';
  }

  static get SETTINGS() {
    return 'settings';
  }
}

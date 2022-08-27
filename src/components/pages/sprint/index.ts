import { Word } from '../../../types/Sprint';
import SprintView from './view';

class Sprint {
  private readonly apiUrl = 'https://learn-words-application.herokuapp.com';

  private vocabularyGroup: number | undefined;

  private vocabularyPage: number | undefined;

  private sprintView;

  private score;

  private words: Word[];

  private curentWordIndex: number;

  private isCurrentWordCorrect: boolean;

  private timer: number;

  private correctAnswersInLine: number;

  private isMuted: boolean;

  private answers: Array<{ word: Word, isCorrect: boolean }>;

  constructor() {
    this.sprintView = new SprintView();
    this.score = 0;
    this.curentWordIndex = 0;
    this.words = [];
    this.isCurrentWordCorrect = true;
    this.timer = 60;
    this.correctAnswersInLine = 0;
    this.isMuted = false;
    this.answers = [];
  }

  onTimerChange() {
    setTimeout(() => {
      if (this.timer > 0 && this.curentWordIndex < this.words.length) {
        this.timer -= 1;
        this.sprintView.drawTimer(this.timer);
        this.onTimerChange();
        return;
      }
      if (this.curentWordIndex < this.words.length) {
        this.finishGame();
      }
    }, 1000);
  }

  start(vocabularyGroup?: number, vocabularyPage?: number) {
    if (vocabularyGroup !== undefined && vocabularyPage !== undefined) {
      this.vocabularyGroup = vocabularyGroup;
      this.vocabularyPage = vocabularyPage;
      this.startGame();
    } else {
      this.sprintView.drawGameLevelSelector(this.onGameLevelSelect.bind(this));
    }
  }

  startGame() {
    this.answers = [];
    this.score = 0;
    this.curentWordIndex = 0;
    this.correctAnswersInLine = 0;
    this.sprintView.showLoading();
    this.timer = 60;
    const lastPage = this.vocabularyPage as number;
    Promise.all(Array.from(Array(lastPage + 1).keys()).map(
      (page) => fetch(`${this.apiUrl}/words?group=${this.vocabularyGroup}&page=${page}`).then((response) => response.json())
    )).then((words) => {
      this.words = words.flat().sort(() => (Math.random() > 0.5) ? 1 : -1);
      this.sprintView.draw(
        this.onCorrect.bind(this),
        this.onIncorrect.bind(this)
      );
      this.sprintView.hideLoading();
      this.onTimerChange();
      this.nextWord();
      this.sprintView.drawTimer(this.timer);
    });
  }

  finishGame() {
    if (this.words.length) {
      this.sprintView.finishGame(
        this.score,
        this.answers,
        this.onRestartGame.bind(this),
        this.onClose.bind(this)
      );
    }
  }

  nextWord() {
    if (this.curentWordIndex >= this.words.length) {
      this.finishGame();
      return;
    }
    const shouldTranslationBeCorrect = Math.random() > 0.5;
    const translation = shouldTranslationBeCorrect
      ? this.words[this.curentWordIndex].wordTranslate
      : this.words[Math.floor(Math.random() * this.words.length)].wordTranslate;
    this.sprintView.drawWord(
      this.words[this.curentWordIndex].word,
      translation,
      `${this.apiUrl}/${this.words[this.curentWordIndex].audio}`,
      this.score,
      this.correctAnswersInLine / 3
    );
    this.isCurrentWordCorrect = translation === this.words[this.curentWordIndex].wordTranslate;
  }

  changeScore(isAnswerCorrect: boolean) {
    const word = { ...this.words[this.curentWordIndex], audio: `${this.apiUrl}/${this.words[this.curentWordIndex].audio}` };
    this.answers.push({ word, isCorrect: isAnswerCorrect });
    if (isAnswerCorrect) {
      this.sprintView.drawCorrectAnswer();
      let multiplier;
      switch (true) {
        case this.correctAnswersInLine >= 9:
          multiplier = 8;
          break;
        case this.correctAnswersInLine >= 6:
          multiplier = 4;
          break;
        case this.correctAnswersInLine >= 3:
          multiplier = 2;
          break;
        default:
          multiplier = 1;
      }
      const receivedScore = 10 * multiplier;
      this.score += receivedScore;
      this.sprintView.drawReceivedScore(receivedScore);
      this.correctAnswersInLine += this.correctAnswersInLine < 9 ? 1 : 0;
      return;
    }
    this.sprintView.drawIncorrectAnswer();
    this.correctAnswersInLine = 0;
  }

  onMuteChange() {
    this.isMuted = !this.isMuted;
  }

  onCorrect() {
    this.changeScore(this.isCurrentWordCorrect === true);
    this.curentWordIndex += 1;
    this.nextWord();
  }

  onIncorrect() {
    this.changeScore(this.isCurrentWordCorrect === false);
    this.curentWordIndex += 1;
    this.nextWord();
  }

  onGameLevelSelect(group: number) {
    this.vocabularyGroup = group;
    this.vocabularyPage = 29;
    window.location.pathname = `/sprint/${this.vocabularyGroup}/${this.vocabularyPage}`;
  }

  onClose() {
    window.location.pathname = '/';
  }

  onRestartGame() {
    this.start(this.vocabularyGroup, this.vocabularyPage);
  }
}

export default Sprint;

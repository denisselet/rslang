import { IWord } from '../../../types/game';
import Service from '../../constants/service';
import WordsService from '../../services/words-service';
import { addWordAndStatistic } from '../../user/sendWordStat';
import SprintView from './view';

class Sprint {
  private static gameName = 'sprint';

  private vocabularyGroup: number | undefined;

  private vocabularyPage: number | undefined;

  private sprintView;

  private score;

  private words: IWord[];

  private currentWordIndex: number;

  private isCurrentWordCorrect: boolean;

  private timer: number;

  private correctAnswersInLine: number;

  private isMuted: boolean;

  private answers: Array<{ word: IWord, isCorrect: boolean }>;

  private maxCorrectAnswers: number;

  constructor() {
    this.sprintView = new SprintView();
    this.score = 0;
    this.currentWordIndex = 0;
    this.words = [];
    this.isCurrentWordCorrect = true;
    this.timer = 60;
    this.correctAnswersInLine = 0;
    this.maxCorrectAnswers = 0;
    this.isMuted = false;
    this.answers = [];
  }

  start(vocabularyGroup?: number, vocabularyPage?: number) {
    if (vocabularyGroup !== undefined) {
      this.vocabularyGroup = vocabularyGroup;
      this.vocabularyPage = vocabularyPage;
      this.startGame();
    } else {
      this.sprintView.drawGameLevelSelector(this.onGameLevelSelect.bind(this));
    }
  }

  private onTimerChange() {
    setTimeout(() => {
      if (this.timer > 0 && this.currentWordIndex < this.words.length) {
        this.timer -= 1;
        this.sprintView.drawTimer(this.timer);
        this.onTimerChange();
        return;
      }
      if (this.currentWordIndex < this.words.length) {
        this.finishGame();
      }
    }, 1000);
  }

  private loadWords(group: number, page: number | undefined): Promise<void> {
    const lastPage = page === undefined ? 29 : page;
    return Promise.all(Array.from(Array(lastPage + 1).keys()).map(
      (wordsPage) => WordsService.getWords(group, wordsPage)
    )).then((words) => {
      if (page !== undefined) {
        const [lastPageWords, ...restWords] = words.reverse();
        this.words = [
          ...lastPageWords.sort(() => (Math.random() > 0.5) ? 1 : -1),
          ...restWords.flat().sort(() => (Math.random() > 0.5) ? 1 : -1)
        ];
      } else {
        this.words = words.flat().sort(() => (Math.random() > 0.5) ? 1 : -1);
      }
    });
  }

  private startGame() {
    this.answers = [];
    this.score = 0;
    this.currentWordIndex = 0;
    this.correctAnswersInLine = 0;
    this.sprintView.showLoading();
    this.timer = 60;
    this.loadWords(this.vocabularyGroup, this.vocabularyPage).then(() => {
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

  private finishGame() {
    if (this.words.length) {
      this.sprintView.finishGame(
        this.score,
        this.answers,
        this.onRestartGame.bind(this),
        this.onClose.bind(this)
      );
      const correctWords = this.answers
        .filter(({ isCorrect }) => isCorrect)
        .map(({ word: { id } }) => id);
      const incorrectWords = this.answers
        .filter(({ isCorrect }) => !isCorrect)
        .map(({ word: { id } }) => id);
      this.maxCorrectAnswers = this.maxCorrectAnswers < this.correctAnswersInLine
        ? this.correctAnswersInLine : this.maxCorrectAnswers;
      addWordAndStatistic(correctWords, incorrectWords, Sprint.gameName, this.maxCorrectAnswers);
    }
  }

  private nextWord() {
    if (this.currentWordIndex >= this.words.length) {
      this.finishGame();
      return;
    }
    const shouldTranslationBeCorrect = Math.random() > 0.5;
    const translation = shouldTranslationBeCorrect
      ? this.words[this.currentWordIndex].wordTranslate
      : this.words[Math.floor(Math.random() * this.words.length)].wordTranslate;
    this.sprintView.drawWord(
      this.words[this.currentWordIndex].word,
      translation,
      `${Service.LINK}/${this.words[this.currentWordIndex].audio}`,
      this.score,
      this.correctAnswersInLine / 3
    );
    this.isCurrentWordCorrect = translation === this.words[this.currentWordIndex].wordTranslate;
  }

  private changeScore(isAnswerCorrect: boolean) {
    const word = { ...this.words[this.currentWordIndex], audio: `${Service.LINK}/${this.words[this.currentWordIndex]?.audio}` };
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
      this.correctAnswersInLine += 1;
      return;
    }
    this.sprintView.drawIncorrectAnswer();
    this.maxCorrectAnswers = this.maxCorrectAnswers < this.correctAnswersInLine
      ? this.correctAnswersInLine : this.maxCorrectAnswers;
    this.correctAnswersInLine = 0;
  }

  private onCorrect() {
    this.changeScore(this.isCurrentWordCorrect === true);
    this.currentWordIndex += 1;
    this.nextWord();
  }

  private onIncorrect() {
    this.changeScore(this.isCurrentWordCorrect === false);
    this.currentWordIndex += 1;
    this.nextWord();
  }

  private onGameLevelSelect(group: number) {
    this.vocabularyGroup = group;
    window.location.pathname = `/sprint/${this.vocabularyGroup}`;
  }

  private onClose() {
    window.location.pathname = '/';
  }

  private onRestartGame() {
    this.start(this.vocabularyGroup, this.vocabularyPage);
  }
}

export default Sprint;

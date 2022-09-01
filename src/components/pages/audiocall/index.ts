import { Word } from '../../../types/Word';
import Service from '../../constants/service';
import WordsService from '../../services/words-service';
import AudioCallView from './view';

class AudioCall {
  private static gameName = 'audiocall';

  private vocabularyGroup: number | undefined;

  private vocabularyPage: number | undefined;

  private audioCallView: AudioCallView;

  private score;

  private words: Word[];

  private currentWordIndex: number;

  private isCurrentWordCorrect: boolean;

  private correctAnswersInLine: number;

  private isMuted: boolean;

  private answers: Array<{ word: Word, isCorrect: boolean }>;

  private maxCorrectAnswers: number;

  constructor() {
    this.audioCallView = new AudioCallView();
    this.score = 0;
    this.currentWordIndex = 0;
    this.words = [];
    this.isCurrentWordCorrect = true;
    this.correctAnswersInLine = 0;
    this.maxCorrectAnswers = 0;
    this.isMuted = false;
    this.answers = [];
  }

  start(vocabularyGroup?: number, vocabularyPage?: number) {
    if (vocabularyGroup !== undefined && vocabularyPage !== undefined) {
      this.vocabularyGroup = vocabularyGroup;
      this.vocabularyPage = vocabularyPage;
      this.startGame();
    } else {
      this.audioCallView.drawGameLevelSelector(this.onGameLevelSelect.bind(this));
    }
  }

  private startGame() {
    this.answers = [];
    this.score = 0;
    this.currentWordIndex = 0;
    this.correctAnswersInLine = 0;
    this.audioCallView.showLoading();
    const lastPage = this.vocabularyPage as number;
    Promise.all(Array.from(Array(lastPage + 1).keys()).map(
      (page) => WordsService.getWords(this.vocabularyGroup, page)
    )).then((words) => {
      const [lastPageWords, ...restWords] = words.reverse();
      this.words = [
        ...lastPageWords.sort(() => (Math.random() > 0.5) ? 1 : -1),
        ...restWords.flat().sort(() => (Math.random() > 0.5) ? 1 : -1)
      ];
      if (this.words.length < 20) {
        // TODO: show error screen
      }
      this.audioCallView.draw(
        this.onAnswer.bind(this)
      );
      this.audioCallView.hideLoading();
      this.nextWord();
    });
  }

  private finishGame() {
    if (this.words.length) {
      this.audioCallView.finishGame(
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
      // TODO: change method once implemented
      // addWordAndStatistic(correctWords, incorrectWords, Sprint.gameName)
      this.maxCorrectAnswers = this.maxCorrectAnswers < this.correctAnswersInLine
        ? this.correctAnswersInLine : this.maxCorrectAnswers;
      // TODO: send maxCorrectAnswers to server
    }
  }

  private nextWord() {
    if (this.currentWordIndex >= 20) {
      this.finishGame();
      return;
    }
    const translations = [
      this.words[this.currentWordIndex].wordTranslate,
      this.words[Math.floor(Math.random() * this.words.length)].wordTranslate,
      this.words[Math.floor(Math.random() * this.words.length)].wordTranslate,
      this.words[Math.floor(Math.random() * this.words.length)].wordTranslate,
      this.words[Math.floor(Math.random() * this.words.length)].wordTranslate
    ].sort(() => (Math.random() > 0.5) ? 1 : -1);
    this.audioCallView.drawWord(
      `${Service.LINK}/${this.words[this.currentWordIndex].audio}`,
      translations,
      this.onAnswer.bind(this)
    );
  }

  private onAnswer(translation: string) {
    const correctTranslation = this.words[this.currentWordIndex].wordTranslate;
    this.audioCallView.drawAnswerResult(
      this.nextWord.bind(this),
      this.words[this.currentWordIndex].word,
      correctTranslation,
      `${Service.LINK}/${this.words[this.currentWordIndex].image}`
    );
    const isAnswerCorrect = correctTranslation === translation;
    const word = { ...this.words[this.currentWordIndex], audio: `${Service.LINK}/${this.words[this.currentWordIndex].audio}` };
    this.answers.push({ word, isCorrect: isAnswerCorrect });
    if (isAnswerCorrect) {
      this.audioCallView.drawCorrectAnswer();
      this.correctAnswersInLine += 1;
    } else {
      this.audioCallView.drawIncorrectAnswer();
      this.maxCorrectAnswers = this.maxCorrectAnswers < this.correctAnswersInLine
        ? this.correctAnswersInLine : this.maxCorrectAnswers;
      this.correctAnswersInLine = 0;
    }
    this.currentWordIndex += 1;
  }

  private onGameLevelSelect(group: number) {
    this.vocabularyGroup = group;
    this.vocabularyPage = 29;
    window.location.pathname = `/audiocall/${this.vocabularyGroup}/${this.vocabularyPage}`;
  }

  private onClose() {
    window.location.pathname = '/';
  }

  private onRestartGame() {
    this.start(this.vocabularyGroup, this.vocabularyPage);
  }
}

export default AudioCall;

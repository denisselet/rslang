import { IWord } from '../../../types/game';
import Service from '../../constants/service';
import UsersWordsService from '../../services/usersWords-service';
import WordsService from '../../services/words-service';
import { checkAuth } from '../../user/checkAuth';
import { addWordAndStatistic } from '../../user/sendWordStat';
import AudioCallView from './view';

class AudioCall {
  private static gameName = 'audiocall';

  private vocabularyGroup: number | undefined;

  private vocabularyPage: number | undefined;

  private audioCallView: AudioCallView;

  private words: IWord[];

  private currentWordIndex: number;

  private correctAnswersInLine: number;

  private answers: Array<{ word: IWord, isCorrect: boolean }>;

  private maxCorrectAnswers: number;

  constructor() {
    this.audioCallView = new AudioCallView();
    this.currentWordIndex = 0;
    this.words = [];
    this.correctAnswersInLine = 0;
    this.maxCorrectAnswers = 0;
    this.answers = [];
  }

  start(vocabularyGroup?: number, vocabularyPage?: number) {
    if (vocabularyGroup !== undefined) {
      this.vocabularyGroup = vocabularyGroup;
      this.vocabularyPage = vocabularyPage;
      this.startGame();
    } else {
      this.audioCallView.drawGameLevelSelector(this.onGameLevelSelect.bind(this));
    }
  }

  private async loadWords(group: number, page: number | undefined): Promise<void> {
    const lastPage = page === undefined ? 29 : page;
    const words = await Promise.all(Array.from(Array(lastPage + 1).keys()).map(
      (wordsPage) => WordsService.getWords(group, wordsPage)
    ));
    const userWords = checkAuth() ? await UsersWordsService.getAllUserWords() : [];
    const learnedWordIds = userWords
      .filter((item: { difficulty: string }) => item.difficulty === 'learned')
      .map(({ wordId }: {wordId: string}) => wordId);
    const wordsToLearn = words
      .map((pageWords) => pageWords.filter(({ id }: {id: string}) => !learnedWordIds.includes(id)));
    if (page !== undefined) {
      const [lastPageWords, ...restWords] = wordsToLearn.reverse();
      this.words = [
        ...lastPageWords.sort(() => (Math.random() > 0.5) ? 1 : -1),
        ...restWords.flat().sort(() => (Math.random() > 0.5) ? 1 : -1)
      ];
    } else {
      this.words = wordsToLearn.flat().sort(() => (Math.random() > 0.5) ? 1 : -1);
    }
  }

  private startGame() {
    this.answers = [];
    this.currentWordIndex = 0;
    this.correctAnswersInLine = 0;
    this.audioCallView.showLoading();
    this.loadWords(this.vocabularyGroup, this.vocabularyPage).then(() => {
      if (this.words.length < 10) {
        this.audioCallView.showError();
        return;
      }
      this.audioCallView.draw();
      this.audioCallView.hideLoading();
      this.nextWord();
    });
  }

  private finishGame() {
    if (this.words.length) {
      this.audioCallView.finishGame(
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
      if (checkAuth()) {
        addWordAndStatistic(
          correctWords,
          incorrectWords,
          AudioCall.gameName,
          this.maxCorrectAnswers
        );
      }
    }
  }

  private nextWord() {
    if (this.currentWordIndex >= this.words.length) {
      this.finishGame();
      return;
    }
    const wrongTranslationsAll = [...this.words];
    wrongTranslationsAll.splice(this.currentWordIndex, 1);
    const wrongTranslations = new Array(4).fill(0).map(() => {
      const randomIndex = Math.floor(Math.random() * wrongTranslationsAll.length);
      return wrongTranslationsAll.splice(randomIndex, 1)[0].wordTranslate;
    });
    const translations = [
      this.words[this.currentWordIndex].wordTranslate,
      wrongTranslations[0],
      wrongTranslations[1],
      wrongTranslations[2],
      wrongTranslations[3]
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
    window.location.pathname = `/audiocall/${this.vocabularyGroup}`;
  }

  private onClose() {
    window.location.pathname = '/';
  }

  private onRestartGame() {
    this.start(this.vocabularyGroup, this.vocabularyPage);
  }
}

export default AudioCall;

import SprintView from './view';

class SprintService {
  private readonly apiUrl = 'https://learn-words-application.herokuapp.com';

  private sprintView;

  private score;

  private words: { word: string, wordTranslate: string, audio: string }[];

  private curentWordIndex: number;

  private isCurrentWordCorrect: boolean;

  private timer: number;

  private correctAnswersInLine: number;

  private isMuted: boolean;

  constructor() {
    this.sprintView = new SprintView();
    this.score = 0;
    this.curentWordIndex = 0;
    this.words = [];
    this.isCurrentWordCorrect = true;
    this.timer = 60;
    this.correctAnswersInLine = 0;
    this.isMuted = false;
  }

  onTimerChange() {
    setTimeout(() => {
      if (this.timer > 0 && this.curentWordIndex < this.words.length) {
        this.timer -= 1;
        this.sprintView.drawTimer(this.timer);
        this.onTimerChange();
        return;
      }
      this.finishGame();
    }, 1000);
  }

  start() {
    this.onTimerChange();
    fetch(`${this.apiUrl}/words?group=1&page=0`)
      .then((response) => response.json())
      .then((words) => {
        this.words = words.sort(() => (Math.random() > 0.5) ? 1 : -1);
        this.sprintView.draw(
          this.onCorrect.bind(this),
          this.onIncorrect.bind(this)
        );
        this.nextWord();
        this.sprintView.drawTimer(this.timer);
      });
  }

  finishGame() {
    this.sprintView.finishGame(this.score);
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
    if (isAnswerCorrect) {
      this.sprintView.playCorrect();
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
      this.score += 10 * multiplier;
      this.correctAnswersInLine += this.correctAnswersInLine < 9 ? 1 : 0;
      return;
    }
    this.sprintView.playIncorrect();
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
}

export default SprintService;

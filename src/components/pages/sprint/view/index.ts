import './style.css';
import FullscreenOnIcon from '../assets/images/fullscreen_on.svg';
import FullscreenExitIcon from '../assets/images/fullscreen_exit.svg';
import StarIcon from '../assets/images/star_rate.svg';
import SoundOnIcon from '../assets/images/music_note-on.svg';
import SoundOffIcon from '../assets/images/music_note-off.svg';
import WordSoundIcon from '../assets/images/volume_down.svg';
import WordSoundOnIcon from '../assets/images/volume_up.svg';
import RightAnswerSound from '../assets/audio/right-answer.mp3';
import WrongAnswerSound from '../assets/audio/wrong-answer.mp3';
import { GameDocument, IWord } from '../../../../types/game';

class SprintView {
  private bodyKeyboardListenerFn: ((event: KeyboardEvent) => void) | undefined;

  draw(onCorrect: () => void, onIncorrect: () => void) {
    let main = document.getElementById('game-container');
    if (!main) {
      main = document.createElement('main');
      main.id = 'game-container';
      const content = document.querySelector('.mutable-content-wrapper');
      content.append(main);
    }
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.id = 'fullscreen-btn';
    fullscreenBtn.innerHTML = FullscreenOnIcon;
    fullscreenBtn.addEventListener('click', (event) => this.toggleFullscreen(event));
    const game = document.createElement('div');
    game.id = 'game';
    main.append(game);
    main.append(fullscreenBtn);
    const gameControls = this.getGameControls(onCorrect, onIncorrect);
    const gameHeader = document.createElement('div');
    gameHeader.className = 'game__game-header';

    const soundEl = document.createElement('button');
    soundEl.id = 'game-sound-btn';
    soundEl.dataset.muted = 'unmuted';
    soundEl.innerHTML = SoundOnIcon;
    soundEl.addEventListener('click', () => {
      const btn = document.getElementById('game-sound-btn') as HTMLButtonElement;
      btn.dataset.muted = btn.dataset.muted === 'muted' ? 'unmuted' : 'muted';
      btn.innerHTML = btn.dataset.muted === 'muted' ? SoundOffIcon : SoundOnIcon;
      document.querySelectorAll('audio').forEach((el) => {
        // eslint-disable-next-line no-param-reassign
        el.muted = btn.dataset.muted === 'muted';
      });
    });

    const scoreEl = document.createElement('span');
    scoreEl.id = 'game-score';
    const wordSoundBtn = document.createElement('button');
    wordSoundBtn.id = 'word-sound-btn';
    wordSoundBtn.innerHTML = WordSoundIcon;
    const wordSoundEl = document.createElement('audio');
    wordSoundEl.id = 'word-sound';
    wordSoundBtn.addEventListener('click', () => {
      wordSoundEl.play();
      wordSoundBtn.innerHTML = WordSoundOnIcon;
      setTimeout(() => { wordSoundBtn.innerHTML = WordSoundIcon; }, 1000);
    });

    const receivedScore = document.createElement('span');
    receivedScore.id = 'received-score';

    const scoreBooster = this.getScoreBooster();
    const wordContainer = document.createElement('div');
    wordContainer.id = 'word-container';
    gameHeader.append(soundEl);
    gameHeader.append(scoreEl);
    gameHeader.append(wordSoundBtn);
    gameHeader.append(wordSoundEl);
    game.append(gameHeader);
    game.append(receivedScore);
    game.append(scoreBooster);
    game.append(wordContainer);
    game.append(gameControls);
  }

  drawTimer(timer: number) {
    let timerEl = document.getElementById('game-timer');
    if (!timerEl) {
      timerEl = document.createElement('span');
      timerEl.id = 'game-timer';
      document.getElementById('game-container')?.append(timerEl);
    }
    timerEl.innerText = timer.toString();
  }

  drawWord(word: string, wordTranslate: string, audio: string, score: number, stars: number) {
    const wordContainer = document.getElementById('word-container') as HTMLElement;
    if (wordContainer) {
      wordContainer.innerHTML = '';
    }
    Array.from(document.querySelectorAll('.stars-container__star'))
      .forEach((el: Element, index: number) => {
        // eslint-disable-next-line no-param-reassign
        (el as HTMLSpanElement).style.fill = stars >= index + 1 ? 'gold' : 'lightgray';
      });
    const wordEl = document.createElement('span');
    wordEl.innerText = word;
    wordEl.className = 'word-eng';
    (document.getElementById('word-sound') as HTMLAudioElement).src = audio;
    const wordTranslateEl = document.createElement('span');
    wordTranslateEl.innerText = wordTranslate;
    const scoreEl = document.getElementById('game-score') as HTMLElement;
    scoreEl.innerText = score.toString();
    wordContainer.append(wordEl);
    wordContainer.append(wordTranslateEl);
    Array.from(document.querySelectorAll('.controls button')).forEach((btn) => {
      // eslint-disable-next-line no-param-reassign
      (btn as HTMLButtonElement).disabled = false;
    });
  }

  getScoreBooster() {
    const scoreBooster = document.querySelector('.score-booster');
    if (scoreBooster) {
      scoreBooster.remove();
    }
    const scoreBoosterContainer = document.createElement('div');
    scoreBoosterContainer.className = 'score-booster';
    const stars = document.createElement('div');
    stars.className = 'score-booster__stars-container';
    for (let i = 0; i < 3; i += 1) {
      const star = document.createElement('span');
      star.innerHTML = StarIcon;
      star.className = 'stars-container__star';
      stars.append(star);
    }
    scoreBoosterContainer.append(stars);
    return scoreBoosterContainer;
  }

  getGameControls(onCorrect: () => void, onIncorrect: () => void) {
    const controls = document.createElement('div');
    controls.className = 'controls';
    this.bodyKeyboardListenerFn = (event: KeyboardEvent) => {
      if (event.code === 'ArrowRight') {
        onIncorrect();
      }
      if (event.code === 'ArrowLeft') {
        onCorrect();
      }
    };
    document.body.addEventListener('keydown', this.bodyKeyboardListenerFn);
    const trueButton = document.createElement('button');
    trueButton.className = 'controls__btn controls__btn-true';
    trueButton.innerText = 'Верно';
    trueButton.addEventListener('click', () => {
      trueButton.disabled = true;
      onCorrect();
    });
    const falseButton = document.createElement('button');
    falseButton.className = 'controls__btn controls__btn-false';
    falseButton.innerText = 'Неверно';
    falseButton.addEventListener('click', () => {
      falseButton.disabled = true;
      onIncorrect();
    });
    const correctAudio = document.createElement('audio');
    correctAudio.id = 'correct-sound';
    const incorrectAudio = document.createElement('audio');
    incorrectAudio.id = 'incorrect-sound';
    correctAudio.src = RightAnswerSound;
    incorrectAudio.src = WrongAnswerSound;
    controls.append(correctAudio);
    controls.append(incorrectAudio);
    controls.append(trueButton);
    controls.append(falseButton);
    return controls;
  }

  finishGame(
    score: number,
    answers: { word: IWord, isCorrect: boolean }[],
    onRestartGame: () => void,
    onClose: () => void
  ) {
    document.body.removeEventListener('keydown', this.bodyKeyboardListenerFn as (event: KeyboardEvent) => void);
    const finishGame = document.createElement('div');
    finishGame.id = 'finish-game-container';
    const scoreTitle = document.createElement('div');
    scoreTitle.innerText = `Твой результат ${score} очков`;
    scoreTitle.className = 'finish-game__title';
    finishGame.append(scoreTitle);

    const gameStatisticContainer = document.createElement('div');
    gameStatisticContainer.className = 'finish-game__statistic';

    const percentRightAnswer = document.createElement('div');
    percentRightAnswer.className = 'statistic__circle';

    const gameStatisticInfo = document.createElement('span');
    gameStatisticInfo.className = 'statistic__info';
    const percentage = Math.round(
      (answers.filter(({ isCorrect }) => isCorrect).length / answers.length) * 100
    );
    gameStatisticInfo.innerText = `${Number.isNaN(percentage) ? 0 : percentage}% правильных ответов`;
    percentRightAnswer.setAttribute('style', `--value:${percentage}`);

    gameStatisticContainer.append(percentRightAnswer);
    percentRightAnswer.append(gameStatisticInfo);

    finishGame.append(gameStatisticContainer);
    const answersSection = this.getAnswersSection(answers);
    finishGame.append(answersSection);
    document.getElementById('game-timer')?.remove();

    const finishGameBtns = document.createElement('div');
    finishGameBtns.className = 'finish-btns';
    finishGame.append(finishGameBtns);

    const restart = document.createElement('button');
    restart.innerText = 'Начать заново';
    restart.className = 'finish-btns__restart';
    restart.addEventListener('click', () => {
      document.getElementById('game-container').remove();
      onRestartGame();
    });
    finishGameBtns.append(restart);

    const close = document.createElement('button');
    close.innerText = 'Закрыть';
    close.className = 'finish-btns__close';
    close.addEventListener('click', () => onClose());
    finishGameBtns.append(close);

    setTimeout(() => {
      [...document.querySelectorAll('audio')].forEach((el) => el?.pause());
      const gameContainer = document.getElementById('game-container') as HTMLElement;
      gameContainer.innerHTML = '';
      gameContainer.append(finishGame);
    }, 500);
  }

  getAnswer({ word, wordTranslate, audio }: IWord): HTMLElement {
    const wordContainer = document.createElement('div');
    wordContainer.className = 'word-in-result-container';
    const wordSoundBtn = document.createElement('button');
    wordSoundBtn.id = 'result-sound-btn';
    wordSoundBtn.innerHTML = WordSoundIcon;
    const wordSoundEl = document.createElement('audio');
    wordSoundEl.src = audio;
    wordSoundEl.id = 'word-sound';
    wordSoundBtn.addEventListener('click', () => {
      wordSoundEl.play();
      wordSoundBtn.innerHTML = WordSoundOnIcon;
      setTimeout(() => { wordSoundBtn.innerHTML = WordSoundIcon; }, 1000);
    });
    const wordEl = document.createElement('span');
    wordEl.innerText = `${word} - ${wordTranslate}`;
    wordContainer.append(wordSoundBtn, wordEl);
    return wordContainer;
  }

  getAnswersSection(answers: { word: IWord, isCorrect: boolean }[]): HTMLElement {
    const container = document.createElement('div');
    container.className = 'answers-container';
    const correctAnswers = answers.filter(({ isCorrect }) => isCorrect).map(({ word }) => word);
    const correctTitle = document.createElement('div');
    correctTitle.innerText = `Знаю - ${correctAnswers.length}`;
    correctTitle.className = 'answers-container__title';
    container.append(correctTitle);
    correctAnswers.forEach((word) => {
      container.append(this.getAnswer(word));
    });
    const incorrectAnswers = answers.filter(({ isCorrect }) => !isCorrect).map(({ word }) => word);
    const incorrectTitle = document.createElement('div');
    incorrectTitle.innerText = `Стоит повторить - ${incorrectAnswers.length}`;
    incorrectTitle.className = 'answers-container__title';
    container.append(incorrectTitle);
    incorrectAnswers.forEach((word) => {
      container.append(this.getAnswer(word));
    });
    return container;
  }

  drawCorrectAnswer() {
    (document.getElementById('correct-sound') as HTMLAudioElement).play();
    const gameEl = document.getElementById('game');
    gameEl?.classList.add('game__correct-answer');
    setTimeout(() => {
      gameEl?.classList.remove('game__correct-answer');
    }, 500);
  }

  drawIncorrectAnswer() {
    (document.getElementById('incorrect-sound') as HTMLAudioElement).play();
    const gameEl = document.getElementById('game');
    gameEl?.classList.add('game__incorrect-answer');
    setTimeout(() => {
      gameEl?.classList.remove('game__incorrect-answer');
    }, 500);
  }

  drawGameLevelSelector(onSelect: (group: number) => void) {
    const main = document.createElement('main');
    main.id = 'game-container';
    document.querySelector('.mutable-content-wrapper').append(main);
    const sprintStart = document.createElement('div');
    sprintStart.id = 'sprint-start-screen';
    main.append(sprintStart);
    const levelHeader = document.createElement('h2');
    levelHeader.innerText = 'СПРИНТ';
    const level = document.createElement('span');
    level.className = 'level-message';
    level.innerText = 'Выбери уровень сложности, чтобы начать игру';
    sprintStart.append(levelHeader);
    sprintStart.append(level);
    const groups = 6;
    new Array(groups).fill(0).forEach((el, index) => {
      const btn = document.createElement('button');
      switch (index) {
        case 0:
          btn.innerText = 'A1';
          btn.className = 'level__btn level__btn-A1';
          break;
        case 1:
          btn.innerText = 'A2';
          btn.className = 'level__btn level__btn-A2';
          break;
        case 2:
          btn.innerText = 'B1';
          btn.className = 'level__btn level__btn-B1';
          break;
        case 3:
          btn.innerText = 'B2';
          btn.className = 'level__btn level__btn-B2';
          break;
        case 4:
          btn.innerText = 'C1';
          btn.className = 'level__btn level__btn-C1';
          break;
        case 5:
          btn.innerText = 'C2';
          btn.className = 'level__btn level__btn-C2';
          break;
        default:
          btn.innerText = '';
          break;
      }
      btn.dataset.value = index.toString();
      sprintStart.append(btn);
    });
    main.addEventListener('click', (event) => {
      const btn = (event.target as HTMLElement).closest('button');
      if (btn?.dataset?.value) {
        onSelect(Number(btn.dataset.value));
      }
    });
  }

  drawReceivedScore(receivedScore: number) {
    const receivedScoreEl = document.getElementById('received-score') as HTMLSpanElement;
    receivedScoreEl.innerText = `+${receivedScore}`;
    setTimeout(() => {
      receivedScoreEl.innerText = '';
    }, 500);
  }

  showLoading() {
    const main = document.createElement('main');
    main.id = 'game-container';
    document.querySelector('.mutable-content-wrapper').append(main);
    const header = document.createElement('h2');
    header.id = 'loading-indicator';
    header.innerText = 'Подождите, игра загружается...';
    main.append(header);
  }

  hideLoading() {
    document.getElementById('loading-indicator')?.remove();
  }

  showError() {
    const main = document.getElementById('game-container');
    main.innerHTML = '';
    const errorMessage = document.createElement('p');
    errorMessage.className = 'error-message';
    errorMessage.innerText = 'Oops!.. Недостаточно слов. Начни игру с другой страницы учебника или из меню';
    main.append(errorMessage);
  }

  cancelFullscreen() {
    if ((document as Document & {cancelFullScreen: () => void}).cancelFullScreen) {
      (document as Document & {cancelFullScreen: () => void}).cancelFullScreen();
    }
  }

  toggleFullscreen(event: Event) {
    let element = document.body;
    if (event instanceof HTMLElement) {
      element = event;
    }
    const isFullscreen = (document as Document & GameDocument)
      .webkitIsFullScreen || (document as Document & GameDocument).mozFullScreen || false;

    (element as HTMLElement & GameDocument).requestFullScreen = (
      element as HTMLElement & GameDocument
    )
      .requestFullScreen
      || (element as HTMLElement & GameDocument).webkitRequestFullScreen
      || (element as HTMLElement & GameDocument).mozRequestFullScreen
      || function isFscrn() { return false; };
    (document as Document & GameDocument).cancelFullScreen = (document as Document & GameDocument)
      .cancelFullScreen
      || (document as Document & GameDocument).webkitCancelFullScreen
      || (document as Document & GameDocument).mozCancelFullScreen
      || function isFscrn() { return false; };
    if (isFullscreen) {
      (document as Document & {cancelFullScreen: () => void}).cancelFullScreen();
      document.getElementById('fullscreen-btn').innerHTML = FullscreenOnIcon;
    } else {
      (element as HTMLElement & {requestFullScreen: () => void}).requestFullScreen();
      document.getElementById('fullscreen-btn').innerHTML = FullscreenExitIcon;
    }
  }
}

export default SprintView;

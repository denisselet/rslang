import { IWord } from '../../../../types/game';
import './style.css';
import SoundOnIcon from '../assets/images/music_note-on.svg';
import SoundOffIcon from '../assets/images/music_note-off.svg';
import WordSoundIcon from '../assets/images/volume_down.svg';
import WordSoundOnIcon from '../assets/images/volume_up.svg';
import RightAnswerSound from '../assets/audio/right-answer.mp3';
import WrongAnswerSound from '../assets/audio/wrong-answer.mp3';

class AudioCallView {
  private bodyKeyboardListenerFn: ((event: KeyboardEvent) => void) | undefined;

  draw() {
    let main = document.getElementById('audiocall-game-container');
    if (!main) {
      main = document.createElement('main');
      main.id = 'audiocall-game-container';
      const content = document.querySelector('.mutable-content-wrapper');
      content.append(main);
    }
    const game = document.createElement('div');
    game.id = 'audiocall-game';
    main.append(game);
    const gameControls = this.getGameControls();
    const gameHeader = document.createElement('div');
    gameHeader.className = 'audiocall-game__game-header';

    const soundEl = document.createElement('button');
    soundEl.id = 'game-sound-btn';
    soundEl.dataset.muted = 'unmuted';
    soundEl.innerHTML = SoundOnIcon;
    soundEl.addEventListener('click', () => {
      const btn = document.getElementById('game-sound-btn') as HTMLButtonElement;
      btn.dataset.muted = btn.dataset.muted === 'muted' ? 'unmuted' : 'muted';
      btn.innerHTML = btn.dataset.muted === 'muted' ? SoundOffIcon : SoundOnIcon;
      document.querySelectorAll('.controls audio').forEach((el) => {
        // eslint-disable-next-line no-param-reassign
        (el as HTMLAudioElement).muted = btn.dataset.muted === 'muted';
      });
    });

    const wordContainer = document.createElement('div');
    wordContainer.id = 'audiocall-word-container';
    gameHeader.append(soundEl);
    game.append(gameHeader);
    game.append(wordContainer);
    game.append(gameControls);
  }

  setKeyboardAnswerListener(onAnswer: (translation: string) => void) {
    if (this.bodyKeyboardListenerFn) {
      document.body.removeEventListener('keydown', this.bodyKeyboardListenerFn as (event: KeyboardEvent) => void);
    }
    this.bodyKeyboardListenerFn = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'Digit1':
        case 'Digit2':
        case 'Digit3':
        case 'Digit4':
        case 'Digit5': {
          const buttonIndex = Number(Array.from(event.code).pop()) - 1;
          const button = (document
            .querySelectorAll('.audiocall-translation-controls__answer-button')[buttonIndex] as HTMLButtonElement);
          onAnswer(button.dataset.translation);
          break;
        }
        case 'Space': {
          onAnswer(undefined);
          break;
        }
        default:
          break;
      }
    };
    document.body.addEventListener('keydown', this.bodyKeyboardListenerFn);
  }

  setKeyboardAnswerResultListener(onNext: () => void) {
    if (this.bodyKeyboardListenerFn) {
      document.body.removeEventListener('keydown', this.bodyKeyboardListenerFn as (event: KeyboardEvent) => void);
    }
    this.bodyKeyboardListenerFn = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        onNext();
      }
    };
    document.body.addEventListener('keydown', this.bodyKeyboardListenerFn);
  }

  drawWord(audio: string, translations: string[], onAnswer: (translation: string) => void) {
    const wordContainer = document.getElementById('audiocall-word-container') as HTMLElement;
    if (wordContainer) {
      wordContainer.innerHTML = '';
    }
    const wordAudio = document.createElement('audio');
    wordAudio.src = audio;
    const wordAudioBtn = document.createElement('button');
    wordAudioBtn.classList.add('audiocall-word-audio-btn');
    wordAudio.play();
    wordAudioBtn.innerHTML = WordSoundOnIcon;
    setTimeout(() => { wordAudioBtn.innerHTML = WordSoundIcon; }, 1000);
    wordAudioBtn.addEventListener('click', () => {
      wordAudio.play();
      wordAudioBtn.innerHTML = WordSoundOnIcon;
      setTimeout(() => { wordAudioBtn.innerHTML = WordSoundIcon; }, 1000);
    });
    const translationsContainer = document.createElement('div');
    translationsContainer.classList.add('audiocall-translation-controls');
    translations.forEach((translation) => {
      const translationEl = document.createElement('button');
      translationEl.classList.add('audiocall-translation-controls__answer-button');
      translationEl.addEventListener('click', () => {
        onAnswer(translation);
      });
      translationEl.innerText = `${translations.indexOf(translation) + 1} ${translation}`;
      translationEl.dataset.translation = translation;
      translationsContainer.append(translationEl);
    });
    const nextBtn = document.createElement('button');
    nextBtn.id = 'next-btn';
    nextBtn.className = 'audiocall-controls__btn audiocall-controls__btn-true';
    nextBtn.innerText = 'Не знаю';
    nextBtn.addEventListener('click', () => onAnswer(undefined));
    wordContainer.append(wordAudio);
    wordContainer.append(wordAudioBtn);
    wordContainer.append(translationsContainer);
    wordContainer.append(nextBtn);
    this.setKeyboardAnswerListener(onAnswer);
  }

  drawAnswerResult(onNextClick: () => void, word: string, translation: string, image: string) {
    Array.from(document.querySelector('.audiocall-translation-controls').children).forEach((btn) => {
      // eslint-disable-next-line no-param-reassign
      (btn as HTMLButtonElement).disabled = true;
      btn.classList.add(
        (btn as HTMLButtonElement).dataset.translation === translation ? 'audiocall-btn__correct-answer' : 'audiocall-btn__incorrect-answer'
      );
    });
    const nextBtn = document.getElementById('next-btn');
    const nextBtnClone = nextBtn.cloneNode(true) as HTMLElement;
    nextBtnClone.innerText = 'Дальше';
    nextBtn.remove();
    document.getElementById('audiocall-word-container')?.append(nextBtnClone);
    nextBtnClone.addEventListener('click', () => onNextClick());
    const container = document.getElementById('audiocall-word-container');
    const imageEl = document.createElement('img');
    imageEl?.classList.add('audiocall-translation-img');
    imageEl.src = image;
    const wordEl = document.createElement('span');
    wordEl.innerText = word;
    container.prepend(wordEl);
    container.prepend(imageEl);
    this.setKeyboardAnswerResultListener(onNextClick);
  }

  getGameControls() {
    const controls = document.createElement('div');
    controls.className = 'controls';
    const correctAudio = document.createElement('audio');
    correctAudio.id = 'correct-sound';
    const incorrectAudio = document.createElement('audio');
    incorrectAudio.id = 'incorrect-sound';
    correctAudio.src = RightAnswerSound;
    incorrectAudio.src = WrongAnswerSound;
    controls.append(correctAudio);
    controls.append(incorrectAudio);
    return controls;
  }

  finishGame(
    answers: { word: IWord, isCorrect: boolean }[],
    onRestartGame: () => void,
    onClose: () => void
  ) {
    document.body.removeEventListener('keydown', this.bodyKeyboardListenerFn as (event: KeyboardEvent) => void);
    const finishGame = document.createElement('div');
    finishGame.id = 'audiocall-finish-game-container';

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
      document.getElementById('audiocall-game-container').remove();
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
      const gameContainer = document.getElementById('audiocall-game-container') as HTMLElement;
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
    container.className = 'audiocall-answers-container';
    const correctAnswers = answers.filter(({ isCorrect }) => isCorrect).map(({ word }) => word);
    const correctTitle = document.createElement('div');
    correctTitle.innerText = `Знаю - ${correctAnswers.length}`;
    correctTitle.className = 'audiocall-answers-container__title';
    container.append(correctTitle);
    correctAnswers.forEach((word) => {
      container.append(this.getAnswer(word));
    });
    const incorrectAnswers = answers.filter(({ isCorrect }) => !isCorrect).map(({ word }) => word);
    const incorrectTitle = document.createElement('div');
    incorrectTitle.innerText = `Стоит повторить - ${incorrectAnswers.length}`;
    incorrectTitle.className = 'audiocall-answers-container__title';
    container.append(incorrectTitle);
    incorrectAnswers.forEach((word) => {
      container.append(this.getAnswer(word));
    });
    return container;
  }

  drawCorrectAnswer() {
    (document.getElementById('correct-sound') as HTMLAudioElement).play();
    const gameEl = document.getElementById('audiocall-game');
    gameEl?.classList.add('audiocall-game__correct-answer');
    setTimeout(() => {
      gameEl?.classList.remove('audiocall-game__correct-answer');
    }, 500);
  }

  drawIncorrectAnswer() {
    (document.getElementById('incorrect-sound') as HTMLAudioElement).play();
    const gameEl = document.getElementById('audiocall-game');
    gameEl?.classList.add('audiocall-game__incorrect-answer');
    setTimeout(() => {
      gameEl?.classList.remove('audiocall-game__incorrect-answer');
    }, 500);
  }

  drawGameLevelSelector(onSelect: (group: number) => void) {
    const main = document.createElement('main');
    main.id = 'audiocall-game-container';
    document.querySelector('.mutable-content-wrapper').append(main);
    const audioCallStart = document.createElement('div');
    audioCallStart.id = 'audiocall-start-screen';
    main.append(audioCallStart);
    const levelHeader = document.createElement('h2');
    levelHeader.innerText = 'АУДИОВЫЗОВ';
    const level = document.createElement('span');
    level.className = 'level-message';
    level.innerText = 'Выбери уровень сложности, чтобы начать игру';
    audioCallStart.append(levelHeader);
    audioCallStart.append(level);
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
      audioCallStart.append(btn);
    });
    main.addEventListener('click', (event) => {
      const btn = (event.target as HTMLElement).closest('button');
      if (btn?.dataset?.value) {
        onSelect(Number(btn.dataset.value));
      }
    });
  }

  showLoading() {
    const main = document.createElement('main');
    main.id = 'audiocall-game-container';
    document.querySelector('.mutable-content-wrapper').append(main);
    const header = document.createElement('h2');
    header.id = 'loading-indicator';
    header.innerText = 'Подождите, игра загружается...';
    main.append(header);
  }

  hideLoading() {
    document.getElementById('loading-indicator')?.remove();
  }
}

export default AudioCallView;

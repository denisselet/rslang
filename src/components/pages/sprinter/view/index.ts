import './style.css';
import StarIcon from '../assets/images/star_rate.svg';
import SoundOnIcon from '../assets/images/music_note-on.svg';
import SoundOffIcon from '../assets/images/music_note-off.svg';
import WordSoundIcon from '../assets/images/volume_down.svg';
import WordSoundOnIcon from '../assets/images/volume_up.svg';
import RightAnswerSound from '../assets/audio/right-answer.mp3';
import WrongAnswerSound from '../assets/audio/wrong-answer.mp3';

class SprintView {
  draw(onCorrect: () => void, onIncorrect: () => void) {
    const main = document.createElement('main');
    main.id = 'game-container';
    const content = document.querySelector('.mutable-content-wrapper');
    content.append(main);
    const game = document.createElement('div');
    game.id = 'game';
    main.append(game);
    const gameControlls = this.getGameControlls(onCorrect, onIncorrect);
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

    const scoreBooster = this.getScoreBooster();
    const wordContainer = document.createElement('div');
    wordContainer.id = 'word-container';
    gameHeader.append(soundEl);
    gameHeader.append(scoreEl);
    gameHeader.append(wordSoundBtn);
    gameHeader.append(wordSoundEl);
    game.append(gameHeader);
    game.append(scoreBooster);
    game.append(wordContainer);
    game.append(gameControlls);
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

  getGameControlls(onCorrect: () => void, onIncorrect: () => void) {
    const controlls = document.createElement('div');
    controlls.className = 'controlls';
    const trueButton = document.createElement('button');
    trueButton.className = 'controlls__btn controlls__btn-true';
    trueButton.innerText = 'Верно';
    trueButton.addEventListener('click', () => onCorrect());
    const falseButton = document.createElement('button');
    falseButton.className = 'controlls__btn controlls__btn-false';
    falseButton.innerText = 'Неверно';
    falseButton.addEventListener('click', () => onIncorrect());
    const correctAutio = document.createElement('audio');
    correctAutio.src = RightAnswerSound;
    correctAutio.id = 'correct-sound';
    const incorrectAutio = document.createElement('audio');
    incorrectAutio.src = WrongAnswerSound;
    incorrectAutio.id = 'incorrect-sound';
    controlls.append(trueButton);
    controlls.append(falseButton);
    controlls.append(correctAutio);
    controlls.append(incorrectAutio);
    return controlls;
  }

  finishGame(score: number) {
    const gameContainer = document.getElementById('game-container') as HTMLElement;
    gameContainer.innerHTML = '';
    const scoreContainer = document.createElement('div');
    const scoreEl = document.createElement('span');
    scoreEl.innerText = `Ваш результат ${score} очков`;
    scoreContainer.append(scoreEl);
    gameContainer.append(scoreContainer);
    document.getElementById('game-timer')?.remove();
  }

  playCorrect() {
    (document.getElementById('correct-sound') as HTMLAudioElement).play();
  }

  playIncorrect() {
    (document.getElementById('incorrect-sound') as HTMLAudioElement).play();
  }
}

export default SprintView;

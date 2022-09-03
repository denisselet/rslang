import Service from '../../constants/service';
import WordsService from '../../services/words-service';
import { TextbookView } from './view';

export class TextbookService {
  private textbookView: TextbookView;

  constructor() {
    this.textbookView = new TextbookView();
  }

  public start(): void {
    this.textbookView.draw();
    this.addCardsWords();
    WordsService.getWords(0, 0).then((words) => {
      const playBtn = document.getElementById('play-action');
      playBtn.addEventListener('click', () => {
        const audio = document.getElementById('word-audio') as HTMLAudioElement;
        audio.src = `${Service.LINK}/${words[0].audio}`;
        audio.addEventListener('ended', () => {
          audio.src = `${Service.LINK}/${words[0].audioExample}`;
          audio.play();
          audio.addEventListener('ended', () => {
            audio.src = `${Service.LINK}/${words[0].audioMeaning}`;
            audio.play();
          }, { once: true });
        }, { once: true });
        return audio.play();
      });
    });
  }

  private addCardsWords(): void {
    const wrapperTextbookWords: HTMLElement = document.querySelector('.wrapper-textbook-words');
    let i = 0;
    while (i < 20) {
      wrapperTextbookWords.insertAdjacentHTML('beforeend', `
<div class='card'>
<audio id="word-audio"></audio>
<div class='card-img'>
<img src='./assets/img/Denis.jpg' alt='photo'>
<div class='card-volume' id="play-action"><img src="./assets/img/volume.svg" alt="play"></div>
</div>
<h4 class='card-name'>Изучаемое слово: переменная слова</h4>
<h5 class='card-transcription'>Транскрипция: переменная транскрипции</h5>
<h5 class='card-meaning-en'>Meaning: переменная с объяснением значения слова </h5>
<h5 class='card-example-en'>Example: переменная с примером использования изучаемого слова</h5>
<h5 class='card-translation'>Перевод: <strong>переменная с переводом слова</strong></h5>
<h5 class='card-meaning-ru'>Значение: переменная с переводом объяснением значения слова на ру.</h5>
<h5 class='card-example-ru'>Пример: переменная с примером использования изучаемого слова на ру.</h5>
<div class='card-button'><button>Сложное</button><button>Изученное</button></div>
</div>
`);
      i += 1;
    }
  }
}

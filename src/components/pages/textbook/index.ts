import { ICard, IWord } from '../../../types/card';
import Service from '../../constants/service';
import {
  ATTRIBUTE_ENTER,
  ATTRIBUTE_HARD,
  ATTRIBUTE_LEARNED,
  ATTRIBUTE_NONE
} from '../../constants/textbook';
import UsersWordsService from '../../services/usersWords-service';
import WordsService from '../../services/words-service';
import { checkAuth } from '../../user/checkAuth';

import {
  audioFunc, hardBut, learnedBut
} from './utils';
import { TextbookView } from './view';

export class TextbookService {
  private textbookView: TextbookView;

  constructor() {
    this.textbookView = new TextbookView();
  }

  public start(): void {
    this.textbookView.draw();
    let group = 0;
    let page = 0;
    if (localStorage.getItem('textbook')) {
      const obj = JSON.parse(localStorage.getItem('textbook'));
      group = obj.g;
      page = obj.p;
      this.addCardsWords(group, page);
    } else {
      localStorage.setItem('textbook', JSON.stringify({ g: 0, p: 0 }));
      this.addCardsWords(group, page);
    }

    const arrPage = document.querySelectorAll('.section-textbook-pages .form_radio_btn');
    for (let i = 0; i < arrPage.length; i += 1) {
      arrPage[i].addEventListener('click', () => {
        const pageLoop = +arrPage[i].querySelector('input').getAttribute('value') - 1;
        const loc = JSON.parse(localStorage.getItem('textbook'));
        localStorage.setItem('textbook', JSON.stringify({ g: loc.g, p: pageLoop }));
        this.start();
      });
    }

    const arrGroup = document.querySelectorAll('.section-textbook-partition .form_radio_btn');
    for (let i = 0; i < arrGroup.length; i += 1) {
      arrGroup[i].addEventListener('click', () => {
        const groupLoop = +arrGroup[i].querySelector('input').getAttribute('value') - 1;
        const loc = JSON.parse(localStorage.getItem('textbook'));
        localStorage.setItem('textbook', JSON.stringify({ g: groupLoop, p: loc.p }));
        this.start();
      });
    }
  }

  private async addCardsWords(group: number, page: number) {
    const wrapperTextbookWords: HTMLElement = document.querySelector('.wrapper-textbook-words');
    wrapperTextbookWords.innerHTML = '';

    const wrapperTextbookLinks: HTMLElement = document.querySelector('.wrapper-textbook-links');
    wrapperTextbookLinks.innerHTML = `
    <p><a href="sprint/${group}/${page}">Перейти на спринт</a></p>
    <p><a href="audiocall/${group}/${page}">Перейти на аудиовызов</a></p>`;

    let arrWord: IWord[];
    let userWord;
    let arrCard;

    if (checkAuth()) {
      userWord = await UsersWordsService.getAllUserWords();
      document.querySelector('#div-but-hard').classList.remove(ATTRIBUTE_NONE);
    }
    if (group === 6) {
      document.querySelector('.wrapper-textbook-links').classList.add(ATTRIBUTE_NONE);
      arrWord = userWord
        .filter((item: { difficulty: string }) => item.difficulty === ATTRIBUTE_HARD);
      const arrWordId = arrWord.map((item) => item.wordId);
      const prom = [];
      for (let i = 0; i < arrWordId.length; i += 1) {
        prom.push(WordsService.getWordById(arrWordId[i]));
      }
      arrCard = await Promise.all(prom);
    } else {
      arrWord = await WordsService.getWords(group, page);
      document.querySelector('.wrapper-textbook-links').classList.remove(ATTRIBUTE_NONE);
    }

    let i = 0;
    while (i < arrWord.length) {
      const el = arrWord[i];
      let objWord;
      let card: ICard;
      if (group === 6) {
        card = arrCard.find((item) => item.id === el.wordId);
        objWord = userWord.find((item: { wordId: string }) => item.wordId === el.wordId);
      } else {
        if (checkAuth()) {
          objWord = userWord.find((item: { wordId: string }) => item.wordId === el.id);
        }
        card = el;
      }

      wrapperTextbookWords.insertAdjacentHTML('beforeend', `
        <div class='card' data-value="${card.id}">
        <div class='card-img'>
        <img src='${Service.LINK}/${card.image}' alt='photo'>
        <audio id="word-audio-${card.id}"></audio>
        <div class='card-volume' id="play-action-${card.id}"><img src="./assets/img/volume.svg" alt="play"></div>
        </div>
        <h4 class='card-name'>${card.word}</h4>
        <h5 class='card-transcription'>${card.transcription}</h5>
        <h5 class='card-meaning-en'>${card.textMeaning}</h5>
        <h5 class='card-example-en'>Example: ${card.textExample}</h5>
        <h5 class='card-translation'>Перевод: <strong>${card.wordTranslate}</strong></h5>
        <h5 class='card-meaning-ru'>${card.textMeaningTranslate}</h5>
        <h5 class='card-example-ru'>Пример: ${card.textExampleTranslate}</h5>
        <div class='card-stat-div${(checkAuth()) ? '' : ATTRIBUTE_NONE}'>
        <h5 class='card-stat'>Спринт: ${(objWord) ? objWord.optional.sprint.true : 0} : ${(objWord) ? objWord.optional.sprint.false : 0}</h5>
        <h5 class='card-stat'>Аудиовызов: ${(objWord) ? objWord.optional.audioCall.true : 0} : ${(objWord) ? objWord.optional.audioCall.false : 0}</h5>
        </div>
        <div class='card-button${(checkAuth()) ? '' : ATTRIBUTE_NONE}'>
          <button class="card-but-hard${(objWord && objWord.difficulty === ATTRIBUTE_HARD) ? ' ' + ATTRIBUTE_ENTER : ''}" id="card-but-hard-${card.id}">${(objWord && objWord.difficulty === ATTRIBUTE_HARD) ? 'Удалить из сложного' : 'Сложное'}</button>
          <button class="card-but-learned${(objWord && objWord.difficulty === ATTRIBUTE_LEARNED) ? ' ' + ATTRIBUTE_ENTER : ''}" id="card-but-learned-${card.id}">${(objWord && objWord.difficulty === ATTRIBUTE_LEARNED) ? 'Удалить из изученного' : 'Изученное'}</button>
        </div>
        </div>
        `);
      i += 1;

      audioFunc(card);
    }
    hardBut();
    learnedBut();
  }
}

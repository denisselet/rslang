import Service from '../../constants/service';
import UsersWordsService from '../../services/usersWords-service';
import WordsService from '../../services/words-service';
import { checkAuth } from '../../user/checkAuth';
import { addWordAndStatistic } from '../../user/sendWordStat';
import { getStatistic } from '../../user/statistic/getStatistic';
import { addHardWord, addLearnedWord, deleteHardWord, deleteLearnedWord } from '../../user/textbook/addWord';
import { TextbookView } from './view';


export class TextbookService {
  private textbookView: TextbookView;

  constructor() {
    this.textbookView = new TextbookView();
  }

  public start(): void {
    if (checkAuth()) {
      let group = 0;
      let page = 0;
      this.textbookView.draw();
      if (localStorage.getItem('textbook')) {
        const obj = JSON.parse(localStorage.getItem('textbook'))
        group = obj.g;
        page = obj.p;
        this.addCardsWords(group, page);

      } else {
        localStorage.setItem('textbook', JSON.stringify({g: 0, p: 0}));
        this.addCardsWords(group, page);
      }
  
  
      const arrPage = document.querySelectorAll('.section-textbook-pages .form_radio_btn');
      for (let i = 0; i < arrPage.length; i += 1) {
        arrPage[i].addEventListener('click', () => {
          const p = +arrPage[i].querySelector('input').getAttribute('value');
          page = p - 1;
          this.addCardsWords(group, page);
          localStorage.setItem('textbook', JSON.stringify({g: group, p: page}));
        })
      }
  
      const arrGroup = document.querySelectorAll('.section-textbook-partition .form_radio_btn');
      for (let i = 0; i < arrGroup.length; i += 1) {
        arrGroup[i].addEventListener('click', () => {
          const g = +arrGroup[i].querySelector('input').getAttribute('value');
          group = g - 1;
          this.addCardsWords(group, page);
          localStorage.setItem('textbook', JSON.stringify({g: group, p: page}));
        })
      }
    } else {
      this.noAuth();
    }
  }

  private async addCardsWords(group: number, page: number) {
    const wrapperTextbookWords: HTMLElement = document.querySelector('.wrapper-textbook-words');
    wrapperTextbookWords.innerHTML = '';

    let arrWord;
    let userWord = await UsersWordsService.getAllUserWords();
    if (group !== 6) {
      arrWord = await WordsService.getWords(group, page);
    } else {
      arrWord = userWord.filter((item: { difficulty: string }) => item.difficulty === 'hard');
    }

    let i = 0;
    while (i < arrWord.length) {
      let objWord;
      let word;
      let card;
      if (group !== 6) {
        objWord = userWord.find((item: { wordId: string }) => item.wordId === arrWord[i].id);
        card = arrWord[i];       
      } else {
        word = await WordsService.getWordById(arrWord[i].wordId);
        card = word;
        objWord = userWord.find((item: { wordId: string }) => item.wordId === arrWord[i].wordId);
        
      }
      

      

      wrapperTextbookWords.insertAdjacentHTML('beforeend', `
        <div class='card' data-value="${card.id}">
        <div class='card-img'>
        <img src='${Service.LINK}/${card.image}' alt='photo'>
        <div class='card-volume'><img src="./assets/img/volume.svg" alt="play"></div>
        <audio controls src="${Service.LINK}/${card.audio}">
          <source src="${Service.LINK}/${card.audio}" type="mp3">
          <source src="${Service.LINK}/${card.audioExample}" type="mp3">
          <source src="${Service.LINK}/${card.audioMeaning}" type="mp3">
        </audio>
        </div>
        <h4 class='card-name'>${card.word}</h4>
        <h5 class='card-transcription'>${card.transcription}</h5>
        <h5 class='card-meaning-en'>${card.textMeaning}</h5>
        <h5 class='card-example-en'>Example: ${card.textExample}</h5>
        <h5 class='card-translation'>Перевод: <strong>${card.wordTranslate}</strong></h5>
        <h5 class='card-meaning-ru'>${card.textMeaningTranslate}</h5>
        <h5 class='card-example-ru'>Пример: ${card.textExampleTranslate}</h5>
        <div class='card-stat-div'>
        <h5 class='card-stat'>Спринт: ${(objWord) ? objWord.optional.sprint.true : 0} : ${(objWord) ? objWord.optional.sprint.false : 0}</h5>
        <h5 class='card-stat'>Аудиовызов: ${(objWord) ? objWord.optional.audioCall.true : 0} : ${(objWord) ? objWord.optional.audioCall.false : 0}</h5>
        </div>
        <div class='card-button'>
          <button class="card-but-hard${(objWord && objWord.difficulty === 'hard') ? ' enter' : ''}" id="card-but-hard-${card.id}">${(objWord && objWord.difficulty === 'hard') ? 'Удалить из сложного' : 'Сложное'}</button>
          <button class="card-but-learned${(objWord && objWord.difficulty === 'learned') ? ' enter' : ''}" id="card-but-learned-${card.id}">${(objWord && objWord.difficulty === 'learned') ? 'Удалить из изученного' : 'Изученное'}</button>
        </div>
        </div>
        `);
      i += 1;
    }


    



    const cardButHard = document.querySelectorAll('.card-but-hard');
    for (let i = 0; i < cardButHard.length; i += 1) {
      cardButHard[i].addEventListener('click', async (event) => {
        const id = document.querySelector(`#${event.target.id}`);
        console.log(event);
        const wordId = event.target.id.slice(14);
        if (id.textContent === 'Сложное') {
          id.textContent = 'Удалить из сложного';
          id.classList.add('enter');
          document.querySelector(`#card-but-learned-${wordId}`).textContent = 'Изученное';
          document.querySelector(`#card-but-learned-${wordId}`).classList.remove('enter');
          await addHardWord(wordId);
        } else {
          id.textContent = 'Сложное';
          id.classList.remove('enter');
          await deleteHardWord(wordId);

        }

      })
    }

    let cardButLearned = document.querySelectorAll('.card-but-learned');
    for (let i = 0; i < cardButLearned.length; i += 1) {
      cardButLearned[i].addEventListener('click', async (event) => {
        const id = document.querySelector(`#${event.target.id}`);
        const wordId = event.target.id.slice(17);       
        if (id.textContent === 'Изученное') {
          id.textContent = 'Удалить из изученного';
          id.classList.add('enter');
          document.querySelector(`#card-but-hard-${wordId}`).textContent = 'Сложное';
          document.querySelector(`#card-but-hard-${wordId}`).classList.remove('enter');
          await addLearnedWord(wordId);
        } else {
          id.textContent = 'Изученное';
          id.classList.remove('enter');
          await deleteLearnedWord(wordId);
        }

      })
    }


  }

  noAuth() {
    const content = document.querySelector('.mutable-content-wrapper');
    content.innerHTML = `<div>Извините, вы не авторизированы</div>`;
  }
}

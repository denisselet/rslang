import { ICard } from '../../../types/card';
import Service from '../../constants/service';
import {
  addHardWord, addLearnedWord, deleteHardWord, deleteLearnedWord
} from '../../user/textbook/addWord';

export function hideLinks(cardButLearned: NodeListOf<Element>) {
  let sum = 0;
  for (let j = 0; j < cardButLearned.length; j += 1) {
    if (cardButLearned[j].textContent === 'Изученное') {
      sum += 1;
    }
  }
  if (sum === 0) {
    document.querySelector('.wrapper-textbook-links').classList.add('none');
  }
}

export function showLinks(cardButLearned: NodeListOf<Element>) {
  let sum = 0;
  for (let j = 0; j < cardButLearned.length; j += 1) {
    if (cardButLearned[j].textContent === 'Изученное') {
      sum += 1;
    }
  }
  if (sum !== 0) {
    document.querySelector('.wrapper-textbook-links').classList.remove('none');
  }
}

export function hardBut() {
  const cardButHard = document.querySelectorAll('.card-but-hard');
  for (let i = 0; i < cardButHard.length; i += 1) {
    cardButHard[i].addEventListener('click', async (event) => {
      const id = document.querySelector(`#${(event.target as Element).id}`);
      const wordId = (event.target as Element).id.slice(14);
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
    });
  }
}

export function learnedBut() {
  const cardButLearned = document.querySelectorAll('.card-but-learned');
  for (let i = 0; i < cardButLearned.length; i += 1) {
    cardButLearned[i].addEventListener('click', async (event) => {
      const id = document.querySelector(`#${(event.target as Element).id}`);
      const wordId = (event.target as Element).id.slice(17);
      if (id.textContent === 'Изученное') {
        id.textContent = 'Удалить из изученного';
        id.classList.add('enter');
        document.querySelector(`#card-but-hard-${wordId}`).textContent = 'Сложное';
        document.querySelector(`#card-but-hard-${wordId}`).classList.remove('enter');
        hideLinks(cardButLearned);

        await addLearnedWord(wordId);
      } else {
        id.textContent = 'Изученное';
        id.classList.remove('enter');
        showLinks(cardButLearned);
        await deleteLearnedWord(wordId);
      }
    });
  }
}

export function audioFunc(card: ICard) {
  document.querySelector(`#play-action-${card.id}`).addEventListener('click', () => {
    const wordId = card.id;
    const audio = document.getElementById(`word-audio-${wordId}`) as HTMLAudioElement;
    audio.src = `${Service.LINK}/${card.audio}`;
    audio.addEventListener('ended', () => {
      audio.src = `${Service.LINK}/${card.audioMeaning}`;
      audio.play();
      audio.addEventListener('ended', () => {
        audio.src = `${Service.LINK}/${card.audioExample}`;
        audio.play();
      }, { once: true });
    }, { once: true });
    audio.play();
  });
}

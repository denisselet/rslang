import UserStatisticService from '../../services/userStatistic-service';
import UsersWordsService from '../../services/usersWords-service';
import { getDateToday } from '../date';
import { getStatistic } from '../statistic/getStatistic';

export async function addHardWord(id: string) {
  const userWords = await UsersWordsService.getAllUserWords();
  const arrWordIdUser: string[] = userWords
    .reduce((acc: string[], { wordId }: {wordId: string}) => [...acc, wordId], []);
  if (arrWordIdUser.includes(id)) {
    const objWord = userWords.find((item: { wordId: string; }) => item.wordId === id);
    objWord.difficulty = 'hard';
    delete objWord.id;
    delete objWord.wordId;
    await UsersWordsService.updateUserWord(id, objWord);
  } else {
    await UsersWordsService.createUserWord(id, {
      difficulty: 'hard',
      optional: {
        sprint: {
          true: 0,
          false: 0,
          row: 0
        },
        audioCall: {
          true: 0,
          false: 0,
          row: 0
        }
      }
    });
  }
}

export async function deleteHardWord(id: string) {
  const userWords = await UsersWordsService.getAllUserWords();
  const arrWordIdUser: string[] = userWords
    .reduce((acc: string[], { wordId }: {wordId: string}) => [...acc, wordId], []);
  if (arrWordIdUser.includes(id)) {
    const objWord = userWords.find((item: { wordId: string; }) => item.wordId === id);
    objWord.difficulty = 'new';
    delete objWord.id;
    delete objWord.wordId;
    await UsersWordsService.updateUserWord(id, objWord);
  }
}

export async function addLearnedWord(id: string) {
  const userWords = await UsersWordsService.getAllUserWords();
  const arrWordIdUser: string[] = userWords
    .reduce((acc: string[], { wordId }: {wordId: string}) => [...acc, wordId], []);
  if (arrWordIdUser.includes(id)) {
    const objWord = userWords.find((item: { wordId: string; }) => item.wordId === id);
    objWord.difficulty = 'learned';
    delete objWord.id;
    delete objWord.wordId;
    await UsersWordsService.updateUserWord(id, objWord);
  } else {
    await UsersWordsService.createUserWord(id, {
      difficulty: 'learned',
      optional: {
        sprint: {
          true: 0,
          false: 0,
          row: 0
        },
        audioCall: {
          true: 0,
          false: 0,
          row: 0
        }
      }
    });
  }
  const stat = await getStatistic();
  delete stat.id;
  const todayDate: string = getDateToday();
  if ({}.hasOwnProperty.call(stat.optional, todayDate)) {
    stat.optional[todayDate].learned = +stat.optional[todayDate].learned + 1;
  } else {
    stat.optional[todayDate] = {
      sprint: {
        newWord: 0,
        proc: {
          true: 0,
          false: 0
        },
        row: 0
      },
      audioCall: {
        newWord: 0,
        proc: {
          true: 0,
          false: 0
        },
        row: 0
      },
      learned: 1
    };
  }
  await UserStatisticService.upsertStatistic(stat);
}

export async function deleteLearnedWord(id: string) {
  const userWords = await UsersWordsService.getAllUserWords();
  const arrWordIdUser: string[] = userWords
    .reduce((acc: string[], { wordId }: {wordId: string}) => [...acc, wordId], []);
  if (arrWordIdUser.includes(id)) {
    const objWord = userWords.find((item: { wordId: string; }) => item.wordId === id);
    objWord.difficulty = 'new';
    delete objWord.id;
    delete objWord.wordId;
    await UsersWordsService.updateUserWord(id, objWord);
  }
}

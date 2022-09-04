import UserStatisticService from '../../services/userStatistic-service';
import UsersWordsService from '../../services/usersWords-service';
import { getDateToday } from '../date';
import { getStatistic } from '../statistic/getStatistic';

export async function addHardWord(wordId: string) {
  const userWords = await UsersWordsService.getAllUserWords();
  const arrWordIdUser: string[] = userWords.reduce((acc: string[], { wordId }: {wordId: string}) => [...acc, wordId], []);
  if (arrWordIdUser.includes(wordId)) {
    const objWord = userWords.find((item: { wordId: string; }) => item.wordId === wordId);
    objWord.difficulty = 'hard';
    delete objWord.id;
    delete objWord.wordId;
    await UsersWordsService.updateUserWord(wordId, objWord);
  } else {
    await UsersWordsService.createUserWord(wordId, {
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

export async function deleteHardWord(wordId: string) {
  const userWords = await UsersWordsService.getAllUserWords();
  const arrWordIdUser: string[] = userWords.reduce((acc: string[], { wordId }: {wordId: string}) => [...acc, wordId], []);
  if (arrWordIdUser.includes(wordId)) {
    const objWord = userWords.find((item: { wordId: string; }) => item.wordId === wordId);
    objWord.difficulty = 'new';
    delete objWord.id;
    delete objWord.wordId;
    await UsersWordsService.updateUserWord(wordId, objWord);
  }
}

export async function addLearnedWord(wordId: string) {
  const userWords = await UsersWordsService.getAllUserWords();
  const arrWordIdUser: string[] = userWords.reduce((acc: string[], { wordId }: {wordId: string}) => [...acc, wordId], []);
  if (arrWordIdUser.includes(wordId)) {
    const objWord = userWords.find((item: { wordId: string; }) => item.wordId === wordId);
    objWord.difficulty = 'learned';
    delete objWord.id;
    delete objWord.wordId;
    await UsersWordsService.updateUserWord(wordId, objWord);
  } else {
    await UsersWordsService.createUserWord(wordId, {
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
    }
  }
  await UserStatisticService.upsertStatistic(stat);
}

export async function deleteLearnedWord(wordId: string) {
  const userWords = await UsersWordsService.getAllUserWords();
  const arrWordIdUser: string[] = userWords.reduce((acc: string[], { wordId }: {wordId: string}) => [...acc, wordId], []);
  if (arrWordIdUser.includes(wordId)) {
    const objWord = userWords.find((item: { wordId: string; }) => item.wordId === wordId);
    objWord.difficulty = 'new';
    delete objWord.id;
    delete objWord.wordId;
    await UsersWordsService.updateUserWord(wordId, objWord);
  }
}

import USER from '../constants/user';
import UserStatisticService from '../services/userStatistic-service';
import UsersWordsService from '../services/usersWords-service';
import { getDateToday } from './date';
import {
  addNewWordForFalse, addNewWordForTrue, updateUserWordForFalse, updateUserWordForTrue
} from './game/userWord';
import { addStatisticForGameNewDay, updateStatisticForGame } from './statistic/statForGame';
import { getStatistic } from './statistic/getStatistic';

export async function addWordAndStatistic(
  arrAnswerTrue: string[],
  arrAnswerFalse: string[],
  game: string,
  rowInGame: number
) {
  console.log(await UsersWordsService.getAllUserWords());
  console.log(await getStatistic());

  const PRE_WIN_COUNT_FOR_NEW = 2;
  const PRE_WIN_COUNT_FOR_HARD = 4;
  const arrUserWord = await UsersWordsService.getAllUserWords();
  const arrWordIdUser: string[] = arrUserWord
    .reduce((acc: string[], { wordId }: {wordId: string}) => [...acc, wordId], []);
  const newWordNowStat = arrAnswerTrue
    .concat(arrAnswerFalse)
    .reduce((acc, item) => (!arrWordIdUser.includes(item)) ? acc + 1 : acc + 0, 0);

  let countLearned = 0;
  const promiseAll = [];

  for (let i = 0; i < arrAnswerTrue.length; i += 1) {
    if (!arrWordIdUser.includes(arrAnswerTrue[i])) {
      promiseAll.push(UsersWordsService.createUserWord(arrAnswerTrue[i], addNewWordForTrue(game)));
    } else {
      const objWord = arrUserWord
        .find((item: { wordId: string; }) => item.wordId === arrAnswerTrue[i]);
      let difficulty;
      if (objWord.optional.sprint.row === PRE_WIN_COUNT_FOR_NEW
        && objWord.difficulty === USER.NEW) {
        difficulty = USER.LEARNED;
        countLearned += 1;
      }
      if (objWord.optional.sprint.row === PRE_WIN_COUNT_FOR_HARD
        && objWord.difficulty === USER.HARD) {
        difficulty = USER.LEARNED;
        countLearned += 1;
      }
      promiseAll.push(UsersWordsService.updateUserWord(
        arrAnswerTrue[i],
        updateUserWordForTrue(difficulty, objWord, game)
      ));
    }
  }

  for (let i = 0; i < arrAnswerFalse.length; i += 1) {
    if (!arrWordIdUser.includes(arrAnswerFalse[i])) {
      promiseAll.push(UsersWordsService.createUserWord(
        arrAnswerFalse[i],
        addNewWordForFalse(game)
      ));
    } else {
      const objWord = arrUserWord
        .find((item: { wordId: string; }) => item.wordId === arrAnswerFalse[i]);
      let difficulty;
      if (objWord.difficulty === USER.LEARNED) {
        difficulty = USER.NEW;
      }
      promiseAll.push(UsersWordsService.updateUserWord(
        arrAnswerFalse[i],
        updateUserWordForFalse(difficulty, objWord, game)
      ));
    }
  }

  // STATISTIC
  const stat = await getStatistic();
  const todayDate: string = getDateToday();

  if ({}.hasOwnProperty.call(stat.optional, todayDate)) {
    stat.optional[todayDate] = updateStatisticForGame(
      game,
      stat,
      arrAnswerFalse,
      arrAnswerTrue,
      todayDate,
      rowInGame,
      newWordNowStat,
      countLearned
    );
  } else {
    stat.optional[todayDate] = addStatisticForGameNewDay(
      game,
      newWordNowStat,
      arrAnswerTrue,
      arrAnswerFalse,
      rowInGame,
      countLearned
    );
  }
  delete stat.id;

  promiseAll.push(UserStatisticService.upsertStatistic(stat));
  await Promise.all(promiseAll);

  console.log('After game: ');
  console.log(await UsersWordsService.getAllUserWords());
  console.log(await getStatistic());
}

import UserStatisticService from '../../services/userStatistic-service';
import { getDateToday } from '../date';

export async function getStatistic() {
  const date: string = getDateToday();
  const obj: object = {
    learnedWords: 0,
    optional: {
      [date]: {
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
        learned: 0
      }
    }
  };

  const stat = await UserStatisticService.getStatistic();
  if (!stat.id) {
    await UserStatisticService.upsertStatistic(obj);
    return obj;
  }

  if (!{}.hasOwnProperty.call(stat.optional, date)) {
    stat.optional[date] = {
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
      learned: 0
    };
    delete stat.id;
    await UserStatisticService.upsertStatistic(stat);
    return await UserStatisticService.getStatistic();
  }
  return stat;
}

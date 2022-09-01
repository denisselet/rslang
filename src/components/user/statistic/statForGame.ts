import { IStat } from '../../../types/statistic';
import USER from '../../constants/user';

export function updateStatisticForGame(
  game: string,
  stat: IStat,
  arrAnswerFalse: string[],
  arrAnswerTrue: string[],
  todayDate: string,
  rowInGame: number,
  newWordNowStat: number,
  countLearned: number
) {
  return {
    sprint: {
      newWord: (game === USER.SPRINT)
        ? +stat.optional[todayDate].sprint.newWord + newWordNowStat
        : stat.optional[todayDate].sprint.newWord,
      proc: {
        true: (game === USER.SPRINT)
          ? +arrAnswerTrue.length + stat.optional[todayDate].sprint.proc.true
          : stat.optional[todayDate].sprint.proc.true,
        false: (game === USER.SPRINT)
          ? +arrAnswerFalse.length + stat.optional[todayDate].sprint.proc.false
          : stat.optional[todayDate].sprint.proc.false
      },
      row: (game === USER.SPRINT && rowInGame > stat.optional[todayDate].sprint.row)
        ? rowInGame
        : stat.optional[todayDate].sprint.row
    },
    audioCall: {
      newWord: (game !== USER.SPRINT)
        ? +stat.optional[todayDate].audioCall.newWord + newWordNowStat
        : stat.optional[todayDate].audioCall.newWord,
      proc: {
        true: (game !== USER.SPRINT)
          ? +arrAnswerTrue.length + stat.optional[todayDate].audioCall.proc.true
          : stat.optional[todayDate].audioCall.proc.true,
        false: (game !== USER.SPRINT)
          ? +arrAnswerFalse.length + stat.optional[todayDate].audioCall.proc.false
          : stat.optional[todayDate].audioCall.proc.false
      },
      row: (game !== USER.SPRINT && rowInGame > stat.optional[todayDate].audioCall.row)
        ? rowInGame
        : stat.optional[todayDate].audioCall.row
    },
    learned: +stat.optional[todayDate].learned + countLearned
  };
}

export function addStatisticForGameNewDay(
  game: string,
  newWordNowStat: number,
  arrAnswerTrue: string[],
  arrAnswerFalse: string[],
  rowInGame: number,
  countLearned: number
) {
  return {
    sprint: {
      newWord: (game === USER.SPRINT) ? newWordNowStat : 0,
      proc: {
        true: (game === USER.SPRINT) ? +arrAnswerTrue.length : 0,
        false: (game === USER.SPRINT) ? +arrAnswerFalse.length : 0
      },
      row: (game === USER.SPRINT) ? rowInGame : 0
    },
    audioCall: {
      newWord: (game !== USER.SPRINT) ? newWordNowStat : 0,
      proc: {
        true: (game !== USER.SPRINT) ? +arrAnswerTrue.length : 0,
        false: (game !== USER.SPRINT) ? +arrAnswerFalse.length : 0
      },
      row: (game !== USER.SPRINT) ? rowInGame : 0
    },
    learned: `${countLearned}`
  };
}

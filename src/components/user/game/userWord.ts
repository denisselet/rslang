import { IWord } from '../../../types/word';
import USER from '../../constants/user';

export function addNewWordForTrue(game: string) {
  return {
    difficulty: USER.NEW,
    optional: {
      sprint: {
        true: (game === USER.SPRINT) ? 1 : 0,
        false: 0,
        row: (game === USER.SPRINT) ? 1 : 0
      },
      audioCall: {
        true: (game !== USER.SPRINT) ? 1 : 0,
        false: 0,
        row: (game !== USER.SPRINT) ? 1 : 0
      }
    }
  };
}

export function addNewWordForFalse(game: string) {
  return {
    difficulty: USER.NEW,
    optional: {
      sprint: {
        true: 0,
        false: (game === USER.SPRINT) ? 1 : 0,
        row: 0
      },
      audioCall: {
        true: 0,
        false: (game !== USER.SPRINT) ? 1 : 0,
        row: 0
      }
    }
  };
}

export function updateUserWordForTrue(difficulty: string, objWord: IWord, game: string) {
  return {
    difficulty: difficulty || objWord.difficulty,
    optional: {
      sprint: {
        true: (game === USER.SPRINT)
          ? (+objWord.optional.sprint.true + 1)
          : objWord.optional.sprint.true,
        false: objWord.optional.sprint.false,
        row: (game === USER.SPRINT)
          ? (+objWord.optional.sprint.row + 1)
          : objWord.optional.sprint.row
      },
      audioCall: {
        true: (game !== USER.SPRINT)
          ? (+objWord.optional.audioCall.true + 1)
          : objWord.optional.audioCall.true,
        false: objWord.optional.audioCall.false,
        row: (game !== USER.SPRINT)
          ? (+objWord.optional.audioCall.row + 1)
          : objWord.optional.audioCall.row
      }
    }
  };
}

export function updateUserWordForFalse(difficulty: string, objWord: IWord, game: string) {
  return {
    difficulty: difficulty || objWord.difficulty,
    optional: {
      sprint: {
        true: objWord.optional.sprint.true,
        false: (game === USER.SPRINT)
          ? (+objWord.optional.sprint.false + 1)
          : objWord.optional.sprint.false,
        row: 0
      },
      audioCall: {
        true: objWord.optional.audioCall.true,
        false: (game !== USER.SPRINT)
          ? (+objWord.optional.audioCall.false + 1)
          : objWord.optional.audioCall.false,
        row: 0
      }
    }
  };
}

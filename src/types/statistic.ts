export interface IStat {
  optional: {
    [x: string]: {
      sprint: {
        newWord: number,
        proc: {
          true: number,
          false: number
        },
        row: number
      };
      learned: string | number;
      audioCall: {
        newWord: number,
        proc: {
          true: number,
          false: number
        },
        row: number
      }
    };
  };
}

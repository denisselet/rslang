export interface IWord {
  difficulty: string,
    optional: {
      sprint: {
        true: number,
        false: number,
        row: number
      },
      audioCall: {
        true: number,
        false: number,
        row:number
      }
    }
}

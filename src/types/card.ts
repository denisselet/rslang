export interface ICard {
  id: string;
  image: string;
  word: string;
  transcription: string;
  textMeaning: string;
  textExample: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
}

export interface IWord {
  difficulty: string;
  id: string;
  wordId: string;
  optional: {
    audioCall: {
      true: number;
      false: number;
      row: number
    };
    sprint: {
      true: number;
      false: number;
      row: number
    };
  }
  image: string;
  word: string;
  transcription: string;
  textMeaning: string;
  textExample: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
  audio: string;
  audioMeaning: string;
  audioExample: string
}

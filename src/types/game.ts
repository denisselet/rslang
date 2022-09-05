export interface IWord {
    id: string;
    image: string,
    word: string,
    wordTranslate: string,
    audio: string
}

export interface GameDocument {
    requestFullScreen: () => void;
    cancelFullScreen: () => void;
    exitFullscreen: () => void;
    mozCancelFullScreen: () => void;
    webkitExitFullscreen: () => void;
    fullscreenElement: () => void;
    mozFullScreenElement: () => void;
    webkitFullscreenElement: () => void;
    webkitCancelFullScreen: () => void;
    mozRequestFullScreen: () => void;
    webkitRequestFullScreen: () => void;
    webkitIsFullScreen: boolean;
    mozFullScreen: boolean;
}

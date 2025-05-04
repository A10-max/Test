import { _decorator, Component, debug, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MainMenu')
export class MainMenu extends Component {

    @property({ type: String })
    gameSceneName: string = 'Game';

    startGame() {
        director.loadScene(this.gameSceneName);
        console.log("Called");
    }
}

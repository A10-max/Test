import { _decorator, Component, VideoPlayer, Node, Button, sys, find, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AdsManager')
export class AdsManager extends Component {
    @property(VideoPlayer)
    videoPlayer: VideoPlayer = null!;

    @property(Button)
    skipButton: Button = null!;

    private isSecondAdPlaying = false;
    private firstAdPath = '';
    private secondAdPath = '';

    start() {
        this.firstAdPath = this.getStreamingPath("firstAd.mp4");
        this.secondAdPath = this.getStreamingPath("secondAd.mp4");

        this.videoPlayer.node.on(VideoPlayer.EventType.COMPLETED, this.onAdFinished, this);

        this.skipButton.node.on(Button.EventType.CLICK, this.skipAd, this);

        this.skipButton.node.active = false;
    }

    public showGameOverAds() {
        this.scheduleOnce(this.delayedAdStart.bind(this), 3);
    }

    private delayedAdStart() {
        this.playAd(this.firstAdPath, false);
    }

    private playAd(adURL: string, skippable: boolean) {
        this.videoPlayer.resourceType = VideoPlayer.ResourceType.REMOTE;
        this.videoPlayer.remoteURL = adURL;

        this.videoPlayer.play();

        this.videoPlayer.node.active = true;

        if (skippable) {
            this.scheduleOnce(() => {
                this.skipButton.node.active = true;
            }, 5);
        }
    }

    private onAdFinished() {
        if (!this.isSecondAdPlaying) {
            this.isSecondAdPlaying = true;
            this.playAd(this.secondAdPath, true);
        } else {
            this.endAds();
        }
    }

    private skipAd() {
        this.videoPlayer.stop();
        this.endAds();
    }

    private endAds() {
        //this.uiElements.active = true;
        this.videoPlayer.node.active = false;
        //this.adPanel.active = false;
        this.skipButton.node.active = false;
    }

    private getStreamingPath(filename: string): string {
        return `assets/${filename}`;
    }
}

import { _decorator, Node, Component, ProgressBar, UITransform, Sprite, director, Tween, tween, AudioSource, sys, find } from 'cc';
import { SharkController } from './SharkController';
import { AdsManager } from './AdsManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerHealth')
export class PlayerHealth extends Component {
    @property(ProgressBar)
    healthBar: ProgressBar = null!;

    @property
    maxHealth: number = 100;

    @property
    healthDecreaseRate: number = 10;

    @property
    healthIncreaseRate: number = 5;

    @property({ type: Node })
    loseUI: Node = null!;

    @property({ type: Node })
    winUI: Node = null!;

    @property(AudioSource)
    audioSource: AudioSource = null!;

    @property(SharkController)
    sharkController: SharkController = null!;

    @property(AdsManager)
    adsManager: AdsManager = null!;

    private currentHealth: number = 100;
    private isDrowning: boolean = false;
    private isDead: boolean = false;

    start() {
        this.currentHealth = this.maxHealth;
        this.updateHealthUI();
    }

    update(deltaTime: number) {
        if (this.isDead) return;

        if (this.isDrowning) {
            this.takeDamage(deltaTime);
        } else if (this.currentHealth < this.maxHealth) {
            this.regenerateHealth(deltaTime);
        }
    }

    public setDrowning(drowning: boolean) {
        this.isDrowning = drowning;
    }

    private takeDamage(dt: number) {
        this.currentHealth -= this.healthDecreaseRate * dt;
        if (this.currentHealth <= 0) {
            this.currentHealth = 0;
            this.die();
        }
        this.updateHealthUI();
    }

    private regenerateHealth(dt: number) {
        this.currentHealth += this.healthIncreaseRate * dt;
        if (this.currentHealth > this.maxHealth) {
            this.currentHealth = this.maxHealth;
        }
        this.updateHealthUI();
    }

    private updateHealthUI() {
        if (this.healthBar) {
            this.healthBar.progress = this.currentHealth / this.maxHealth;
        }
    }

    private die() {
        this.isDead = true;
        this.loseUI.active = true;
        this.loseGame();
    }

    public winGame() {
        console.log("You Win!");
        this.winUI.active = true;
        director.pause();
    }

    public loseGame() {
        console.log("Game Over!");
        this.audioSource.node.active = false;

        this.sharkController?.gameOver();

        this.adsManager?.showGameOverAds();
    }

    public retryGame() {
        director.resume();
        director.loadScene(director.getScene().name);
    }

    public goToMainMenu() {
        director.resume();
        director.loadScene("MainMenu");
    }
}
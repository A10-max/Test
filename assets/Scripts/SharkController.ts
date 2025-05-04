// SharkController.ts
import {
    _decorator, Component, Node, Vec3, v3, Sprite, Tween, tween, RigidBody2D, Collider2D, UITransform, director
} from 'cc';
import { RiddleManager } from './RiddleManager';
const { ccclass, property } = _decorator;

@ccclass('SharkController')
export class SharkController extends Component {
    @property(Node)
    waterLevel: Node = null;

    @property(Node)
    player: Node = null;

    @property(Node)
    sharksTeeth: Node = null;

    @property
    swimSpeed: number = 2;

    @property
    riseSpeed: number = 0.5;

    @property
    gameOverSwimSpeed: number = 5;

    @property(RiddleManager)
    riddleManager: RiddleManager = null;

    private isMovingRight = true;
    private isGameOver = false;
    private leftBound = -4;
    private rightBound = 2.5;
    private defaultSharkPosition: Vec3;

    start() {
        this.defaultSharkPosition = this.node.position.clone();
    }

    update(deltaTime: number) {
        if (!this.isGameOver) {
            const moveDirection = this.isMovingRight ? 1 : -1;
            const currentPos = this.node.position;
            const newX = currentPos.x + this.swimSpeed * moveDirection * deltaTime;
            const newY = this.waterLevel.position.y - 1;
            this.node.setPosition(newX, newY, currentPos.z);

            if (newX >= this.rightBound && this.isMovingRight) {
                this.isMovingRight = false;
                this.flipShark();
            } else if (newX <= this.leftBound && !this.isMovingRight) {
                this.isMovingRight = true;
                this.flipShark();
            }
        }
    }

    private flipShark() {
        const scale = this.node.scale;
        this.node.setScale(this.isMovingRight ? v3(0.5, 0.5, 1) : v3(-0.5, 0.5, 1));
    }

    public gameOver() {
        if (!this.isGameOver) {
            this.isGameOver = true;
            this.swimAwayWithPlayer();
        }
    }

    private swimAwayWithPlayer() {
        // Disable player controls and physics
        const playerRB = this.player.getComponent(RigidBody2D);
        const playerCollider = this.player.getComponent(Collider2D);
        const playerSprite = this.player.getComponent(Sprite);
        const playerMovement = this.player.getComponent('PlayerMovement') as Component;

        if (playerRB) playerRB.enabled = false;
        if (playerCollider) playerCollider.enabled = false;
        if (playerMovement) playerMovement.enabled = false;
        if (playerSprite) playerSprite.node.setSiblingIndex(999); // bring to front

        // Move shark to player
        this.scheduleOnce(() => {
            this.moveToTarget(this.player.position, () => {
                this.node.setPosition(this.defaultSharkPosition.x, this.node.position.y, this.node.position.z);

                if (this.node.scale.x < 0) {
                    const newScale = this.node.scale.clone();
                    newScale.x *= -1;
                    this.node.setScale(newScale);
                }

                this.player.setPosition(this.sharksTeeth.position);

                this.scheduleOnce(() => {
                    this.exitScene();
                }, 1.5);
            });
        });
    }

    private moveToTarget(target: Vec3, onComplete: () => void) {
        tween(this.node)
            .to(
                1,
                { position: target },
                { easing: 'linear' }
            )
            .call(onComplete)
            .start();
    }

    private exitScene() {
        // Move shark and player upward off-screen
        tween(this.node)
            .by(2, { position: v3(20, 30, 0) }, { easing: 'linear' })
            .start();

        tween(this.player)
            .by(2, { position: v3(20, 30, 0) }, { easing: 'linear' })
            .call(() => {
                this.riddleManager.stopBlinkHint();
                this.node.active = false;
                // "Pause" the game
                director.pause();
            })
            .start();
    }
}

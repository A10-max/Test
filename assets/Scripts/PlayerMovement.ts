import { _decorator, Component, Vec3, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerMovement')
export class PlayerMovement extends Component {
    @property
    jumpHeight: number = 2;

    @property
    forwardDistance: number = 2;

    @property
    jumpDuration: number = 0.2;

    @property
    bounceHeight: number = 0.3;
    
    @property
    bounceDuration: number = 0.1;

    @property
    stepHeightOffset: number = 0.2; // Offset above original step Y

    private isJumping: boolean = false;
    private isBouncing: boolean = false;
    private jumpTimer: number = 0;
    private bounceTimer: number = 0;

    private startPos: Vec3 = v3();
    private peakPos: Vec3 = v3();
    private endPos: Vec3 = v3();

    update(deltaTime: number) {
        if (this.isJumping) {
            this.jumpTimer += deltaTime;
            const t = this.jumpTimer / this.jumpDuration;

            if (t >= 1) {
                this.isJumping = false;
                this.isBouncing = true;
                this.bounceTimer = 0;

                // Start bounce from peak to slightly higher than previous Y
                this.startPos = this.peakPos.clone();
                this.endPos = v3(
                    this.peakPos.x,
                    this.startPos.y - this.bounceHeight + this.stepHeightOffset,
                    this.peakPos.z
                );
                return;
            }

            const easedT = 1 - Math.pow(1 - t, 3);
            const x = this.lerp(this.startPos.x, this.peakPos.x, easedT);
            const y = this.lerp(this.startPos.y, this.peakPos.y, easedT);
            this.node.setPosition(x, y, this.startPos.z);
        }

        if (this.isBouncing) {
            this.bounceTimer += deltaTime;
            const t = this.bounceTimer / this.bounceDuration;

            if (t >= 1) {
                this.isBouncing = false;
                this.node.setPosition(this.endPos);
                return;
            }

            const bounceT = 1 - Math.pow(1 - t, 2);
            const y = this.lerp(this.startPos.y, this.endPos.y, bounceT);
            this.node.setPosition(this.startPos.x, y, this.startPos.z);
        }
    }

    public jumpToNextStep() {
        if (this.isJumping || this.isBouncing) return;

        this.startPos = this.node.position.clone();
        this.peakPos = v3(
            this.startPos.x + this.forwardDistance,
            this.startPos.y + this.jumpHeight,
            this.startPos.z
        );

        this.jumpTimer = 0;
        this.isJumping = true;
    }

    private lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }
}

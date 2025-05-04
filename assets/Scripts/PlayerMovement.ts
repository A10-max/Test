import { _decorator, Component, Vec3, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerMovement')
export class PlayerMovement extends Component {
    @property
    jumpHeight: number = 2;

    @property
    forwardDistance: number = 2;

    @property
    jumpDuration: number = 0.2; // Faster jump

    private isJumping: boolean = false;
    private jumpTimer: number = 0;
    private startPos: Vec3 = v3();
    private peakPos: Vec3 = v3();

    update(deltaTime: number) {
        if (!this.isJumping) return;

        this.jumpTimer += deltaTime;
        const t = this.jumpTimer / this.jumpDuration;

        if (t >= 1) {
            this.isJumping = false;
            this.node.setPosition(this.peakPos);
            return;
        }

        const easedT = 1 - Math.pow(1 - t, 3); 

        const x = this.lerp(this.startPos.x, this.peakPos.x, easedT);
        const y = this.lerp(this.startPos.y, this.peakPos.y, easedT);

        this.node.setPosition(x, y, this.startPos.z);
    }

    public jumpToNextStep() {
        if (this.isJumping) return;

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

import { _decorator, Component, Node, Vec3, math, Camera } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraFollow')
export class CameraFollow extends Component {
    @property(Node)
    player: Node = null;

    @property
    smoothSpeed: number = 0.125;

    @property(Vec3)
    offset: Vec3 = new Vec3(0, 0, 0);

    @property(Camera)
    cameraComp: Camera = null!;

    private _desiredPosition: Vec3 = new Vec3();
    private _smoothedPosition: Vec3 = new Vec3();

    start() {
        if (this.cameraComp) {
            this.cameraComp.orthoHeight = 960;
        } else {
            console.warn('Camera component not found on node:', this.node.name);
        }
    }

    update(deltaTime: number) {
        if (!this.player) return;

        Vec3.add(this._desiredPosition, this.player.worldPosition, this.offset);
        Vec3.lerp(this._smoothedPosition, this.node.worldPosition, this._desiredPosition, this.smoothSpeed);

        this.node.setWorldPosition(this._smoothedPosition);
    }
}

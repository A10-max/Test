import { _decorator, Component, Node, Vec3 } from 'cc';
import { PlayerHealth } from './PlayerHealth';
const { ccclass, property } = _decorator;

@ccclass('WaterRise')
export class WaterRise extends Component {
    @property
    riseSpeed: number = 0.05;

    @property(Node)
    waterSurface: Node = null!;

    @property(PlayerHealth)
    playerHealthNode: PlayerHealth = null!;

    private isDrowning: boolean = false;

    start() {
        if (!this.playerHealthNode) {
            console.error("PlayerHealth Node not assigned!");
        }
    }

    update(deltaTime: number) {
        // Move the water upward
        const currentPosition = this.node.position;
        this.node.setPosition(currentPosition.x, currentPosition.y + this.riseSpeed * deltaTime, currentPosition.z);
    
        const playerY = this.playerHealthNode.node.worldPosition.y;
        const waterY = this.node.worldPosition.y;
    
        if (!this.playerHealthNode) return;
    
        if (playerY < waterY) {
            if (!this.isDrowning) {
                this.isDrowning = true;
                this.playerHealthNode.setDrowning(true);
                console.log("Water reached the player! Health is decreasing.");
            }
        } else {
            if (this.isDrowning) {
                this.isDrowning = false;
                this.playerHealthNode.setDrowning(false);
                console.log("Player is above water! Health is regenerating.");
            }
        }
    }
    
}
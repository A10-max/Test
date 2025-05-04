import { _decorator, Component, Label, Node, Sprite, SpriteFrame, Input, input, KeyCode, Tween, tween, Vec3, Color, Prefab, instantiate, EventKeyboard } from 'cc';
import { PlayerMovement } from './PlayerMovement';
const { ccclass, property } = _decorator;

@ccclass('RiddleManager')
export class RiddleManager extends Component {

    @property(Label)
    riddleText: Label = null;

    @property(Label)
    hintText: Label = null;

    @property(Label)
    scoreText: Label = null;

    @property(Node)
    letterSlotsParent: Node = null;

    @property(Prefab)
    letterSlotPrefab: Prefab = null;

    @property([SpriteFrame])
    letterSprites: SpriteFrame[] = [];

    @property(SpriteFrame)
    emptyLetterSlot: SpriteFrame = null;

    @property(PlayerMovement)
    playerMovement: PlayerMovement = null!;

    private letterDictionary: Map<string, SpriteFrame> = new Map();
    private riddlePairs: { riddle: string; answer: string; }[] = [
        { riddle: "I speak without a mouth and hear without ears. What am I?", answer: "echo" },
        { riddle: "I come down but never go up. What am I?", answer: "rain" },
        { riddle: "What has a neck but no head?", answer: "bottle" },
        { riddle: "What has an eye but cannot see?", answer: "needle" },
        { riddle: "What runs but never walks?", answer: "river" },
        { riddle: "What can travel around the world while staying in one spot?", answer: "stamp" },
        { riddle: "I’m tall when I’m young and short when I’m old. What am I?", answer: "candle" },
        { riddle: "What begins with T, ends with T, and has T in it?", answer: "teapot" },
        { riddle: "What gets wetter as it dries?", answer: "towel" },
        { riddle: "What has one eye but can’t see?", answer: "storm" },
        { riddle: "What has a head and a tail but no body?", answer: "coin" },
        { riddle: "What kind of room has no doors or windows?", answer: "mushroom" },
        { riddle: "What gets broken without being held?", answer: "promise" },
        { riddle: "What comes once in a minute, twice in a moment, but never in a thousand years?", answer: "m" },
        { riddle: "What has four legs in the morning, two at noon, and three at night?", answer: "man" },
        { riddle: "The more you take, the more you leave behind. What are they?", answer: "footsteps" },
        { riddle: "What can fill a room but takes up no space?", answer: "light" },
        { riddle: "If you drop me I'm sure to crack, but give me a smile and I’ll smile back. What am I?", answer: "mirror" },
        { riddle: "What has no body and no nose, but can still sneeze?", answer: "ghost" },
        { riddle: "What goes up and down but doesn’t move?", answer: "stairs" },
        { riddle: "What can you catch but not throw?", answer: "cold" },
        { riddle: "What is full of holes but still holds water?", answer: "sponge" },
        { riddle: "Where does today come before yesterday?", answer: "dictionary" },
        { riddle: "What has cities, but no houses; forests, but no trees; and rivers, but no water?", answer: "map" },
        { riddle: "What is always in front of you but can’t be seen?", answer: "future" },
        { riddle: "What comes at the end of everything?", answer: "g" },
        { riddle: "What kind of tree can you carry in your hand?", answer: "palm" },
        { riddle: "What is as light as a feather, yet the strongest person can’t hold it for long?", answer: "breath" },
        { riddle: "What building has the most stories?", answer: "library" },
        { riddle: "What goes through cities and fields, but never moves?", answer: "road" },
        { riddle: "What has a ring but no finger?", answer: "phone" },
        { riddle: "What kind of band never plays music?", answer: "rubber" },
        { riddle: "What has many teeth but can’t bite?", answer: "comb" },
        { riddle: "What kind of coat is best put on wet?", answer: "paint" },
        { riddle: "What has words but never speaks?", answer: "book" },
        { riddle: "What begins and has no end, and is the key to everything?", answer: "knowledge" },
        { riddle: "I can be long or short; I can be grown or bought; I can be painted or left bare. What am I?", answer: "hair" },
        { riddle: "What invention lets you look right through a wall?", answer: "window" },
        { riddle: "What has many rings but no fingers?", answer: "tree" },
        { riddle: "What has legs but doesn’t walk?", answer: "table" },
        { riddle: "I go through towns and over hills but never move. What am I?", answer: "road" },
        { riddle: "What can't talk but will reply when spoken to?", answer: "echo" },
        { riddle: "What has a heart that doesn't beat?", answer: "artichoke" },
        { riddle: "What gets bigger the more you take away?", answer: "hole" },
        { riddle: "What has a bottom at the top?", answer: "leg" },
        { riddle: "What has ears but can’t hear?", answer: "corn" },
        { riddle: "What do you buy to eat but never eat?", answer: "plate" },
        { riddle: "I have lakes but no water, mountains but no rocks, and roads but no cars. What am I?", answer: "map" },
        { riddle: "What is cut on a table but is never eaten?", answer: "deck" },
        { riddle: "The more you take, the more you leave. What am I?", answer: "footsteps" },
        { riddle: "What starts with P and ends with E and has thousands of letters?", answer: "postoffice" },
        { riddle: "What runs around a house but doesn’t move?", answer: "fence" },
        { riddle: "What is always coming but never arrives?", answer: "tomorrow" },
        { riddle: "What has a spine but no bones?", answer: "book" },
        { riddle: "What comes down but never goes up?", answer: "rain" },
        { riddle: "What can’t be used until it’s broken?", answer: "egg" },
        { riddle: "What goes up when rain comes down?", answer: "umbrella" },
        { riddle: "What belongs to you but others use it more than you do?", answer: "name" },
        { riddle: "What comes in a minute, twice in a moment, but never in a thousand years?", answer: "m" },
        { riddle: "What gets sharper the more you use it?", answer: "mind" },
        { riddle: "What starts with an E, ends with an E, but only contains one letter?", answer: "envelope" },
        { riddle: "What has a tongue but cannot speak?", answer: "shoe" },
        { riddle: "What is made of water but if you put it into water it dies?", answer: "ice" },
        { riddle: "What has a bed but never sleeps?", answer: "river" },
        { riddle: "What has roots that nobody sees, is taller than trees?", answer: "mountain" },
        { riddle: "What can be cracked, made, told, and played?", answer: "joke" },
        { riddle: "What flies without wings?", answer: "time" },
        { riddle: "What kind of cup can't hold water?", answer: "cupcake" },
        { riddle: "What has stripes but no color?", answer: "zebra" },
        { riddle: "What kind of key opens no doors?", answer: "monkey" },
        { riddle: "What falls but never gets hurt?", answer: "snow" },
        { riddle: "What has a mouth but can't talk?", answer: "river" },
        { riddle: "What is white when it’s dirty?", answer: "blackboard" },
        { riddle: "What kind of ship has two mates but no captain?", answer: "relationship" },
        { riddle: "What has four wheels and flies?", answer: "garbage truck" },
        { riddle: "What’s really easy to get into, and hard to get out of?", answer: "trouble" },
        { riddle: "What goes up but never comes down?", answer: "age" },
        { riddle: "What has nothing but a hole in the middle?", answer: "donut" },
        { riddle: "What has hands but can’t clap?", answer: "clock" },
        { riddle: "What makes more as you take them?", answer: "steps" },
        { riddle: "What’s orange and sounds like a parrot?", answer: "carrot" },
        { riddle: "What can you break without touching?", answer: "silence" },
        { riddle: "What lives in winter, dies in summer, and grows with its root upward?", answer: "icicle" },
        { riddle: "What flies forever, rests never?", answer: "wind" },
        { riddle: "What do you throw out when you want to use it and take in when you don't?", answer: "anchor" },
        { riddle: "What has a bell but isn’t a phone?", answer: "bicycle" },
        { riddle: "What kind of table has no legs?", answer: "periodic" },
        { riddle: "What has many keys but can’t open a single lock?", answer: "keyboard" },
        { riddle: "What’s black and white and read all over?", answer: "newspaper" },
        { riddle: "What kind of dog never bites?", answer: "hotdog" },
        { riddle: "What goes through water and doesn’t get wet?", answer: "light" }

    ];

    private currentRiddleIndex = 0;
    private currentLetterIndex = 0;
    private letterSlots: Sprite[] = [];
    private score = 0;
    private currentAnswer = '';
    private blinkTween: Tween<Node> = null;

    start() {
        this.initLetterDictionary();
        this.shuffleRiddles();
        this.showNextRiddle();
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    initLetterDictionary() {
        for (let i = 0; i < 26; i++) {
            const letter = String.fromCharCode(65 + i); // A-Z
            this.letterDictionary.set(letter, this.letterSprites[i]);
        }
    }

    shuffleRiddles() {
        for (let i = this.riddlePairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.riddlePairs[i], this.riddlePairs[j]] = [this.riddlePairs[j], this.riddlePairs[i]];
        }
    }

    showNextRiddle() {
        const riddle = this.riddlePairs[this.currentRiddleIndex];
        this.riddleText.string = riddle.riddle;
        this.currentAnswer = riddle.answer.toUpperCase();
        this.hintText.string = this.getHint(this.currentAnswer);

        this.stopBlinkHint();
        this.blinkHint();

        this.setupLetterSlots(this.currentAnswer.length);
        this.currentLetterIndex = 0;
    }

    getHint(answer: string): string {
        if (answer.length > 2) {
            return `Hint: ${answer[0]}${'*'.repeat(answer.length - 2)}${answer[answer.length - 1]}`;
        }
        return "Hint: ???";
    }

    blinkHint() {
        this.blinkTween = tween(this.hintText.node)
            .repeatForever(
                tween(this.hintText.node)
                    .to(0.5, { scale: new Vec3(1.1, 1.1, 1) })
                    .to(0.5, { scale: new Vec3(1, 1, 1) })
            )
            .start();
    }

    stopBlinkHint() {
        if (this.blinkTween) {
            this.blinkTween.stop();
            this.blinkTween = null;
            this.hintText.node.scale = new Vec3(1, 1, 1);
        }
    }

    setupLetterSlots(length: number) {
        this.letterSlotsParent.removeAllChildren();
        this.letterSlots = [];
    
        for (let i = 0; i < length; i++) {
            const slot = instantiate(this.letterSlotPrefab);
            this.letterSlotsParent.addChild(slot);
    
            const spriteNode = slot.getChildByName("Sprite") || slot;
            const sprite = spriteNode.getComponent(Sprite);
    
            if (sprite) {
                sprite.spriteFrame = this.emptyLetterSlot;
                this.letterSlots.push(sprite);
            } else {
                console.warn("No Sprite component found in letter slot prefab.");
            }
        }
    }

    onKeyDown(event: EventKeyboard) {
        const key = String.fromCharCode(event.keyCode);
        if (!/^[A-Z]$/.test(key)) return;

        const expectedLetter = this.currentAnswer[this.currentLetterIndex];

        if (key === expectedLetter) {
            const sprite = this.letterSlots[this.currentLetterIndex];
            sprite.spriteFrame = this.letterDictionary.get(key);
            this.popEffect(sprite.node);

            this.currentLetterIndex++;
            this.score += 10;
            this.updateScore();

            if (this.currentLetterIndex >= this.currentAnswer.length) {
                this.score += 50;
            
                this.playerMovement.jumpToNextStep();
            
                this.currentRiddleIndex++;
                if (this.currentRiddleIndex >= this.riddlePairs.length) {
                    this.winGame();
                } else {
                    this.scheduleOnce(() => this.showNextRiddle(), 1.5);
                }
            }
            
        } else {
            this.score = Math.max(0, this.score - 5);
            const sprite = this.letterSlots[this.currentLetterIndex];
            sprite.spriteFrame = this.letterDictionary.get(key);
            this.wrongEffect(sprite);
            this.updateScore();
        }
    }

    popEffect(node: Node) {
        tween(node)
            .to(0.1, { scale: new Vec3(1.5, 1.5, 1) })
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .start();
    }

    wrongEffect(sprite: Sprite) {
        const originalPos = sprite.node.getPosition();
        const shake = tween(sprite.node)
            .repeat(5, tween(sprite.node).by(0.05, { position: new Vec3(5, 0) }).by(0.05, { position: new Vec3(-5, 0) }))
            .call(() => {
                sprite.node.setPosition(originalPos);
                sprite.spriteFrame = this.emptyLetterSlot;
            });
        shake.start();
    }

    updateScore() {
        this.scoreText.string = `Score: ${this.score}`;
    }

    winGame() {
        console.log("You win!");
    }
}

import { _decorator, Component, EditBox, Input, input } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('KeyboardBridge')
export class KeyboardBridge extends Component {
    @property(EditBox)
    hiddenEditBox: EditBox = null!;

    start() {
        this.hiddenEditBox.node.active = true;
        this.hiddenEditBox.string = '';
        this.hiddenEditBox.focus();

        this.hiddenEditBox.node.on('text-changed', this.onTextChanged, this);
    }

    onTextChanged(editBox: EditBox) {
        const typed = editBox.string;
        if (typed.length > 0) {
            const lastChar = typed[typed.length - 1];

            // TODO: Pass this to your riddle answer system
            console.log('Typed Letter:', lastChar);

            // Clear the EditBox after reading input
            editBox.string = '';
            editBox.focus(); // Refocus to keep keyboard up
        }
    }
}

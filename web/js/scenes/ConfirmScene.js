/**
 * ConfirmScene - 確認重新開始場景
 * 對應 Pygame 的 confirm_reborn_scene.py
 */
class ConfirmScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ConfirmScene' });
    }

    init(data) {
        this.fromScene = data.fromScene || 'SetScene';
    }

    create() {
        const { width, height } = this.cameras.main;
        const player = window.GameState.getPlayer();

        // 深色遮罩
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.85);
        overlay.fillRect(0, 0, width, height);

        // 確認框
        const boxWidth = 500;
        const boxHeight = 400;
        const boxX = (width - boxWidth) / 2;
        const boxY = (height - boxHeight) / 2;

        const box = this.add.graphics();
        box.fillStyle(0xffffff, 1);
        box.fillRoundedRect(boxX, boxY, boxWidth, boxHeight, 15);
        box.lineStyle(5, 0xe74c3c, 1);
        box.strokeRoundedRect(boxX, boxY, boxWidth, boxHeight, 15);

        // 訊息文字
        const msg1 = this.add.text(width / 2, boxY + 80, '人生無法重來', 
            GameUtils.createTextStyle(32, '#2c3e50', 'Arial'));
        msg1.setOrigin(0.5);

        const msg2 = this.add.text(width / 2, boxY + 130, '但可以重新投胎', 
            GameUtils.createTextStyle(32, '#2c3e50', 'Arial'));
        msg2.setOrigin(0.5);

        const msg3 = this.add.text(width / 2, boxY + 200, '你確定要放棄我了嗎？', 
            GameUtils.createTextStyle(28, '#e74c3c', 'Arial'));
        msg3.setOrigin(0.5);

        // 角色情緒圖示（簡化版，用表情符號代替）
        const emoji = this.add.text(width / 2, boxY + 50, '😢', 
            GameUtils.createTextStyle(48, '#000000', 'Arial'));
        emoji.setOrigin(0.5);

        // 按鈕
        const btnY = boxY + boxHeight - 80;
        const btnSpacing = 150;

        // 是按鈕
        const yesBtn = this.createButton(width / 2 - btnSpacing / 2, btnY, '是', 0xe74c3c, () => {
            this.scene.stop();
            if (this.fromScene) {
                this.scene.get(this.fromScene).events.emit('confirmed-restart');
            }
        });

        // 否按鈕
        const noBtn = this.createButton(width / 2 + btnSpacing / 2, btnY, '否', 0x27ae60, () => {
            this.scene.stop();
            if (this.fromScene) {
                this.scene.get(this.fromScene).events.emit('cancel-restart');
            }
        });
    }

    createButton(x, y, text, color, callback) {
        const btnWidth = 100;
        const btnHeight = 50;

        const btnBg = this.add.graphics();
        btnBg.fillStyle(color, 1);
        btnBg.fillRoundedRect(x - btnWidth / 2, y - btnHeight / 2, btnWidth, btnHeight, 8);

        const btnText = this.add.text(x, y, text, GameUtils.createTextStyle(28, '#FFFFFF', 'Arial'));
        btnText.setOrigin(0.5);

        const hitArea = new Phaser.Geom.Rectangle(x - btnWidth / 2, y - btnHeight / 2, btnWidth, btnHeight);
        btnText.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains, { useHandCursor: true })
            .on('pointerover', () => {
                btnBg.setAlpha(0.8);
                btnText.setScale(1.1);
            })
            .on('pointerout', () => {
                btnBg.setAlpha(1);
                btnText.setScale(1);
            })
            .on('pointerdown', callback);

        return { bg: btnBg, text: btnText };
    }
}

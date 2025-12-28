/**
 * FeedbackScene - 回饋表單場景
 * 對應 Pygame 的 feedback_scene.py
 */
class FeedbackScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FeedbackScene' });
    }

    create() {
        const { width, height } = this.cameras.main;

        // 背景
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0x2c3e50, 0x2c3e50, 0x34495e, 0x34495e, 1);
        graphics.fillRect(0, 0, width, height);

        // 半透明遮罩
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.5);
        overlay.fillRect(0, 0, width, height);

        this.tweens.add({
            targets: overlay,
            alpha: { from: 0, to: 1 },
            duration: 1000
        });

        // 標題
        const title = this.add.text(width / 2, 80, 'Give Us Your Feedback!', 
            GameUtils.createTextStyle(56, '#FFFFFF', 'Arial'));
        title.setOrigin(0.5);

        // QR Code 或連結提示
        const qrBox = this.add.graphics();
        qrBox.fillStyle(0xffffff, 1);
        qrBox.fillRoundedRect(width / 2 - 250, height / 2 - 250, 500, 500, 20);

        // QR Code 佔位符
        const qrPlaceholder = this.add.text(width / 2, height / 2, 
            '📱\n\n掃描 QR Code\n或點擊下方連結\n填寫回饋表單', {
            fontSize: '32px',
            fill: '#2c3e50',
            fontFamily: 'Arial',
            align: 'center',
            lineSpacing: 15
        });
        qrPlaceholder.setOrigin(0.5);

        // 連結按鈕
        const linkText = 'https://forms.gle/example';
        const linkBtn = this.add.text(width / 2, height / 2 + 280, linkText, 
            GameUtils.createTextStyle(24, '#3498db', 'Arial'));
        linkBtn.setOrigin(0.5);
        linkBtn.setInteractive({ useHandCursor: true })
            .on('pointerover', () => linkBtn.setColor('#2980b9'))
            .on('pointerout', () => linkBtn.setColor('#3498db'))
            .on('pointerdown', () => {
                // 在實際部署時替換為真實的表單連結
                window.open(linkText, '_blank');
            });

        // 返回提示
        const hint = this.add.text(width / 2, height - 60, '(按下 Enter 鍵返回)', 
            GameUtils.createTextStyle(28, '#CCCCCC', 'Arial'));
        hint.setOrigin(0.5);

        // 返回鍵
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('EndScene');
        });
    }
}

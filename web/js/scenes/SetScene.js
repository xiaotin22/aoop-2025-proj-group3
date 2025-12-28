/**
 * SetScene - 設定場景
 * 對應 Pygame 的 set_scene.py
 */
class SetScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SetScene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        const player = window.GameState.getPlayer();

        // 半透明遮罩背景
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7);
        overlay.fillRect(0, 0, width, height);

        // 設定面板背景
        const panelWidth = 600;
        const panelHeight = 500;
        const panelX = (width - panelWidth) / 2;
        const panelY = (height - panelHeight) / 2;

        const panel = this.add.graphics();
        panel.fillStyle(0xffffff, 0.95);
        panel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 20);
        panel.lineStyle(4, 0x667eea, 1);
        panel.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 20);

        // 標題 - 週數
        const weekText = this.add.text(width / 2, panelY + 50, `第 ${player.weekNumber} 週`, 
            GameUtils.createTextStyle(42, '#667eea', 'Arial'));
        weekText.setOrigin(0.5);

        // 返回按鈕（左上角）
        const backBtn = this.add.text(panelX + 30, panelY + 30, '← 返回', 
            GameUtils.createTextStyle(28, '#666666', 'Arial'));
        backBtn.setInteractive({ useHandCursor: true })
            .on('pointerover', () => backBtn.setColor('#667eea'))
            .on('pointerout', () => backBtn.setColor('#666666'))
            .on('pointerdown', () => {
                this.scene.stop();
                this.scene.resume('MainScene');
            });

        // 音量調整按鈕
        const btn1Y = panelY + 150;
        const soundBtn = this.createButton(width / 2, btn1Y, '音量調整', () => {
            this.scene.pause();
            this.scene.launch('SoundControlScene');
        });

        // 重新開始按鈕
        const btn2Y = panelY + 280;
        const restartBtn = this.createButton(width / 2, btn2Y, '重新開始', () => {
            this.scene.pause();
            this.scene.launch('ConfirmScene', { fromScene: 'SetScene' });
        });

        // 監聽確認場景的返回事件
        this.events.on('confirmed-restart', () => {
            this.scene.stop();
            window.GameState.reset();
            this.scene.start('CharacterSelectScene');
        });

        this.events.on('cancel-restart', () => {
            this.scene.resume();
        });
    }

    createButton(x, y, text, callback) {
        const btnWidth = 400;
        const btnHeight = 80;

        const btnBg = this.add.graphics();
        btnBg.fillStyle(0xf0f0f0, 1);
        btnBg.fillRoundedRect(x - btnWidth / 2, y - btnHeight / 2, btnWidth, btnHeight, 10);
        btnBg.lineStyle(2, 0xcccccc, 1);
        btnBg.strokeRoundedRect(x - btnWidth / 2, y - btnHeight / 2, btnWidth, btnHeight, 10);

        const btnText = this.add.text(x, y, text, GameUtils.createTextStyle(36, '#333333', 'Arial'));
        btnText.setOrigin(0.5);

        const hitArea = new Phaser.Geom.Rectangle(x - btnWidth / 2, y - btnHeight / 2, btnWidth, btnHeight);
        btnText.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains, { useHandCursor: true })
            .on('pointerover', () => {
                btnBg.clear();
                btnBg.fillStyle(0x667eea, 1);
                btnBg.fillRoundedRect(x - btnWidth / 2, y - btnHeight / 2, btnWidth, btnHeight, 10);
                btnText.setColor('#ffffff');
            })
            .on('pointerout', () => {
                btnBg.clear();
                btnBg.fillStyle(0xf0f0f0, 1);
                btnBg.fillRoundedRect(x - btnWidth / 2, y - btnHeight / 2, btnWidth, btnHeight, 10);
                btnBg.lineStyle(2, 0xcccccc, 1);
                btnBg.strokeRoundedRect(x - btnWidth / 2, y - btnHeight / 2, btnWidth, btnHeight, 10);
                btnText.setColor('#333333');
            })
            .on('pointerdown', callback);

        return { bg: btnBg, text: btnText };
    }
}

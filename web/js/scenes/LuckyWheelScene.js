/**
 * LuckyWheelScene - 對應 Pygame 的 lucky_wheel_scene
 * 傳入 data: { title, options: string[], onResult: fn(result), nextScene: string, nextSceneData: object }
 */
class LuckyWheelScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LuckyWheelScene' });
    }

    init(data) {
        this.options = data.options || [];
        this.onResult = data.onResult;
        this.nextScene = data.nextScene || 'MainScene';
        this.nextSceneData = data.nextSceneData || {};
        this.title = data.title || '幸運轉盤';
    }

    create() {
        const { width, height } = this.cameras.main;

        // 背景
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0x2c3e50, 0x2c3e50, 0x3498db, 0x3498db, 1);
        graphics.fillRect(0, 0, width, height);

        // 標題
        const titleText = this.add.text(width / 2, 100, this.title, GameUtils.createTextStyle(48, '#FFEB3B', 'Arial'));
        titleText.setOrigin(0.5);

        // 簡化版：用隨機選項代替實轉盤
        const wheelBg = this.add.circle(width / 2, height / 2, 180, 0xffffff, 0.15);
        wheelBg.setStrokeStyle(4, 0xFFEB3B, 1);

        const optionText = this.add.text(width / 2, height / 2 - 20, '點擊開始轉動', GameUtils.createTextStyle(28, '#FFFFFF', 'Arial'));
        optionText.setOrigin(0.5);

        const startBtn = this.add.text(width / 2, height - 120, '開始轉盤', GameUtils.createTextStyle(32, '#FFFFFF', 'Arial'))
            .setOrigin(0.5)
            .setPadding(30, 15)
            .setBackgroundColor('#e67e22')
            .setInteractive({ useHandCursor: true });

        startBtn.on('pointerdown', () => {
            startBtn.disableInteractive();
            this.spinWheel(optionText);
        });
    }

    spinWheel(optionText) {
        const result = Phaser.Utils.Array.GetRandom(this.options);
        optionText.setText(`結果：${result}`);

        this.time.delayedCall(1200, () => {
            if (typeof this.onResult === 'function') {
                this.onResult(result);
            }
            this.scene.start(this.nextScene, this.nextSceneData);
        });
    }
}

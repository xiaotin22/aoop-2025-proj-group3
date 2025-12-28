/**
 * GradingScene - 分數跳動展示
 * data: { examType, score, nextScene, nextSceneData }
 */
class GradingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GradingScene' });
    }

    init(data) {
        this.examType = data.examType || 'midterm';
        this.targetScore = Math.round(data.score || 0);
        this.nextScene = data.nextScene || 'MainScene';
        this.nextSceneData = data.nextSceneData || {};
    }

    create() {
        const { width, height } = this.cameras.main;

        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0x1f4037, 0x1f4037, 0x99f2c8, 0x99f2c8, 1);
        graphics.fillRect(0, 0, width, height);

        const title = this.examType === 'midterm' ? '期中成績' : '期末成績';
        this.add.text(width / 2, 120, title, GameUtils.createTextStyle(52, '#FFFFFF', 'Arial')).setOrigin(0.5);

        this.displayScore = 0;
        this.scoreText = this.add.text(width / 2, height / 2, '0', GameUtils.createTextStyle(72, '#FFEB3B', 'Arial')).setOrigin(0.5);

        // 跳分動畫
        this.time.addEvent({
            delay: 80,
            loop: true,
            callback: () => {
                const step = Math.max(1, Math.floor(this.targetScore / 25));
                this.displayScore = Math.min(this.targetScore, this.displayScore + step);
                this.scoreText.setText(`${this.displayScore} 分`);
                if (this.displayScore >= this.targetScore) {
                    this.time.delayedCall(400, () => this.showContinue());
                    return false;
                }
            }
        });
    }

    showContinue() {
        const { width, height } = this.cameras.main;
        const btn = this.add.text(width / 2, height - 140, '繼續', GameUtils.createTextStyle(32, '#FFFFFF', 'Arial'))
            .setOrigin(0.5)
            .setPadding(30, 15)
            .setBackgroundColor('#34495e')
            .setInteractive({ useHandCursor: true });

        btn.on('pointerdown', () => {
            this.scene.start(this.nextScene, this.nextSceneData);
        });
    }
}

/**
 * TakeTestScene - 進入考試並切到 GradingScene
 * data: { examType: 'midterm' | 'final', nextScene: string, nextSceneData: object }
 */
class TakeTestScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TakeTestScene' });
    }

    init(data) {
        this.examType = data.examType || 'midterm';
        this.nextScene = data.nextScene || 'MainScene';
        this.nextSceneData = data.nextSceneData || {};
    }

    create() {
        const { width, height } = this.cameras.main;
        const player = window.GameState.getPlayer();

        // 背景
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0x0f2027, 0x203a43, 0x2c5364, 0x2c5364, 1);
        graphics.fillRect(0, 0, width, height);

        const title = this.examType === 'midterm' ? '期中考試' : '期末考試';
        const prompt = this.add.text(width / 2, height / 2 - 80, `${title} 開始`, GameUtils.createTextStyle(52, '#FFEB3B', 'Arial'));
        prompt.setOrigin(0.5);

        const info = this.add.text(width / 2, height / 2, '點擊開始作答 (快速跳過)', GameUtils.createTextStyle(28, '#FFFFFF', 'Arial'));
        info.setOrigin(0.5);

        this.input.once('pointerdown', () => {
            // 計算分數
            if (this.examType === 'midterm') {
                player.getMidterm();
            } else {
                player.getFinal();
            }
            const score = this.examType === 'midterm' ? player.midterm : player.final;
            this.scene.start('GradingScene', {
                examType: this.examType,
                score,
                nextScene: this.nextScene,
                nextSceneData: this.nextSceneData
            });
        });
    }
}

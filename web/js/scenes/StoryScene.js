/**
 * 劇情場景
 * Story Scene - 用於顯示週開始前的劇情
 */

class StoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StoryScene' });
    }
    
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const player = window.GameState.getPlayer();
        
        // 背景
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0x667eea, 0x667eea, 0x764ba2, 0x764ba2, 1);
        graphics.fillRect(0, 0, width, height);
        
        // 根據週數顯示不同劇情
        let storyText = '';
        if (player.weekNumber === 0) {
            storyText = `歡迎，${player.name}！\n\n新的學期開始了！\n作為一名大學生，你需要在學習、社交、娛樂和休息之間找到平衡。\n\n每週你都會面臨選擇，這些選擇將影響你的狀態和最終成績。\n\n準備好開始你的大學生活了嗎？`;
        } else if (player.weekNumber === 8) {
            storyText = `第 ${player.weekNumber} 週\n\n期中考試週到了！\n\n是時候檢驗你這半學期的學習成果了。\n你目前的知識積累將決定你的期中考成績。\n\n加油！`;
        } else if (player.weekNumber === 16) {
            storyText = `第 ${player.weekNumber} 週\n\n期末考試週來臨！\n\n這是最後的衝刺階段。\n你這一學期的努力即將得到回報。\n\n全力以赴吧！`;
        } else {
            storyText = `第 ${player.weekNumber + 1} 週\n\n新的一週開始了。\n你感覺如何？\n\n繼續保持平衡，朝著目標前進！`;
        }
        
        // 顯示劇情文字
        const story = this.add.text(width / 2, height / 2 - 50, storyText, {
            fontSize: '28px',
            fill: '#FFFFFF',
            fontFamily: 'Arial',
            align: 'center',
            lineSpacing: 15,
            wordWrap: { width: 900 }
        });
        story.setOrigin(0.5);
        
        // 打字機效果（簡化版）
        story.setAlpha(0);
        this.tweens.add({
            targets: story,
            alpha: 1,
            duration: 1000
        });
        
        // 繼續按鈕
        const continueButton = this.add.text(width / 2, height - 100, '點擊繼續 ▶', 
            GameUtils.createTextStyle(32, '#FFEB3B', 'Arial')
        );
        continueButton.setOrigin(0.5);
        continueButton.setAlpha(0);
        
        // 延遲顯示按鈕
        this.time.delayedCall(1500, () => {
            this.tweens.add({
                targets: continueButton,
                alpha: 1,
                duration: 500
            });
            
            // 閃爍效果
            this.tweens.add({
                targets: continueButton,
                alpha: { from: 1, to: 0.5 },
                duration: 800,
                yoyo: true,
                repeat: -1
            });
            
            continueButton.setInteractive({ useHandCursor: true })
                .on('pointerdown', () => {
                    this.proceedToNext();
                });
        });
        
        // 點擊任意位置繼續
        this.input.on('pointerdown', () => {
            if (continueButton.alpha > 0.8) {
                this.proceedToNext();
            }
        });
    }
    
    proceedToNext() {
        const player = window.GameState.getPlayer();
        
        // 增加週數
        player.nextWeek();

        // 週三：抽籤回家 / 期末教授抽籤
        if (player.weekNumber === 3) {
            const options = [
                '超可愛學姐\n帥潮學長',
                '看起來是系邊\n有點宅宅的學長',
                '超搞笑的系核\n第一次見面\n就表演倒立走路',
                '卷哥卷姐',
                '被放生了'
            ];
            this.scene.start('LuckyWheelScene', {
                title: '今天跟誰回家？',
                options,
                onResult: (result) => { player.home = result; },
                nextScene: 'EventScene'
            });
            return;
        }

        // 考試週
        if (player.weekNumber === 8) {
            this.scene.start('TakeTestScene', {
                examType: 'midterm',
                nextScene: 'EventScene'
            });
            return;
        }

        if (player.weekNumber === 16) {
            // 期末考後進教授抽籤，最後進結局
            this.scene.start('TakeTestScene', {
                examType: 'final',
                nextScene: 'LuckyWheelScene',
                nextSceneData: {
                    title: '幸運教授指數',
                    options: ['幸運教授指數3', '幸運教授指數5', '幸運教授指數4'],
                    onResult: (result) => {
                        const mapping = { '幸運教授指數3': 3, '幸運教授指數5': 5, '幸運教授指數4': 4 };
                        player.luckyProf = mapping[result] || 3;
                    },
                    nextScene: 'EndScene'
                }
            });
            return;
        }

        if (player.weekNumber > 16) {
            this.scene.start('EndScene');
            return;
        }

        // 普通週，進入事件選擇
        this.scene.start('EventScene');
    }
}

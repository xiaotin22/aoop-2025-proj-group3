/**
 * AdviceScene - 結果分析與建議場景
 * 對應 Pygame 的 advice_scene.py
 */
class AdviceScene extends Phaser.Scene {
    constructor() {
        super({ key: 'AdviceScene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        const player = window.GameState.getPlayer();

        // 背景
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0x667eea, 0x667eea, 0x764ba2, 0x764ba2, 1);
        graphics.fillRect(0, 0, width, height);

        // 內容區域
        const contentX = 340 / 1200 * width;
        const contentY = 122 / 800 * height;
        const contentW = 814 / 1200 * width;
        const contentH = 570 / 800 * height;

        const contentBg = this.add.graphics();
        contentBg.fillStyle(0xffffff, 0.95);
        contentBg.fillRoundedRect(contentX, contentY, contentW, contentH, 15);

        // 標題
        const title = this.add.text(width / 2, contentY - 40, '學習建議與分析', 
            GameUtils.createTextStyle(48, '#FFFFFF', 'Arial'));
        title.setOrigin(0.5);

        // 生成建議文字
        const adviceText = this.generateAdvice(player);
        
        // 可滾動文字區域
        const padding = 20;
        const textZone = this.add.zone(contentX + padding, contentY + padding, 
            contentW - padding * 2, contentH - padding * 2);
        
        const text = this.add.text(contentX + padding, contentY + padding, adviceText, {
            fontSize: '22px',
            fill: '#2c3e50',
            fontFamily: 'Arial',
            wordWrap: { width: contentW - padding * 2 },
            lineSpacing: 8
        });

        // 如果文字超出範圍，啟用滾動
        const textHeight = text.height;
        const maxHeight = contentH - padding * 2;
        
        if (textHeight > maxHeight) {
            // 創建遮罩
            const mask = this.make.graphics();
            mask.fillStyle(0xffffff);
            mask.fillRect(contentX + padding, contentY + padding, contentW - padding * 2, maxHeight);
            text.setMask(mask.createGeometryMask());

            // 添加滾動功能
            this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
                const scrollSpeed = 30;
                const newY = Phaser.Math.Clamp(
                    text.y - deltaY * scrollSpeed * 0.01,
                    contentY + padding - (textHeight - maxHeight),
                    contentY + padding
                );
                text.y = newY;
            });
        }

        // 返回提示
        const hint = this.add.text(width / 2, height - 40, '按 ESC 或點擊返回', 
            GameUtils.createTextStyle(24, '#CCCCCC', 'Arial'));
        hint.setOrigin(0.5);

        // 返回鍵
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('EndScene');
        });

        this.input.on('pointerdown', () => {
            this.scene.start('EndScene');
        });
    }

    generateAdvice(player) {
        // 簡化版建議生成邏輯
        let advice = `親愛的 ${player.name}，\n\n`;
        advice += `經過一學期的努力，你的最終成績是 ${player.totalScore} 分，等級為 ${player.grade}，GPA 為 ${player.gpa.toFixed(2)}。\n\n`;

        // 根據屬性提供建議
        if (player.knowledge < 50) {
            advice += `📚 學習建議：你的知識累積較少，建議未來多花時間讀書，打好基礎。\n\n`;
        } else if (player.knowledge >= 80) {
            advice += `📚 學習表現：知識累積優秀！繼續保持學習熱情。\n\n`;
        }

        if (player.mood < 50) {
            advice += `😊 心情管理：注意適時放鬆，維持良好心情對學習很重要。\n\n`;
        }

        if (player.energy < 50) {
            advice += `⚡ 體力管理：記得充分休息，保持充沛體力才能有效學習。\n\n`;
        }

        if (player.social < 50) {
            advice += `👥 社交建議：適度的社交活動能幫助調劑身心，建議多與同學互動。\n\n`;
        }

        advice += `\n總結：大學生活需要在學習、休息、娛樂和社交之間找到平衡。`;
        advice += `每個人的節奏不同，找到適合自己的方式最重要。加油！`;

        return advice;
    }
}

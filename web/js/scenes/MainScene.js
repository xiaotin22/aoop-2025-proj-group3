/**
 * 主遊戲場景 - 完全參照 main_scene.py
 * Main Game Scene
 */

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }
    
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const player = window.GameState.getPlayer();
        
        // 背景圖片 - 參照 main_scene.py: background = pygame.image.load(setting.ImagePath.BACKGROUND_PATH)
        if (this.textures.exists('background_intro')) {
            const bg = this.add.image(width / 2, height / 2, 'background_intro');
            const scale = Math.max(width / bg.width, height / bg.height);
            bg.setScale(scale);
        }
        
        // 初始化角色動畫系統
        this.initCharacterAnimation();
        
        // 創建 "下一週" 按鈕 (右下角)
        this.createNextWeekButton();
        
        // 創建事件圖標 (中央，帶閃爍和懸停效果)
        this.createEventIcon();
        
        // 創建設定按鈕 (右上角)
        this.createSettingsButton();
        
        // 創建玩家狀態顯示 (左上角)
        this.createPlayerStats();
        
        // 創建表情符號按鈕 (左下5個，右下3個)
        this.createEmojiButtons();
        
        // 創建日記按鈕 (右上角，設定按鈕左邊)
        if (player.weekNumber > 0) {
            this.createDiaryButton();
        }
        
        // 初始化飄浮表情系統
        this.floatingEmojis = [];
        
        // 初始化對話氣泡
        this.speechBubble = null;
        
        // 角色點擊互動狀態
        this.currentAnimLevel = 0;
        this.lastAnimClickTime = 0;
        this.animClickTimeout = 2000;
    }
    
    initCharacterAnimation() {
        const player = window.GameState.getPlayer();
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 根據週數選擇角色動畫
        // 參照 main_scene.py: self.animator = self.player.gif_choose(self.player.week_number)
        const animState = this.getCharacterAnimState(player);
        const animFrameCount = this.getAnimationFrameCount(player.characterId, animState);
        
        // 創建角色動畫
        const charX = width * 0.75; // 右側 3/4 位置
        const charY = height * 0.4;
        
        // 初始化第一幀
        const firstFrameKey = `${player.characterId}_${animState}_0`;
        this.characterSprite = this.add.image(charX, charY, firstFrameKey);
        this.characterSprite.setScale(2.5);
        this.characterSprite.setInteractive({ useHandCursor: true });
        
        // 儲存動畫信息用於 update 循環
        this.characterAnimState = animState;
        this.characterAnimFrameCount = animFrameCount;
        this.characterAnimFrameIndex = 0;
        this.characterAnimSpeed = 100; // 每幀持續時間（毫秒）
        this.characterAnimTimer = 0;
        
        // 點擊角色播放互動動畫
        this.characterSprite.on('pointerdown', () => {
            this.handleCharacterClick();
        });
    }
    
    getCharacterAnimState(player) {
        // 參照 main_scene.py: self.animator = self.player.gif_choose(self.player.week_number)
        // 根據週數返回不同動畫狀態
        const week = player.weekNumber;
        
        // 簡化版本：根據週數返回不同動畫狀態
        if (week === 0) return 'intro';
        if (week >= 1 && week <= 7) return 'study';
        if (week === 8) return 'exam';
        if (week >= 9 && week <= 15) return 'active';
        if (week === 16) return 'final';
        
        return 'intro';
    }
    
    getAnimationFrameCount(characterId, animState) {
        // 定義每個角色動畫的幀數（必須與 PreloadScene 中的定義相符）
        const frameData = {
            bubu: {
                intro: 8,
                study: 2,
                active: 11,
                exam: 46,
                final: 24
            },
            yier: {
                intro: 14,
                study: 4,
                active: 18,
                exam: 38,
                final: 29
            },
            mitao: {
                intro: 12,
                study: 12,
                active: 10,
                exam: 14,
                final: 12
            },
            huihui: {
                intro: 12,
                study: 8,
                active: 4,
                exam: 12,
                final: 14
            }
        };
        
        return frameData[characterId] && frameData[characterId][animState] 
            ? frameData[characterId][animState] 
            : 8; // 預設 8 幀
    }
    
    createNextWeekButton() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 參照 main_scene.py: (SCREEN_WIDTH - 200, SCREEN_HEIGHT - 100, 180, 60)
        const btnX = width - 200 / 1200 * width;
        const btnY = height - 100 / 800 * height;
        const btnWidth = 180 / 1200 * width;
        const btnHeight = 60 / 800 * height;
        
        // 創建按鈕容器
        this.nextWeekBtn = this.add.container(btnX, btnY);
        
        // 按鈕背景 - 參照 main_scene.py: (200, 200, 250)
        const btnBg = this.add.rectangle(0, 0, btnWidth, btnHeight, 0xC8C8FA);
        btnBg.setStrokeStyle(2, 0x323232);
        
        // 按鈕文字 - 參照 main_scene.py: font = pygame.font.Font(setting.JFONT_PATH_BOLD, 36)
        const fontSize = Math.floor(36 / 800 * height);
        const btnText = this.add.text(0, 0, ' 下一週', {
            fontSize: fontSize + 'px',
            fontFamily: 'JasonHandwriting3',
            color: '#323232'
        });
        btnText.setOrigin(0.5);
        
        this.nextWeekBtn.add([btnBg, btnText]);
        
        // 設定互動
        btnBg.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                btnBg.setFillStyle(0xB4B4B4);
                if (this.sound.get('sfx_menu_hover')) {
                    this.sound.play('sfx_menu_hover');
                }
            })
            .on('pointerout', () => {
                btnBg.setFillStyle(0xC8C8FA);
            })
            .on('pointerdown', () => {
                // 進入下一週 (StoryScene)
                this.scene.start('StoryScene');
            });
    }
    
    createEventIcon() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 參照 main_scene.py: center=(400, 400), size=(175, 175)
        const iconX = 400 / 1200 * width;
        const iconY = 400 / 800 * height;
        const iconSize = 175 / 800 * height;
        
        this.eventIcon = this.add.image(iconX, iconY, 'event_icon');
        this.eventIcon.setDisplaySize(iconSize, iconSize);
        this.eventIcon.setInteractive({ useHandCursor: true });
        
        this.eventIconHover = false;
        
        // 閃爍動畫 - 參照 main_scene.py 的 sin 動畫
        // base_scale = 1 + 0.12 * math.sin(ticks * 0.01)
        this.eventIconTween = this.tweens.add({
            targets: this.eventIcon,
            scale: 1.12,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // 懸停效果 - 參照 main_scene.py: hover_scale = 1.1
        this.eventIcon.on('pointerover', () => {
            if (!this.eventIconHover) {
                this.eventIconHover = true;
                this.eventIcon.setScale(1.1 * 1.12); // hover_scale * base_scale
                if (this.sound.get('sfx_menu_hover')) {
                    this.sound.play('sfx_menu_hover');
                }
            }
        });
        
        this.eventIcon.on('pointerout', () => {
            this.eventIconHover = false;
            this.eventIcon.setScale(1.0);
        });
        
        // 點擊顯示對話氣泡 - 參照 main_scene.py: SpeechBubble(self.player, (470, 330), bubble_font)
        this.eventIcon.on('pointerdown', () => {
            this.showSpeechBubble();
        });
    }
    
    showSpeechBubble() {
        const player = window.GameState.getPlayer();
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 移除舊的氣泡
        if (this.speechBubble) {
            this.speechBubble.destroy();
        }
        
        // 創建對話氣泡 - 參照 main_scene.py: (470, 330)
        const bubbleX = 470 / 1200 * width;
        const bubbleY = 330 / 800 * height;
        
        // 簡化版本：顯示玩家當前狀態提示
        const messages = [
            `本週是第 ${player.weekNumber} 週`,
            `記得查看日記了解進度！`,
            `點擊角色可以互動哦～`
        ];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        
        this.speechBubble = this.add.container(bubbleX, bubbleY);
        
        // 氣泡背景
        const bubbleBg = this.add.graphics();
        bubbleBg.fillStyle(0xFFFFFF, 0.95);
        bubbleBg.fillRoundedRect(-100, -40, 200, 80, 10);
        bubbleBg.lineStyle(2, 0x666666);
        bubbleBg.strokeRoundedRect(-100, -40, 200, 80, 10);
        
        // 氣泡文字 - 參照 main_scene.py: font = pygame.font.Font(setting.JFONT_PATH_REGULAR, 28)
        const fontSize = Math.floor(28 / 800 * height);
        const bubbleText = this.add.text(0, 0, randomMsg, {
            fontSize: fontSize + 'px',
            fontFamily: 'JasonHandwriting3',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 180 }
        });
        bubbleText.setOrigin(0.5);
        
        this.speechBubble.add([bubbleBg, bubbleText]);
        
        // 3秒後自動消失
        this.time.delayedCall(3000, () => {
            if (this.speechBubble) {
                this.speechBubble.destroy();
                this.speechBubble = null;
            }
        });
    }
    
    createSettingsButton() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 參照 main_scene.py: topleft=(1100, 20), size=(80, 80)
        const btnX = 1100 / 1200 * width + (80 / 1200 * width) / 2;
        const btnY = 20 / 800 * height + (80 / 800 * height) / 2;
        const btnSize = 80 / 800 * height;
        
        this.settingsBtn = this.add.image(btnX, btnY, 'set_icon');
        this.settingsBtn.setDisplaySize(btnSize, btnSize);
        this.settingsBtn.setInteractive({ useHandCursor: true });
        
        this.settingsHover = false;
        
        // 參照 main_scene.py: hover 時放大到 96x96
        this.settingsBtn.on('pointerover', () => {
            if (!this.settingsHover) {
                this.settingsHover = true;
                this.settingsBtn.setDisplaySize(btnSize * 1.2, btnSize * 1.2);
                if (this.sound.get('sfx_menu_hover')) {
                    this.sound.play('sfx_menu_hover');
                }
            }
        });
        
        this.settingsBtn.on('pointerout', () => {
            this.settingsHover = false;
            this.settingsBtn.setDisplaySize(btnSize, btnSize);
        });
        
        this.settingsBtn.on('pointerdown', () => {
            // 進入設定場景
            this.scene.pause();
            this.scene.launch('SetScene');
        });
    }
    
    createPlayerStats() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const player = window.GameState.getPlayer();
        
        // 參照 main_scene.py: 位置 (20, 50), 大小 (480, 250)
        const statsX = 20 / 1200 * width;
        const statsY = 50 / 800 * height;
        const statsWidth = 480 / 1200 * width;
        const statsHeight = 250 / 800 * height;
        
        // 半透明背景 - 參照 main_scene.py: fillStyle((255, 255, 255, 180))
        const statsBg = this.add.graphics();
        statsBg.fillStyle(0xFFFFFF, 180/255);
        statsBg.fillRect(statsX, statsY, statsWidth, statsHeight);
        statsBg.lineStyle(2, 0x646464);
        statsBg.strokeRect(statsX, statsY, statsWidth, statsHeight);
        
        // 玩家頭像 - 參照 main_scene.py: topleft=(40, 60), size=(100, 100)
        const headSize = 100 / 800 * height;
        const headX = statsX + 40 / 1200 * width;
        const headY = statsY + 60 / 800 * height;
        
        const playerHead = this.add.image(headX, headY, player.characterId + '_head');
        playerHead.setDisplaySize(headSize, headSize);
        playerHead.setOrigin(0, 0);
        
        // 玩家名字 - 參照 main_scene.py: topleft=(160, 80), font_size=28
        const nameX = statsX + 160 / 1200 * width;
        const nameY = statsY + 80 / 800 * height;
        const fontSize = Math.floor(28 / 800 * height);
        
        const nameText = this.add.text(nameX, nameY, `${player.chineseName} ${player.name}`, {
            fontSize: fontSize + 'px',
            fontFamily: 'JasonHandwriting3',
            color: '#000000'
        });
        
        // 週數 - 參照 main_scene.py: topleft=(160, 120)
        const weekY = statsY + 120 / 800 * height;
        const weekText = this.add.text(nameX, weekY, `第 ${player.weekNumber} 週`, {
            fontSize: fontSize + 'px',
            fontFamily: 'JasonHandwriting3',
            color: '#000000'
        });
        
        // 屬性條 - 參照 main_scene.py 的佈局
        const barWidth = 150 / 1200 * width;
        const barHeight = 20 / 800 * height;
        const barGap = 10 / 800 * height;
        
        // 定義屬性和顏色 - 參照 main_scene.py
        const stats = [
            { key: 'intelligence', label: '智力', color: 0x87CEFA }, // (135, 206, 250)
            { key: 'mood', label: '心情', color: 0xFFB6C1 },         // (255, 182, 193)
            { key: 'energy', label: '體力', color: 0x90EE90 },       // (144, 238, 144)
            { key: 'social', label: '社交', color: 0xFFA500 },       // (255, 165, 0)
            { key: 'knowledge', label: '知識', color: 0xDDA0DD }     // (221, 160, 221)
        ];
        
        // 第一排：智力 / 心情 - 參照 main_scene.py: y_start = 180
        const row1Y = statsY + 180 / 800 * height;
        const leftX = statsX + 30 / 1200 * width;
        const rightX = leftX + barWidth + 80 / 1200 * width;
        
        this.drawStatBar(leftX, row1Y, barWidth, barHeight, stats[0], player.intelligence);
        this.drawStatBar(rightX, row1Y, barWidth, barHeight, stats[1], player.mood);
        
        // 第二排：體力 / 社交
        const row2Y = row1Y + barHeight + barGap + 10 / 800 * height;
        this.drawStatBar(leftX, row2Y, barWidth, barHeight, stats[2], player.energy);
        this.drawStatBar(rightX, row2Y, barWidth, barHeight, stats[3], player.social);
        
        // 第三排：知識（橫跨兩欄）
        const row3Y = row2Y + barHeight + barGap + 20 / 800 * height;
        const totalWidth = (rightX - leftX) + 130 / 1200 * width + barWidth;
        this.drawStatBar(leftX, row3Y, totalWidth - 130 / 1200 * width, barHeight, stats[4], player.knowledge);
        
        // 本週選擇改變 - 參照 main_scene.py: topleft=(x_right + 60, 90)
        if (player.weekNumber > 0 && player.lastWeekChange.some(v => v !== 0)) {
            this.showWeekChanges(rightX + 60 / 1200 * width, statsY + 90 / 800 * height);
        }
    }
    
    drawStatBar(x, y, width, height, stat, value) {
        // 參照 main_scene.py: 
        // pygame.draw.rect(self.screen, (200, 200, 200), (x + 65, y, bar_width, bar_height), 2)
        // pygame.draw.rect(self.screen, self.bar_colors[key], (x + 65, y, int(bar_width * fill), bar_height))
        
        const barX = x + 65 / 1200 * this.cameras.main.width;
        
        // 邊框 - 參照 main_scene.py: (200, 200, 200)
        const barBorder = this.add.graphics();
        barBorder.lineStyle(2, 0xC8C8C8);
        barBorder.strokeRect(barX, y, width, height);
        
        // 填充
        const fill = Math.max(0, Math.min(1, value / 100));
        const barFill = this.add.graphics();
        barFill.fillStyle(stat.color);
        barFill.fillRect(barX, y, width * fill, height);
        
        // 標籤 - 參照 main_scene.py: label = font.render(f"智力 {self.player.intelligence}", True, (0, 0, 0))
        const fontSize = Math.floor(28 / 800 * this.cameras.main.height);
        const label = this.add.text(x, y, `${stat.label} ${Math.floor(value)}`, {
            fontSize: fontSize + 'px',
            fontFamily: 'JasonHandwriting3',
            color: '#000000'
        });
        label.setOrigin(0, 0.5);
    }
    
    showWeekChanges(x, y) {
        const player = window.GameState.getPlayer();
        const changes = this.formatChanges(player.lastWeekChange);
        const height = this.cameras.main.height;
        
        // 參照 main_scene.py: font2 = pygame.font.Font(setting.JFONT_PATH_Light, 22)
        const fontSize = Math.floor(22 / 800 * height);
        
        const title = this.add.text(x, y, '本週選擇改變：', {
            fontSize: fontSize + 'px',
            fontFamily: 'JasonHandwriting3',
            color: '#000000'
        });
        
        // 參照 main_scene.py: text1 = font2.render(f"心情 {last_week_change[0]} 知識 {last_week_change[3]}", ...)
        const line1 = this.add.text(x, y + 25, `心情 ${changes[0]} 知識 ${changes[3]}`, {
            fontSize: fontSize + 'px',
            fontFamily: 'JasonHandwriting3',
            color: '#000000'
        });
        
        // text2 = font2.render(f"體力 {last_week_change[1]} 社交 {last_week_change[2]}", ...)
        const line2 = this.add.text(x, y + 50, `體力 ${changes[1]} 社交 ${changes[2]}`, {
            fontSize: fontSize + 'px',
            fontFamily: 'JasonHandwriting3',
            color: '#000000'
        });
    }
    
    formatChanges(changeList) {
        // 參照 main_scene.py: stats_change 函數
        // 正數前加 "+"，負數前加 "-"，零則顯示 "-"
        return changeList.map(change => {
            const intChange = Math.floor(change);
            if (intChange > 0) return '+' + intChange;
            if (intChange === 0) return '-';
            return String(intChange);
        });
    }
    
    createEmojiButtons() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 參照 main_scene.py: 8個表情，左下5個，右下3個
        // left_start_x = 30, left_y = SCREEN_HEIGHT - 120
        // right_x = SCREEN_WIDTH - 100, right_start_y = SCREEN_HEIGHT - 360
        const emojiKeys = [
            'emoji_happy_w',
            'emoji_kiss_w',
            'emoji_hehe_w',
            'emoji_sad_w',
            'emoji_angry_w',
            'emoji_heart_w',
            'emoji_lightening_w',
            'emoji_rocket_w'
        ];
        
        const emojiKeysColored = [
            'emoji_happy',
            'emoji_kiss',
            'emoji_hehe',
            'emoji_sad',
            'emoji_angry',
            'emoji_heart',
            'emoji_lightening',
            'emoji_rocket'
        ];
        
        const emojiSize = 90 / 800 * height;
        
        this.emojiButtons = [];
        this.emojiClickedFrames = new Array(8).fill(0);
        
        emojiKeys.forEach((key, i) => {
            let x, y;
            
            if (i < 5) {
                // 左下5個：水平排列
                // 參照 main_scene.py: x = left_start_x + i * 70
                x = (30 + i * 70) / 1200 * width;
                y = height - 120 / 800 * height;
            } else {
                // 右下3個：垂直排列
                // 參照 main_scene.py: x = right_x, y = right_start_y + (i - 5) * 70
                x = width - 100 / 1200 * width;
                y = height - (360 - (i - 5) * 70) / 800 * height;
            }
            
            const emoji = this.add.image(x, y, key);
            emoji.setDisplaySize(emojiSize, emojiSize);
            emoji.setOrigin(0, 0);
            emoji.setInteractive({ useHandCursor: true });
            
            emoji.on('pointerdown', () => {
                if (this.sound.get('sfx_menu_hover')) {
                    this.sound.play('sfx_menu_hover');
                }
                
                // 點擊放大動畫 - 參照 main_scene.py: emoji_frame_max = 3
                this.emojiClickedFrames[i] = 3;
                
                // 創建飄浮表情 - 參照 main_scene.py: FloatingEmoji
                this.createFloatingEmoji(emojiKeysColored[i], x + emojiSize / 2, y + emojiSize / 2);
            });
            
            this.emojiButtons.push(emoji);
        });
    }
    
    createFloatingEmoji(emojiKey, startX, startY) {
        // 創建飄浮表情動畫 - 參照 main_scene.py: FloatingEmoji
        const emoji = this.add.image(startX, startY, emojiKey);
        emoji.setDisplaySize(90, 90);
        
        // 飄浮動畫：向上移動並淡出
        this.tweens.add({
            targets: emoji,
            y: startY - 200,
            alpha: 0,
            duration: 2000,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                emoji.destroy();
            }
        });
        
        // 左右擺動
        this.tweens.add({
            targets: emoji,
            x: startX + (Math.random() - 0.5) * 100,
            duration: 2000,
            ease: 'Sine.easeInOut'
        });
        
        this.floatingEmojis.push(emoji);
    }
    
    createDiaryButton() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 參照 main_scene.py: topleft=(980, 15), size=(90, 90)
        const btnX = (980 + 45) / 1200 * width;
        const btnY = (15 + 45) / 800 * height;
        const btnSize = 90 / 800 * height;
        
        this.diaryBtn = this.add.image(btnX, btnY, 'notebook');
        this.diaryBtn.setDisplaySize(btnSize, btnSize);
        this.diaryBtn.setInteractive({ useHandCursor: true });
        
        this.diaryHover = false;
        
        // 參照 main_scene.py: hover 時放大到 100x100
        this.diaryBtn.on('pointerover', () => {
            if (!this.diaryHover) {
                this.diaryHover = true;
                this.diaryBtn.setDisplaySize(btnSize * 100/90, btnSize * 100/90);
                if (this.sound.get('sfx_menu_hover')) {
                    this.sound.play('sfx_menu_hover');
                }
            }
        });
        
        this.diaryBtn.on('pointerout', () => {
            this.diaryHover = false;
            this.diaryBtn.setDisplaySize(btnSize, btnSize);
        });
        
        this.diaryBtn.on('pointerdown', () => {
            // 進入日記場景 - 參照 main_scene.py: return "DIARY"
            this.scene.start('DiaryScene');
        });
    }
    
    handleCharacterClick() {
        const player = window.GameState.getPlayer();
        
        // 參照 main_scene.py: 點擊角色播放 active 動畫
        this.lastAnimClickTime = Date.now();
        
        // 播放互動音效
        if (this.sound.get('sfx_bo')) {
            this.sound.play('sfx_bo');
        }
        
        // 角色跳動動畫
        this.tweens.add({
            targets: this.characterSprite,
            y: this.characterSprite.y - 30,
            duration: 200,
            yoyo: true,
            ease: 'Quad.easeOut'
        });
        
        // 隨機顯示一個表情
        const emojis = ['😊', '🎮', '📚', '💪', '🎉'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        
        const emojiText = this.add.text(
            this.characterSprite.x,
            this.characterSprite.y - 100,
            randomEmoji,
            { fontSize: '48px' }
        );
        emojiText.setOrigin(0.5);
        
        this.tweens.add({
            targets: emojiText,
            y: emojiText.y - 50,
            alpha: 0,
            duration: 1000,
            onComplete: () => emojiText.destroy()
        });
    }
    
    update(time, delta) {
        // 更新角色動畫幀
        if (this.characterAnimTimer !== undefined) {
            this.characterAnimTimer += delta;
            
            if (this.characterAnimTimer >= this.characterAnimSpeed) {
                this.characterAnimTimer = 0;
                this.characterAnimFrameIndex = (this.characterAnimFrameIndex + 1) % this.characterAnimFrameCount;
                
                // 更新角色精靈的紋理
                const player = window.GameState.getPlayer();
                const frameKey = `${player.characterId}_${this.characterAnimState}_${this.characterAnimFrameIndex}`;
                
                if (this.textures.exists(frameKey)) {
                    this.characterSprite.setTexture(frameKey);
                }
            }
        }
        
        // 更新表情按鈕的點擊動畫 - 參照 main_scene.py
        this.emojiClickedFrames.forEach((frames, i) => {
            if (frames > 0) {
                this.emojiClickedFrames[i]--;
                // 參照 main_scene.py: scale = 1.2 if frames > 0 else 1.0
                const scale = frames > 0 ? 1.2 : 1.0;
                const currentSize = 90 / 800 * this.cameras.main.height;
                this.emojiButtons[i].setDisplaySize(currentSize * scale, currentSize * scale);
            }
        });
        
        // 檢查是否需要重置角色動畫 - 參照 main_scene.py: anim_click_timeout = 2000
        if (this.currentAnimLevel !== 0 && Date.now() - this.lastAnimClickTime > this.animClickTimeout) {
            this.currentAnimLevel = 0;
        }
        
        // 清理過期的飄浮表情
        this.floatingEmojis = this.floatingEmojis.filter(emoji => emoji.active);
    }
}

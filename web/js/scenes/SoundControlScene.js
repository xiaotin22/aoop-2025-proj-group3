/**
 * SoundControlScene - 音量控制場景
 * 對應 Pygame 的 sound_control_scene.py
 */
class SoundControlScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SoundControlScene' });
    }

    create() {
        const { width, height } = this.cameras.main;

        // 半透明遮罩
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.8);
        overlay.fillRect(0, 0, width, height);

        // 控制面板
        const panelWidth = 700;
        const panelHeight = 400;
        const panelX = (width - panelWidth) / 2;
        const panelY = (height - panelHeight) / 2;

        const panel = this.add.graphics();
        panel.fillStyle(0x2c3e50, 0.95);
        panel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 20);
        panel.lineStyle(4, 0x3498db, 1);
        panel.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 20);

        // 標題
        const title = this.add.text(width / 2, panelY + 50, '音量設定', 
            GameUtils.createTextStyle(48, '#FFFFFF', 'Arial'));
        title.setOrigin(0.5);

        // BGM 滑桿
        const bgmY = panelY + 140;
        this.createSlider(panelX + 80, bgmY, panelWidth - 160, '背景音樂', 
            window.GameState.bgmVolume || 0.5,
            (value) => {
                window.GameState.bgmVolume = value;
                // TODO: 實際控制 BGM 音量
                console.log('BGM Volume:', value);
            }
        );

        // SFX 滑桿
        const sfxY = panelY + 240;
        this.createSlider(panelX + 80, sfxY, panelWidth - 160, '音效', 
            window.GameState.sfxVolume || 0.5,
            (value) => {
                window.GameState.sfxVolume = value;
                // TODO: 實際控制 SFX 音量
                console.log('SFX Volume:', value);
            }
        );

        // 返回提示
        const hint = this.add.text(width / 2, panelY + panelHeight - 40, '點擊任意處返回', 
            GameUtils.createTextStyle(24, '#AAAAAA', 'Arial'));
        hint.setOrigin(0.5);

        // 點擊返回
        this.input.once('pointerdown', () => {
            this.scene.stop();
            this.scene.resume('SetScene');
        });
    }

    createSlider(x, y, width, label, initialValue, onChange) {
        const sliderHeight = 12;
        const knobRadius = 18;

        // 標籤
        const labelText = this.add.text(x, y - 30, `${label}: ${Math.round(initialValue * 100)}%`, 
            GameUtils.createTextStyle(28, '#FFFFFF', 'Arial'));

        // 滑桿底座
        const trackBg = this.add.graphics();
        trackBg.fillStyle(0x7f8c8d, 1);
        trackBg.fillRoundedRect(x, y, width, sliderHeight, sliderHeight / 2);

        // 滑桿填充
        const trackFill = this.add.graphics();
        const updateFill = (value) => {
            trackFill.clear();
            trackFill.fillStyle(0x3498db, 1);
            trackFill.fillRoundedRect(x, y, width * value, sliderHeight, sliderHeight / 2);
        };
        updateFill(initialValue);

        // 滑桿圓鈕
        const knob = this.add.circle(x + width * initialValue, y + sliderHeight / 2, knobRadius, 0xecf0f1);
        knob.setStrokeStyle(3, 0x3498db);
        knob.setInteractive({ draggable: true, useHandCursor: true });

        let isDragging = false;

        knob.on('pointerover', () => {
            knob.setScale(1.1);
        });

        knob.on('pointerout', () => {
            if (!isDragging) knob.setScale(1);
        });

        knob.on('dragstart', () => {
            isDragging = true;
        });

        knob.on('drag', (pointer) => {
            const relX = Phaser.Math.Clamp(pointer.x - x, 0, width);
            const value = relX / width;
            
            knob.x = x + relX;
            updateFill(value);
            labelText.setText(`${label}: ${Math.round(value * 100)}%`);
            
            if (onChange) onChange(value);
        });

        knob.on('dragend', () => {
            isDragging = false;
            knob.setScale(1);
        });
    }
}

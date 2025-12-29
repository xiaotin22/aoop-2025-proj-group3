# Web 版視覺參數對照 Python 版

本文檔記錄了從 Python/Pygame 版本提取的精確視覺參數，用於 Web/Phaser 版本的視覺調整。

## 背景透明度設定 (Background Alpha)

### StartScene
- **Python**: `background.set_alpha(100)` → Web: `bg.setAlpha(100/255)` = **0.39**
- **字體**: title=72px, button=48px
- **按鈕尺寸**: 300x70, spacing=30

### IntroScene  
- **Python**: `background.set_alpha(100)` → Web: `bg.setAlpha(100/255)` = **0.39**
- **遮罩**: `overlay_alpha` 從 0 漸變到 200 → Web: `0.78` (黑色)
- **字體**: font=36px, font_desc=28px
- **角色位置**: (900, 50), 尺寸=(240, 220)
- **行間距**: 75px

### CharacterSelectScene
- **Python**: `background.set_alpha(100)` → Web: **0.39**
- **卡片尺寸**: 500x300, margin=30
- **字體**: font=36px, font_desc=28px
- **顏色**:
  - Bubu: (255, 200, 200) → 0xFFC8C8, hover (200, 100, 100) → 0xC86464
  - Yier: (150, 200, 255) → 0x96C8FF, hover (100, 150, 200) → 0x6496C8
  - Mitao: (255, 200, 200) → 0xFFC8C8, hover (255, 120, 180) → 0xFF78B4
  - Huihui: (200, 200, 255) → 0xC8C8FF, hover (150, 150, 200) → 0x9696C8

### StoryScene
- **Python**: `background.set_alpha(65)` → Web: `bg.setAlpha(65/255)` = **0.255**
- **字體**: font=36px, color=(50,50,50) → 0x323232
- **文字位置**: left_margin=100, top_start=230
- **行間距**: line_spacing=10
- **角色動畫**: (220, 200) at (900, 50)
- **打字速度**: char_interval=120ms

### EndScene
- **Python**: `background.set_alpha(100)` → Web: **0.39**
- **字體**: title=54px, subtitle=48px
- **角色**: (300, 300) at (50, 400)
- **Emoji**: 90x90, left placement at x=30+i*70, y=SCREEN_HEIGHT-120

### MainScene
- **背景**: 全屏顯示，無透明度調整
- **字體**: stats=28px, button=36px
- **狀態條**: width=150, height=20, gap=10
- **顏色**:
  - intelligence: (135, 206, 250) → 0x87CEFA
  - mood: (255, 182, 193) → 0xFFB6C1
  - energy: (144, 238, 144) → 0x90EE90
  - social: (255, 165, 0) → 0xFFA500
  - knowledge: (221, 160, 221) → 0xDDA0DD
- **按鈕**: next_week (180x60), set_icon (80x80)
- **Emoji**: 白色版 90x90, 彩色版(飄浮) 60x60

### EventScene
- **事件窗口**: target_width=850, 按比例縮放高度
- **字體**: title=42px, desc=24px
- **選項按鈕**: 70px height, 20px spacing
- **顏色**: (50,50,50) → 0x323232

### DiaryScene
- **日記背景**: cream color (245, 235, 220) → 0xF5EBDC
- **字體**: title=48px, content=24px
- **內容區**: 寬度 SCREEN_WIDTH-200

## 動畫設定 (Animation Settings)

### Frame Delay
- **Python**: `frame_delay=3` → 每 3 幀換一次圖片 (30 FPS → 100ms)
- **Web**: `delay: 100` (毫秒)

### 角色尺寸對照
| 場景 | Python (px) | Web 縮放建議 |
|------|-------------|--------------|
| StartScene | 300x300 | scale based on 600x600 source |
| IntroScene | 240x220 | at (900, 50) |
| StoryScene | 220x200 | at (900, 50) |
| EndScene | 300x300 | at (50, 400) |
| MainScene | 預設 | center-right position |

## 顏色轉換對照

### RGB → Hex 轉換公式
```javascript
// Python: (R, G, B)
// Web: 0xRRGGBB
const rgbToHex = (r, g, b) => {
    return (r << 16) | (g << 8) | b;
};
```

### 透明度轉換
```javascript
// Python: alpha (0-255)
// Web: alpha (0-1)
const webAlpha = pythonAlpha / 255;
```

## 字體對照

| Python | Web |
|--------|-----|
| pygame.font.Font(..., 72) | fontSize: '72px' |
| pygame.font.Font(..., 54) | fontSize: '54px' |
| pygame.font.Font(..., 48) | fontSize: '48px' |
| pygame.font.Font(..., 36) | fontSize: '36px' |
| pygame.font.Font(..., 28) | fontSize: '28px' |
| pygame.font.Font(..., 24) | fontSize: '24px' |

## 位置計算

### 相對位置轉換
```javascript
// Python 絕對位置 (1200x800 屏幕)
// Web 相對位置 (響應式)
const webX = (pythonX / 1200) * width;
const webY = (pythonY / 800) * height;
```

## 待優化項目

1. ✅ **StoryScene** - 背景透明度已更新為 0.255
2. ✅ **StoryScene** - 字體大小和顏色已更新
3. ✅ **EndScene** - 字體大小已更新
4. ⏳ **IntroScene** - 遮罩透明度需進一步測試
5. ⏳ **StartScene** - 按鈕尺寸和間距待確認
6. ⏳ **CharacterSelectScene** - 卡片顏色需更新
7. ⏳ **EventScene** - 窗口尺寸 target_width=850 待應用
8. ⏳ **MainScene** - 狀態條顏色待精確匹配
9. ⏳ **所有場景** - 角色動畫尺寸和位置需逐一調整

## 測試檢查清單

- [ ] 背景透明度在所有場景中視覺效果一致
- [ ] 字體大小在不同解析度下可讀性良好
- [ ] 顏色在不同設備上顯示正確
- [ ] 動畫速度與 Python 版本同步
- [ ] 按鈕和互動元素大小適中
- [ ] 響應式布局在 1200x800 以外分辨率正常工作

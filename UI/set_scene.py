import pygame
import asyncio
from UI.components.base_scene import BaseScene
from UI.components.image_button import ImageButton
import setting
from UI.components.blur import fast_blur

class SetScene(BaseScene):
    def __init__(self, screen, blurred_bg, player):
        super().__init__(screen)
        self.player = player
        self.week_number = player.week_number

        self.blurred_bg = pygame.transform.scale(blurred_bg, screen.get_size())

        self.panel = pygame.image.load(setting.ImagePath.SET_PAGE_PATH).convert_alpha()
        self.panel = pygame.transform.scale(self.panel, screen.get_size())

        self.back_icon = pygame.image.load(setting.ImagePath.BACK_PATH).convert_alpha()
        self.back_icon = pygame.transform.smoothscale(self.back_icon, (80, 80))
        self.back_rect = self.back_icon.get_rect(topleft=(200, 157))
        self.back_hover = False

        # 👇 兩個 hover 放大圖片按鈕
        self.button1 = ImageButton(setting.ImagePath.BUTTON_PATH, (300, 95), size=(600, 450))
        self.button2 = ImageButton(setting.ImagePath.BUTTON_PATH, (300, 295), size=(600, 450))

        # 字體（週數）
        self.week_font = pygame.font.Font(setting.CFONT_PATH, 42)

    def draw_week_number(self):
        text = f"第 {self.week_number} 週"
        surface = self.week_font.render(text, True, (255, 245, 200))  # 淺黃色
        shadow = self.week_font.render(text, True, (100, 80, 60))
        x = self.SCREEN_WIDTH // 2 - surface.get_width() // 2
        y = 175
        self.screen.blit(shadow, (x + 2, y + 2))
        self.screen.blit(surface, (x, y))

    async def run(self):
        while self.running:
            await asyncio.sleep(0)
            self.screen.blit(self.blurred_bg, (0, 0))
            self.screen.blit(self.panel, (0, 0))
            self.draw_week_number()

            # hover 放大返回鍵
            mouse_pos = pygame.mouse.get_pos()
            self.back_hover = self.back_rect.collidepoint(mouse_pos)
            if self.back_hover:
                scaled = pygame.transform.scale(self.back_icon, (96, 96))
                rect = scaled.get_rect(center=self.back_rect.center)
                self.screen.blit(scaled, rect.topleft)
            else:
                self.screen.blit(self.back_icon, self.back_rect.topleft)

            # 更新＆畫圖片按鈕
            self.button1.update()
            self.button2.update()
            self.button1.draw(self.screen)
            self.button2.draw(self.screen)

            font1 = pygame.font.Font(setting.CFONT_PATH, 50)
            text1 = font1.render("音量調整", True, (50, 50, 50))
            text_rect1 = text1.get_rect(center=self.button1.rect.center)
            self.screen.blit(text1, text_rect1)


            font2 = pygame.font.Font(setting.CFONT_PATH, 50)
            text2 = font2.render("重新開始", True, (50, 50, 50))
            text_rect2 = text2.get_rect(center=self.button2.rect.center)
            self.screen.blit(text2, text_rect2)

            # 處理事件
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    return "QUIT"
                elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
                    if self.back_hover:
                        return "BACK"
                    elif self.button1.is_clicked(event):
                        from UI.sound_control_scene import SoundControlScene
                        sound_scene = SoundControlScene(self.screen)
                        await sound_scene.run()
                        continue
                    elif self.button2.is_clicked(event):
                        from UI.confirm_reborn_scene import ConfirmScene
                        new_blurred_bg = fast_blur(self.screen.copy())

                        confirm = ConfirmScene(self.screen, new_blurred_bg, self.player)
                        result = await confirm.run()
                        if result == "RESTART":
                            #print("[SetScene] 收到 RESTART,return 中")
                            return "RESTART"  # 回傳給外層 MainScene 處理跳轉邏輯
                        elif result == "BACK":
                            continue

            pygame.display.flip()
            self.clock.tick(self.FPS)
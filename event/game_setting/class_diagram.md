```mermaid
classDiagram
    class SceneManager {
        -screen
        -running
        -player
        -scene_map
        +run()
        +first_scene()
        +start_scene()
        +intro_scene()
        +character_select()
        +sound_control_scene()
        +main_game_loop()
        +story_and_event()
        +setting_scene()
        +end_scene()
        +rank_scene()
        +feedback_scene()
        +diary_scene()
        +advice_scene()
    }

    class AudioManager {
        -instance
        +get_instance()
        +play_sound(path)
        +play_bgm(path, loop)
        +stop_sound(path)
        +fade_out_bgm(ms)
        +set_bgm_volume(vol)
        +set_sound_volume(vol)
        +is_sound_playing(path)
        +play_sound_loop(path)
        +stop_bgm()
        +pause_bgm()
        +resume_bgm()
    }

    class BaseScene {
        -screen
        -running
        -clock
        -FPS
        -SCREEN_WIDTH
        -SCREEN_HEIGHT
        -audio : AudioManager
        +handle_event(event)
        +update()
        +draw()
        +run() async
    }

    class FirstScene {
        +run() async
    }
    class StartScene {
        +run() async
    }
    class CharacterSelectScene {
        +run() async
    }
    class MainScene {
        +run() async
    }
    class StoryScene {
        +run() async
        +update()
        +draw()
    }
    class EventScene {
        +run() async
    }
    class SetScene {
        +run() async
    }
    class EndScene {
        +run() async
    }
    class RankScene {
        +run() async
    }
    class FeedbackScene {
        +run() async
    }
    class SoundControlScene {
        +run() async
    }

    class DiaryScene {
        +run() async
    }

    class IntroScene {
        +run() async
    }

    class LuckyWheelScene {
        +run() async
    }

    class TakeTestScene {
        +run() async
    }

    class GradingScene {
        +run() async
    }

    class CharacterAnimator {
        -folder_path
        -position
        -size
        -frames
        -current_frame
        -frame_delay
        +update()
        +draw(screen)
        +switch_animation(path)
    }

    class Character {
        -name
        -chname
        -intelligence
        -mood
        -energy
        -social
        -knowledge
        -midterm
        -final
        -week_number
        -total_score
        -GPA
        -week_data
        -event_history
        -header
        -testing
        -taketest
        -ending
        +study(degree)
        +socialize(degree)
        +play_game(degree)
        +rest(degree)
        +get_midterm()
        +get_final()
        +calculate_GPA()
        +gif_choose()
    }
    class Bubu
    class Yier
    class Mitao
    class Huihui

    SceneManager --> FirstScene
    SceneManager --> StartScene
    SceneManager --> CharacterSelectScene
    SceneManager --> MainScene
    SceneManager --> StoryScene
    SceneManager --> EventScene
    SceneManager --> SetScene
    SceneManager --> EndScene
    SceneManager --> RankScene
    SceneManager --> FeedbackScene
    SceneManager --> SoundControlScene
    SceneManager --> DiaryScene
    SceneManager --> IntroScene
    SceneManager --> AdviceScene

    FirstScene --|> BaseScene
    StartScene --|> BaseScene
    CharacterSelectScene --|> BaseScene
    MainScene --|> BaseScene
    StoryScene --|> BaseScene
    EventScene --|> BaseScene
    SetScene --|> BaseScene
    EndScene --|> MainScene
    RankScene --|> BaseScene
    FeedbackScene --|> BaseScene
    SoundControlScene --|> BaseScene
    DiaryScene --|> BaseScene
    IntroScene --|> BaseScene
    LuckyWheelScene --|> BaseScene
    TakeTestScene --|> BaseScene
    GradingScene --|> BaseScene

    Character <|-- Bubu
    Character <|-- Yier
    Character <|-- Mitao
    Character <|-- Huihui

    SceneManager o-- Character
    MainScene o-- Character
    StoryScene o-- Character
    EventScene o-- Character
    EndScene o-- Character
    RankScene o-- Character
    FeedbackScene o-- Character
    BaseScene o-- AudioManager
    MainScene o-- CharacterAnimator
    StoryScene o-- CharacterAnimator
    EndScene o-- CharacterAnimator
    TakeTestScene o-- CharacterAnimator
    GradingScene o-- CharacterAnimator

    StoryScene --> LuckyWheelScene
    StoryScene --> TakeTestScene
    TakeTestScene --> GradingScene
```
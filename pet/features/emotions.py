"""
情感功能模块
处理桌面宠物的情感状态和表情变化
包括：心情切换、表情动画、睡眠状态等
"""

import os
import random
from typing import Optional
from datetime import datetime
from PyQt5.QtCore import QTimer, QDateTime
from PyQt5.QtGui import QPixmap, QMovie
from utils.constants import (
    MOODS, IMAGE_DIR, MOOD_CHANGE_PROBABILITY,
    SLEEP_TIMEOUT, MESSAGES
)

class EmotionManager:
    """情感管理器类"""
    
    def __init__(self, pet_widget):
        """
        初始化情感管理器
        Args:
            pet_widget: 桌面宠物窗口实例
        """
        self.pet = pet_widget
        self.current_mood = "normal"
        self.is_sleeping = False
        self.last_interaction = QDateTime.currentDateTime()
        
        # 加载表情图片
        self._load_emotions()
        
    def _load_emotions(self) -> None:
        """加载所有表情图片"""
        self.emotion_images = {}
        for mood, filename in MOODS.items():
            path = os.path.join(IMAGE_DIR, filename)
            if os.path.exists(path):
                if path.endswith('.gif'):
                    self.emotion_images[mood] = path  # GIF路径存储
                else:
                    self.emotion_images[mood] = QPixmap(path)
                if mood == "cry":
                    self.emotion_images[mood] = QPixmap(path)
            else:
                print(f"警告: 找不到表情图片 {path}")
                # 使用默认表情作为后备
                default_path = os.path.join(IMAGE_DIR, MOODS["normal"])
                if os.path.exists(default_path):
                    self.emotion_images[mood] = QPixmap(default_path)
    
    def change_mood(self, mood: str) -> None:
        """
        切换心情和表情
        Args:
            mood: 目标心情状态
        """
        if mood in self.emotion_images:
            self.current_mood = mood
            image = self.emotion_images[mood]
            
            if isinstance(image, str) and image.endswith('.gif'):
                # 处理GIF动画
                movie = QMovie(image)
                if movie.isValid():
                    self.pet.setMovie(movie)
                    movie.start()
            else:
                # 处理静态图片
                self.pet.setPixmap(
                    image.scaled(
                        self.pet.width(),
                        self.pet.height(),
                        aspectRatioMode=1,
                        transformMode=1
                    )
                )
    
    def try_random_mood_change(self) -> None:
        """尝试随机改变心情"""
        if (not self.is_sleeping and 
            random.random() < MOOD_CHANGE_PROBABILITY):
            available_moods = list(MOODS.keys())
            available_moods.remove("sleeping")
            if self.current_mood in available_moods:
                available_moods.remove(self.current_mood)
            
            if available_moods:
                self.change_mood(random.choice(available_moods))
    
    def update_interaction_time(self) -> None:
        """更新最后交互时间"""
        self.last_interaction = QDateTime.currentDateTime()
        if self.is_sleeping:
            self.wake_up()
    
    def check_sleep_state(self) -> None:
        """检查是否应该进入睡眠状态"""
        if not self.is_sleeping:
            current_time = QDateTime.currentDateTime()
            if self.last_interaction.secsTo(current_time) > SLEEP_TIMEOUT:
                self.sleep()
    
    def sleep(self) -> None:
        """进入睡眠状态"""
        self.is_sleeping = True
        self.change_mood("sleeping")
    
    def wake_up(self) -> None:
        """唤醒"""
        self.is_sleeping = False
        self.change_mood("normal")
    
    def get_random_message(self) -> str:
        """获取随机对话消息"""
        return random.choice(MESSAGES)
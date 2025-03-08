"""
移动功能模块
处理桌面宠物的各种移动行为，包括：
- 随机移动（包括上下移动）
- 跟随鼠标
- 逃跑和返回
- 头部碰撞检测
"""

from typing import Tuple, Optional
import random
from PyQt5.QtCore import QPoint, QTimer
from PyQt5.QtGui import QCursor
from PyQt5.QtWidgets import QWidget, QApplication
from pet.utils.constants import (
    MOVE_SPEED, RANDOM_MOVE_RANGE, FOLLOW_PROBABILITY,
    FOLLOW_INTERVAL, RUNAWAY_TIMEOUT, VERTICAL_MOVE_RANGE
)

# 最小移动距离阈值，小于这个距离就不移动
MIN_DISTANCE = 10

class MovementManager:
    """ 移动管理器类 """

    def __init__(self, pet_widget: QWidget):
        """
        初始化移动管理器
        Args:
            pet_widget: 需要进行移动管理的桌面宠物窗口
        """
        self.pet = pet_widget
        self.screen = QApplication.primaryScreen().geometry()
        self.is_following = False
        self.follow_timer = None
        self.last_y = 0  # 记录上一次的y坐标用于检测碰撞
        self.collision_cooldown = False  # 碰撞冷却状态

    def start_following_mouse(self) -> None:
        """ 开始跟随鼠标 """
        if not self.is_following:
            self.is_following = True
            self.follow_timer = QTimer(self.pet)
            self.follow_timer.timeout.connect(self._follow_mouse_step)
            self.follow_timer.start(FOLLOW_INTERVAL)

    def stop_following_mouse(self) -> None:
        """ 停止跟随鼠标 """
        if self.is_following:
            self.is_following = False
            if self.follow_timer:
                self.follow_timer.stop()
                self.follow_timer = None

    def _follow_mouse_step(self) -> None:
        """ 执行一步跟随鼠标的移动 """
        if random.random() < FOLLOW_PROBABILITY:
            cursor_pos = QCursor.pos()
            current_pos = self.pet.pos()

            # 计算水平和垂直方向的移动
            dx = cursor_pos.x() - current_pos.x()
            dy = cursor_pos.y() - current_pos.y()
            distance = (dx**2 + dy**2)**0.5

            if distance > MIN_DISTANCE:  # 只在距离足够大时移动
                dpi_scale = QApplication.primaryScreen().logicalDotsPerInch() / 96.0
                dx = (dx / distance * MOVE_SPEED * dpi_scale)
                dy = (dy / distance * MOVE_SPEED * dpi_scale)

                # 检查头部碰撞
                new_pos = self._clamp_position(current_pos.x() + dx, current_pos.y() + dy)
                if self._check_head_collision(new_pos[1]):
                    # 发生碰撞，向下移动一段距离
                    new_pos = (new_pos[0], new_pos[1] + 50)
                
                self.pet.move(int(new_pos[0]), int(new_pos[1]))
                self.last_y = new_pos[1]

    def random_move(self) -> None:
        """ 执行随机移动（包括上下移动）"""
        if not self.is_following and not self.collision_cooldown:
            current_pos = self.pet.pos()
            
            # 同时进行随机的水平和垂直移动
            x_offset = random.randint(*RANDOM_MOVE_RANGE)
            y_offset = random.randint(*VERTICAL_MOVE_RANGE)
            
            new_pos = self._clamp_position(
                current_pos.x() + x_offset, 
                current_pos.y() + y_offset
            )
            
            # 检查头部碰撞
            if self._check_head_collision(new_pos[1]):
                # 发生碰撞，向下移动一段距离
                new_pos = (new_pos[0], new_pos[1] + 50)
                # 设置碰撞冷却
                self.collision_cooldown = True
                QTimer.singleShot(1000, self._reset_collision_cooldown)
            
            self.pet.move(int(new_pos[0]), int(new_pos[1]))
            self.last_y = new_pos[1]

    def run_away(self) -> None:
        """ 执行逃跑动作，可以向任意方向逃跑 """
        # 随机选择一个逃跑方向（上下左右）
        dx = random.choice([-1, 1]) * self.screen.width() / 2
        dy = random.choice([-1, 1]) * self.screen.height() / 2
        
        new_pos = self._clamp_position(
            self.pet.x() + dx,
            self.pet.y() + dy
        )
        
        self.pet.move(int(new_pos[0]), int(new_pos[1]))
        QTimer.singleShot(RUNAWAY_TIMEOUT, self.come_back)

    def come_back(self) -> None:
        """ 从逃跑中返回到随机位置 """
        target_x = random.randint(0, self.screen.width() - self.pet.width())
        target_y = random.randint(0, self.screen.height() - self.pet.height())
        
        new_pos = self._clamp_position(target_x, target_y)
        self.pet.move(int(new_pos[0]), int(new_pos[1]))

    def _check_head_collision(self, new_y: float) -> bool:
        """
        检查是否发生头部碰撞
        Args:
            new_y: 新的y坐标
        Returns:
            bool: 是否发生碰撞
        """
        # 放宽碰撞检测的阈值，并确保发送信号
        if new_y < 30 and self.last_y > new_y and not self.collision_cooldown:
            self.pet.head_collision.emit()  # 发送头部碰撞信号
            self.collision_cooldown = True
            QTimer.singleShot(1000, self._reset_collision_cooldown)
            return True
        self.last_y = new_y
        return False

    def _reset_collision_cooldown(self) -> None:
        """重置碰撞冷却状态"""
        self.collision_cooldown = False

    def _clamp_position(self, x: float, y: float) -> Tuple[float, float]:
        """
        确保位置在屏幕范围内，允许完全移动到屏幕边缘
        Args:
            x: x坐标
            y: y坐标
        Returns:
            修正后的坐标元组 (x, y)
        """
        # 获取屏幕尺寸
        screen_width = self.screen.width()
        screen_height = self.screen.height()
        pet_width = self.pet.width()
        pet_height = self.pet.height()
        
        # 限制x坐标范围，考虑宠物宽度以允许完全移动到边缘
        x = max(0, min(x, screen_width - pet_width))
        
        # 限制y坐标范围，考虑宠物高度以允许完全移动到边缘
        y = max(0, min(y, screen_height - pet_height))
        
        return x, y

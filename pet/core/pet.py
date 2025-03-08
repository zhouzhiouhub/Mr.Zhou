"""
桌面宠物核心模块
整合所有功能模块，实现完整的桌面宠物功能
"""

import random
from PyQt5.QtWidgets import QLabel, QMenu, QAction, QApplication
from PyQt5.QtCore import Qt, QTimer, QPoint, QDateTime, pyqtSignal
from PyQt5.QtGui import QCursor

from pet.ui.bubble import ChatBubble
from pet.features.movement import MovementManager
from pet.features.emotions import EmotionManager
from pet.core.state import StateManager
from pet.utils.environment import get_environment_info
from pet.utils.constants import (
    WINDOW_SIZE, MOVE_INTERVAL, SLEEP_CHECK_INTERVAL,
    TALK_INTERVAL, TALK_PROBABILITY, MESSAGES,
    WEATHER_MESSAGES, TIME_MESSAGES, WEEKDAY_MESSAGES,
    HEADACHE_MESSAGES
)

class DesktopPet(QLabel):
    """桌面宠物主类"""
    
    # 添加头部碰撞信号
    wall_collision = pyqtSignal()
    head_collision = pyqtSignal()
    
    def __init__(self):
        super().__init__()
        self._setup_window()
        self._init_managers()
        self._setup_timers()
        self._setup_signals()
        # 添加点击计数器
        self.click_count = 0
        self.last_click_time = QDateTime.currentDateTime()
        
        # 显示初始环境信息
        self._show_environment_info()
        
        # 显示随机打招呼信息
        self._show_random_greeting()
    
    def _setup_window(self) -> None:
        """设置窗口属性"""
        # 设置窗口标志
        self.setWindowFlags(
            Qt.FramelessWindowHint | 
            Qt.WindowStaysOnTopHint | 
            Qt.SubWindow
        )
        self.setAttribute(Qt.WA_TranslucentBackground)
        
        # 设置窗口大小
        self.resize(*WINDOW_SIZE)
        
        # 初始化拖动相关变量
        self.dragging = False
        self.offset = QPoint()
    
    def _init_managers(self) -> None:
        """初始化各个功能管理器"""
        self.state_manager = StateManager()
        self.movement_manager = MovementManager(self)
        self.emotion_manager = EmotionManager(self)
        
        # 获取屏幕尺寸
        screen = QApplication.primaryScreen().geometry()
        
        # 恢复上次位置或设置完全随机的初始位置
        last_pos = self.state_manager.get_last_position()
        if last_pos:
            self.move(*last_pos)
        else:
            x = random.randint(0, screen.width() - self.width())
            y = random.randint(0, screen.height() - self.height())
            self.move(x, y)
    
    def _setup_timers(self) -> None:
        """设置定时器"""
        # 随机移动定时器
        self.move_timer = QTimer(self)
        self.move_timer.timeout.connect(self._on_move_timer)
        self.move_timer.start(MOVE_INTERVAL)
        
        # 睡眠检查定时器
        self.sleep_timer = QTimer(self)
        self.sleep_timer.timeout.connect(self._on_sleep_timer)
        self.sleep_timer.start(SLEEP_CHECK_INTERVAL)
        
        # 说话定时器
        self.talk_timer = QTimer(self)
        self.talk_timer.timeout.connect(self._on_talk_timer)
        self.talk_timer.start(TALK_INTERVAL)
    
    def _setup_signals(self) -> None:
        """设置信号连接"""
        self.wall_collision.connect(self._on_wall_collision)
        self.head_collision.connect(self._on_head_collision)
    
    def _on_wall_collision(self) -> None:
        """处理墙壁碰撞事件"""
        message = random.choice(MESSAGES)
        self._show_message(message)
        self.emotion_manager.change_mood("cry")
    
    def _on_head_collision(self) -> None:
        """处理头部碰撞事件"""
        message = random.choice(HEADACHE_MESSAGES)
        print(f"显示消息: {message}")  # 调试信息
        # 在头部下方显示消息
        bubble = ChatBubble(message, self)
        bubble.adjustSize()
        pos = self.pos()
        bubble_x = pos.x() + (self.width() - bubble.width()) // 2
        bubble_y = pos.y() + self.height() + 10  # 将消息气泡显示在下方
        print(f"气泡位置: ({bubble_x}, {bubble_y})")  # 调试信息
        bubble.show_at_position(QPoint(bubble_x, bubble_y))
        self.emotion_manager.change_mood("cry")
        # 添加定时器，在一段时间后恢复表情
        QTimer.singleShot(3000, lambda: self.emotion_manager.change_mood("normal"))
    
    def _show_message(self, message: str) -> None:
        """显示消息气泡"""
        print(f"显示消息气泡: {message}")  # 调试信息
        bubble = ChatBubble(message, self)
        bubble.adjustSize()
        pos = self.pos()
        bubble_x = pos.x() + (self.width() - bubble.width()) // 2
        bubble_y = pos.y() - bubble.height() - 10
        print(f"气泡位置: ({bubble_x}, {bubble_y}) 大小: {bubble.size()}")  # 调试信息
        bubble.show_at_position(QPoint(bubble_x, bubble_y))
        print(f"气泡透明度: {bubble.windowOpacity()}")  # 调试信息
    
    def _show_environment_info(self) -> None:
        """显示环境信息"""
        env_info = get_environment_info()
        
        # 显示天气信息
        weather = env_info['weather']
        if (weather in WEATHER_MESSAGES):
            QTimer.singleShot(1000, lambda: self._show_message(
                random.choice(WEATHER_MESSAGES[weather])
            ))
        
        # 显示时间信息
        time_period = env_info['time']
        if (time_period in TIME_MESSAGES):
            QTimer.singleShot(3000, lambda: self._show_message(
                random.choice(TIME_MESSAGES[time_period])
            ))
        
        # 显示星期信息
        weekday = env_info['weekday']
        if (weekday in WEEKDAY_MESSAGES):
            QTimer.singleShot(5000, lambda: self._show_message(
                random.choice(WEEKDAY_MESSAGES[weekday])
            ))
        
        # 显示打招呼信息
        QTimer.singleShot(7000, lambda: self._show_message(
            random.choice(MESSAGES)
        ))
    
    def _show_random_greeting(self) -> None:
        """显示随机打招呼信息"""
        greeting = random.choice(MESSAGES)
        self._show_message(greeting)
    
    def mousePressEvent(self, event) -> None:
        """鼠标按下事件处理"""
        if (event.button() == Qt.LeftButton):
            self.dragging = True
            self.offset = event.globalPos() - self.pos()
            self._handle_left_click()
        elif (event.button() == Qt.RightButton):
            self._show_menu()
    
    def mouseMoveEvent(self, event) -> None:
        """鼠标移动事件处理"""
        if (self.dragging):
            new_pos = event.globalPos() - self.offset
            clamped_pos = self.movement_manager._clamp_position(new_pos.x(), new_pos.y())
            self.move(int(clamped_pos[0]), int(clamped_pos[1]))
    
    def mouseReleaseEvent(self, event) -> None:
        """鼠标释放事件处理"""
        if (self.dragging):
            self.dragging = False
            # 保存当前位置
            self.state_manager.save_state((self.x(), self.y()))
    
    def _handle_left_click(self) -> None:
        """处理左键点击"""
        current_time = QDateTime.currentDateTime()
        
        # 检查是否是快速点击（1秒内的点击）
        if (self.last_click_time.msecsTo(current_time) < 1000):
            self.click_count += 1
            # 如果快速点击超过5次，生气并逃跑
            if (self.click_count > 5):
                self.emotion_manager.change_mood("angry")
                QTimer.singleShot(1000, self.movement_manager.run_away)
                self.click_count = 0  # 重置点击计数
        else:
            self.click_count = 1  # 重置点击计数
        
        self.last_click_time = current_time
        self.emotion_manager.update_interaction_time()
        self.state_manager.save_state((self.x(), self.y()))
    
    def _show_menu(self) -> None:
        """显示右键菜单"""
        menu = QMenu(self)
        
        # 添加表情切换菜单
        emotions_menu = menu.addMenu("切换表情")
        for mood in self.emotion_manager.emotion_images.keys():
            action = QAction(mood, self)
            action.triggered.connect(
                lambda x, m=mood: self.emotion_manager.change_mood(m)
            )
            emotions_menu.addAction(action)
        
        # 添加鼠标跟随选项
        follow_text = "停止跟随" if self.movement_manager.is_following else "跟随鼠标"
        follow_action = QAction(follow_text, self)
        follow_action.triggered.connect(self._toggle_following)
        menu.addAction(follow_action)
        
        # 添加退出选项
        exit_action = QAction("退出", self)
        exit_action.triggered.connect(self.close)
        menu.addAction(exit_action)
        
        menu.exec_(QCursor.pos())
    
    def _toggle_following(self) -> None:
        """切换鼠标跟随状态"""
        if (self.movement_manager.is_following):
            self.movement_manager.stop_following_mouse()
            self.move_timer.start()
        else:
            self.movement_manager.start_following_mouse()
            self.move_timer.stop()
    
    def _on_move_timer(self) -> None:
        """移动定时器回调"""
        self.movement_manager.random_move()
        self.emotion_manager.try_random_mood_change()
    
    def _on_sleep_timer(self) -> None:
        """睡眠定时器回调"""
        self.emotion_manager.check_sleep_state()
    
    def _on_talk_timer(self) -> None:
        """说话定时器回调"""
        if (not self.emotion_manager.is_sleeping and 
            random.random() < TALK_PROBABILITY):
            # 随机选择消息类型
            message_type = random.choice(['weather', 'time', 'weekday', 'normal'])
            env_info = get_environment_info()
            
            if (message_type == 'weather' and env_info['weather'] in WEATHER_MESSAGES):
                message = random.choice(WEATHER_MESSAGES[env_info['weather']])
            elif (message_type == 'time' and env_info['time'] in TIME_MESSAGES):
                message = random.choice(TIME_MESSAGES[env_info['time']])
            elif (message_type == 'weekday' and env_info['weekday'] in WEEKDAY_MESSAGES):
                message = random.choice(WEEKDAY_MESSAGES[env_info['weekday']])
            else:
                message = random.choice(MESSAGES)
            
            self._show_message(message)
    
    def closeEvent(self, event) -> None:
        """关闭事件处理"""
        # 保存状态
        self.state_manager.save_state((self.x(), self.y()))
        
        # 停止所有定时器
        if (self.move_timer):
            self.move_timer.stop()
        if (self.sleep_timer):
            self.sleep_timer.stop()
        if (self.talk_timer):
            self.talk_timer.stop()
        if (self.movement_manager.follow_timer):
            self.movement_manager.stop_following_mouse()
            
        # 接受关闭事件
        event.accept()
        
        # 退出应用程序
        QApplication.instance().quit()
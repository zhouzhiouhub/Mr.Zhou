from PyQt5.QtWidgets import QLabel, QWidget, QVBoxLayout
from PyQt5.QtGui import QPainter, QColor, QPainterPath, QFont
from PyQt5.QtCore import Qt, QPropertyAnimation, QRect, QEasingCurve, QTimer, QPoint
from pet.utils.constants import (
    BUBBLE_STYLE, BUBBLE_SHOW_DURATION, BUBBLE_CLOSE_DURATION
)

class BubbleLabel(QLabel):
    """气泡标签类，实现气泡的视觉效果"""
    
    def __init__(self, text: str, parent=None):
        super().__init__(parent)
        self._setup_ui(text)
    
    def _setup_ui(self, text: str) -> None:
        """设置UI样式"""
        self.setText(text)
        self.setWordWrap(True)
        self.setAlignment(Qt.AlignCenter)
        
        # 设置字体
        font = QFont("微软雅黑", 10)
        self.setFont(font)
        
        # 自动调整大小
        self.adjustSize()
        self.setStyleSheet(BUBBLE_STYLE)
        print(f"BubbleLabel 大小: {self.size()}")  # 调试信息
    
    def paintEvent(self, event):
        """绘制气泡"""
        painter = QPainter(self)
        painter.setRenderHint(QPainter.Antialiasing)
        
        # 绘制气泡形状
        path = QPainterPath()
        path.addRoundedRect(0, 0, self.width(), self.height(), 10, 10)
        
        # 绘制主体
        painter.setBrush(QColor("#FFE4E1"))
        painter.drawPath(path)
        
        super().paintEvent(event)

class ChatBubble(QWidget):
    """聊天气泡窗口类，处理气泡的显示、动画和关闭"""
    
    def __init__(self, text: str, parent=None):
        super().__init__(parent)
        self._setup_window()
        self._setup_ui(text)
        self._setup_animation()
    
    def _setup_window(self) -> None:
        """设置窗口属性"""
        self.setWindowFlags(Qt.FramelessWindowHint | Qt.WindowStaysOnTopHint | Qt.SubWindow)
        self.setAttribute(Qt.WA_TranslucentBackground)
    
    def _setup_ui(self, text: str) -> None:
        """设置UI布局"""
        layout = QVBoxLayout()
        self.label = BubbleLabel(text, self)
        layout.addWidget(self.label)
        layout.setContentsMargins(10, 10, 10, 10)  # 适当调整边距
        self.setLayout(layout)
        
        # 自动适应文本大小
        self.label.adjustSize()
        self.adjustSize()  # 让气泡窗口匹配内容
        print(f"ChatBubble 大小: {self.size()}")  # 调试信息
    
    def _setup_animation(self) -> None:
        """设置动画"""
        self.show_animation = QPropertyAnimation(self, b"geometry")
        self.show_animation.setDuration(BUBBLE_SHOW_DURATION)
        self.show_animation.setEasingCurve(QEasingCurve.OutBounce)
    
    def show_at_position(self, pos: QPoint) -> None:
        """
        在指定位置显示气泡
        Args:
            pos: 显示位置
        """
        self.label.adjustSize()
        self.adjustSize()
        self.move(pos)  # 直接移动到正确位置

        # 触发动画
        start_pos = QRect(
            pos.x(),
            pos.y(),
            self.width(),
            self.height()
        )
        end_pos = start_pos
        self.show_animation.setStartValue(start_pos)
        self.show_animation.setEndValue(end_pos)
        print(f"气泡开始位置: {start_pos}")  # 调试信息
        print(f"气泡结束位置: {end_pos}")  # 调试信息
        self.setWindowOpacity(1.0)  # 显式设置透明度
        self.show()
        self.raise_()
        self.show_animation.start()
        print("气泡已显示，透明度: {self.windowOpacity()}")  # 调试信息
        print(f"气泡位置: {self.pos()} 大小: {self.size()}")  # 调试信息
        
        # 自动关闭
        QTimer.singleShot(3000, self.close_with_animation)
    
    def close_with_animation(self) -> None:
        """带动画效果的关闭"""
        close_anim = QPropertyAnimation(self, b"geometry")
        close_anim.setDuration(BUBBLE_CLOSE_DURATION)
        
        # 消失动画
        close_anim.setStartValue(self.geometry())
        close_anim.setEndValue(QRect(self.x(), self.y() - 20, self.width(), self.height()))
        close_anim.finished.connect(self.close)
        close_anim.start()

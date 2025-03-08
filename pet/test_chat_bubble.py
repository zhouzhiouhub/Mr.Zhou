import sys
from PyQt5.QtWidgets import QApplication, QWidget, QPushButton
from PyQt5.QtCore import QPoint
import os

# 获取当前文件的绝对路径
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)  # 获取 pet 目录的父级目录
sys.path.insert(0, parent_dir)  # 将父目录添加到 sys.path

from pet.ui.bubble import ChatBubble  # 现在可以正确导入


class TestWindow(QWidget):
    """测试 ChatBubble 的窗口"""
    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowTitle("ChatBubble 测试")
        self.setGeometry(100, 100, 400, 300)  # 设置窗口大小

        # 按钮触发气泡显示
        self.button = QPushButton("显示气泡", self)
        self.button.setGeometry(150, 130, 100, 40)
        self.button.clicked.connect(self.show_bubble)

    def show_bubble(self):
        """在按钮上方显示气泡"""
        text = "你好！我是一个动态调整大小的气泡！"  # 长度不同的文本都能正确适应
        bubble = ChatBubble(text, self)
        bubble.adjustSize()  # 让窗口匹配内容大小
        
        # 计算相对窗口的全局坐标
        button_pos = self.button.mapToGlobal(QPoint(0, 0))
        bubble_x = button_pos.x() + (self.button.width() - bubble.width()) // 2
        bubble_y = button_pos.y() - bubble.height() - 10  # 放在按钮上方

        bubble.show_at_position(QPoint(bubble_x, bubble_y))


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = TestWindow()
    window.show()
    sys.exit(app.exec_())

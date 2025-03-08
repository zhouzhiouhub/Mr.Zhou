"""
桌面宠物程序入口
实现一个可爱的桌面宠物，具有以下功能：
- 拖动和跟随鼠标
- 随机移动和表情变化
- 互动对话
- 睡眠状态
- 状态保存
"""

import sys
import os

# Add the project root directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pet.core.pet import DesktopPet
from PyQt5.QtWidgets import QApplication

def main():
    """程序入口函数"""
    # 创建应用实例
    app = QApplication(sys.argv)
    
    # 创建桌面宠物实例
    pet = DesktopPet()
    pet.show()
    
    # 运行应用
    sys.exit(app.exec_())

if __name__ == '__main__':
    main()

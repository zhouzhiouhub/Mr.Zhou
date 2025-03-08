"""
桌面宠物单元测试
测试核心功能的正确性
"""

import sys
import unittest
from PyQt5.QtWidgets import QApplication
from PyQt5.QtCore import QPoint, Qt, QTimer
from core.pet import DesktopPet
from features.emotions import EmotionManager
from features.movement import MovementManager
from core.state import StateManager

class TestDesktopPet(unittest.TestCase):
    """桌面宠物测试类"""
    
    @classmethod
    def setUpClass(cls):
        """测试前创建QApplication实例"""
        cls.app = QApplication(sys.argv)
    
    def setUp(self):
        """每个测试前创建宠物实例"""
        self.pet = DesktopPet()
    
    def test_initialization(self):
        """测试初始化"""
        self.assertIsNotNone(self.pet.emotion_manager)
        self.assertIsNotNone(self.pet.movement_manager)
        self.assertIsNotNone(self.pet.state_manager)
    
    def test_movement(self):
        """测试移动功能"""
        initial_pos = self.pet.pos()
        self.pet.movement_manager.random_move()
        self.assertNotEqual(initial_pos, self.pet.pos())
    
    def test_emotion_change(self):
        """测试情感变化"""
        initial_mood = self.pet.emotion_manager.current_mood
        self.pet.emotion_manager.change_mood("happy")
        self.assertEqual(self.pet.emotion_manager.current_mood, "happy")
    
    def test_state_save_load(self):
        """测试状态保存和加载"""
        test_pos = (100, 100)
        self.pet.move(*test_pos)
        self.pet.state_manager.save_state(test_pos)
        
        # 创建新的状态管理器来测试加载
        new_state = StateManager()
        loaded_pos = new_state.get_last_position()
        self.assertEqual(loaded_pos, test_pos)
    
    def test_sleep_wake(self):
        """测试睡眠功能"""
        self.pet.emotion_manager.sleep()
        self.assertTrue(self.pet.emotion_manager.is_sleeping)
        self.pet.emotion_manager.wake_up()
        self.assertFalse(self.pet.emotion_manager.is_sleeping)
    
    def test_mouse_following(self):
        """测试鼠标跟随"""
        self.pet.movement_manager.start_following_mouse()
        self.assertTrue(self.pet.movement_manager.is_following)
        self.pet.movement_manager.stop_following_mouse()
        self.assertFalse(self.pet.movement_manager.is_following)

if __name__ == '__main__':
    unittest.main()
"""
状态管理模块
负责处理桌面宠物的状态保存和加载
包括：上次互动时间、互动次数、位置记忆等
"""

import json
from datetime import datetime
from typing import Dict, Any, Optional
from utils.constants import STATE_FILE, DEFAULT_STATE

class StateManager:
    """状态管理器类"""
    
    def __init__(self):
        """初始化状态管理器"""
        self.state: Dict[str, Any] = self.load_state()
    
    def load_state(self) -> Dict[str, Any]:
        """
        加载状态文件
        Returns:
            Dict[str, Any]: 状态数据字典
        """
        try:
            with open(STATE_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            return DEFAULT_STATE.copy()
    
    def save_state(self, position: Optional[tuple] = None) -> None:
        """
        保存当前状态
        Args:
            position: 当前位置坐标 (x, y)
        """
        self.state['last_interaction'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        self.state['interaction_count'] += 1
        
        if position:
            self.state['favorite_position'] = {'x': position[0], 'y': position[1]}
            
        with open(STATE_FILE, 'w', encoding='utf-8') as f:
            json.dump(self.state, f, ensure_ascii=False, indent=2)
    
    def get_interaction_count(self) -> int:
        """获取互动次数"""
        return self.state['interaction_count']
    
    def get_last_position(self) -> Optional[tuple]:
        """获取上次保存的位置"""
        pos = self.state.get('favorite_position')
        if pos:
            return (pos['x'], pos['y'])
        return None
    
    def get_last_interaction_time(self) -> Optional[datetime]:
        """获取上次互动时间"""
        last_time = self.state.get('last_interaction')
        if last_time:
            return datetime.strptime(last_time, '%Y-%m-%d %H:%M:%S')
        return None
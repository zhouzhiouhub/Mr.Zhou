"""
常量定义模块
包含所有配置项和常量值
"""

from typing import Dict, List
import os

# 路径配置
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGE_DIR = os.path.join(BASE_DIR, "image")
STATE_FILE = os.path.join(BASE_DIR, "pet_state.json")

# 窗口配置
WINDOW_SIZE = (200, 200)
BUBBLE_WIDTH = 200

# 时间配置（毫秒）
MOVE_INTERVAL = 3000  # 随机移动间隔
SLEEP_CHECK_INTERVAL = 10000  # 睡眠检查间隔
TALK_INTERVAL = 30000  # 说话间隔
FOLLOW_INTERVAL = 16  # 减少跟随间隔到约60fps
SLEEP_TIMEOUT = 30  # 睡眠超时（秒）
RUNAWAY_TIMEOUT = 5000  # 逃跑后返回时间

# 动画配置
BUBBLE_SHOW_DURATION = 500
BUBBLE_CLOSE_DURATION = 200
BUBBLE_DISPLAY_TIME = 0  # 设置为0表示不自动消失

# 概率配置
FOLLOW_PROBABILITY = 0.8  # 跟随鼠标概率
TALK_PROBABILITY = 0.3  # 说话概率
MOOD_CHANGE_PROBABILITY = 0.1  # 心情改变概率

# 移动配置
MOVE_SPEED = 25  # 增加移动速度
RANDOM_MOVE_RANGE = (-20, 20)
VERTICAL_MOVE_RANGE = (-30, 30)  # 垂直移动范围

# 表情配置
MOODS: Dict[str, str] = {
    "normal": "1.png",
    "happy": "happy.png",
    "angry": "angry.png",
    "sleeping": "sleeping.png",
    "surprised": "surprised.png",
    "cry": "cry.png"
}

# 对话内容
MESSAGES: List[str] = [
    "主人好呀~ ❤",
    "我好无聊啊... 😢",
    "要不要一起玩游戏？🎮",
    "主人，该休息了！😴",
]

# 天气相关消息
WEATHER_MESSAGES = {
    '晴天': ['今天阳光真好呢！☀', '是个适合出门的好天气~'],
    '多云': ['今天天气还不错呢！⛅', '云朵就像棉花糖一样~'],
    '阴天': ['今天天气有点阴沉呢 😕', '希望明天能放晴~'],
    '小雨': ['下雨了，记得带伞哦！🌧', '淅淅沥沥的雨声好安静~'],
    '大雨': ['外面在下大雨呢，注意安全！⛈', '待在家里最舒服啦~']
}

# 时间相关消息
TIME_MESSAGES = {
    '早上': ['早上好呀！该吃早餐啦 🌅', '今天也要元气满满哦！'],
    '中午': ['午安，记得按时吃饭哦 🌞', '要不要小睡一会儿？'],
    '下午': ['下午好，来杯下午茶吧 ☕', '工作累了记得休息~'],
    '晚上': ['晚上好，今天过得怎么样？🌙', '早点休息哦~'],
    '深夜': ['这么晚还不睡吗？😴', '熬夜对身体不好哦，快去睡觉吧']
}

# 星期相关消息
WEEKDAY_MESSAGES = {
    '星期一': ['新的一周开始啦，加油！💪', '周一也要保持好心情哦~'],
    '星期二': ['今天是周二，继续加油！', '一周才刚刚开始呢~'],
    '星期三': ['周三啦，已经过半啦 ⭐', '再坚持两天就周末啦！'],
    '星期四': ['周四了，马上就周末啦 🎵', '今天也要元气满满！'],
    '星期五': ['周五啦！开心Weekend！🎉', '等待已久的周末要来啦~'],
    '星期六': ['周六真是悠闲的一天呢~ 🎮', '今天想做些什么呢？'],
    '星期日': ['周日要开心哦！☀', '好好享受假日时光吧~']
}

# 头部碰撞消息
HEADACHE_MESSAGES = [
    "好痛啊！撞到头了... 😣",
    "哎呀，头顶好痛 >_<",
    "撞到天花板了... 😫",
    "呜呜，头好痛 😢"
]

# 位置状态配置
WALL_COLLISION_TIMEOUT = 1000  # 碰撞后的恢复时间（毫秒）

# UI配置
BUBBLE_STYLE = """
    QLabel {
        background-color: #FFE4E1;
        border-radius: 10px;
        padding: 10px;
        color: #4A4A4A;
    }
"""

# 状态配置
DEFAULT_STATE = {
    'last_interaction': '',
    'interaction_count': 0,
    'favorite_position': None
}
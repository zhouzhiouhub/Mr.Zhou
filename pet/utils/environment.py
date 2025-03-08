"""
环境信息模块
获取天气、时间等环境信息
"""

import datetime
import random
import requests
from typing import Tuple, Dict

def get_weekday() -> str:
    """获取当前星期几"""
    weekdays = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
    return weekdays[datetime.datetime.now().weekday()]

def get_time() -> str:
    """获取当前时间"""
    now = datetime.datetime.now()
    if 5 <= now.hour < 12:
        return "早上"
    elif 12 <= now.hour < 14:
        return "中午"
    elif 14 <= now.hour < 18:
        return "下午"
    elif 18 <= now.hour < 23:
        return "晚上"
    else:
        return "深夜"

def get_weather() -> str:
    """获取天气信息(模拟)"""
    weathers = ['晴天', '多云', '阴天', '小雨', '大雨']
    return random.choice(weathers)

def get_environment_info() -> Dict[str, str]:
    """获取环境信息"""
    return {
        'weekday': get_weekday(),
        'time': get_time(),
        'weather': get_weather()
    }
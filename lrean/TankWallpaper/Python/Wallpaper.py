import os
import platform
import subprocess
from pathlib import Path
from PIL import Image, ImageColor

# 获取当前桌面壁纸
def get_current_wallpaper():
    system_name = platform.system()

    if system_name == "Windows":
        import winreg
        key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Control Panel\Desktop")
        value, _ = winreg.QueryValueEx(key, "WallPaper")
        return value
    elif system_name == "Darwin":  # macOS
        result = subprocess.run(
            ["osascript", "-e", 'tell application "Finder" to get POSIX path of (get desktop picture as alias)'],
            capture_output=True,
            text=True,
        )
        return result.stdout.strip()
    elif system_name == "Linux":
        return None  # Linux 可能没有统一的获取方式
    else:
        return None

# 解析颜色（支持颜色名称和 #RRGGBB 格式）
def parse_color(color_input):
    try:
        return ImageColor.getrgb(color_input)
    except ValueError:
        print("无效颜色，请输入颜色名称（如 'red'）或 HEX 代码（如 '#FF5733'）")
        return None

# 生成纯色壁纸
def generate_solid_color_wallpaper(color, width=1920, height=1080):
    img = Image.new("RGB", (width, height), color)
    wallpaper_path = Path.cwd() / "temp_wallpaper.png"
    img.save(wallpaper_path)
    return str(wallpaper_path)

# 设置壁纸
def set_wallpaper(image_path):
    system_name = platform.system()
    image_path = str(image_path)

    if system_name == "Windows":
        import ctypes
        ctypes.windll.user32.SystemParametersInfoW(20, 0, image_path, 3)
    elif system_name == "Darwin":  # macOS
        os.system(f"osascript -e 'tell application \"Finder\" to set desktop picture to POSIX file \"{image_path}\"'")
    elif system_name == "Linux":
        os.system(f"feh --bg-scale '{image_path}'")  # 需要安装 feh
    else:
        print("Unsupported OS")

# 还原原始壁纸
def restore_wallpaper(original_wallpaper):
    if original_wallpaper:
        set_wallpaper(original_wallpaper)

# 主程序
if __name__ == "__main__":
    original_wallpaper = get_current_wallpaper()
    current_color = (255, 255, 255)  # 默认白色

    try:
        while True:
            user_input = input("请输入颜色（回车使用当前颜色）： ").strip()
            if user_input:
                new_color = parse_color(user_input)
                if new_color:
                    current_color = new_color
            
            temp_wallpaper = generate_solid_color_wallpaper(current_color)
            print(f"设置新壁纸: {temp_wallpaper}")
            set_wallpaper(temp_wallpaper)
    except KeyboardInterrupt:
        print("\n正在恢复原始壁纸...")
        restore_wallpaper(original_wallpaper)
        print("壁纸已恢复。")

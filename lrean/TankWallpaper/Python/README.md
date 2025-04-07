# 纯色壁纸生成器使用手册

## 简介
这是一个简单易用的纯色壁纸生成器，可以快速将桌面壁纸更换为任何纯色背景。
支持Windows、macOS和Linux操作系统。

## 功能
1. 生成纯色壁纸并设置为桌面背景
2. 支持通过颜色名称或十六进制颜色代码选择颜色
3. 自动保存原始壁纸，程序结束后可恢复

## 系统要求
- Python 3.6+
- PIL (Pillow) 库: `pip install pillow`
- 对于Linux系统，需要安装feh: `sudo apt-get install feh`

## 使用方法
1. 运行程序: `python Wallpaper.py`
2. 程序启动后，在提示符处输入颜色
   - 可以使用颜色名称，如: red, blue, green
   - 可以使用十六进制代码，如: #FF5733, #4286f4
   - 按回车使用当前颜色
3. 程序会立即将桌面壁纸更改为指定颜色
4. 可连续输入不同颜色进行更改
5. 按Ctrl+C可退出程序并恢复原始壁纸

## 颜色示例
- 基本颜色: red, green, blue, yellow, cyan, magenta, black, white
- 十六进制颜色: #FF0000(红), #00FF00(绿), #0000FF(蓝)

## 注意事项
1. 程序会在当前目录生成临时壁纸文件(temp_wallpaper.png)
2. 按Ctrl+C退出程序时会自动恢复原始壁纸
3. 如果程序意外关闭，原始壁纸可能不会自动恢复

## 作者信息
- 作者：Mr.Zhou
- 联系方式：zhouzhiou9588@163.com
- 项目地址：https://github.com/zhouzhiouhub/Mr.Zhou/tree/main/lrean/TankWallpaper/Python
- 最后更新：2025年4月7日
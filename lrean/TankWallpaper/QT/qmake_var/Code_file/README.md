# TankWallpaper 纯色壁纸生成器

## 简介

TankWallpaper是一个简单实用的纯色壁纸生成工具，能够快速将您的桌面壁纸更换为任意纯色背景。该工具使用Qt框架开发，提供了简洁直观的图形用户界面，适合所有类型的用户使用。

## 功能特点

- 生成纯色壁纸并立即应用到桌面
- 支持通过颜色名称或十六进制代码选择颜色
- 内置颜色选择对话框，方便直观地选择颜色
- 自动保存原始壁纸，可随时一键恢复
- 应用程序退出时自动恢复原始壁纸
- 跨平台支持(Windows, macOS, Linux)

## 系统要求

- Qt 5.15.2或更高版本
- 支持的操作系统：
  - Windows系统
  - macOS系统
  - Linux系统(需安装feh)

## 编译与安装

### 在Windows上使用Qt Creator编译

1. 安装Qt Creator和Qt 5.15.2或更高版本
2. 打开Qt Creator
3. 选择"文件" > "打开文件或项目"，然后选择qmake_var.pro文件
4. 配置项目
5. 点击构建按钮(Ctrl+B)编译项目
6. 点击运行按钮(Ctrl+R)运行应用程序

### 在命令行编译(所有平台)

```bash
cd /path/to/TankWallpaper/QT/qmake_var/Code_file
qmake
make (在Windows上使用nmake或mingw32-make)
```

## 使用方法

1. 启动应用程序，会出现一个简洁的用户界面
2. 可以通过以下两种方式选择颜色：
   - 在文本框中输入颜色名称(如"red"、"blue")或十六进制颜色代码(如"#FF5733")
   - 点击"Choose Color"按钮打开颜色选择对话框，直观地选择颜色
3. 点击"Apply Wallpaper"按钮应用所选颜色作为桌面壁纸
4. 如需恢复原始壁纸，点击"Restore Original"按钮
5. 应用程序底部的状态标签会显示操作结果

## 支持的颜色格式

- 标准颜色名称：red, green, blue, yellow, cyan, magenta, black, white等
- 十六进制颜色代码：#RGB或#RRGGBB格式，如#F00(红色)，#00FF00(绿色)

## 工作原理

1. 应用程序启动时自动保存当前壁纸路径
2. 根据用户选择生成纯色图像并保存为临时文件
3. 使用系统API设置生成的图像为桌面壁纸
4. 应用程序关闭时自动恢复原始壁纸

## 注意事项

1. 程序会在当前目录生成临时壁纸文件(temp_wallpaper.png)
2. 程序正常关闭时会自动恢复原始壁纸
3. 如果程序异常终止，可能需要手动恢复原始壁纸
4. 在Linux系统上需要安装feh工具以支持壁纸设置

## 许可证

该项目使用MIT许可证，详情请参阅项目根目录下的LICENSE文件。

## 联系方式

如有问题或建议，请通过以下方式联系：

- 项目主页：[https://github.com/yourusername/TankWallpaper](https://github.com/yourusername/TankWallpaper)
- 电子邮件：your.email@example.com
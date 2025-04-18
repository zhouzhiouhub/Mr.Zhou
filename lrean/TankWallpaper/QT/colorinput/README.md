# Color Input 程序

## 项目简介

Color Input 是一个基于 Qt 开发的颜色管理与背景变换工具，允许用户选择、管理多种颜色并实现背景颜色的动态变化效果。该程序适用于需要测试或展示颜色变化效果的场景。

## 功能特性

- **多颜色选择**：支持选择多种颜色并添加到颜色列表
- **颜色管理**：可以添加、删除和查看颜色列表
- **动态颜色切换**：提供两种颜色切换模式
  - 快速切换：直接在不同颜色间切换
  - 平滑过渡：颜色之间平滑渐变过渡
- **直观的用户界面**：颜色以可视化方式展示，操作简单直观

## 系统要求

- Windows 操作系统
- 支持 Qt 应用程序运行的环境

## 目录结构

```
colorinput/
├── Code_file/               # 源代码文件
│   ├── colorinput.pro       # Qt 项目文件
│   ├── main.cpp             # 程序入口
│   ├── mainwindow.cpp       # 主窗口实现
│   ├── mainwindow.h         # 主窗口头文件
│   ├── mainwindow.ui        # 用户界面设计文件
│   ├── MultiColorDialog.cpp # 多颜色选择对话框实现
│   └── MultiColorDialog.h   # 多颜色选择对话框头文件
└── Exe_file/                # 可执行文件
    └── colorinput.exe       # 程序可执行文件
```

## 快速开始

1. 进入 `Exe_file` 文件夹
2. 双击运行 `colorinput.exe`
3. 使用"选择多颜色"按钮添加颜色
4. 点击"应用"按钮将颜色添加到活动列表
5. 选择"快速切换"或"平滑过渡"模式启动颜色变化
6. 使用"停止"按钮可随时停止颜色变化

## 使用指南

### 添加颜色

1. 点击"选择多颜色"按钮打开颜色选择对话框
2. 在对话框中选择您需要的颜色
3. 所选颜色将显示在左侧列表中

### 管理颜色

- 所有添加的颜色都会在左侧列表中显示
- 右键点击列表中的颜色项，选择"Remove Color"可删除该颜色

### 颜色切换模式

- **快速切换**：每500毫秒直接切换到下一个颜色
- **平滑过渡**：颜色之间以渐变方式平滑过渡

## 注意事项

- 使用任何颜色切换模式前，请确保已添加颜色并点击"应用"按钮
- 程序不会自动保存颜色设置，关闭前请记录您喜欢的颜色组合
- 为获得更好的视觉效果，建议添加3-5种颜色形成循环

## 开发信息

- 开发环境：Qt 5.x
- 编程语言：C++
- 最后更新：2025年4月7日

## 许可信息

本项目仅供学习和个人使用。

## 联系方式

## 联系方式

如有问题或建议，请通过以下方式联系：

- 项目主页：[https://github.com/zhouzhiouhub/Mr.Zhou/tree/main/lrean/TankWallpaper/QT/colorinput]
- 电子邮件：zhouzhiou9588@163.com

---

*Color Input - 让颜色变化更简单*
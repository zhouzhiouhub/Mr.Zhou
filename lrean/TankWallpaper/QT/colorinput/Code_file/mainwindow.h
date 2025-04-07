#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QList>
#include <QColor>
#include <QListWidgetItem>
#include "MultiColorDialog.h"

QT_BEGIN_NAMESPACE
namespace Ui { class MainWindow; }
QT_END_NAMESPACE

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private slots:
    void openMultiColorDialog();                 // 打开多颜色选择对话框
    void addColors(const QList<QColor> &colors); // 添加多个颜色到列表
    void setupContextMenu();                     // 设置右键菜单
    void removeSelectedColor();                  // 移除选中的颜色
    void changeBackgroundColor();
    void on_pushButton_clicked();
    void updateColorTransition();

    void on_fastSwitchButton_clicked();

    void on_smoothSwitchButton_clicked();

    void on_stopButton_clicked();

private:
    void addColorToList(const QColor &color);    // 添加颜色到 QListWidget
    void updateColorDisplay();                   // 更新颜色显示标签

    Ui::MainWindow *ui;
    QList<QColor> selectedColors;                // 保存选中的颜色
    QTimer *rainbowTimer;       // 定时器
    QVector<QColor> colorList;  // 颜色列表
    int currentColorIndex;      // 当前颜色索引
    QColor currentColor;        // 当前颜色
    QColor targetColor;         // 目标颜色
    int transitionStep;         // 当前过渡的步数
    int totalSteps;             // 总步数（过渡帧数）
};

#endif // MAINWINDOW_H

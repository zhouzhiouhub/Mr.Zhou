#include "mainwindow.h"
#include "ui_mainwindow.h"
#include "QTimer"
#include "QMessageBox"

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    // 初始化定时器
    rainbowTimer = new QTimer(this);

    // 连接按钮点击事件
    connect(ui->selectMultiColorButton, &QPushButton::clicked, this, &MainWindow::openMultiColorDialog);

    // 设置右键菜单
    setupContextMenu();
}

MainWindow::~MainWindow()
{

    delete ui;
}

void MainWindow::openMultiColorDialog()
{
    MultiColorDialog dialog(this);

    // 连接颜色添加信号
    connect(&dialog, &MultiColorDialog::colorAdded, this, [this](const QColor &color) {
        addColors({color}); // 添加颜色到列表
    });

    dialog.exec(); // 显示对话框
}

void MainWindow::addColors(const QList<QColor> &colors)
{
    for (const QColor &color : colors) {
        if (!selectedColors.contains(color)) {
            selectedColors.append(color);
            addColorToList(color);
        }
    }
    updateColorDisplay();
}

void MainWindow::addColorToList(const QColor &color)
{
    QListWidgetItem *item = new QListWidgetItem();
    item->setText(color.name());   // 显示颜色代码
    item->setBackgroundColor(color); // 设置背景颜色
    item->setForeground(color.value() < 128 ? Qt::white : Qt::black); // 自动调整字体颜色
    ui->colorListWidget->addItem(item);
}

void MainWindow::updateColorDisplay()
{
    if (selectedColors.isEmpty()) {
//ui->selectedColorsLabel->setText("Selected Colors: None");
        return;
    }

    QStringList colorNames;
    for (const QColor &color : selectedColors) {
        colorNames.append(color.name());
    }

//ui->selectedColorsLabel->setText("Selected Colors: " + colorNames.join(", "));
}

void MainWindow::setupContextMenu()
{
    // 设置 QListWidget 的右键菜单策略
    ui->colorListWidget->setContextMenuPolicy(Qt::CustomContextMenu);

    // 连接右键菜单信号
    connect(ui->colorListWidget, &QListWidget::customContextMenuRequested, this, [this](const QPoint &pos) {
        QMenu contextMenu;
        QAction *removeAction = contextMenu.addAction("Remove Color");

        // 显示菜单
        QAction *selectedAction = contextMenu.exec(ui->colorListWidget->mapToGlobal(pos));
        if (selectedAction == removeAction)
        {
            removeSelectedColor();
        }
    });
}

void MainWindow::removeSelectedColor()
{
    // 获取选中的 QListWidgetItem
    QListWidgetItem *item = ui->colorListWidget->currentItem();
    if (!item)
        return;

    // 获取颜色名称
    QString colorName = item->text();

    // 从 QListWidget 中移除
    delete item;

    // 从已选颜色列表中移除
    for (int i = 0; i < selectedColors.size(); ++i)
    {
        if (selectedColors[i].name() == colorName)
        {
            selectedColors.removeAt(i);
            break;
        }
    }

    // 更新显示
    updateColorDisplay();
}

void MainWindow::changeBackgroundColor()
{
    // 如果颜色列表为空，直接返回
    if (colorList.isEmpty()) {
        return;
    }

    // 获取当前颜色
    static int currentIndex = 0; // 静态变量，保存当前颜色索引
    QColor currentColor = colorList[currentIndex];

    // 设置窗口背景颜色
    QPalette palette = this->palette();
    palette.setColor(QPalette::Window, currentColor); // 设置窗口背景色
    this->setPalette(palette);

    // 更新索引，循环使用颜色列表
    currentIndex = (currentIndex + 1) % colorList.size();
}

void MainWindow::on_pushButton_clicked()
{
    // 检查 colorListWidget 是否为空
    if (ui->colorListWidget->count() == 0) {
        QMessageBox::warning(this, "警告", "颜色列表为空，请先添加颜色！");
        return;
    }

    // 清空 listWidget 和 colorList，避免重复添加
    ui->listWidget->clear();
    colorList.clear();

    // 遍历 colorListWidget 中的所有项，提取颜色
    for (int i = 0; i < ui->colorListWidget->count(); ++i) {
        QListWidgetItem *item = ui->colorListWidget->item(i);
        QString colorValue = item->text();
        QColor newColor(colorValue);

        // 检查是否已经存在，避免重复添加
        if (!colorList.contains(newColor)) {
            // 添加到 listWidget 和 colorList
            QListWidgetItem *newItem = new QListWidgetItem(colorValue);
            ui->listWidget->addItem(newItem);
            colorList.append(newColor);
        }
    }

    // 检查是否提取到了颜色
    if (colorList.isEmpty()) {
        QMessageBox::warning(this, "警告", "未找到有效颜色，请检查颜色列表！");
        return;
    }

    // 如果需要自动启动快速切换模式，可以启动定时器
    if (!rainbowTimer->isActive()) {
        connect(rainbowTimer, &QTimer::timeout, this, &MainWindow::changeBackgroundColor);
        rainbowTimer->start(500); // 默认以快速切换模式启动
    }
}

void MainWindow::updateColorTransition()
{
    if (colorList.isEmpty()) return;

    // 如果 transitionStep 达到 totalSteps，切换到下一个颜色
    if (transitionStep >= totalSteps) {
        transitionStep = 0;

        // 更新当前颜色和目标颜色
        static int currentIndex = 0;
        currentIndex = (currentIndex + 1) % colorList.size();
        currentColor = targetColor;
        targetColor = colorList[currentIndex];
    }

    // 计算插值颜色
    int r = currentColor.red() + (targetColor.red() - currentColor.red()) * transitionStep / totalSteps;
    int g = currentColor.green() + (targetColor.green() - currentColor.green()) * transitionStep / totalSteps;
    int b = currentColor.blue() + (targetColor.blue() - currentColor.blue()) * transitionStep / totalSteps;

    QColor interpolatedColor(r, g, b);

    // 更新背景颜色
    QPalette palette = this->palette();
    palette.setColor(QPalette::Window, interpolatedColor);
    this->setPalette(palette);

    // 增加步数
    transitionStep++;
}


void MainWindow::on_fastSwitchButton_clicked()
{
    if (colorList.isEmpty()) {
        QMessageBox::warning(this, "警告", "颜色列表为空，请先添加颜色！");
        return;
    }

    // 停止定时器，防止与平滑过渡冲突
    if (rainbowTimer->isActive()) {
        rainbowTimer->stop();
    }

    // 连接快速切换的逻辑
    disconnect(rainbowTimer, &QTimer::timeout, this, nullptr);
    connect(rainbowTimer, &QTimer::timeout, this, &MainWindow::changeBackgroundColor);

    // 启动定时器（500 毫秒切换一次颜色）
    rainbowTimer->start(500);
}


void MainWindow::on_smoothSwitchButton_clicked()
{
    if (colorList.isEmpty()) {
        QMessageBox::warning(this, "警告", "颜色列表为空，请先添加颜色！");
        return;
    }

    // 停止定时器，防止与快速切换冲突
    if (rainbowTimer->isActive()) {
        rainbowTimer->stop();
    }

    // 连接平滑过渡的逻辑
    disconnect(rainbowTimer, &QTimer::timeout, this, nullptr);
    connect(rainbowTimer, &QTimer::timeout, this, &MainWindow::updateColorTransition);

    // 初始化平滑过渡参数
    transitionStep = 0;
    totalSteps = 50; // 设置总步数
    currentColor = colorList[0];
    targetColor = colorList[1 % colorList.size()];

    // 启动定时器（30 毫秒更新一帧）
    rainbowTimer->start(30);
}



void MainWindow::on_stopButton_clicked()
{
    if (rainbowTimer->isActive()) {
        rainbowTimer->stop(); // 停止定时器
    }
}


#include "MultiColorDialog.h"
#include <QPushButton>

MultiColorDialog::MultiColorDialog(QWidget *parent)
    : QDialog(parent)
{
    // 设置窗口标题
    setWindowTitle("Selected Colors");

    // 设置窗口背景颜色
    QPalette palette = this->palette();
    palette.setColor(QPalette::Window, Qt::lightGray); // 使用 Qt 推荐的方式
    this->setAutoFillBackground(true);
    this->setPalette(palette);

    // 初始化主布局
    mainLayout = new QVBoxLayout(this);

    // 添加初始颜色选择器
    addNewColorSelector();

    // 添加按钮
    QPushButton *addButton = new QPushButton("Add Color", this);
    QPushButton *confirmButton = new QPushButton("Ok", this);
    mainLayout->addWidget(addButton);
    mainLayout->addWidget(confirmButton);

    // 连接按钮信号
    connect(addButton, &QPushButton::clicked, this, &MultiColorDialog::addNewColorSelector);
    connect(confirmButton, &QPushButton::clicked, this, &MultiColorDialog::confirmSelection);
}

void MultiColorDialog::addNewColorSelector()
{
    // 创建新的颜色选择器
    QColorDialog *colorDialog = new QColorDialog(this);
    colorDialog->setOptions(QColorDialog::ShowAlphaChannel | QColorDialog::DontUseNativeDialog);

    // 连接颜色选择器的信号，当选择颜色时更新颜色列表
    connect(colorDialog, &QColorDialog::colorSelected, this, [this](const QColor &color) {
        if (color.isValid() && !selectedColorsList.contains(color)) {
            selectedColorsList.append(color);  // 添加到颜色列表
            emit colorAdded(color);           // 发送信号通知主窗口
        }
    });

    // 保存颜色选择器并添加到布局
    colorSelectors.append(colorDialog);
    mainLayout->addWidget(colorDialog);
}

void MultiColorDialog::confirmSelection()
{
    accept(); // 关闭对话框
}

QList<QColor> MultiColorDialog::selectedColors() const
{
    return selectedColorsList;
}

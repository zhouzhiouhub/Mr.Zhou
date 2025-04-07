#ifndef MULTICOLORDIALOG_H
#define MULTICOLORDIALOG_H

#include <QDialog>
#include <QColorDialog>
#include <QVBoxLayout>
#include <QList>

class MultiColorDialog : public QDialog
{
    Q_OBJECT

public:
    explicit MultiColorDialog(QWidget *parent = nullptr);
    QList<QColor> selectedColors() const;

signals:
    void colorAdded(const QColor &color); // 当用户选择新颜色时发送信号

private slots:
    void addNewColorSelector();
    void confirmSelection();

private:
    QVBoxLayout *mainLayout;              // 主布局
    QList<QColorDialog *> colorSelectors; // 保存所有颜色选择器
    QList<QColor> selectedColorsList;     // 保存选中的颜色
};

#endif // MULTICOLORDIALOG_H

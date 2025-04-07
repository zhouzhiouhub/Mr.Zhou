#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QLineEdit>
#include <QPushButton>
#include <QLabel>

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private slots:
    void showColorDialog();
    void applyWallpaper();
    void restoreWallpaper();

private:
    QString getCurrentWallpaper();
    QString generateSolidColorWallpaper(const QColor& color, int width = 1920, int height = 1080);
    void setWallpaper(const QString& imagePath);

    QString originalWallpaper;
    QColor currentColor;

    QLineEdit *colorInput;
    QPushButton *colorButton;
    QPushButton *applyButton;
    QPushButton *restoreButton;
    QLabel *statusLabel;
};

#endif // MAINWINDOW_H

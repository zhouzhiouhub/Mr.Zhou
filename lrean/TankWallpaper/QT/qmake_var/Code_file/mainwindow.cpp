#include "mainwindow.h"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QColorDialog>
#include <QImage>
#include <QDir>
#include <QProcess>
#ifdef Q_OS_WIN
#include <windows.h>
#endif

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent),
    currentColor(Qt::white)
{
    setWindowTitle("Wallpaper Changer");
    resize(400, 200);

    originalWallpaper = getCurrentWallpaper();

    // 创建中心窗口部件和布局
    QWidget *centralWidget = new QWidget(this);
    setCentralWidget(centralWidget);
    QVBoxLayout *mainLayout = new QVBoxLayout(centralWidget);

    // 颜色输入布局
    QHBoxLayout *colorLayout = new QHBoxLayout();
    colorInput = new QLineEdit(this);
    colorInput->setPlaceholderText("Enter color (e.g., 'red' or '#FF5733')");
    colorInput->setText(currentColor.name());
    colorLayout->addWidget(colorInput);

    colorButton = new QPushButton("Choose Color", this);
    connect(colorButton, &QPushButton::clicked, this, &MainWindow::showColorDialog);
    colorLayout->addWidget(colorButton);
    mainLayout->addLayout(colorLayout);

    // 应用按钮
    applyButton = new QPushButton("Apply Wallpaper", this);
    connect(applyButton, &QPushButton::clicked, this, &MainWindow::applyWallpaper);
    mainLayout->addWidget(applyButton);

    // 恢复按钮
    restoreButton = new QPushButton("Restore Original", this);
    connect(restoreButton, &QPushButton::clicked, this, &MainWindow::restoreWallpaper);
    mainLayout->addWidget(restoreButton);

    // 状态标签
    statusLabel = new QLabel("Ready", this);
    mainLayout->addWidget(statusLabel);

    mainLayout->addStretch();
}

MainWindow::~MainWindow()
{
    restoreWallpaper();
}

QString MainWindow::getCurrentWallpaper()
{
#ifdef Q_OS_WIN
    wchar_t path[MAX_PATH];
    SystemParametersInfoW(SPI_GETDESKWALLPAPER, MAX_PATH, path, 0);
    return QString::fromWCharArray(path);
#elif defined(Q_OS_MACOS)
    QProcess process;
    process.start("osascript", QStringList() << "-e"
                                             << "tell application \"Finder\" to get POSIX path of (get desktop picture as alias)");
    process.waitForFinished();
    return process.readAllStandardOutput().trimmed();
#else
    return QString();
#endif
}

QString MainWindow::generateSolidColorWallpaper(const QColor& color, int width, int height)
{
    QImage image(width, height, QImage::Format_RGB32);
    image.fill(color);
    QString path = QDir::currentPath() + "/temp_wallpaper.png";
    image.save(path);
    return path;
}

void MainWindow::setWallpaper(const QString& imagePath)
{
#ifdef Q_OS_WIN
    SystemParametersInfoW(SPI_SETDESKWALLPAPER, 0, (PVOID)imagePath.toStdWString().c_str(),
                          SPIF_UPDATEINIFILE | SPIF_SENDCHANGE);
#elif defined(Q_OS_MACOS)
    QProcess::execute("osascript", QStringList() << "-e"
                                                 << QString("tell application \"Finder\" to set desktop picture to POSIX file \"%1\"").arg(imagePath));
#elif defined(Q_OS_LINUX)
    QProcess::execute("feh", QStringList() << "--bg-scale" << imagePath);
#endif
}

void MainWindow::showColorDialog()
{
    QColor color = QColorDialog::getColor(currentColor, this);
    if (color.isValid()) {
        currentColor = color;
        colorInput->setText(color.name());
        applyWallpaper();
    }
}

void MainWindow::applyWallpaper()
{
    QString input = colorInput->text().trimmed();
    if (!input.isEmpty()) {
        QColor newColor(input);
        if (newColor.isValid()) {
            currentColor = newColor;
        } else {
            statusLabel->setText("Invalid color! Use name or HEX code");
            return;
        }
    }

    QString tempWallpaper = generateSolidColorWallpaper(currentColor);
    setWallpaper(tempWallpaper);
    statusLabel->setText("Wallpaper set: " + tempWallpaper);
}

void MainWindow::restoreWallpaper()
{
    if (!originalWallpaper.isEmpty()) {
        setWallpaper(originalWallpaper);
        statusLabel->setText("Original wallpaper restored");
    } else {
        statusLabel->setText("No original wallpaper found");
    }
}

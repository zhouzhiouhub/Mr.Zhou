<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

header('Content-Type: application/json');
session_start(); // 启用 Session 防止重复提交

// 确保是 POST 请求
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => "error", "message" => "非法访问"]);
    exit;
}

// 获取表单数据
$name = htmlspecialchars($_POST["name"] ?? '');
$email = filter_var($_POST["email"] ?? '', FILTER_SANITIZE_EMAIL);
$message = nl2br(htmlspecialchars($_POST["message"] ?? ''));

// 验证输入
if (empty($name) || empty($email) || empty($message)) {
    echo json_encode(["status" => "error", "message" => "请填写所有字段"]);
    exit;
}

// 验证邮箱格式
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "邮箱格式不正确"]);
    exit;
}

// 生成唯一请求 ID，防止短时间重复提交
$requestID = md5($name . $email . $message);
if (isset($_SESSION['last_request']) && $_SESSION['last_request'] === $requestID) {
    echo json_encode(["status" => "error", "message" => "请勿重复提交"]);
    exit;
}

// 记录当前请求，防止 10 秒内重复提交
$_SESSION['last_request'] = $requestID;
$_SESSION['request_time'] = time();

$mail = new PHPMailer(true);

try {
    // 配置邮件服务器
    $mail->CharSet    = 'UTF-8';
    $mail->Encoding   = 'base64';
    $mail->isSMTP();
    $mail->Host       = 'smtp.163.com'; 
    $mail->SMTPAuth   = true;
    $mail->Username   = 'zhouzhiou9588@163.com';  
    $mail->Password   = 'DAcANtxmypaZNzYA';  // ⚠️ 确保这里填写的是授权码！
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;  // ✅ 使用 SSL
    $mail->Port       = 465;  // ✅ 163 邮箱的 SSL 端口

    // 关闭调试模式
    $mail->SMTPDebug = 0;
    $mail->Debugoutput = 'html';

    // 设置发件人和收件人
    $mail->setFrom('zhouzhiou9588@163.com', "$name 的留言反馈");
    $mail->addAddress('zhouzhiou9588@163.com'); // 发送到自己邮箱
    $mail->addReplyTo($email, $name); // 方便回复

    // 设置邮件标题和内容
    $mail->isHTML(true);
    $mail->Subject = "来自 $name 的留言反馈";
    $mail->Body    = "
        <p><strong>发件人：</strong>$name</p>
        <p><strong>回复邮箱：</strong><a href='mailto:$email'>$email</a></p>
        <p><strong>留言内容：</strong></p>
        <p>$message</p>
    ";
    $mail->AltBody = "发件人：$name\n回复邮箱：$email\n留言内容：\n$message"; // 为不支持HTML的邮件客户端提供纯文本版本

    // 发送邮件
    if ($mail->send()) {
        echo json_encode(["status" => "success", "message" => "留言已成功发送！"]);
    } else {
        echo json_encode(["status" => "error", "message" => "邮件发送失败，请稍后再试"]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "邮件发送失败：" . $mail->ErrorInfo]);
}
?>

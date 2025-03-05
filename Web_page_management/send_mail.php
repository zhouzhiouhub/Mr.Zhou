<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

header('Content-Type: application/json');
session_start(); // 启用 Session 防止重复提交

$response = [];

// 确保是 POST 请求
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => "error", "message" => "非法访问"]);
    exit;
}

// 获取表单数据并防止 XSS
$name = htmlspecialchars($_POST["name"] ?? '');
$email = htmlspecialchars($_POST["email"] ?? '');
$message = nl2br(htmlspecialchars($_POST["message"] ?? ''));

// 验证输入是否为空
if (empty($name) || empty($email) || empty($message)) {
    echo json_encode(["status" => "error", "message" => "请填写所有字段"]);
    exit;
}

// 生成唯一请求 ID，防止短时间重复提交
$requestID = md5($name . $email . $message);

// 如果 Session 里已有相同的请求，直接返回，防止重复提交
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
    $mail->Password   = 'DAcANtxmypaZNzYA';  
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 465;

    // 关闭调试模式，避免前端获取到 SMTP 输出
    $mail->SMTPDebug = 0;
    $mail->Debugoutput = 'html';

    // 设置发件人和收件人
    $mail->setFrom('zhouzhiou9588@163.com', "$name 的留言反馈");
    $mail->addAddress('zhouzhiou9588@163.com'); // 发送到自己邮箱
    $mail->addReplyTo($email, $name); // 方便回复

    // 设置邮件标题和内容
    $mail->Subject = "$email";
    $mail->Body    = "姓名: $name\n$message";

    // 发送邮件
    if ($mail->send()) {
        echo json_encode(["status" => "success", "message" => "留言已成功发送！"]);
    } else {
        echo json_encode(["status" => "error", "message" => "留言发送失败: " . $mail->ErrorInfo]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "留言发送失败: " . $e->getMessage()]);
}
?>

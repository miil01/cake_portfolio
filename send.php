<?php
// エラー表示
error_reporting(E_ALL);
ini_set('display_errors', 1);

// PHPMailer 読み込み
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

// POST チェック
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $feedback = $_POST["feedback"] ?? "";

    if (empty($feedback)) {
        echo "感想が空です";
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        // サーバ設定
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'あなたのメール@gmail.com';  // Gmail アドレス
        $mail->Password   = 'アプリ用パスワード';       // Gmail アプリパスワード
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        // 送信者・受信者
        $mail->setFrom('あなたのメール@gmail.com', 'Webサイト');
        $mail->addAddress('mmm.hearts.3333@gmail.com', '受信者名');

        // 内容
        $mail->Subject = 'サイトの感想が届きました';
        $mail->Body    = "感想内容:\n\n" . $feedback;

        $mail->send();
        echo "送信完了 ✔️";

    } catch (Exception $e) {
        echo "送信失敗 ❌ メール送信できませんでした: {$mail->ErrorInfo}";
    }
} else {
    echo "POST で送信してください";
}
?>
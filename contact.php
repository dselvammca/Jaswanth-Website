
<?php
$to = "jaswanthselvam12@gmail.com";
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');
if ($name === '' || $email === '' || $message === '') { http_response_code(400); echo "<!doctype html><meta charset='utf-8'><link rel='stylesheet' href='assets/style.css'><div class='container'><div class='warning card'>Missing fields. Please go back and complete the form.</div></div>"; exit; }
$subject = "New message from Jaswanth website";
$body = "From: $name\nEmail: $email\n\nMessage:\n$message\n\n--\nSent from jaswanth site";
$headers = "From: Website Contact <no-reply@your-domain.com>\r\nReply-To: $email\r\n";
$sent = @mail($to, $subject, $body, $headers);
echo "<!doctype html><meta charset='utf-8'><link rel='stylesheet' href='assets/style.css'><div class='container'>";
if ($sent) { echo "<div class='success card'><h3>Thank you!</h3><p>Your message has been sent successfully.</p><p><a class='btn' href='index.html'>Back to Home</a></p></div>"; }
else { echo "<div class='warning card'><h3>Oops!</h3><p>Unable to send email from this server. Please email directly: <a href='mailto:jaswanthselvam12@gmail.com'>jaswanthselvam12@gmail.com</a>.</p><p><a class='btn' href='contact.html'>Back to Contact</a></p></div>"; }
echo "</div>";
?>

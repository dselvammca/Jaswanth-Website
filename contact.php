<?php
// contact.php
// Simple mail handler. Requires PHP hosting (NOT Vercel).

header('Content-Type: text/html; charset=utf-8');

function sanitize($s) {
  return htmlspecialchars(trim($s), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $name    = sanitize($_POST['name'] ?? '');
  $phone   = sanitize($_POST['phone'] ?? '');
  $email   = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
  $message = sanitize($_POST['message'] ?? '');

  if (!$name || !$phone || !$email || !$message) {
    http_response_code(400);
    echo "Please fill all fields correctly."; exit;
  }

  $to      = "dselvammca@gmail.com";
  $subject = "New contact from Jaswanth Website";
  $body    = "Name: $name\nPhone: $phone\nEmail: $email\n\nMessage:\n$message\n";
  $headers = "From: Website <no-reply@yourdomain.com>\r\n" .
             "Reply-To: $email\r\n" .
             "Content-Type: text/plain; charset=UTF-8\r\n";

  // For better deliverability on shared hosting you might need SMTP (PHPMailer).
  if (mail($to, $subject, $body, $headers)) {
    echo "Thank you! Your message has been sent.";
  } else {
    http_response_code(500);
    echo "Sorry, we could not send your message. Please try again later.";
  }
} else {
  http_response_code(405);
  echo "Method not allowed.";
}

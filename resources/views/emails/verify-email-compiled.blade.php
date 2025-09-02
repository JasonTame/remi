<?php
$htmlPath = resource_path('views/emails/email-verification.html');

if (!file_exists($htmlPath)) {
    throw new \Exception("Email verification HTML template not found at: {$htmlPath}");
}

$html = file_get_contents($htmlPath);

// Replace the verification URL placeholder
$html = str_replace('{{VERIFICATION_URL}}', $verificationUrl, $html);

// Replace config placeholders if any
$html = str_replace("{{ config('app.url') }}", config('app.url'), $html);

echo $html;
?>

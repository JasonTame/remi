<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Spatie\Mjml\Mjml;

class OnboardingWelcome extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome to Remi! Let\'s help you never forget important tasks again 🐘',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            htmlString: $this->generateHtmlFromMjml(),
        );
    }

    /**
     * Generate HTML from MJML template
     */
    private function generateHtmlFromMjml(): string
    {
        $mjmlPath = resource_path('views/emails/onboarding-welcome.mjml');

        if (!file_exists($mjmlPath)) {
            throw new \Exception("MJML template not found at: {$mjmlPath}");
        }

        $mjml = file_get_contents($mjmlPath);

        // Process any Laravel blade-style variables in the MJML
        $mjml = $this->processTemplateVariables($mjml);

        return Mjml::new()->toHtml($mjml);
    }

    /**
     * Process template variables in MJML content
     */
    private function processTemplateVariables(string $mjml): string
    {
        // Replace {{ asset('favicon.svg') }} with the actual asset URL
        $mjml = str_replace("{{ asset('favicon.svg') }}", asset('favicon.svg'), $mjml);

        return $mjml;
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}

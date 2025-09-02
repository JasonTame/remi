<?php

namespace App\Mail;

use App\Models\User;
use App\Models\WeeklyRecommendation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Spatie\Mjml\Mjml;

class WeeklyRecommendations extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;

    public WeeklyRecommendation $weeklyRecommendation;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, WeeklyRecommendation $weeklyRecommendation)
    {
        $this->user = $user;
        $this->weeklyRecommendation = $weeklyRecommendation;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $weekStart = $this->weeklyRecommendation->week_start_date->format('M j');
        $weekEnd = $this->weeklyRecommendation->week_start_date->addDays(6)->format('M j');

        return new Envelope(
            subject: "Your weekly task suggestions ({$weekStart} - {$weekEnd}) 🗓️",
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
        $mjmlPath = resource_path('views/emails/weekly-recommendations.mjml');

        if (! file_exists($mjmlPath)) {
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
        // Replace template variables
        $mjml = str_replace("{{ asset('favicon.png') }}", asset('favicon.png'), $mjml);
        $mjml = str_replace('{{ user_name }}', $this->user->name, $mjml);
        $mjml = str_replace('{{ dashboard_url }}', url('/dashboard'), $mjml);

        // Replace week dates
        $weekStart = $this->weeklyRecommendation->week_start_date->format('M j');
        $weekEnd = $this->weeklyRecommendation->week_start_date->addDays(6)->format('M j');
        $mjml = str_replace('{{ week_start }}', $weekStart, $mjml);
        $mjml = str_replace('{{ week_end }}', $weekEnd, $mjml);

        // Build task list
        $taskList = $this->buildTaskList();
        $mjml = str_replace('{{ task_list }}', $taskList, $mjml);

        return $mjml;
    }

    /**
     * Build the HTML for the task list
     */
    private function buildTaskList(): string
    {
        $recommendedTasks = $this->weeklyRecommendation->recommendedTasks()
            ->with(['task', 'task.category'])
            ->orderBy('priority')
            ->get();

        if ($recommendedTasks->isEmpty()) {
            return '<p style="font-size: 14px; color: #6b7280; text-align: center; margin: 16px 0;">No recommendations this week. Great job staying on top of things!</p>';
        }

        $taskHtml = '';
        foreach ($recommendedTasks as $recommendedTask) {
            $task = $recommendedTask->task;
            $category = $task->category;
            $priorityText = $this->getPriorityText($recommendedTask->priority);

            $taskHtml .= '<div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 12px; background-color: #ffffff;">';
            $taskHtml .= '<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">';
            $taskHtml .= '<h3 style="font-size: 16px; font-weight: 600; color: #1f2937; margin: 0; flex: 1;">'.htmlspecialchars($task->title).'</h3>';
            $taskHtml .= '<span style="background-color: #f3f4f6; color: #374151; font-size: 12px; padding: 4px 8px; border-radius: 4px; font-weight: 500; margin-left: 8px;">'.$priorityText.'</span>';
            $taskHtml .= '</div>';

            if ($category) {
                $taskHtml .= '<p style="font-size: 12px; color: #6b7280; margin: 0 0 8px 0;">📂 '.htmlspecialchars($category->name).'</p>';
            }

            if ($task->timing_description) {
                $taskHtml .= '<p style="font-size: 13px; color: #4b5563; margin: 0 0 8px 0;"><strong>Timing:</strong> '.htmlspecialchars($task->timing_description).'</p>';
            }

            if ($recommendedTask->reason) {
                $taskHtml .= '<p style="font-size: 13px; color: #059669; margin: 0; padding: 8px; background-color: #ecfdf5; border-radius: 4px; border-left: 4px solid #10b981;"><strong>Why now:</strong> '.htmlspecialchars($recommendedTask->reason).'</p>';
            }

            $taskHtml .= '</div>';
        }

        return $taskHtml;
    }

    /**
     * Get priority text for display
     */
    private function getPriorityText(int $priority): string
    {
        return match ($priority) {
            1 => 'High Priority',
            2 => 'Medium Priority',
            3 => 'Low Priority',
            default => 'Priority '.$priority,
        };
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

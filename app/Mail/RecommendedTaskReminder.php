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

class RecommendedTaskReminder extends Mailable
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
        return new Envelope(
            subject: "Gentle reminder: Your week's tasks 📝",
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
        $mjmlPath = resource_path('views/emails/recommended-task-reminder.mjml');

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

        // Build incomplete task list
        $taskList = $this->buildIncompleteTaskList();
        $mjml = str_replace('{{ task_list }}', $taskList, $mjml);

        // Calculate completion stats
        $stats = $this->getCompletionStats();
        $mjml = str_replace('{{ completed_count }}', $stats['completed'], $mjml);
        $mjml = str_replace('{{ total_count }}', $stats['total'], $mjml);
        $mjml = str_replace('{{ remaining_count }}', $stats['remaining'], $mjml);

        return $mjml;
    }

    /**
     * Build the HTML for incomplete tasks only
     */
    private function buildIncompleteTaskList(): string
    {
        $recommendedTasks = $this->weeklyRecommendation->recommendedTasks()
            ->with(['task', 'task.category'])
            ->where('completed', false)
            ->orderBy('priority')
            ->get();

        if ($recommendedTasks->isEmpty()) {
            return '<p style="font-size: 16px; color: #059669; text-align: center; margin: 16px 0; font-weight: 500;">🎉 Amazing! You\'ve completed all your recommended tasks for this week!</p>';
        }

        $taskHtml = '';
        foreach ($recommendedTasks as $recommendedTask) {
            $task = $recommendedTask->task;
            $category = $task->category;
            $priorityText = $this->getPriorityText($recommendedTask->priority);

            $taskHtml .= '<div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 12px; background-color: #ffffff;">';
            $taskHtml .= '<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">';
            $taskHtml .= '<h3 style="font-size: 16px; font-weight: 600; color: #1f2937; margin: 0; flex: 1;">'.htmlspecialchars($task->title).'</h3>';
            $taskHtml .= '<span style="background-color: #fef3c7; color: #92400e; font-size: 12px; padding: 4px 8px; border-radius: 4px; font-weight: 500; margin-left: 8px;">'.$priorityText.'</span>';
            $taskHtml .= '</div>';

            if ($category) {
                $taskHtml .= '<p style="font-size: 12px; color: #6b7280; margin: 0 0 8px 0;">📂 '.htmlspecialchars($category->name).'</p>';
            }

            if ($task->timing_description) {
                $taskHtml .= '<p style="font-size: 13px; color: #4b5563; margin: 0 0 8px 0;"><strong>Timing:</strong> '.htmlspecialchars($task->timing_description).'</p>';
            }

            if ($recommendedTask->reason) {
                $taskHtml .= '<p style="font-size: 13px; color: #0369a1; margin: 0; padding: 8px; background-color: #f0f9ff; border-radius: 4px; border-left: 4px solid #0ea5e9;"><strong>Why this matters:</strong> '.htmlspecialchars($recommendedTask->reason).'</p>';
            }

            $taskHtml .= '</div>';
        }

        return $taskHtml;
    }

    /**
     * Get completion statistics for the week
     */
    private function getCompletionStats(): array
    {
        $allTasks = $this->weeklyRecommendation->recommendedTasks()->get();

        $total = $allTasks->count();
        $completed = $allTasks->filter(fn ($recommendedTask) => $recommendedTask->completed)->count();
        $remaining = $total - $completed;

        return [
            'total' => $total,
            'completed' => $completed,
            'remaining' => $remaining,
        ];
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

import { Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from '@react-email/components';

interface WeeklyDigestEmailProps {
    userFirstName?: string;
    weekRange?: string;
    suggestedTasks?: Array<{
        id: string;
        title: string;
        category?: string;
        reason: string;
        lastCompleted: string;
    }>;
}

export const WeeklyDigestEmail = ({
    userFirstName = 'there',
    weekRange = 'January 6-12, 2025',
    suggestedTasks = [
        {
            id: '1',
            title: 'Schedule dental checkup',
            category: 'Health',
            reason: "It's been 6 months since your last dental checkup",
            lastCompleted: '6 months ago',
        },
        {
            id: '2',
            title: 'Call parents',
            category: 'Personal',
            reason: 'You usually call every 2 weeks',
            lastCompleted: '2 weeks ago',
        },
        {
            id: '3',
            title: 'Change air filters',
            category: 'Home',
            reason: 'You typically do this every 3 months',
            lastCompleted: '3 months ago',
        },
    ],
}: WeeklyDigestEmailProps) => (
    <Html>
        <Head />
        <Preview>Your weekly task suggestions from Remi 🐘</Preview>
        <Body style={main}>
            <Container style={container}>
                {/* Header */}
                <Section style={header}>
                    <div style={logoContainer}>
                        <div style={logoBackground}>
                            <img src="/static/logo.svg" style={{ display: 'block' }} width={48} height={48} alt="Remi logo" />
                        </div>
                        <Text style={logoText}>Remi</Text>
                    </div>
                </Section>

                {/* Week header */}
                <Section style={weekSection}>
                    <Text style={weekRangeStyle}>{weekRange}</Text>
                    <Heading style={weekHeading}>Remi suggests these tasks this week:</Heading>
                    <Text style={weekSubtext}>
                        Hi {userFirstName}! Here are some gentle suggestions based on your patterns. Complete what makes sense, skip what doesn't. 🙂
                    </Text>
                </Section>

                {/* Suggested tasks */}
                <Section style={tasksSection}>
                    {suggestedTasks.map((task) => (
                        <div key={task.id} style={taskCard}>
                            <div style={taskHeader}>
                                <Heading style={taskTitle}>{task.title}</Heading>
                                {task.category && <span style={getCategoryBadge(task.category)}>{task.category}</span>}
                            </div>
                            <Text style={taskReason}>{task.reason}</Text>
                            <Text style={taskLastCompleted}>Last completed: {task.lastCompleted}</Text>
                            <div style={taskActions}>
                                <Button style={completeButton} href={`https://remi.app/tasks/${task.id}/complete`}>
                                    ✓ Complete
                                </Button>
                                <Button style={skipButton} href={`https://remi.app/tasks/${task.id}/skip`}>
                                    Skip this week
                                </Button>
                            </div>
                        </div>
                    ))}
                </Section>

                {/* Quick actions */}
                <Section style={actionsSection}>
                    <Heading style={actionsHeading}>Quick actions</Heading>
                    <div style={actionButtons}>
                        <Button style={primaryActionButton} href="https://remi.app/dashboard">
                            View All Tasks
                        </Button>
                        <Button style={secondaryActionButton} href="https://remi.app/tasks/new">
                            Add New Task
                        </Button>
                    </div>
                </Section>

                {/* Encouragement */}
                <Section style={encouragementSection}>
                    <div style={encouragementCard}>
                        <Text style={encouragementText}>
                            🎉 <strong>Great job!</strong> You've completed 8 tasks this month. Remi is learning your patterns and getting better at
                            suggestions.
                        </Text>
                    </div>
                </Section>

                <Hr style={hr} />

                {/* Footer */}
                <Section style={footer}>
                    <Text style={footerText}>
                        Remember, these are gentle suggestions, not rigid deadlines. Complete what feels right for your schedule this week.
                    </Text>
                    <Text style={footerText}>
                        Happy remembering,
                        <br />
                        The Remi Team 🐘
                    </Text>
                    <Text style={footerLinks}>
                        <Link href="https://remi.app" style={footerLink}>
                            Open Remi
                        </Link>{' '}
                        •
                        <Link href="https://remi.app/settings/notifications" style={footerLink}>
                            Email Preferences
                        </Link>{' '}
                        •
                        <Link href="https://remi.app/unsubscribe" style={footerLink}>
                            Unsubscribe
                        </Link>
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

// Helper function for category badges
const getCategoryBadge = (category: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
        Health: { bg: '#dbeafe', text: '#1e40af' },
        Home: { bg: '#dcfce7', text: '#166534' },
        Personal: { bg: '#f3e8ff', text: '#7c3aed' },
        Auto: { bg: '#fed7aa', text: '#c2410c' },
        Documents: { bg: '#f1f5f9', text: '#475569' },
        Tech: { bg: '#e0e7ff', text: '#4338ca' },
    };

    const color = colors[category] || colors.Documents;

    return {
        backgroundColor: color.bg,
        color: color.text,
        fontSize: '12px',
        fontWeight: 'bold',
        padding: '4px 8px',
        borderRadius: '4px',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px',
    };
};

// Styles (reusing many from onboarding email)
const main = {
    backgroundColor: '#f8f9fa',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '600px',
};

const header = {
    textAlign: 'center' as const,
    padding: '24px 0',
};

const logoContainer = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const logoBackground = {
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    padding: '10px',
    marginRight: '10px',
    boxShadow: '0 2px 8px rgba(96, 125, 139, 0.15)',
};

const logoText = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#607D8B',
    margin: '0',
    fontFamily: 'Georgia, serif',
};

const weekSection = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
    textAlign: 'center' as const,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
};

const weekRangeStyle = {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0 0 8px 0',
    fontWeight: '500',
};

const weekHeading = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 12px 0',
};

const weekSubtext = {
    fontSize: '16px',
    color: '#4b5563',
    margin: '0',
    lineHeight: '1.5',
};

const tasksSection = {
    marginBottom: '24px',
};

const taskCard = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '16px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
};

const taskHeader = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
};

const taskTitle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0',
};

const taskReason = {
    fontSize: '14px',
    color: '#4b5563',
    margin: '0 0 4px 0',
    lineHeight: '1.4',
};

const taskLastCompleted = {
    fontSize: '12px',
    color: '#9ca3af',
    margin: '0 0 16px 0',
};

const taskActions = {
    display: 'flex',
    gap: '8px',
};

const completeButton = {
    backgroundColor: '#85B79D',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '8px 16px',
    borderRadius: '6px',
    textDecoration: 'none',
    border: 'none',
};

const skipButton = {
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
    fontSize: '14px',
    fontWeight: '500',
    padding: '8px 16px',
    borderRadius: '6px',
    textDecoration: 'none',
    border: '1px solid #d1d5db',
};

const actionsSection = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
    textAlign: 'center' as const,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
};

const actionsHeading = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 16px 0',
};

const actionButtons = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
};

const primaryActionButton = {
    backgroundColor: '#607D8B',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '12px 20px',
    borderRadius: '6px',
    textDecoration: 'none',
};

const secondaryActionButton = {
    backgroundColor: '#f9fafb',
    color: '#374151',
    fontSize: '14px',
    fontWeight: '500',
    padding: '12px 20px',
    borderRadius: '6px',
    textDecoration: 'none',
    border: '1px solid #d1d5db',
};

const encouragementSection = {
    marginBottom: '24px',
};

const encouragementCard = {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    padding: '16px',
};

const encouragementText = {
    fontSize: '14px',
    color: '#166534',
    margin: '0',
    lineHeight: '1.5',
};

const hr = {
    borderColor: '#e5e7eb',
    margin: '32px 0',
};

const footer = {
    textAlign: 'center' as const,
};

const footerText = {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#6b7280',
    margin: '0 0 12px 0',
};

const footerLinks = {
    fontSize: '12px',
    color: '#9ca3af',
    margin: '16px 0 0 0',
};

const footerLink = {
    color: '#607D8B',
    textDecoration: 'none',
    margin: '0 4px',
};

export default WeeklyDigestEmail;

import { Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from '@react-email/components';

interface TaskCompletedEmailProps {
    userFirstName?: string;
    taskTitle?: string;
    category?: string;
    completedDate?: string;
    nextSuggestion?: string;
    streak?: number;
}

export const TaskCompletedEmail = ({
    userFirstName = 'Jason',
    taskTitle = 'Schedule dental checkup',
    category = 'Health',
    completedDate = 'January 8, 2025',
    nextSuggestion = 'July 8, 2025',
    streak = 3,
}: TaskCompletedEmailProps) => (
    <Html>
        <Head />
        <Preview>Great job completing "{taskTitle}"! 🎉</Preview>
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

                {/* Celebration */}
                <Section style={celebrationSection}>
                    <div style={celebrationIcon}>🎉</div>
                    <Heading style={celebrationHeading}>Great job, {userFirstName}!</Heading>
                    <Text style={celebrationText}>
                        You completed <strong>"{taskTitle}"</strong> on {completedDate}
                    </Text>
                    {category && <span style={getCategoryBadge(category)}>{category}</span>}
                </Section>

                {/* Task details */}
                <Section style={detailsSection}>
                    <div style={detailCard}>
                        <div style={detailItem}>
                            <Text style={detailLabel}>✅ Completed</Text>
                            <Text style={detailValue}>{completedDate}</Text>
                        </div>
                        <div style={detailItem}>
                            <Text style={detailLabel}>🔮 Next suggestion</Text>
                            <Text style={detailValue}>{nextSuggestion}</Text>
                        </div>
                        {streak > 1 && (
                            <div style={detailItem}>
                                <Text style={detailLabel}>🔥 Streak</Text>
                                <Text style={detailValue}>{streak} completions in a row!</Text>
                            </div>
                        )}
                    </div>
                </Section>

                {/* AI learning message */}
                <Section style={aiSection}>
                    <div style={aiCard}>
                        <Text style={aiLabel}>🧠 Remi is learning</Text>
                        <Text style={aiText}>
                            Thanks for marking this complete! Remi's AI is learning from your completion patterns to make better suggestions in the
                            future. The more you use Remi, the smarter it gets at understanding your schedule.
                        </Text>
                    </div>
                </Section>

                {/* Quick actions */}
                <Section style={actionsSection}>
                    <Heading style={actionsHeading}>What's next?</Heading>
                    <div style={actionButtons}>
                        <Button style={primaryActionButton} href="https://remi.app/dashboard">
                            View Dashboard
                        </Button>
                        <Button style={secondaryActionButton} href="https://remi.app/tasks/new">
                            Add Another Task
                        </Button>
                    </div>
                </Section>

                <Hr style={hr} />

                {/* Footer */}
                <Section style={footer}>
                    <Text style={footerText}>Keep up the great work! Every completed task helps you build better habits.</Text>
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
                        </Link>
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

// Helper function for category badges (same as weekly digest)
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
        display: 'inline-block',
        marginTop: '8px',
    };
};

// Styles
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

const celebrationSection = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '32px',
    marginBottom: '20px',
    textAlign: 'center' as const,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
};

const celebrationIcon = {
    fontSize: '48px',
    marginBottom: '16px',
};

const celebrationHeading = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 12px 0',
};

const celebrationText = {
    fontSize: '16px',
    color: '#4b5563',
    margin: '0 0 8px 0',
    lineHeight: '1.5',
};

const detailsSection = {
    marginBottom: '20px',
};

const detailCard = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '20px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
};

const detailItem = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #f3f4f6',
};

const detailLabel = {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0',
    fontWeight: '500',
};

const detailValue = {
    fontSize: '14px',
    color: '#1f2937',
    margin: '0',
    fontWeight: 'bold',
};

const aiSection = {
    marginBottom: '20px',
};

const aiCard = {
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '8px',
    padding: '16px',
};

const aiLabel = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#0369a1',
    margin: '0 0 8px 0',
};

const aiText = {
    fontSize: '14px',
    color: '#0c4a6e',
    margin: '0',
    lineHeight: '1.5',
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

export default TaskCompletedEmail;

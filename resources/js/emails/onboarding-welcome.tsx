import { Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from '@react-email/components';

export const OnboardingWelcomeEmail = () => (
    <Html>
        <Head />
        <Preview>Welcome to Remi! Let's help you never forget important tasks again 🐘</Preview>
        <Body style={main}>
            <Container style={container}>
                {/* Header with logo */}
                <Section style={header}>
                    <div style={logoContainer}>
                        <div style={logoBackground}>
                            <img src="/static/logo.svg" style={{ display: 'block' }} width={48} height={48} alt="Remi logo" />
                        </div>
                        <Text style={logoText}>Remi</Text>
                    </div>
                    <Text style={tagline}>Flexible Reminders for Real Life</Text>
                </Section>

                {/* Welcome message */}
                <Section style={welcomeSection}>
                    <Heading style={welcomeHeading}>Welcome to Remi! 🎉</Heading>
                    <Text style={welcomeText}>
                        We're thrilled you've joined thousands of people who never forget important tasks anymore. Remi is here to help you stay on
                        top of life's irregular but important commitments – from dental checkups to catching up with old friends.
                    </Text>
                </Section>

                {/* Getting started tips */}
                <Section style={tipsSection}>
                    <Heading style={sectionHeading}>🚀 Get the most out of Remi in 3 simple steps</Heading>

                    {/* Tip 1 */}
                    <div style={tipCard}>
                        <div style={tipNumber}>1</div>
                        <div style={tipContent}>
                            <Heading style={tipHeading}>Add your first tasks</Heading>
                            <Text style={tipText}>Start by adding 3-5 recurring tasks using natural language. Try phrases like:</Text>
                            <ul style={tipList}>
                                <li style={tipListItem}>"Dental checkup every 6 months"</li>
                                <li style={tipListItem}>"Call parents weekly"</li>
                                <li style={tipListItem}>"Car maintenance about twice a year"</li>
                                <li style={tipListItem}>"Deep clean kitchen every few months"</li>
                            </ul>
                            <Text style={tipText}>Remi's AI understands how you naturally think about time – no rigid scheduling needed!</Text>
                        </div>
                    </div>

                    {/* Tip 2 */}
                    <div style={tipCard}>
                        <div style={tipNumber}>2</div>
                        <div style={tipContent}>
                            <Heading style={tipHeading}>Complete tasks to teach the AI</Heading>
                            <Text style={tipText}>
                                When you complete tasks, mark them as done in Remi. This helps our AI learn your patterns and make better suggestions.
                                The more you use Remi, the smarter it gets at understanding your schedule and preferences.
                            </Text>
                        </div>
                    </div>

                    {/* Tip 3 */}
                    <div style={tipCard}>
                        <div style={tipNumber}>3</div>
                        <div style={tipContent}>
                            <Heading style={tipHeading}>Check your weekly digest</Heading>
                            <Text style={tipText}>
                                Every week, Remi will send you a gentle email with suggested tasks. These aren't rigid deadlines – they're friendly
                                suggestions based on your patterns. Complete what makes sense, skip what doesn't.
                            </Text>
                        </div>
                    </div>
                </Section>

                {/* CTA Button */}
                <Section style={ctaSection}>
                    <Button style={ctaButton} href="https://remi.app/dashboard">
                        Add Your First Task
                    </Button>
                    <Text style={ctaSubtext}>It takes less than 30 seconds to add a task and start building better habits.</Text>
                </Section>

                {/* Pro tip */}
                <Section style={proTipSection}>
                    <div style={proTipCard}>
                        <Text style={proTipLabel}>💡 Pro Tip</Text>
                        <Text style={proTipText}>
                            Start with tasks you already do regularly but sometimes forget. Remi works best when it learns from your existing habits!
                        </Text>
                    </div>
                </Section>

                <Hr style={hr} />

                {/* Footer */}
                <Section style={footer}>
                    <Text style={footerText}>Questions? Just reply to this email – we'd love to help you get started!</Text>
                    <Text style={footerText}>
                        Happy remembering,
                        <br />
                        The Remi Team 🐘
                    </Text>
                    <Text style={footerLinks}>
                        <Link href="https://remi.app" style={footerLink}>
                            Visit Remi
                        </Link>{' '}
                        •
                        <Link href="https://remi.app/help" style={footerLink}>
                            Help Center
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
    padding: '32px 0',
};

const logoContainer = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
};

const logoBackground = {
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    padding: '12px',
    marginRight: '12px',
    boxShadow: '0 4px 12px rgba(96, 125, 139, 0.15)',
};

const logoText = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#607D8B',
    margin: '0',
    fontFamily: 'Georgia, serif',
};

const tagline = {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0',
    fontStyle: 'italic',
};

const welcomeSection = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '32px',
    marginBottom: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
};

const welcomeHeading = {
    fontSize: '28px',
    lineHeight: '1.3',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 16px 0',
    textAlign: 'center' as const,
};

const welcomeText = {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#4b5563',
    margin: '0',
    textAlign: 'center' as const,
};

const tipsSection = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '32px',
    marginBottom: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
};

const sectionHeading = {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 24px 0',
    textAlign: 'center' as const,
};

const tipCard = {
    display: 'flex',
    marginBottom: '24px',
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
};

const tipNumber = {
    backgroundColor: '#607D8B',
    color: '#ffffff',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    marginRight: '16px',
    flexShrink: 0,
};

const tipContent = {
    flex: 1,
};

const tipHeading = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 8px 0',
};

const tipText = {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#4b5563',
    margin: '0 0 12px 0',
};

const tipList = {
    margin: '0 0 12px 0',
    paddingLeft: '20px',
};

const tipListItem = {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#4b5563',
    marginBottom: '4px',
};

const ctaSection = {
    textAlign: 'center' as const,
    padding: '32px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    marginBottom: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
};

const ctaButton = {
    backgroundColor: '#607D8B',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '14px 28px',
    marginBottom: '12px',
};

const ctaSubtext = {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0',
};

const proTipSection = {
    marginBottom: '24px',
};

const proTipCard = {
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '8px',
    padding: '20px',
};

const proTipLabel = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#0369a1',
    margin: '0 0 8px 0',
};

const proTipText = {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#0c4a6e',
    margin: '0',
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

export default OnboardingWelcomeEmail;

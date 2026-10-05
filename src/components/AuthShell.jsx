import Logo from './Logo';

const steps = [
    ['01', 'Create your workspace', 'A home for your team and services.'],
    ['02', 'Connect your change events', 'Start with GitHub or send events through the API.'],
    ['03', 'Investigate what changed', 'Review the timeline and ranked signals in Rewind.'],
];

export default function AuthShell({ children, stage = 'signin' }) {
    return (
        <div className="min-h-screen bg-bg-primary text-foreground font-sans">
            <header className="border-b border-border px-6 sm:px-10 py-5 flex items-center justify-between gap-4">
                <Logo size="md" showText />
                <span className="font-mono text-[12px] text-muted-foreground uppercase tracking-[0.12em]">Workspace setup</span>
            </header>
            <main className="mx-auto max-w-[1120px] grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-20 px-6 sm:px-10 py-10 lg:py-16 items-start">
                <aside className="order-2 lg:order-1 lg:sticky lg:top-16">
                    <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-accent mb-5">Change context for incident response</p>
                    <h2 className="text-[36px] sm:text-[48px] leading-[1.06] tracking-[-0.045em] font-semibold max-w-[480px]">Production broke.<br /><span className="text-accent">What changed?</span></h2>
                    <p className="mt-5 text-[16px] leading-relaxed text-muted-foreground max-w-[440px]">Bring deploys and other change events into one timeline. Inspect the evidence before deciding what to do next.</p>
                    <div className="mt-8 border-t border-border pt-5">
                        <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted-foreground mb-4">What happens next</p>
                        <ol className="space-y-4">
                            {steps.map(([number, title, detail], index) => (
                                <li key={number} className={`${index > 0 ? 'hidden lg:flex' : 'flex'} gap-4 items-start`}>
                                    <span className="font-mono text-[12px] text-accent pt-0.5">{number}</span>
                                    <div><p className="text-[14px] font-medium">{title}</p><p className="text-[13px] leading-relaxed text-muted-foreground mt-1">{detail}</p></div>
                                </li>
                            ))}
                        </ol>
                        <p className="lg:hidden text-[13px] text-muted-foreground mt-3">Then connect change events and investigate in Rewind.</p>
                    </div>
                </aside>
                <section aria-label={stage === 'profile' ? 'Complete your profile' : 'Account access'} className="order-1 lg:order-2 min-w-0 bg-bg-surface border border-border rounded-[4px] p-6 sm:p-8">
                    <p className="font-mono uppercase tracking-[0.12em] text-[12px] text-accent mb-5">{stage === 'profile' ? '02 / Workspace details' : '01 / Account access'}</p>
                    {children}
                </section>
            </main>
        </div>
    );
}

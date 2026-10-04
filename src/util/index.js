// The support widget is opt-in. Loading it on every route allowed vendor auto-greetings
// to cover the sandbox; no undocumented vendor settings are needed here.
let supportLoading = false;
const contactCS = () => {
    if (window.Helploom) { window.Helploom('open'); return; }
    if (supportLoading) return;
    supportLoading = true;
    const script = document.createElement('script');
    script.src = '/helploom.js';
    script.onload = () => {
        supportLoading = false;
        window.Helploom?.('open');
    };
    script.onerror = () => {
        supportLoading = false;
        script.remove();
        alert('Support chat could not load. Please try again.');
    };
    document.body.appendChild(script);
};

export {
    contactCS
}

export const isIframe = globalThis.top !== globalThis.self

export const isDevelopment = globalThis.origin.includes('localhost')

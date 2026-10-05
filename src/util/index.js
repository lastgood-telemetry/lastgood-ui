// The support widget (Crisp) is opt-in. Loading it on every route let vendor
// auto-greetings cover the sandbox, so it only loads when the user asks for help.
const CRISP_WEBSITE_ID = 'b43bd032-f6c2-47fc-835a-c2a4cdcb067d';
let supportLoading = false;
const openCrisp = () => {
    window.$crisp.push(['do', 'chat:show']);
    window.$crisp.push(['do', 'chat:open']);
};
const contactCS = () => {
    if (window.$crisp && window.CRISP_WEBSITE_ID) { openCrisp(); return; }
    if (supportLoading) return;
    supportLoading = true;
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = CRISP_WEBSITE_ID;
    const script = document.createElement('script');
    script.src = 'https://client.crisp.chat/l.js';
    script.async = true;
    script.onload = () => {
        supportLoading = false;
        openCrisp();
    };
    script.onerror = () => {
        supportLoading = false;
        script.remove();
        window.$crisp = undefined;
        window.CRISP_WEBSITE_ID = undefined;
        alert('Support chat could not load. Please try again.');
    };
    document.head.appendChild(script);
};

export {
    contactCS
}

export const isIframe = globalThis.top !== globalThis.self

export const isDevelopment = globalThis.origin.includes('localhost')

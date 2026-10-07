// JWT claims only decide what to show. The API remains the authorization boundary.
export function sessionClaims(token) {
    try {
        const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(decodeURIComponent(Array.from(atob(payload), c => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`).join('')));
    } catch { return {}; }
}

export function inviteMessage(error) {
    const code = error?.response?.data?.code;
    const messages = {
        seat_limit: 'Your workspace has no available seats. Pending invites count toward the limit. Revoke a pending invite or ask your admin about your plan.',
        account_exists: 'This email already has a LastGood account. Existing accounts cannot join another workspace by invite.',
        account_or_invite_exists: 'This email already has an account or a pending invite. Check the pending list before trying again.',
        email_failed: 'The email could not be sent. The new link is no longer usable. Please try again.',
        admin_required: 'Only workspace admins can manage invites.',
        invalid_invite: 'This invite link is invalid. Ask your admin to resend it.',
        expired: 'This invite has expired. Ask your admin to resend it.',
        revoked: 'This invite was revoked. Ask your admin for a new invite.',
        accepted: 'This invite has already been accepted. Sign in if you already joined, or ask your admin for help.',
        invite_unavailable: 'This invite is no longer available. Refresh the pending list.',
    };
    return messages[code] || error?.response?.data?.message || 'Could not complete the request. Please try again.';
}

export function joinErrors(name, password) {
    if (!name.trim() || name.trim().length > 255) return 'Enter your name (up to 255 characters).';
    if (password.length < 8) return 'Use at least 8 characters for your password.';
    if (new TextEncoder().encode(password).length > 72) return 'Your password is too long. Use at most 72 bytes (fewer characters if using emoji).';
    return '';
}

export function inviteOAuthUrl(baseUrl, token, provider) {
    if (!/^[A-Za-z0-9_-]{43}$/.test(token || '') || !['google', 'github'].includes(provider)) return null;
    return `${baseUrl.replace(/\/$/, '')}/invites/${encodeURIComponent(token)}/oauth/${provider}`;
}

export function inviteOAuthError(code) {
    const messages = {
        email_mismatch: 'This account does not match the invited email. Try the Google or GitHub account the invite was sent to.',
        oauth_email_mismatch: 'This account does not match the invited email. Try the Google or GitHub account the invite was sent to.',
        expired: 'This invite has expired. Ask your admin to resend it.',
        revoked: 'This invite was revoked. Ask your admin for a new invite.',
        accepted: 'This invite has already been accepted. Sign in if you already joined.',
        invalid_invite: 'This invite link is invalid. Ask your admin to resend it.',
        account_exists: 'This email already has a LastGood account. Existing accounts cannot join another workspace by invite.',
        seat_limit: 'This workspace has no available seats. Ask your admin for help.',
        invalid_oauth_state: 'Your sign-in session expired or could not be verified. Open your invite link and try again.',
        unverified_email: 'Your provider email is not verified. Verify the invited email with Google or GitHub, then try again.',
        oauth_unavailable: 'This sign-in provider is not available right now. Try the other provider or ask your admin for help.',
        oauth_cancelled: 'Sign-in was cancelled. Choose Google or GitHub to try again.',
        oauth_failed: 'Sign-in could not be completed. Try again with the account the invite was sent to.',
        access_denied: 'Sign-in was cancelled. Choose Google or GitHub to try again.',
    };
    return messages[code] || 'Sign-in could not be completed. Try again with the account the invite was sent to.';
}

// Never use a provider/API error as an open redirect. Only return to this console's invite route.
export function inviteErrorDestination(value, origin) {
    if (!value) return null;
    try {
        const url = new URL(value, origin);
        if (url.origin !== origin || !/^\/invite\/[A-Za-z0-9_-]{43}$/.test(url.pathname)) return null;
        return url.pathname + url.search;
    } catch { return null; }
}

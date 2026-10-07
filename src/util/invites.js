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

export function workspaceSlug(value) {
    return value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

export function profileErrors(form) {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Enter your name.';
    if (!form.org_name.trim()) errors.org_name = 'Enter a workspace name.';
    if (!form.org_slug) errors.org_slug = 'Enter a workspace slug.';
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.org_slug)) errors.org_slug = 'Use letters and numbers separated by single hyphens, with no hyphen at either end.';
    if (form.provider === 'magic') Object.assign(errors, passwordErrors(form.password, form.confirmPassword));
    return errors;
}

export function passwordErrors(password = '', confirmPassword = '') {
    const errors = {};
    if (password.length < 12) errors.password = 'Use at least 12 characters.';
    else if (new TextEncoder().encode(password).length > 72) errors.password = 'Use at most 72 UTF-8 bytes.';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';
    return errors;
}

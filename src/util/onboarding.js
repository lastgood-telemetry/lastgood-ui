export function workspaceSlug(value) {
    return value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

export function profileErrors(form) {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Enter your name.';
    if (!form.org_name.trim()) errors.org_name = 'Enter a workspace name.';
    if (!form.org_slug) errors.org_slug = 'Enter a workspace slug.';
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.org_slug)) errors.org_slug = 'Use letters and numbers separated by single hyphens, with no hyphen at either end.';
    return errors;
}

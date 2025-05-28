export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove non-word characters
        .replace(/\s+/g, '-')      // Replace spaces with -
        .replace(/--+/g, '-')      // Replace multiple - with single -
        .trim();
}
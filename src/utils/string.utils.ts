export function isNullOrWhiteSpace(text: string) {
    return text === null || text === undefined || text === "" || text.trim() === "";
}
function generateRandomID(prefix: string) {
    const timestamp = Date.now(); // Current timestamp
    const randomSuffix = Math.random().toString(36).substring(2, 8); // Random alphanumeric string
    return `${prefix}-${timestamp}-${randomSuffix}`; // Combine for a unique ID
}
export { generateRandomID }
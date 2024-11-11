/**
 * Converts a number of seconds to a time string in the format "HH:MM:SS".
 * @param {number} seconds - The number of seconds to convert.
 * @returns {string} - The time string in the format "HH:MM:SS".
 */
export function secondsToTimeStamp(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const paddedHours = String(hours).padStart(2, '0');
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(secs).padStart(2, '0');

    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}
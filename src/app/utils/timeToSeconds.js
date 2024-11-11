/**
 * Converts a time string in the format "HH:MM:SS" to the total number of seconds.
 * @param {string} time - The time string to convert.
 * @returns {number} - The total number of seconds.
 */
export function timeToSeconds(h, m, s) {
    const hours = parseInt(h, 10);
    const minutes = parseInt(m, 10);
    const seconds = parseInt(s, 10);
    console.log('hours: ' + hours + ' minutes: ' + minutes + ' seconds: ' + seconds);
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    console.log('total seconds: ' + totalSeconds);
    return totalSeconds;
}
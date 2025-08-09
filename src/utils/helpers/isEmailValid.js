/**
 * Validates if the provided email string matches email format
 * @param {string} email - The email string to validate
 * @returns {boolean} - Returns true if email format is valid, false otherwise
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};
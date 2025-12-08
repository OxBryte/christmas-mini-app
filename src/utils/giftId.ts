/**
 * Generate a random 6-character alphanumeric code
 * Ensures the code always contains both letters and numbers
 */
export function generateGiftCode(): string {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  let code = "";

  // Ensure we have at least one letter and one number
  // Generate 3 random letters and 3 random numbers, then shuffle
  const letterChars: string[] = [];
  const numberChars: string[] = [];

  for (let i = 0; i < 3; i++) {
    letterChars.push(letters[Math.floor(Math.random() * letters.length)]);
    numberChars.push(numbers[Math.floor(Math.random() * numbers.length)]);
  }

  // Combine and shuffle
  const allChars = [...letterChars, ...numberChars];
  for (let i = allChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allChars[i], allChars[j]] = [allChars[j], allChars[i]];
  }

  return allChars.join("");
}

/**
 * Validate if a string is a valid gift ID code
 */
export function isValidGiftIdCode(code: string): boolean {
  const cleaned = code.trim().toLowerCase();
  if (cleaned.length !== 6) return false;
  if (!/^[0-9a-z]{6}$/.test(cleaned)) return false;
  
  // Ensure it has both letters and numbers
  const hasLetters = /[a-z]/.test(cleaned);
  const hasNumbers = /[0-9]/.test(cleaned);
  return hasLetters && hasNumbers;
}

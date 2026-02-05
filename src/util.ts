export function toTitleCase(str: string) {
  return str
    .toLowerCase() // 1. Convert the entire string to lowercase for consistency
    .split(' ')    // 2. Split the string into an array of individual words
    .map(word => { // 3. For each word in the array:
      // Capitalize the first character and concatenate the rest of the word
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');    // 4. Join the words back into a single string with spaces
}

export const acronyms = ["SIG", "ACM"]

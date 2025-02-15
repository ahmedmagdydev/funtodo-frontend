// Function to convert string to Uint8Array
const stringToBytes = (str: string): Uint8Array => {
  return new TextEncoder().encode(str);
};

// Function to convert ArrayBuffer to hex string
const bufferToHex = (buffer: ArrayBuffer): string => {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Generate a random salt
export const generateSalt = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return bufferToHex(array.buffer);
};

// Hash password with salt using SHA-256
export const hashPassword = async (password: string, salt: string): Promise<string> => {
  const passwordWithSalt = password + salt;
  const msgBuffer = stringToBytes(passwordWithSalt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return bufferToHex(hashBuffer);
};

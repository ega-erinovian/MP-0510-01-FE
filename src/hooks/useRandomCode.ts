// Import the crypto package
import { randomBytes } from "crypto";

// Custom hook to generate a random code
const useRandomCode = (): (() => string) => {
  // Function to generate a random code
  const generateCode = (): string => {
    // Generate random bytes and convert them to a string
    const randomBuffer = randomBytes(4); // 4 bytes = 8 hex characters, but we will slice for 6 characters

    // Convert to base64 and filter to use only safe characters for the web
    return randomBuffer
      .toString("base64")
      .replace(/[^a-zA-Z0-9]/g, "") // Remove non-alphanumeric characters
      .replace(/[O0Il]/g, "") // Remove characters that could be confusing (e.g., O, 0, I, l)
      .slice(0, 7);
  };

  return generateCode;
};

export default useRandomCode;

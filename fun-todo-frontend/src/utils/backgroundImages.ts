// Collection of curated background images from Picsum
// Each image is chosen for its professional and clean aesthetic
import bg1 from "../assets/bg1.png";
import bg2 from "../assets/bg2.png";
import bg3 from "../assets/bg3.png";
import bg4 from "../assets/bg4.png";

const backgroundImages = [bg1, bg2, bg3, bg4];

// Get a random background image URL
export const getRandomBackground = (): string => {
  // Get the current date to ensure the same background persists during a session
  const today = new Date().toDateString();

  // Create a simple hash of the date string
  const hash = today.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  // Use the hash to select an image
  const index = Math.abs(hash) % backgroundImages.length;
  return backgroundImages[index];
};

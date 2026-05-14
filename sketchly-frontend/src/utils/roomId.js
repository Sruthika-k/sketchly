/**
 * Room ID utility functions
 */

/**
 * Generate a unique 6-character alphanumeric room ID
 * @returns {string} Random room ID
 */
export const generateRoomId = () => {
  return Math.random().toString(36).substring(2, 8);
};

/**
 * Validate room ID format (6 lowercase alphanumeric characters)
 * @param {string} roomId - Room ID to validate
 * @returns {boolean} True if valid
 */
export const isValidRoomId = (roomId) => {
  return /^[a-z0-9]{6}$/.test(roomId);
};

/**
 * Get current room URL for sharing
 * @param {string} roomId - Room ID
 * @returns {string} Full shareable URL
 */
export const getRoomUrl = (roomId) => {
  return `${window.location.origin}/room/${roomId}`;
};

/**
 * Copy room link to clipboard
 * @param {string} roomId - Room ID
 * @returns {Promise<boolean>} True if copy succeeded
 */
export const copyRoomLink = async (roomId) => {
  try {
    const url = getRoomUrl(roomId);
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    console.error('Failed to copy room link:', error);
    return false;
  }
};
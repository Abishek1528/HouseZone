export const getTimeAgo = (createdAt) => {
  if (!createdAt) return 'Just now';
  const now = new Date();
  const created = new Date(createdAt);
  const diffInMs = now - created;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays < 0) return 'Just now';
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
  const weeks = Math.floor(diffInDays / 7);
  return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
};

export default { getTimeAgo };

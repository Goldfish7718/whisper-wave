export function getInitials(fullName: string) {
  const words = fullName.split(" ");
  const initials = words.map((word) => word[0].toUpperCase()).join("");
  return initials;
}

export const truncateString = (message: string) => {
  if (message.length > 50) {
    return `${message.substring(0, 20)}...`;
  }

  return message;
};

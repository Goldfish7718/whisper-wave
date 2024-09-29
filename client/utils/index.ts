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

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export const convertTime = (time: Date) => {
  return new Date(time).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

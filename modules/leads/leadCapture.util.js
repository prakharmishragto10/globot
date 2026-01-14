export const extractName = (text) => {
  if (!text) return null;

  const clean = text
    .replace(/my name is/i, "")
    .replace(/i am/i, "")
    .replace(/this is/i, "")
    .trim();

  // Allow only letters and spaces
  if (!/^[a-zA-Z ]{2,50}$/.test(clean)) return null;

  return clean;
};

export const extractEmail = (text) => {
  if (!text) return null;

  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

  return match ? match[0] : null;
};

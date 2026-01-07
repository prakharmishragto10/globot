export const detectIntent = (text) => {
  const message = text.toLowerCase();

  // Counselor request
  if (
    message.includes("talk to counselor") ||
    message.includes("human") ||
    message.includes("agent")
  ) {
    return "COUNSELOR_REQUEST";
  }

  // Country selection
  if (
    message.includes("canada") ||
    message.includes("uk") ||
    message.includes("usa") ||
    message.includes("australia") ||
    message.includes("europe")
  ) {
    return "COUNTRY_SELECTION";
  }

  // Course selection
  if (
    message.includes("mba") ||
    message.includes("ms") ||
    message.includes("ug") ||
    message.includes("pg") ||
    message.includes("diploma")
  ) {
    return "COURSE_SELECTION";
  }

  // Fees
  if (
    message.includes("fees") ||
    message.includes("cost") ||
    message.includes("tuition")
  ) {
    return "FEES_QUERY";
  }

  // Visa
  if (
    message.includes("visa") ||
    message.includes("permit") ||
    message.includes("pr")
  ) {
    return "VISA_QUERY";
  }

  // Tests
  if (
    message.includes("ielts") ||
    message.includes("pte") ||
    message.includes("toefl") ||
    message.includes("gre")
  ) {
    return "TEST_REQUIREMENT";
  }

  return "UNKNOWN";
};

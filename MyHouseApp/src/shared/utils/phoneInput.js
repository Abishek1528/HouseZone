export const sanitizePhoneInput = (value, maxLength = 10) =>
  String(value || "").replace(/\D/g, "").slice(0, maxLength);

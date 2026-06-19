import { PasswordStrength } from "./types";

/**
 * Strips any non-alphanumeric keyboard entries and applies CPF formatting (000.000.000-00)
 */
export function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, "");
  const d = digits.slice(0, 11);
  
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

/**
 * Securely masks a name so that no real personal information is fully visible
 * e.g., "Professor Fit Santana" -> "P******** F** S******"
 */
export function maskName(fullName: string): string {
  if (!fullName) return "";
  const parts = fullName.split(" ");
  return parts
    .map((part) => {
      if (part.length <= 2) return part;
      return `${part[0]}${"*".repeat(part.length - 2)}${part[part.length - 1]}`;
    })
    .join(" ");
}

/**
 * Securely masks a CPF, e.g., "111.222.333-44" -> "***.***.333-**"
 */
export function maskCpf(cpf: string): string {
  if (!cpf) return "";
  // Keep only a small portion visible for verification, mask the rest heavily.
  const clean = cpf.replace(/\D/g, "");
  if (clean.length < 11) return "***.***.***-**";
  return `***.***.${clean.slice(6, 9)}-**`;
}

/**
 * Securely masks a phone number, e.g., "11987654321" -> "+55 (11) 9****-4321"
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone) return "";
  const clean = phone.replace(/\D/g, "");
  if (clean.length < 10) return "(**) *****-****";
  const ddd = clean.slice(0, 2);
  const leadingDigit = clean.length === 11 ? clean[2] : "";
  const lastFour = clean.slice(-4);
  return `+55 (${ddd}) ${leadingDigit}****-${lastFour}`;
}

/**
 * Validates password rules and gives a live rating score from 0 up to 5 points
 */
export function calculatePasswordStrength(password: string): PasswordStrength {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  let score = 0;
  if (hasMinLength) score += 1;
  if (hasUppercase) score += 1;
  if (hasLowercase) score += 1;
  if (hasNumber) score += 1;
  if (hasSpecial) score += 1;

  return {
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial,
    score,
  };
}

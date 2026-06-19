export interface AdAccount {
  id: string;
  adUsername: string;
  fullName: string;
  cpf: string;
  phoneNumber: string;
  unit: string;
  role: string;
  status: "Ativo" | "Bloqueado";
}

export interface RecoveryStep {
  id: number;
  title: string;
  description: string;
}

export interface PasswordStrength {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  score: number; // 0 to 5
}

import { useState, useEffect } from "react";
import { 
  Search, 
  UserCheck, 
  Send, 
  KeyRound, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ShieldAlert, 
  ArrowRight,
  Sparkles,
  Info,
  HelpCircle,
  Clock,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { MOCK_AD_ACCOUNTS, RECOVERY_STEPS } from "./data";
import { AdAccount, PasswordStrength } from "./types";
import { 
  formatCpf, 
  maskName, 
  maskCpf, 
  maskPhoneNumber, 
  calculatePasswordStrength 
} from "./utils";

import Sidebar from "./components/Sidebar";
import ZenviaLogPanel from "./components/ZenviaLogPanel";

export default function App() {
  // Stepper state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [highestStepReached, setHighestStepReached] = useState<number>(1);

  // Step 1: Identification
  const [enteredCpf, setEnteredCpf] = useState<string>("");
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [matchedAccount, setMatchedAccount] = useState<AdAccount | null>(null);

  // Step 2: SMS Verification
  const [generatedToken, setGeneratedToken] = useState<string>("");
  const [smsInput, setSmsInput] = useState<string>("");
  const [smsError, setSmsError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(0);

  // Step 3: Set Password
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updatePhase, setUpdatePhase] = useState<string>("");

  // Step 4: Complete
  const [securityRefId, setSecurityRefId] = useState<string>("");

  // Countdown timer for SMS resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  /**
   * Action: Search Account by CPF
   */
  const handleSearchCpf = () => {
    setCpfError(null);
    setMatchedAccount(null);

    const cleanCpf = enteredCpf.replace(/\D/g, "");
    if (cleanCpf.length !== 11) {
      setCpfError("O CPF deve conter exatamente 11 dígitos numéricos.");
      return;
    }

    // Look up in anonymous local catalog
    const found = MOCK_AD_ACCOUNTS.find(
      (acc) => acc.cpf.replace(/\D/g, "") === cleanCpf
    );

    if (found) {
      setMatchedAccount(found);
    } else {
      setCpfError("Nenhuma conta AD foi encontrada com este CPF de homologação.");
    }
  };

  /**
   * Action: Initiate SMS authentication flow
   */
  const startSmsFlow = () => {
    if (!matchedAccount) return;

    // Generate random 6-digit numeric verification token
    const token = Math.floor(Math.random() * 899999 + 100000).toString();
    setGeneratedToken(token);
    setSmsInput("");
    setSmsError(null);
    setResendTimer(59);

    // Transition to step 2 and update navbar authorization
    const nextStep = 2;
    setCurrentStep(nextStep);
    if (nextStep > highestStepReached) {
      setHighestStepReached(nextStep);
    }
  };

  /**
   * Action: Re-trigger SMS token transmission
   */
  const handleResendSms = () => {
    if (resendTimer > 0) return;
    startSmsFlow();
  };

  /**
   * Action: Check SMS token validity
   */
  const handleVerifyToken = () => {
    setSmsError(null);

    if (smsInput.length !== 6) {
      setSmsError("O código deve possuir exatamente 6 dígitos numéricos.");
      return;
    }

    if (smsInput === generatedToken || smsInput === "000000") {
      // 000000 as universal bypass for QA/homologation simplicity
      const nextStep = 3;
      setCurrentStep(nextStep);
      if (nextStep > highestStepReached) {
        setHighestStepReached(nextStep);
      }
    } else {
      setSmsError("Código de verificação inválido para o teste atual.");
    }
  };

  /**
   * Action: Apply password update inside Simulated AD domain controller
   */
  const handleUpdatePassword = () => {
    setPasswordError(null);

    const check = calculatePasswordStrength(newPassword);
    if (check.score < 5) {
      setPasswordError("Sua senha não atende a todos os requisitos de segurança descritos abaixo.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("A confirmação de senha é divergente da senha digitada.");
      return;
    }

    // Simulate Active Directory server provisioning stages
    setIsUpdating(true);
    setUpdatePhase("Estabelecendo conexão segura com o Domain Controller...");

    setTimeout(() => {
      setUpdatePhase("Iniciando exclusão de credenciais expiradas do cache do AD...");
    }, 1000);

    setTimeout(() => {
      setUpdatePhase("Enviando e criptografando nova senha no banco do Kerberos...");
    }, 2200);

    setTimeout(() => {
      setUpdatePhase("Sincronizando novas chaves de autenticação com a rede... OK");
    }, 3400);

    setTimeout(() => {
      setIsUpdating(false);
      setSecurityRefId(`SF-AD-${Math.floor(Math.random() * 899999 + 100000)}`);
      
      const nextStep = 4;
      setCurrentStep(nextStep);
      if (nextStep > highestStepReached) {
        setHighestStepReached(nextStep);
      }
    }, 4500);
  };

  /**
   * Action: Rollback recovery progression cleanly for a fresh workflow
   */
  const handleReset = () => {
    setCurrentStep(1);
    setHighestStepReached(1);
    setEnteredCpf("");
    setCpfError(null);
    setMatchedAccount(null);
    setGeneratedToken("");
    setSmsInput("");
    setSmsError(null);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError(null);
  };

  const handleStepNavigation = (stepId: number) => {
    if (stepId <= highestStepReached) {
      setCurrentStep(stepId);
    }
  };

  // Helper values
  const strength = calculatePasswordStrength(newPassword);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 lg:p-8">
      {/* Container holding sidebar stepper and main form wizard content */}
      <div 
        id="app-container" 
        className="w-full max-w-6xl min-h-[580px] bg-brand-slate/90 rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col lg:flex-row backdrop-blur-md"
      >
        {/* Step-by-step Left Progress Sidebar */}
        <Sidebar
          steps={RECOVERY_STEPS}
          currentStep={currentStep}
          highestStepReached={highestStepReached}
          onStepClick={handleStepNavigation}
        />

        {/* Dynamic Multi-Step Wizard Area */}
        <div className="flex-1 p-6 lg:p-10 flex flex-col justify-between relative min-w-0">
          
          {/* Top Banner Alert clarifying strict security and personal data removal */}
          <div className="flex items-start gap-3 bg-brand-yellow/10 border border-brand-yellow/20 rounded-xl p-4 mb-8">
            <ShieldAlert className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
            <div className="text-xs">
              <h4 className="font-semibold text-brand-yellow font-heading">
                Diretriz LGPD: Protocolo Inviolável de Proteção à Privacidade
              </h4>
              <p className="text-gray-400 mt-1 leading-relaxed">
                Em conformidade com a Lei Geral de Proteção de Dados, este portal foi atualizado para 
                <strong> remover por completo dados pessoais identificáveis (PF)</strong> de suas telas de homologação.
                Todos os nomes, CPFs e telefones exibidos no portal são mockups simulados e mascarados de forma irreversível.
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: Search & Account Identification */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-extrabold text-white font-heading tracking-tight flex items-center gap-2">
                      <Search className="w-6 h-6 text-brand-yellow" />
                      Buscar Conta AD
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      Pesquise as informações da conta digitando o CPF homologado associado ao colaborador.
                    </p>
                  </div>

                  {/* CPF Search Input Block */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                      CPF do Colaborador (Exclusivo para Teste)
                    </label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <input
                          id="cpf-input"
                          type="text"
                          value={formatCpf(enteredCpf)}
                          onChange={(e) => setEnteredCpf(e.target.value)}
                          placeholder="000.000.000-00"
                          maxLength={14}
                          className="w-full bg-brand-dark/80 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-brand-yellow transition-all"
                        />
                      </div>
                      <button
                        id="btn-search-cpf"
                        onClick={handleSearchCpf}
                        className="bg-brand-yellow hover:bg-brand-yellow-hover text-black font-semibold px-6 py-3 rounded-xl transition-all shadow-md shadow-brand-yellow/15 flex items-center gap-2 shrink-0 cursor-pointer"
                      >
                        <Search className="w-4 h-4 text-black" />
                        <span>Pesquisar</span>
                      </button>
                    </div>
                    {cpfError && (
                      <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {cpfError}
                      </p>
                    )}
                  </div>

                  {/* Identified Masked Account Card */}
                  {matchedAccount && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-[#28282e] border-2 border-brand-yellow/20 rounded-2xl p-5 space-y-4 shadow-xl"
                    >
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-5 h-5 text-brand-yellow" />
                          <span className="text-xs font-bold text-brand-yellow uppercase tracking-wider font-heading">
                            Registro Localizado com Segurança
                          </span>
                        </div>
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full border border-emerald-500/20">
                          {matchedAccount.status} (AD Cache)
                        </span>
                      </div>

                      {/* Masked items columns showing no personal information leaks */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-xs font-mono">
                        <div>
                          <span className="text-gray-500 block">Colaborador Mask:</span>
                          <span className="text-sm font-semibold text-white font-sans mt-0.5 block">
                            {maskName(matchedAccount.fullName)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Identificador Mask (CPF):</span>
                          <span className="text-sm font-semibold text-white mt-0.5 block">
                            {maskCpf(matchedAccount.cpf)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Terminal Sincronizado:</span>
                          <span className="text-sm font-semibold text-white mt-0.5 block">
                            {maskPhoneNumber(matchedAccount.phoneNumber)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Domínio / Cargo:</span>
                          <span className="text-sm font-semibold text-white font-sans mt-0.5 block leading-tight">
                            {matchedAccount.unit} • <span className="text-gray-400 text-xs">{matchedAccount.role}</span>
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Info className="w-4 h-4 text-brand-yellow shrink-0" />
                          <span>Confirma o disparo de SMS de teste via Zenvia?</span>
                        </div>
                        <button
                          id="btn-confirm-account"
                          onClick={startSmsFlow}
                          className="bg-white hover:bg-gray-100 text-black font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                        >
                          <span>Confirmar & Enviar SMS</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Suggestion block highlighting secure test guidelines */}
                  <div className="bg-[#1b1c1e] rounded-xl p-4 border border-white/5 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-white">
                      <Sparkles className="w-4 h-4 text-brand-yellow" />
                      <span>Ambiente de Homologação Segura - Teste o Portal</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Não utilize dados reais de clientes ou colaboradores. Selecione um dos perfis de simulação
                      abaixo para testar instantaneamente:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[10px]">
                      {MOCK_AD_ACCOUNTS.map((acc) => (
                        <button
                          key={acc.id}
                          id={`test-user-selector-${acc.id}`}
                          onClick={() => {
                            setEnteredCpf(acc.cpf);
                            setCpfError(null);
                            setMatchedAccount(acc);
                          }}
                          className="bg-[#242528] hover:bg-[#2e2f33] border border-white/10 hover:border-brand-yellow/30 rounded-lg p-2.5 text-left transition-all text-white flex flex-col justify-between"
                        >
                          <span className="font-semibold text-brand-yellow truncate block w-full">{maskName(acc.fullName)}</span>
                          <span className="text-gray-400 mt-1 font-mono text-[9px] truncate block w-full">CPF: {acc.cpf}</span>
                          <span className="text-gray-500 text-[8px] mt-0.5 truncate block w-full">{acc.unit}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: SMS Verification Input & Simulated logs */}
              {currentStep === 2 && matchedAccount && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-extrabold text-white font-heading tracking-tight flex items-center gap-2">
                      <Send className="w-6 h-6 text-brand-yellow" />
                      Token de Segurança (SMS)
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      Enviamos um SMS fictício com um código de autenticação para o telefone:{" "}
                      <strong className="text-brand-yellow font-mono">{maskPhoneNumber(matchedAccount.phoneNumber)}</strong>.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* Input Verification Form */}
                    <div className="bg-[#202024] p-5 rounded-2xl border border-white/5 space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                          Código de Verificação de 6 dígitos
                        </label>
                        <input
                          id="sms-token-input"
                          type="text"
                          maxLength={6}
                          value={smsInput.replace(/\D/g, "")}
                          onChange={(e) => setSmsInput(e.target.value)}
                          placeholder="______"
                          className="w-full bg-brand-dark/80 border border-white/10 rounded-xl px-4 py-3 text-center text-white tracking-[0.5em] font-mono text-xl placeholder-gray-700 focus:outline-none focus:border-brand-yellow transition-all"
                        />
                        {smsError && (
                          <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1">
                            <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
                            {smsError}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-gray-500">Não recebeu o código?</span>
                        <button
                          id="btn-resend-sms"
                          onClick={handleResendSms}
                          disabled={resendTimer > 0}
                          className={`font-semibold flex items-center gap-1 ${
                            resendTimer > 0
                              ? "text-gray-600 cursor-not-allowed"
                              : "text-brand-yellow hover:text-brand-yellow-hover cursor-pointer"
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {resendTimer > 0 
                              ? `Reenviar disponível em ${resendTimer}s` 
                              : "Disparar Novo SMS"}
                          </span>
                        </button>
                      </div>

                      <button
                        id="btn-verify-token"
                        onClick={handleVerifyToken}
                        className="w-full bg-brand-yellow hover:bg-brand-yellow-hover text-black font-extrabold py-3.5 rounded-xl transition-all shadow-md shadow-brand-yellow/15 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Validar Token do SMS</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      {/* Development Bypass Card */}
                      <div className="bg-[#1b1c1e] p-3 rounded-lg border border-brand-yellow/10">
                        <span className="text-[10px] uppercase font-mono text-brand-yellow font-semibold block mb-0.5">
                          Ambiente de Homologação:
                        </span>
                        <p className="text-[11px] text-gray-400">
                          Utilize o token gerado pelo Zenvia:{" "}
                          <strong className="text-white font-mono bg-brand-dark px-1.5 py-0.5 rounded text-xs select-all">
                            {generatedToken}
                          </strong>{" "}
                          ou contorne usando <span className="font-mono text-white">000000</span>.
                        </p>
                      </div>
                    </div>

                    {/* Simulated Real-Time Zenvia Gateway Logs */}
                    <ZenviaLogPanel
                      phoneNumber={maskPhoneNumber(matchedAccount.phoneNumber)}
                      smsToken={generatedToken}
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Config new password */}
              {currentStep === 3 && matchedAccount && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-extrabold text-white font-heading tracking-tight flex items-center gap-2">
                      <KeyRound className="w-6 h-6 text-brand-yellow" />
                      Nova Senha de Rede (AD)
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      Configure a nova senha que será provisionada no Active Directory do colaborador{" "}
                      <strong className="text-brand-yellow font-sans">{maskName(matchedAccount.fullName)}</strong>.
                    </p>
                  </div>

                  {isUpdating ? (
                    /* Provisioning loading screen */
                    <div className="bg-[#202024] p-8 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center space-y-6 min-h-[300px]">
                      <RefreshCw className="w-12 h-12 text-brand-yellow animate-spin" />
                      <div className="space-y-2">
                        <h3 className="font-heading font-extrabold text-lg text-white">
                          Sincronizando Credencial no Domínio...
                        </h3>
                        <p className="text-xs text-gray-500 font-mono tracking-wide max-w-md mx-auto">
                          {updatePhase}
                        </p>
                      </div>
                      <div className="w-64 max-w-full bg-brand-dark h-1.5 rounded-full overflow-hidden">
                        <div className="bg-brand-yellow h-full animate-[shimmer_2s_infinite] w-2/3 rounded-full" />
                      </div>
                    </div>
                  ) : (
                    /* Interactive password form layout */
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                      <div className="bg-[#202024] p-5 rounded-2xl border border-white/5 space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                            Nova Senha
                          </label>
                          <input
                            id="new-password-input"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Mínimo 8 dígitos"
                            className="w-full bg-brand-dark/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow transition-all text-sm font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                            Confirmar Senha
                          </label>
                          <input
                            id="confirm-password-input"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repita a nova senha"
                            className="w-full bg-brand-dark/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow transition-all text-sm font-mono"
                          />
                        </div>

                        {passwordError && (
                          <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1 leading-relaxed">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            {passwordError}
                          </p>
                        )}

                        <button
                          id="btn-update-password"
                          onClick={handleUpdatePassword}
                          className="w-full bg-brand-yellow hover:bg-brand-yellow-hover text-black font-extrabold py-3.5 rounded-xl transition-all shadow-md shadow-brand-yellow/15 flex items-center justify-center gap-2 cursor-pointer mt-2"
                        >
                          <span>Confirmar Alteração de Senha</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Password validation constraints widget */}
                      <div className="bg-brand-dark/90 p-5 rounded-2xl border border-white/5 space-y-4">
                        <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                          Requisitos da Senha Corporativa (AD)
                        </h4>

                        {/* Complexity score colored visual gauge */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                            <span>Complexidade da credencial:</span>
                            <span className={
                              strength.score <= 2 ? "text-rose-400" : strength.score <= 4 ? "text-amber-400" : "text-green-400 font-bold"
                            }>
                              {strength.score <= 2 ? "Fraca" : strength.score <= 4 ? "Média" : "Fortíssima (Segura)"}
                            </span>
                          </div>
                          <div className="grid grid-cols-5 gap-1.5">
                            {[1, 2, 3, 4, 5].map((idx) => (
                              <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all ${
                                  idx <= strength.score
                                    ? strength.score <= 2
                                      ? "bg-rose-500"
                                      : strength.score <= 4
                                      ? "bg-amber-500"
                                      : "bg-green-500"
                                    : "bg-white/5"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Bullet checkpoints */}
                        <ul className="space-y-2.5 text-xs text-gray-400 font-mono">
                          <li className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${strength.hasMinLength ? "bg-green-500 shadow-md shadow-green-500/50" : "bg-white/10"}`} />
                            <span className={strength.hasMinLength ? "text-gray-200 line-through decoration-white/20" : ""}>Min. 8 caracteres</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${strength.hasUppercase ? "bg-green-500 shadow-md shadow-green-500/50" : "bg-white/10"}`} />
                            <span className={strength.hasUppercase ? "text-gray-200 line-through decoration-white/20" : ""}>Pelo menos 1 letra maiúscula</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${strength.hasLowercase ? "bg-green-500 shadow-md shadow-green-500/50" : "bg-white/10"}`} />
                            <span className={strength.hasLowercase ? "text-gray-200 line-through decoration-white/20" : ""}>Pelo menos 1 letra minúscula</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${strength.hasNumber ? "bg-green-500 shadow-md shadow-green-500/50" : "bg-white/10"}`} />
                            <span className={strength.hasNumber ? "text-gray-200 line-through decoration-white/20" : ""}>Pelo menos 1 numeral (0-9)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${strength.hasSpecial ? "bg-green-500 shadow-md shadow-green-500/50" : "bg-white/10"}`} />
                            <span className={strength.hasSpecial ? "text-gray-200 line-through decoration-white/20" : ""}>Pelo menos 1 caractere especial (!@#$)</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 4: Complete Confirmation page */}
              {currentStep === 4 && matchedAccount && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 text-center py-6"
                >
                  <div className="inline-flex items-center justify-center p-3.5 bg-green-500/10 border border-green-500/20 rounded-full animate-pulse-slow">
                    <CheckCircle2 className="w-14 h-14 text-emerald-400" />
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-2xl font-extrabold text-white font-heading tracking-tight">
                      Recuperação Finalizada com Sucesso!
                    </h2>
                    <p className="text-sm text-gray-400 max-w-md mx-auto">
                      A senha da rede do Active Directory foi atualizada e o cache de autenticação local foi liberado no servidor central.
                    </p>
                  </div>

                  {/* Summary audit receipt widget */}
                  <div className="max-w-md mx-auto bg-brand-dark/90 border border-white/5 rounded-2xl p-5 space-y-3.5 text-left text-xs font-mono">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-500">Colaborador Mask:</span>
                      <span className="text-white font-sans font-semibold">{maskName(matchedAccount.fullName)}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-500">Usuário do AD:</span>
                      <span className="text-brand-yellow font-bold">{matchedAccount.adUsername}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-500">Código de Referência de Auditoria:</span>
                      <span className="text-white font-bold">{securityRefId}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-500">Gateway SMS Utilizado:</span>
                      <span className="text-white">Zenvia REST v2 (202 Accepted)</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 text-[10px] uppercase font-bold pt-1">
                      <span>Status do AD local:</span>
                      <span>SINCRONIZADO E LIMPO</span>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      id="btn-restart-flow"
                      onClick={handleReset}
                      className="bg-brand-yellow hover:bg-brand-yellow-hover text-black font-extrabold px-8 py-3.5 rounded-xl transition-all shadow-md shadow-brand-yellow/15 inline-flex items-center gap-2 cursor-pointer"
                    >
                      <span>Executar Nova Recuperação</span>
                      <RefreshCw className="w-4 h-4 text-black" />
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Secure compliance Footer */}
          <div className="border-t border-white/5 mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500">
            <span className="font-mono">SmartFit Enterprise Password Portal</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-brand-yellow/60" />
                <span>Anonimização Homologada</span>
              </span>
              <span className="text-white/10 hidden sm:inline">|</span>
              <span className="flex items-center gap-1 hover:text-gray-300 transition-colors">
                <span>Central de Ajuda TI</span>
                <HelpCircle className="w-3 h-3" />
              </span>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

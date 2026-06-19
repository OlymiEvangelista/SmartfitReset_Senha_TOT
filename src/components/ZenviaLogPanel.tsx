import { useEffect, useState } from "react";
import { Terminal, Shield, RefreshCw } from "lucide-react";

interface ZenviaLogPanelProps {
  phoneNumber: string;
  smsToken: string;
}

export default function ZenviaLogPanel({ phoneNumber, smsToken }: ZenviaLogPanelProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => {
    if (!phoneNumber) {
      setLogs(["[SYSTEM]: Aguardando CPF válido para identificação da conta..."]);
      setStatus("idle");
      return;
    }

    setLogs([]);
    setStatus("sending");
    
    // Simulate gradual log generation for realistic terminal feel
    const timer1 = setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] INICIANDO REQUISIÇÃO DE DISPARO...`,
        `[INFO] Destinatário mascarado detectado: ${phoneNumber}`,
        `[INFO] Provedor selecionado: Zenvia SMS REST API v2`,
      ]);
    }, 200);

    const timer2 = setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] AUTH: Token de homologação validado com sucesso.`,
        `[INFO] Gerando token provisório de autenticação segura de 6 dígitos...`,
        `[INFO] Payload definido: { to: "${phoneNumber}", from: "SMARTFIT_AD", msg: "Seu codigo de recuperacao e ${smsToken}" }`,
      ]);
    }, 700);

    const timer3 = setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ENVIO: POST https://api.zenvia.com/v2/messages/sms`,
        `[SUCCESS] Resposta da API: 202 Accepted`,
        `[SUCCESS] Message ID: zen-msg-${Math.floor(Math.random() * 899999 + 100000)}`,
        `[INFO] SMS roteado com sucesso para a operadora de destino.`,
        `[SYSTEM]: Código ${smsToken} pronto para inserção no portal!`,
      ]);
      setStatus("sent");
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [phoneNumber, smsToken]);

  return (
    <div className="bg-[#0b0c10] border border-white/10 rounded-2xl p-4 lg:p-5 relative overflow-hidden shadow-inner">
      <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-gray-300">
          <Terminal className="w-4 h-4 text-brand-yellow" />
          <span>SIMULADOR DE LOGS: ZENVIA API</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${
            status === "idle" 
              ? "bg-gray-600" 
              : status === "sending" 
              ? "bg-amber-400 animate-pulse" 
              : "bg-green-400"
          }`} />
          <span className="text-[10px] font-mono uppercase text-gray-400">
            {status === "idle" ? "Ocioso" : status === "sending" ? "Processando" : "Enviado"}
          </span>
        </div>
      </div>

      {/* Terminal log output */}
      <div className="font-mono text-[11px] leading-relaxed text-gray-300 h-40 overflow-y-auto flex flex-col gap-1 select-none scrollbar-thin scrollbar-thumb-white/10">
        {logs.map((log, index) => {
          let textClass = "text-gray-400";
          if (log.includes("[SUCCESS]")) textClass = "text-green-400 font-medium";
          if (log.includes("[SYSTEM]")) textClass = "text-brand-yellow";
          if (log.includes("Auth") || log.includes("AUTH")) textClass = "text-cyan-400";

          return (
            <div key={index} className={textClass}>
              {log}
            </div>
          );
        })}
        {status === "sending" && (
          <div className="flex items-center gap-2 text-amber-400 text-[10px] italic mt-1 font-sans animate-pulse">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>Aguardando resposta do servidor da Zenvia...</span>
          </div>
        )}
      </div>

      <div className="mt-4 border-t border-white/5 pt-3 flex items-center justify-between text-[10px] text-gray-500 font-mono">
        <div className="flex items-center gap-1 text-[10px]">
          <Shield className="w-3.5 h-3.5 text-green-500/70" />
          <span>Encriptação AES-256 ativa</span>
        </div>
        <span>SmartFit Global Security AD</span>
      </div>
    </div>
  );
}

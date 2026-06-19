import { AdAccount } from "./types";

// Fully mock database containing 100% anonymous, safe, and fake test accounts only.
// There is absolutely no real-world personal information present here.
export const MOCK_AD_ACCOUNTS: AdAccount[] = [
  {
    id: "1",
    adUsername: "professor.treino",
    fullName: "Professor Fit Santana",
    cpf: "111.222.333-44",
    phoneNumber: "11987654321",
    unit: "Unidade Santana I",
    role: "Instrutor de Musculação",
    status: "Ativo"
  },
  {
    id: "2",
    adUsername: "recepcao.paulista",
    fullName: "Colaborador Recepção Paulista",
    cpf: "222.333.444-55",
    phoneNumber: "11999887766",
    unit: "Unidade Paulista III",
    role: "Recepcionista Pleno",
    status: "Ativo"
  },
  {
    id: "3",
    adUsername: "gerente.unidade",
    fullName: "Gestor Geral Fit Campinas",
    cpf: "333.444.555-66",
    phoneNumber: "19977665544",
    unit: "Unidade Campinas Centro",
    role: "Gerente de Operações",
    status: "Ativo"
  },
  {
    id: "4",
    adUsername: "mkt.central",
    fullName: "Analista Central Marketing",
    cpf: "444.555.666-77",
    phoneNumber: "11955443322",
    unit: "Escritório Corporativo",
    role: "Analista de Comunicação",
    status: "Bloqueado"
  }
];

export const RECOVERY_STEPS = [
  {
    id: 1,
    title: "Identificação",
    description: "Pesquise a conta corporativa via CPF de teste."
  },
  {
    id: 2,
    title: "Verificação SMS",
    description: "Digite o token enviado com segurança via Zenvia."
  },
  {
    id: 3,
    title: "Nova Senha do AD",
    description: "Configure os novos parâmetros de credenciais de rede."
  },
  {
    id: 4,
    title: "Conclusão",
    description: "Confirmação e reinicialização de cache completados."
  }
];

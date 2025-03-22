export interface Interessado {
  nome: string;
  email: string;
  telefone: string;
  tipoServico: 'agendamento' | 'orcamento';
  servicoDesejado: string;
  dataPreferida?: Date;
  horarioPreferido?: string;
  mensagem?: string;
} 
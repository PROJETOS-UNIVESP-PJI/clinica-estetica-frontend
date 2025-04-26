import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export enum ProcedureType {
  LIMPEZA_PELE = 'LIMPEZA_PELE',
  BOTOX = 'BOTOX',
  LASER_CLAREAMENTO = 'LASER_CLAREAMENTO',
  JATO_PLASMA = 'JATO_PLASMA',
  PEELING = 'PEELING',
  MICROAGULHAMENTO = 'MICROAGULHAMENTO',
  REVITALIZACAO_FACIAL = 'REVITALIZACAO_FACIAL',
  DEPILACAO_LASER = 'DEPILACAO_LASER',
  MASSAGEM_RELAXANTE = 'MASSAGEM_RELAXANTE',
  DRENAGEM_LINFATICA = 'DRENAGEM_LINFATICA',
  VENTOSSATERAPIA = 'VENTOSSATERAPIA',
  ACUPUNTURA = 'ACUPUNTURA',
  TAPPING = 'TAPPING',
  LASERTERAPIA = 'LASERTERAPIA',
  OZONIOTERAPIA = 'OZONIOTERAPIA',
  TRATAMENTO_GORDURA = 'TRATAMENTO_GORDURA',
  TRATAMENTO_CELULITE = 'TRATAMENTO_CELULITE',
  POS_OPERATORIO = 'POS_OPERATORIO'
}

export interface AgendamentoRequest {
  name: string;
  email: string;
  phone: string;
  procedureType: ProcedureType;
  scheduleDateTime: string;
  scheduleHours: string;
  message: string;
}

export interface OrcamentoRequest {
  name: string;
  email: string;
  phone: string;
  procedureType: ProcedureType;
  message: string;
}

export interface HorarioOcupado {
  horario: string;
  ocupado: boolean;
}

export interface Agendamento {
  id: number;
  name: string;
  email: string;
  phone: string;
  procedureType: ProcedureType;
  scheduleDateTime: string;
  scheduleHours: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private apiUrl = 'https://sleepy-everglades-97802-cdc3033e6535.herokuapp.com';

  constructor(private http: HttpClient) { }

  criarAgendamento(agendamento: AgendamentoRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/scheduling`, agendamento);
  }

  criarOrcamento(orcamento: OrcamentoRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/budget`, orcamento);
  }

  getHorariosOcupados(data: string): Observable<HorarioOcupado[]> {
    return this.http.get<HorarioOcupado[]>(`${this.apiUrl}/scheduling/hours/${data}`);
  }

  getAgendamentosPorData(data: string): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(`${this.apiUrl}/scheduling/${data}`);
  }
} 
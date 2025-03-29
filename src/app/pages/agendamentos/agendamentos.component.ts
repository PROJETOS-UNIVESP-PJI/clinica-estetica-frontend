import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DateFilterFn } from '@angular/material/datepicker';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { Moment } from 'moment';
import moment from 'moment';
import 'moment/locale/pt-br';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgendamentoService, ProcedureType, Agendamento } from '../../services/agendamento.service';
import { RouterLink } from '@angular/router';

// Registrar o locale pt-BR
registerLocaleData(localePt);

// Configurar o locale do moment
moment.locale('pt-br');

// Configurar o formato de data
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthLabel: 'MMM',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

interface HorarioStatus {
  horario: string;
  ocupado: boolean;
  agendamento?: Agendamento;
}

@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    RouterLink
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    provideMomentDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  templateUrl: './agendamentos.component.html',
  styleUrls: ['./agendamentos.component.css']
})
export class AgendamentosComponent implements OnInit {
  form: FormGroup;
  horarios: string[] = [];
  horariosOcupados: string[] = [];
  agendamentos: Agendamento[] = [];
  isLoading = false;
  minDate: Moment = moment();
  maxDate: Moment;
  ProcedureType = ProcedureType;
  dataSelecionada: Date | null = null;

  constructor(
    private fb: FormBuilder,
    private agendamentoService: AgendamentoService,
    private snackBar: MatSnackBar
  ) {
    this.maxDate = moment().add(30, 'days');
    
    // Gerar horários base (9h às 18h)
    for (let hora = 9; hora <= 18; hora++) {
      this.horarios.push(`${hora.toString().padStart(2, '0')}:00`);
    }

    this.form = this.fb.group({
      data: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Limpar os dados quando o componente é inicializado
    this.horariosOcupados = [];
    this.agendamentos = [];
    this.dataSelecionada = null;
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      const data = this.form.get('data')?.value;
      this.dataSelecionada = data;
      
      // Formatar a data para o formato esperado pela API (YYYY-MM-DD)
      const dataFormatada = moment(data).format('YYYY-MM-DD');
      
      // Buscar os agendamentos do dia
      this.agendamentoService.getAgendamentosPorData(dataFormatada).subscribe({
        next: (agendamentos) => {
          this.agendamentos = agendamentos;
          this.horariosOcupados = agendamentos.map(a => a.scheduleHours);
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open('Erro ao buscar agendamentos. Por favor, tente novamente.', 'Fechar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  isHorarioDisponivel(horario: string): boolean {
    if (!this.dataSelecionada) return false;
    
    const diaSemana = moment(this.dataSelecionada).day();
    const hora = parseInt(horario.split(':')[0]);
    
    // Segunda-feira (1) - 13h às 18h
    if (diaSemana === 1) {
      return hora >= 13 && hora <= 18;
    }
    
    // Terça a Sexta (2-5) - 9h às 18h
    if (diaSemana >= 2 && diaSemana <= 5) {
      return hora >= 9 && hora <= 18;
    }
    
    // Sábado e Domingo (0, 6) - não disponível
    return false;
  }

  getAgendamentoPorHorario(horario: string): Agendamento | undefined {
    return this.agendamentos.find(a => a.scheduleHours === horario);
  }

  getProcedureTypeLabel(type: ProcedureType): string {
    const labels: Record<ProcedureType, string> = {
      LIMPEZA_PELE: 'Limpeza de Pele',
      BOTOX: 'Botox',
      PREENCHIMENTO: 'Preenchimento',
      DEPILACAO_LASER: 'Depilação a Laser',
      TRATAMENTO_CAPILAR: 'Tratamento Capilar'
    };
    return labels[type] || type;
  }

  isWorkday: DateFilterFn<Moment | null> = (date: Moment | null): boolean => {
    if (!date) return false;
    const day = date.day();
    // Permitir apenas segunda a sexta
    return day >= 1 && day <= 5;
  }
} 
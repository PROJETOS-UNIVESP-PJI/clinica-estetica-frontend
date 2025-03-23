import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AgendamentoService, AgendamentoRequest, OrcamentoRequest, ProcedureType } from '../../services/agendamento.service';

declare var bootstrap: any;

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

interface Servico {
  titulo: string;
  descricao: string;
  imagem: string;
  enumValue: ProcedureType;
}

interface HorarioOcupado {
  scheduleHours: string;
}

@Component({
  selector: 'app-cadastro-interessados',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    provideMomentDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  templateUrl: './cadastro-interessados.component.html',
  styleUrls: ['./cadastro-interessados.component.css']
})
export class CadastroInteressadosComponent implements OnInit {
  cadastroForm!: FormGroup;
  servicos: Servico[] = [
    {
      titulo: 'Limpeza de Pele',
      descricao: 'Limpeza de pele profissional',
      imagem: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      enumValue: ProcedureType.LIMPEZA_PELE
    },
    {
      titulo: 'Botox',
      descricao: 'Toxina botulínica para rugas',
      imagem: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      enumValue: ProcedureType.BOTOX
    },
    {
      titulo: 'Preenchimento',
      descricao: 'Preenchimento facial com ácido hialurônico',
      imagem: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      enumValue: ProcedureType.PREENCHIMENTO
    },
    {
      titulo: 'Depilação a Laser',
      descricao: 'Depilação a laser',
      imagem: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      enumValue: ProcedureType.DEPILACAO_LASER
    },
    {
      titulo: 'Tratamento Capilar',
      descricao: 'Tratamentos para queda de cabelo',
      imagem: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      enumValue: ProcedureType.TRATAMENTO_CAPILAR
    }
  ];
  horarios: string[] = [];
  horariosOcupados: string[] = [];
  horariosDisponiveis: string[] = [];
  minDate: Moment = moment();
  maxDate: Moment;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private agendamentoService: AgendamentoService
  ) {
    this.maxDate = moment().add(30, 'days');
    
    // Gerar horários das 9h às 18h
    for (let hora = 9; hora <= 18; hora++) {
      this.horarios.push(`${hora.toString().padStart(2, '0')}:00`);
    }
  }

  ngOnInit() {
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)]],
      tipoServico: ['', Validators.required],
      servicoDesejado: ['', Validators.required],
      dataPreferida: ['', Validators.required],
      horarioPreferido: ['', Validators.required],
      mensagem: ['']
    });

    // Observar mudanças no tipo de serviço
    this.cadastroForm.get('tipoServico')?.valueChanges.subscribe(value => {
      if (value === 'agendamento') {
        this.cadastroForm.get('dataPreferida')?.setValidators([Validators.required]);
        this.cadastroForm.get('horarioPreferido')?.setValidators([Validators.required]);
      } else {
        this.cadastroForm.get('dataPreferida')?.clearValidators();
        this.cadastroForm.get('horarioPreferido')?.clearValidators();
      }
      this.cadastroForm.get('dataPreferida')?.updateValueAndValidity();
      this.cadastroForm.get('horarioPreferido')?.updateValueAndValidity();
    });

    // Observar mudanças na data
    this.cadastroForm.get('dataPreferida')?.valueChanges.subscribe((data: Moment) => {
      if (data) {
        // Formatar a data para o formato esperado pela API (YYYY-MM-DD)
        const dataFormatada = data.format('YYYY-MM-DD');
        
        // Buscar horários ocupados
        this.agendamentoService.getHorariosOcupados(dataFormatada).subscribe({
          next: (horariosOcupados) => {
            // Extrair apenas os horários dos objetos recebidos
            this.horariosOcupados = horariosOcupados.map((ocupado: any) => ocupado.scheduleHours);
            
            // Filtrar horários disponíveis
            this.horariosDisponiveis = this.horarios.filter(horario => 
              !this.horariosOcupados.includes(horario)
            );
            
            // Limpar o horário selecionado quando a data mudar
            this.cadastroForm.get('horarioPreferido')?.setValue('');
          },
          error: (error) => {
            this.mostrarErro('Erro ao buscar horários disponíveis. Por favor, tente novamente.');
          }
        });
      } else {
        // Resetar horários disponíveis quando não houver data selecionada
        this.horariosDisponiveis = [];
        this.cadastroForm.get('horarioPreferido')?.setValue('');
      }
    });
  }

  onSubmit() {
    if (this.cadastroForm.valid) {
      const formValue = this.cadastroForm.value;
      
      // Encontrar o serviço selecionado
      const servicoSelecionado = this.servicos.find(s => s.titulo === formValue.servicoDesejado);
      
      if (formValue.tipoServico === 'agendamento') {
        // Preparar dados para a API de agendamento
        const agendamentoRequest: AgendamentoRequest = {
          name: formValue.nome,
          email: formValue.email,
          phone: formValue.telefone.replace(/\D/g, ''), // Remove formatação do telefone
          procedureType: servicoSelecionado?.enumValue || ProcedureType.LIMPEZA_PELE,
          scheduleDateTime: moment(formValue.dataPreferida).format('YYYY-MM-DD'),
          scheduleHours: formValue.horarioPreferido,
          message: formValue.mensagem || ''
        };

        // Chamar a API de agendamento
        this.agendamentoService.criarAgendamento(agendamentoRequest).subscribe({
          next: (response) => {
            this.mostrarModalConfirmacao();
          },
          error: (error) => {
            this.mostrarErro('Erro ao criar agendamento. Por favor, tente novamente.');
          }
        });
      } else {
        // Preparar dados para a API de orçamento
        const orcamentoRequest: OrcamentoRequest = {
          name: formValue.nome,
          email: formValue.email,
          phone: formValue.telefone.replace(/\D/g, ''), // Remove formatação do telefone
          procedureType: servicoSelecionado?.enumValue || ProcedureType.LIMPEZA_PELE,
          message: formValue.mensagem || ''
        };

        // Chamar a API de orçamento
        this.agendamentoService.criarOrcamento(orcamentoRequest).subscribe({
          next: (response) => {
            this.mostrarModalConfirmacao();
          },
          error: (error) => {
            this.mostrarErro('Erro ao solicitar orçamento. Por favor, tente novamente.');
          }
        });
      }
    }
  }

  private mostrarModalConfirmacao() {
    const modalElement = document.getElementById('modalConfirmacao');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }

    // Limpar formulário após o modal ser fechado
    modalElement?.addEventListener('hidden.bs.modal', () => {
      this.cadastroForm.reset();
    }, { once: true });
  }

  private mostrarErro(mensagem: string) {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  // Função para verificar se a data é um dia útil (segunda a sexta)
  isWorkday: DateFilterFn<Moment | null> = (date: Moment | null): boolean => {
    if (!date) return false;
    const day = date.day();
    // Retorna true para segunda (1) a sexta (5), permitindo a seleção
    // Retorna false para sábado (6) e domingo (0), desabilitando esses dias
    return day >= 1 && day <= 5;
  }

  // Função para formatar o telefone
  formatarTelefone(event: Event): void {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, '');
    
    if (valor.length > 11) {
      valor = valor.slice(0, 11);
    }
    
    if (valor.length > 2) {
      valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
    }
    
    if (valor.length > 10) {
      valor = `${valor.slice(0, 10)}-${valor.slice(10)}`;
    }
    
    this.cadastroForm.patchValue({ telefone: valor });
  }

  // Método para verificar se um horário está disponível
  isHorarioDisponivel(horario: string): boolean {
    return !this.horariosOcupados.includes(horario);
  }
}

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
    // Serviços Faciais
    {
      titulo: 'Limpeza de Pele',
      descricao: 'Limpeza de pele profissional',
      imagem: 'assets/images/limpeza-pele.jpg',
      enumValue: ProcedureType.LIMPEZA_PELE
    },
    {
      titulo: 'Botox',
      descricao: 'Toxina botulínica para rugas',
      imagem: 'assets/images/botox.jpg',
      enumValue: ProcedureType.BOTOX
    },
    {
      titulo: 'Laser para Clareamento de Manchas',
      descricao: 'Tratamento a laser para clareamento de manchas',
      imagem: 'assets/images/laser-clareamento.jpg',
      enumValue: ProcedureType.LASER_CLAREAMENTO
    },
    {
      titulo: 'Jato de Plasma',
      descricao: 'Tratamento com jato de plasma',
      imagem: 'assets/images/jato-plasma.jpg',
      enumValue: ProcedureType.JATO_PLASMA
    },
    {
      titulo: 'Peelings',
      descricao: 'Tratamentos com peelings',
      imagem: 'assets/images/peeling.jpg',
      enumValue: ProcedureType.PEELING
    },
    {
      titulo: 'Microagulhamento',
      descricao: 'Tratamento com microagulhamento',
      imagem: 'assets/images/microagulhamento.jpg',
      enumValue: ProcedureType.MICROAGULHAMENTO
    },
    {
      titulo: 'Revitalização Facial',
      descricao: 'Tratamento de revitalização facial',
      imagem: 'assets/images/revitalizacao.jpg',
      enumValue: ProcedureType.REVITALIZACAO_FACIAL
    },
    // Serviços Corporais
    {
      titulo: 'Depilação a Laser',
      descricao: 'Depilação a laser',
      imagem: 'assets/images/depilacao-laser.jpg',
      enumValue: ProcedureType.DEPILACAO_LASER
    },
    {
      titulo: 'Massagem Relaxante',
      descricao: 'Massagem relaxante',
      imagem: 'assets/images/massagem-relaxante.jpg',
      enumValue: ProcedureType.MASSAGEM_RELAXANTE
    },
    {
      titulo: 'Massagem Modeladora',
      descricao: 'Massagem modeladora',
      imagem: 'assets/images/massagem-modeladora.jpg',
      enumValue: ProcedureType.MASSAGEM_RELAXANTE
    },
    {
      titulo: 'Drenagem Linfática',
      descricao: 'Drenagem linfática',
      imagem: 'assets/images/drenagem-linfatica.jpg',
      enumValue: ProcedureType.DRENAGEM_LINFATICA
    },
    {
      titulo: 'Ventosaterapia',
      descricao: 'Tratamento com ventosas',
      imagem: 'assets/images/ventosaterapia.jpg',
      enumValue: ProcedureType.VENTOSSATERAPIA
    },
    {
      titulo: 'Acupuntura e Auriculoterapia',
      descricao: 'Tratamento com acupuntura e auriculoterapia',
      imagem: 'assets/images/acupuntura.jpg',
      enumValue: ProcedureType.ACUPUNTURA
    },
    {
      titulo: 'Aplicação de Tapping',
      descricao: 'Tratamento com tapping',
      imagem: 'assets/images/tapping.jpg',
      enumValue: ProcedureType.TAPPING
    },
    {
      titulo: 'Laserterapia',
      descricao: 'Tratamento com laserterapia',
      imagem: 'assets/images/laserterapia.jpg',
      enumValue: ProcedureType.LASERTERAPIA
    },
    {
      titulo: 'Ozonioterapia',
      descricao: 'Tratamento com ozonioterapia',
      imagem: 'assets/images/ozonioterapia.jpg',
      enumValue: ProcedureType.OZONIOTERAPIA
    },
    {
      titulo: 'Tratamento para Gordura Localizada',
      descricao: 'Tratamento para gordura localizada',
      imagem: 'assets/images/gordura-localizada.jpg',
      enumValue: ProcedureType.TRATAMENTO_GORDURA
    },
    {
      titulo: 'Tratamento para Celulite',
      descricao: 'Tratamento para celulite',
      imagem: 'assets/images/celulite.jpg',
      enumValue: ProcedureType.TRATAMENTO_CELULITE
    },
    {
      titulo: 'Pós Operatório de Cirurgia Plástica',
      descricao: 'Tratamento pós operatório de cirurgia plástica',
      imagem: 'assets/images/pos-operatorio.jpg',
      enumValue: ProcedureType.POS_OPERATORIO
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
    
    // Gerar horários base (9h às 18h)
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
            
            // Filtrar horários disponíveis considerando o dia da semana
            this.horariosDisponiveis = this.horarios.filter(horario => {
              const diaSemana = data.day();
              const hora = parseInt(horario.split(':')[0]);
              
              // Segunda-feira (1) - 13h às 18h
              if (diaSemana === 1) {
                return hora >= 13 && hora <= 18 && !this.horariosOcupados.includes(horario);
              }
              
              // Terça a Sexta (2-5) - 9h às 18h
              if (diaSemana >= 2 && diaSemana <= 5) {
                return hora >= 9 && hora <= 18 && !this.horariosOcupados.includes(horario);
              }
              
              // Sábado e Domingo (0, 6) - não disponível
              return false;
            });
            
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
    // Permitir apenas segunda a sexta
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
    if (!this.cadastroForm.get('dataPreferida')?.value) return false;
    
    const diaSemana = moment(this.cadastroForm.get('dataPreferida')?.value).day();
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
}

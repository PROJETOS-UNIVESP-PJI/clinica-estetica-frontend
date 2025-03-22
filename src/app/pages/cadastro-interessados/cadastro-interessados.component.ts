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

// Registrar o locale pt-BR
registerLocaleData(localePt);

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
      descricao: 'Tratamento profissional para remover impurezas e revitalizar sua pele.',
      imagem: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    },
    {
      titulo: 'Botox',
      descricao: 'Tratamento seguro e eficaz para suavizar linhas de expressão.',
      imagem: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    },
    {
      titulo: 'Preenchimento',
      descricao: 'Recupere o volume natural do seu rosto com produtos de alta qualidade.',
      imagem: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    },
    {
      titulo: 'Depilação a Laser',
      descricao: 'Remoção definitiva de pelos com tecnologia de ponta.',
      imagem: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    },
    {
      titulo: 'Tratamento Capilar',
      descricao: 'Recupere a saúde e beleza dos seus cabelos com tratamentos especializados.',
      imagem: 'https://images.unsplash.com/photo-1595475884562-073c30d45670?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    }
  ];
  horarios: string[] = [];
  minDate: Moment;
  maxDate: Moment;

  constructor(private fb: FormBuilder) {
    // Definir data mínima como hoje
    this.minDate = moment();
    
    // Definir data máxima como 30 dias a partir de hoje
    this.maxDate = moment().add(30, 'days');
    
    // Gerar horários das 8h às 17h
    for (let hora = 8; hora <= 17; hora++) {
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
      dataPreferida: [''],
      horarioPreferido: [''],
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
  }

  onSubmit() {
    if (this.cadastroForm.valid) {
      console.log('Dados do interessado:', this.cadastroForm.value);
      alert('Cadastro realizado com sucesso!');
      this.cadastroForm.reset();
    }
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
  formatarTelefone(event: any) {
    let valor = event.target.value.replace(/\D/g, '');
    if (valor.length > 11) valor = valor.slice(0, 11);
    
    if (valor.length > 2) {
      valor = `(${valor.slice(0,2)}) ${valor.slice(2)}`;
    }
    if (valor.length > 10) {
      valor = `${valor.slice(0,10)}-${valor.slice(10)}`;
    }
    
    this.cadastroForm.patchValue({ telefone: valor });
  }
}

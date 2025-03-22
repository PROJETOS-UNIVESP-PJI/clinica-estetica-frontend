import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Interessado } from '../../interfaces/interessado.interface';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cadastro-interessados',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro-interessados.component.html',
  styleUrls: ['./cadastro-interessados.component.css']
})
export class CadastroInteressadosComponent {
  cadastroForm: FormGroup;
  servicos = [
    'Limpeza de Pele',
    'Botox',
    'Preenchimento',
    'Depilação a Laser',
    'Tratamento Capilar',
    'Outro'
  ];

  constructor(private fb: FormBuilder) {
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required]],
      tipoServico: ['', [Validators.required]],
      servicoDesejado: ['', [Validators.required]],
      dataPreferida: [''],
      horarioPreferido: [''],
      mensagem: ['']
    });
  }

  onSubmit() {
    if (this.cadastroForm.valid) {
      const interessado: Interessado = this.cadastroForm.value;
      console.log('Dados do interessado:', interessado);
      // Aqui você pode implementar a lógica para enviar os dados para o backend
      alert('Cadastro realizado com sucesso! Entraremos em contato em breve.');
      this.cadastroForm.reset();
    }
  }
}

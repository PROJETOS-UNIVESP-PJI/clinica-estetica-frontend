import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter, withHashLocation } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CadastroInteressadosComponent } from './pages/cadastro-interessados/cadastro-interessados.component';
import { AgendamentosComponent } from './pages/agendamentos/agendamentos.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cadastro', component: CadastroInteressadosComponent },
  { path: 'agendamentos', component: AgendamentosComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { } 
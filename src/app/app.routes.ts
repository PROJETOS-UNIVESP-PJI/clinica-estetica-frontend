import { Routes } from '@angular/router';
import { CadastroInteressadosComponent } from './pages/cadastro-interessados/cadastro-interessados.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cadastro', component: CadastroInteressadosComponent },
  { path: '**', redirectTo: '' }
];

import { Routes } from '@angular/router';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { HomeComponent } from './components/home/home';

export const routes: Routes = [
  // Redirección raíz
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Vistas principales
  { path: 'home', component: HomeComponent },
  { path: 'register', component: Register },
  { path: 'login', component: Login },

  // Ruta por defecto si no existe (404)
  { path: '**', redirectTo: 'home' },
];

import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './services/home';

import { HomeComponent } from './components/home/home';
import { Register } from './components/register/register';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: '**', redirectTo: 'home' },
];

import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './services/home';

import { HomeComponent } from './components/home/home';
import { Register } from './components/register/register';
import { Admin } from './components/admin/admin';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: Register },
  { path: 'login', component: Admin },
  { path: '**', redirectTo: 'home' },
];

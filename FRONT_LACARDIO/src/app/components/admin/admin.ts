import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Libros } from './libros/libros';
import { Reportes } from './reportes/reportes';
import { Masivopacientes } from './masivopacientes/masivopacientes';

@Component({
  selector: 'app-admin',
  imports: [MatTabsModule, Libros,Reportes,Masivopacientes],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {

}

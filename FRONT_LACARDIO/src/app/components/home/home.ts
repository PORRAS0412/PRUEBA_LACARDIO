import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    NgFor
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class HomeComponent {
  servicios = [
    { title: 'Urgencias', icon: 'local_hospital', desc: 'Atención inmediata 24/7 para emergencias.' },
    { title: 'Citas Médicas', icon: 'event', desc: 'Agenda tu cita con especialistas certificados.' },
    { title: 'Vacunación', icon: 'vaccines', desc: 'Esquemas completos para niños y adultos.' },
    { title: 'Laboratorio', icon: 'science', desc: 'Resultados rápidos y confiables.' }
  ];
}

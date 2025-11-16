import { AfterViewInit, Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { Paciente } from '../../../services/paciente';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
   CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './reportes.html',
  styleUrl: './reportes.scss',
})
export class Reportes implements OnInit{
  pacientes: any[] = [];
  filtrados: any[] = [];

  topCapacidad: any[] = [];
  topDeudas: any[] = [];

  columnas = ['nombre', 'doc', 'cap', 'riesgo'];

  promedioIngresos = 0;
  promedioRiesgo = 0;
  promedioEdad = 0;

  busqueda = '';

  chartRiesgo: any;
  chartSexo: any;
  chartEdad: any;
  chartIngresos: any;
  chartRegistro: any;

  constructor(private pacienteSrv: Paciente) {}

  ngOnInit() {
    this.cargarPacientes();
  }

  // =====================================
  // CARGA PRINCIPAL
  // =====================================
  cargarPacientes() {
    this.pacienteSrv.getPacientes().subscribe((res: any) => {
      this.pacientes = res.body || res;
      this.filtrados = [...this.pacientes];

      this.calcularReportes();
    });
  }

  // =====================================
  // CALCULO GENERAL
  // =====================================
  calcularReportes() {
    this.calcularPromedios();
    this.calcularTops();

    this.graficaRiesgo();
    this.graficaSexo();
    this.graficaEdades();
    this.graficaIngresos();
    this.graficaRegistros();
  }

  calcularPromedios() {
    const ingresos = this.pacientes.map(p => Number(p.ingresos_mensuales || 0));
    const riesgos = this.pacientes.map(p => Number(p.puntaje_riesgo || 0));

    this.promedioIngresos = ingresos.reduce((a, b) => a + b, 0) / ingresos.length;
    this.promedioRiesgo = riesgos.reduce((a, b) => a + b, 0) / riesgos.length;

    // Edad promedio
    const edades = this.pacientes.map(p => {
      const f = new Date(p.fecha_nacimiento);
      return new Date().getFullYear() - f.getFullYear();
    });
    this.promedioEdad = Math.round(edades.reduce((a, b) => a + b, 0) / edades.length);
  }

  calcularTops() {
    this.topCapacidad = [...this.pacientes]
      .sort((a, b) => b.capacidad_pago - a.capacidad_pago)
      .slice(0, 10);

    this.topDeudas = [...this.pacientes]
      .sort((a, b) => b.deudas - a.deudas)
      .slice(0, 10);
  }

  // =====================================
  // BUSCADOR
  // =====================================
  buscar() {
    const txt = this.busqueda.toLowerCase();

    this.filtrados = this.pacientes.filter(p =>
      p.nombres?.toLowerCase().includes(txt) ||
      p.apellidos?.toLowerCase().includes(txt) ||
      p.numero_documento?.toLowerCase().includes(txt)
    );
  }

  // =====================================
  // GRAFICAS
  // =====================================

  graficaRiesgo() {
    if (this.chartRiesgo) this.chartRiesgo.destroy();

    const riesgoCount: any = {};

    this.pacientes.forEach(p => {
      const r = p.puntaje_riesgo ?? 0;
      riesgoCount[r] = (riesgoCount[r] || 0) + 1;
    });

    this.chartRiesgo = new Chart('riesgoChart', {
      type: 'bar',
      data: {
        labels: Object.keys(riesgoCount),
        datasets: [
          { label: 'Pacientes', data: Object.values(riesgoCount) }
        ]
      }
    });
  }

  graficaSexo() {
    if (this.chartSexo) this.chartSexo.destroy();

    const count = { M: 0, F: 0 };

    this.pacientes.forEach(p => {
      if (p.sexo === 'M') count.M++;
      if (p.sexo === 'F') count.F++;
    });

    this.chartSexo = new Chart('sexoChart', {
      type: 'pie',
      data: {
        labels: ['Hombres', 'Mujeres'],
        datasets: [{ data: [count.M, count.F] }]
      }
    });
  }

  graficaEdades() {
    if (this.chartEdad) this.chartEdad.destroy();

    const edades = this.pacientes.map(p => {
      const f = new Date(p.fecha_nacimiento);
      return new Date().getFullYear() - f.getFullYear();
    });

    this.chartEdad = new Chart('edadChart', {
      type: 'line',
      data: {
        labels: this.pacientes.map(p => p.nombres),
        datasets: [{ label: 'Edad', data: edades }]
      }
    });
  }

  graficaIngresos() {
    if (this.chartIngresos) this.chartIngresos.destroy();

    this.chartIngresos = new Chart('ingresosChart', {
      type: 'bar',
      data: {
        labels: this.pacientes.map(p => p.nombres),
        datasets: [
          { label: 'Ingresos', data: this.pacientes.map(p => p.ingresos_mensuales) },
          { label: 'Gastos', data: this.pacientes.map(p => p.gastos_mensuales) }
        ]
      }
    });
  }

  graficaRegistros() {
    if (this.chartRegistro) this.chartRegistro.destroy();

    const countMes: any = {};
    this.pacientes.forEach(p => {
      const mes = new Date(p.fecha_registro).getMonth() + 1;
      countMes[mes] = (countMes[mes] || 0) + 1;
    });

    this.chartRegistro = new Chart('registroChart', {
      type: 'line',
      data: {
        labels: Object.keys(countMes),
        datasets: [
          { label: 'Registros', data: Object.values(countMes) }
        ]
      }
    });
  }
}

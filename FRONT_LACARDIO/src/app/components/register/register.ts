import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Paciente } from '../../services/paciente';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  standalone: true
})
export class Register {
  pacienteForm: FormGroup;

  tiposDocumento = ['CC', 'TI', 'CE', 'RC'];
  sexos = ['M', 'F', 'Otro'];

  constructor(
    private fb: FormBuilder,
    private pacienteService: Paciente,
    private snackBar: MatSnackBar
  ) {
    this.pacienteForm = this.fb.group({
      paciente: this.fb.group({
        id: [0],
        tipo_documento: ['', Validators.required],
        numero_documento: ['', [Validators.required, Validators.pattern(/^\d{1,15}$/)]],
        nombres: ['', Validators.required],
        apellidos: ['', Validators.required],
        fecha_nacimiento: ['', Validators.required],
        sexo: ['', Validators.required],
        correo: ['', [Validators.required, Validators.email]],
        telefono: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
        direccion: ['', Validators.required],
      }),
      financiero: this.fb.group({
        ingresos_mensuales: [0, [Validators.required, Validators.min(0)]],
        gastos_mensuales: [0, [Validators.required, Validators.min(0)]],
        deudas: [0, [Validators.required, Validators.min(0)]],
        capacidad_pago: [{ value: 0, disabled: true }], // calculada automáticamente
        puntaje_riesgo: [{ value: 0, disabled: true }] // calculado automáticamente
      }),
      complementario: this.fb.group({
        contacto_emergencia: ['', Validators.required],
        telefono_emergencia: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
        alergias: [''],
        enfermedades: [''],
        observaciones: [''],
      }),
    });

    // Suscribirse a cambios en ingresos, gastos y deudas para calcular capacidad y riesgo
    this.pacienteForm.get('financiero')?.valueChanges.subscribe(value => {
      const ingresos = value.ingresos_mensuales || 0;
      const gastos = value.gastos_mensuales || 0;
      const deudas = value.deudas || 0;

      // Capacidad de pago = 15% del sobrante
      const capacidad = Math.max(0, (ingresos - gastos - deudas) * 0.15);
      this.pacienteForm.get('financiero.capacidad_pago')?.setValue(capacidad, { emitEvent: false });

      // Puntaje de riesgo según capacidad
      let riesgo = 1; // bajo por defecto
      if (capacidad <= 100) riesgo = 5;      // alto riesgo
      else if (capacidad <= 500) riesgo = 3; // riesgo medio
      else riesgo = 1;                        // riesgo bajo

      this.pacienteForm.get('financiero.puntaje_riesgo')?.setValue(riesgo, { emitEvent: false });
    });
  }

  enviarFormulario(): void {
    if (this.pacienteForm.invalid) {
      this.snackBar.open('Por favor completa todos los campos requeridos correctamente', 'Cerrar', { duration: 3000 });
      return;
    }

    this.pacienteService.crearPaciente(this.pacienteForm.value).subscribe({
      next: () => {
        this.snackBar.open('Paciente registrado correctamente', 'Cerrar', { duration: 3000 });
        this.pacienteForm.reset();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.snackBar.open(`Error al registrar el paciente: ${err.error.msg?.detail || err.message}`, 'Cerrar', { duration: 3000 });
      }
    });
  }

  get explicacionCapacidad(): string {
  const fin = this.pacienteForm.get('financiero')?.value;
  if (!fin) return '';
  const ingresos = fin.ingresos_mensuales || 0;
  const gastos = fin.gastos_mensuales || 0;
  const deudas = fin.deudas || 0;
  const sobrante = ingresos - gastos - deudas;
  const capacidad = Math.max(0, sobrante * 0.15);

  if (sobrante <= 0) return `No tienes capacidad de pago porque tus ingresos (${ingresos}) no alcanzan para cubrir gastos (${gastos}) y deudas (${deudas}).`;
  return `Tu capacidad de pago es ${capacidad.toFixed(2)} (15% del sobrante de ingresos menos gastos y deudas).`;
}

get explicacionRiesgo(): string {
  const riesgo = this.pacienteForm.get('financiero.puntaje_riesgo')?.value;
  if (riesgo === 1) return 'Riesgo bajo: tu capacidad de pago es buena.';
  if (riesgo === 3) return 'Riesgo medio: tu capacidad de pago es moderada.';
  if (riesgo === 5) return 'Riesgo alto: tu capacidad de pago es baja o tienes muchas deudas.';
  return '';
}

}

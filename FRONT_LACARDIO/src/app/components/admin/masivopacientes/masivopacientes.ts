import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { Paciente } from '../../../services/paciente';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-masivopacientes',
  imports: [
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatTableModule,
    MatButtonModule,
  MatIconModule],
  templateUrl: './masivopacientes.html',
  styleUrl: './masivopacientes.scss',
})
export class Masivopacientes {
    // FormGroups para los pasos del stepper
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  archivoNombre: string = '';

  cargaResultados: any[] = [];

  // Archivo seleccionado
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient , private pacientesService: Paciente) {
    // Paso 1: form vacío solo para avanzar
    this.firstFormGroup = this.fb.group({
      firstCtrl: ['', Validators.required],
    });

    // Paso 2: input file
    this.secondFormGroup = this.fb.group({
      archivo: [null, Validators.required],
    });
  }

  // Capturar archivo seleccionado
onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;
    this.archivoNombre = file.name;
  }
}
  // Subir archivo por HTTP
 uploadFile() {
    if (!this.selectedFile) return;

    this.pacientesService.crearPacientemasivo(this.selectedFile)
      .subscribe({
        next: (res: any) => {
          console.log('Archivo subido exitosamente', res);

          // Guardamos el array de resultados para la tabla
          if (res && res.body) {
            this.cargaResultados = res.body;
          }
        },
        error: (err) => console.error('Error al subir archivo', err)
      })

}
}

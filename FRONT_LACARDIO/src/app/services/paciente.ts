import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Paciente {
  private apiUrl = 'http://127.0.0.1:3000/lacardio/users';

  constructor(private http: HttpClient) { }

  // Listar todos los pacientes
  getPacientes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`);
  }

  // Obtener un paciente por ID
  getPaciente(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo paciente
  crearPaciente(paciente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, paciente);
  }

  // Crear un nuevo paciente masivo con archivo
  crearPacientemasivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); // 'archivo' es el nombre del campo que espera tu API
    return this.http.post(`${this.apiUrl}/carga-xlsx`, formData);
  }


  // Actualizar un paciente existente
  actualizarPaciente(id: number, paciente: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, paciente);
  }

  // Eliminar un paciente
  eliminarPaciente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

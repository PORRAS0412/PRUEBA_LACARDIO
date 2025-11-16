import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerComponent, PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-libros',
  templateUrl: './libros.html',
  styleUrl: './libros.scss',
  standalone: true,
  imports: [CommonModule, PdfViewerModule]
})
export class Libros {
 // Lista de libros en assets
  libros = [
    { nombre: 'Guía de información para el paciente y su familia (2020)', url: 'libros/libro0.pdf' },
    { nombre: 'Riesgo cardiovascular en una población pediátrica', url: 'libros/libro1.pdf' },
    { nombre: 'Salud de los niños Colombianos', url: 'libros/libro3.pdf' }
  ];

  // Libro actualmente seleccionado
  libroSeleccionado: string | null = null;

  // Referencia al visor PDF
  @ViewChild(PdfViewerComponent) pdfViewer!: PdfViewerComponent;

  // Función para seleccionar libro
  abrirLibro(libroUrl: string) {
    this.libroSeleccionado = libroUrl;
  }

  // Función para cerrar el visor
  cerrarLibro() {
    this.libroSeleccionado = null;
  }

  // Descargar PDF
  descargarPDF() {
    if (this.libroSeleccionado) {
      const link = document.createElement('a');
      link.href = this.libroSeleccionado;
      link.download = 'libro.pdf';
      link.click();
    }
  }

  // Imprimir PDF
  imprimirPDF() {
    if (this.libroSeleccionado) {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = this.libroSeleccionado;
      document.body.appendChild(iframe);
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      document.body.removeChild(iframe);
    }
  }

}

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-visor',
  imports: [PdfViewerModule],
  templateUrl: './visor.html',
  styleUrl: './visor.scss',
})
export class Visor {
 libroUrl: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Recibir URL del libro desde la ruta
    this.route.queryParams.subscribe(params => {
      this.libroUrl = params['url'] || '';
    });
  }
}

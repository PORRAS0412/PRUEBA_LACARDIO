import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { NgxUiLoaderModule, NgxUiLoaderRouterModule, NgxUiLoaderService, NgxUiLoaderHttpModule } from "ngx-ui-loader";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar,NgxUiLoaderModule, NgxUiLoaderRouterModule, NgxUiLoaderHttpModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'FRONT_LACARDIO';
   constructor(
  private ngxService: NgxUiLoaderService,
) {

  }
}

import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { RegistrarseComponent } from "./usuarios/registrarse/registrarse.component";
import { IniciarSesionComponent } from "./usuarios/iniciar-sesion/iniciar-sesion.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { ListasPersonalizadasComponent } from './recetas/listas-personalizadas/listas-personalizadas.component';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'recetas';
}

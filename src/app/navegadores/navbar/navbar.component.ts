import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
rutas = inject(Router);

irInicioSesion()
{
  this.rutas.navigate(['iniciarSesion']);
}

iraRegistrarse()
{
  this.rutas.navigate(['registrarse']);
}
}

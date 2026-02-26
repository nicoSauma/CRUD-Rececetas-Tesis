import { Component, inject } from '@angular/core';
<<<<<<< HEAD
import { Router, RouterLink } from '@angular/router';
=======
import { Router } from '@angular/router';
>>>>>>> c3586fe39cf84e1486403381312f83b654918010

@Component({
  selector: 'app-navbar',
  standalone: true,
<<<<<<< HEAD
  imports: [RouterLink],
=======
  imports: [],
>>>>>>> c3586fe39cf84e1486403381312f83b654918010
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

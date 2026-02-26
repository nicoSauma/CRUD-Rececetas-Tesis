import { Component, inject } from '@angular/core';
import { UsuariosService } from '../../service/usuarios.service';
import { routes } from '../../app.routes';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar-login',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './nav-bar-login.component.html',
  styleUrl: './nav-bar-login.component.css'
})
export class NavBarLoginComponent {

  private servicioUser = inject(UsuariosService);
  private ruta = inject(Router)



  obtenerUserActivo() {
    this.servicioUser.getUserActivo().subscribe({
      next: (user) => {
        if (user.length > 0) {
          const id = user[0].id.toString(); // Asegúrate de que estás obteniendo el ID
          console.log("ID del usuario activo:", id);
          this.cerrarSesion(id);
        } else {
          console.log("No hay usuario activo.");
        }
      },
      error: (e: Error) => {
        console.log(e.message);
      }
    });
  }

  cerrarSesion(id: string) {
    this.servicioUser.deleteUserActivo(id).subscribe({
      next: () => {
        console.log(`Usuario con ID ${id} eliminado.`);
        localStorage.removeItem('token');//remueve el token para evitar acceder a otras pags sin sesion iniciada.
        this.ruta.navigateByUrl(""); // Redirige después de eliminar
      },
      error: (e: Error) => {
        console.error("Error al eliminar el usuario:", e.message);
      }
    });
  }

  irperfil()
  {
    this.ruta.navigate(['perfil']);
  }


}

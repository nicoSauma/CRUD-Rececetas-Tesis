import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavBarLoginComponent } from "../../navegadores/nav-bar-login/nav-bar-login.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuariosService } from '../../service/usuarios.service';
import { UserActivo } from '../../interfaces/user-activo';
import { User } from '../../interfaces/user';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [NavBarLoginComponent, FooterComponent,ReactiveFormsModule],
  templateUrl: './editar-perfil.component.html',
  styleUrl: './editar-perfil.component.css'
})
export class EditarPerfilComponent implements OnInit {
  userId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  rutas = inject(Router);
  userACT:UserActivo={
    id:0,
    nombreUsuario:''
  };

  userComun:User={
    nombreUsuario:'',
    contrasena:'',
    listas:[]
  };
  fb = inject(FormBuilder);
  servicioUser = inject(UsuariosService);

  formulario=this.fb.nonNullable.group({
    nombre:['',[Validators.required, Validators.minLength(4)]],
    contrasena:['',[Validators.required, Validators.minLength(6)]]
  })

   ngOnInit(): void {
    this.servicio.getUserActivo().subscribe(
      {
        next:(usuario)=>{
          this.userACT=usuario[0];
          this.servicio.getUSerById(this.userACT.id).subscribe({

            next:(usuario)=>
            {
              this.userComun=usuario;
              this.formulario.patchValue({
                nombre: this.userComun.nombreUsuario,
                contrasena: this.userComun.contrasena
              });
            },
            error:(err:Error)=>
            {
              console.log(err.message);
            }
          })
        },
        error:(err:Error)=>{
          console.log(err.message);
        }
      }
    )
  }

  servicio = inject(UsuariosService);
  imagenPerfil = "img/perfil-de-usuario.web"; 

  editPerfil(): void {
    if (this.formulario.valid) {
      const updatedUser: User = {
        ...this.userComun, // Mantiene los datos actuales del usuario
        nombreUsuario: this.formulario.value.nombre!, // Actualiza solo el nombre
        contrasena: this.formulario.value.contrasena!           // Actualiza solo la contra
      };
  
      
      this.servicio.editUser(updatedUser).subscribe({
        next: () => {
         this.alertPerfilEdit();
          console.log('Perfil actualizado correctamente');
          this.rutas.navigate(['perfil']); 
          
        },
        error: (err: Error) => {
          console.log('Error al actualizar el perfil:', err.message);
        }
      });
    } else {
      console.log('Formulario no válido');
    }
  }

  alertPerfilEdit()
  {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: "Cambios guardados"
    }); 
  }

}

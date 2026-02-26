import { Component, inject } from '@angular/core';
import { User } from '../../interfaces/user';
import { UsuariosService } from '../../service/usuarios.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from "../../navegadores/navbar/navbar.component";
import { ListasPersonalizadasComponent } from '../../recetas/listas-personalizadas/listas-personalizadas.component';
import { ListaRecetasPersonalizadas } from '../../interfaces/recetas';
import { ListasPersonalizadasService } from '../../service/listas-personalizadas.service';
import Swal from 'sweetalert2'
<<<<<<< HEAD
import { FooterComponent } from "../../shared/footer/footer.component";
=======
>>>>>>> c3586fe39cf84e1486403381312f83b654918010


@Component({
  selector: 'app-registrarse',
  standalone: true,
<<<<<<< HEAD
  imports: [ReactiveFormsModule, NavbarComponent, FooterComponent],
=======
  imports: [ReactiveFormsModule, NavbarComponent],
>>>>>>> c3586fe39cf84e1486403381312f83b654918010
  templateUrl: './registrarse.component.html',
  styleUrl: './registrarse.component.css'
})
export class RegistrarseComponent {

  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,16}$/)]],
    email: ['', [Validators.required, Validators.email]]
  })


  //lista favoritos creada automaticamente
  listaInicial : ListaRecetasPersonalizadas = {
    id:0, 
    nombre:"Favoritos", 
    recetas:[]
  }

  listasIniciales : ListaRecetasPersonalizadas[] = [this.listaInicial]

  constructor(private authService: UsuariosService, private router: Router, private listasPersonalizadasService:
    ListasPersonalizadasService) { }

  onSubmit() {
    if (this.form.invalid) return;
    const formValues = this.form.getRawValue();

    const email = formValues.email;
    if (email === null) {
      alert('El correo electrónico es obligatorio.');
      return;
    }



    this.authService.checkEmailExists(email).subscribe({
      next: (emailExists) => {
        if (emailExists) {
          this.alertCorreoIncorrecto();
       
        } else {

          const user: User = {
            nombreUsuario: formValues.username ?? '',
            contrasena: formValues.password ?? '',
            email: email ?? '',
            listas: this.listasIniciales
          };

          this.authService.signup(user).subscribe({
            next: () => {
              this.alertCreado();
              this.router.navigate(['/']);
            },
            error: (error) => {
              console.error(error);
              console.log('Redirecting to Home');
              setTimeout(() => {
                this.router.navigate(['/']);
              }, 1500);
            }
          });
        }
      },
      error: (error) => {
        console.error('Error checking email: ', error);
      }
    });
  }


  onRevealPassword(pwInput: HTMLInputElement) {
    if (pwInput.type == 'password') {
      pwInput.type = 'text';
    } else {
      pwInput.type = 'password';
    }
  }

  alertCreado()
  {
    Swal.fire({
      title: "Usuario creado con exito",
      text: "",
      icon: "success"
    });
  }

  alertCorreoIncorrecto()
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
    icon: "error",
    title: "Este correo ya esta en uso"
  }); 
}
}

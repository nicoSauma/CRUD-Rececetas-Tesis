import { RecetasService } from './../../service/recetas.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListasPersonalizadasService } from '../../service/listas-personalizadas.service';
import { CommonModule } from '@angular/common';
import { Ingredientes, Receta, Receta2 } from '../../interfaces/recetas';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavBarLoginComponent } from '../../navegadores/nav-bar-logeado/nav-bar-login.component';
import { DeleteUpdateOutputComponent } from '../delete-update-output/delete-update-output.component';
import { UserActivo } from '../../interfaces/user-activo';
import { User } from '../../interfaces/user';
import { UsuariosService } from '../../service/usuarios.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-receta-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FooterComponent,NavBarLoginComponent],
  templateUrl: './receta-form.component.html',
  styleUrl: './receta-form.component.css'
})
export class RecetaFormComponent implements OnInit {

  serviceRec = inject(RecetasService);
  //serviceListo = inject(ListasPersonalizadasService);
  servicio=inject(UsuariosService);
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  recetas: Array<Receta>= [];


  idLista = 0;

  formulario=this.fb.nonNullable.group({

    id:[0],
    title: ['', Validators.required],
    vegetarian: [false, Validators.required],  // Tipo boolean
    vegan: [false, Validators.required],       // Tipo boolean
    glutenFree: [false, Validators.required],  // Tipo boolean
    readyInMinutes: [0, [Validators.required, Validators.min(1)]],  // Tipo number
    servings: [1, [Validators.required, Validators.min(1)]],        // Tipo number
    instructions: ['', Validators.required],
    image: [''],
    spoonacularScore: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    listaId: [0, Validators.required],
    ingredientes: this.fb.array([]),
    //creo Un form array que permite agregar la cantidad de ingredientes que quiera
  });

  userACT:UserActivo={
    id:0,
    nombreUsuario:''
  };

  userComun:User={
    nombreUsuario:'',
    contrasena:'',
    listas:[]
  };

  ngOnInit(){
    this.servicio.getUserActivo().subscribe(
      {
        next:(usuario)=>{
          this.userACT=usuario[0];
          this.servicio.getUSerById(this.userACT.id).subscribe({

            next:(usuario)=>
            {
              this.userComun=usuario;
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


addRecipe() {
  if (this.formulario.invalid) return;


  const receta = {
    ...this.formulario.getRawValue(),
    ingredientes: this.formulario.get('ingredientes')?.value as Ingredientes[]
  } as Receta;
  for(var id=0;id<this.userComun.listas.length;id++)
  {
    receta.id = id
  }

  const listaId = this.formulario.get('listaId')?.value;

  console.log('ID de lista seleccionada:', listaId);


  const listaSeleccionada = this.userComun.listas.find(lista => lista.id === Number(listaId));


  if (listaSeleccionada) {
    listaSeleccionada.recetas.push(receta);


    this.servicio.editUser(this.userComun).subscribe({
      next: () => {
        alert('Receta agregada exitosamente a la lista seleccionada!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error("Error al guardar la receta:", err);
      }
    });
  } else {
    console.error("Lista seleccionada no encontrada.");
  }
}

addRecipe2() {
  if (this.formulario.invalid) return;

  const receta = {
    ...this.formulario.getRawValue(),
    ingredientes: this.formulario.get('ingredientes')?.value as Ingredientes[]
  } as Receta;
  const listaId = this.formulario.get('listaId')?.value;
  const listaSeleccionada = this.userComun.listas.find(lista => lista.id === Number(listaId));

  if (!receta.image || receta.image.trim() === '') {
    receta.image = 'img/logoUltimo.jpeg';
  }

  if (listaSeleccionada) {

    receta.id = listaSeleccionada.recetas.length;


    listaSeleccionada.recetas.push(receta);


    this.servicio.editUser(this.userComun).subscribe({
      next: () => {
        this.alertRecetaCreada();
        this.router.navigate(['mis-listas']);
      },
      error: (err) => {
        console.error("Error al guardar la receta:", err);
      }
    });
  } else {
    this.alertaListanoEncontrada();
  }
}

get ingredientes(){
  return this.formulario.get('ingredientes') as FormArray;
}

//asigna los datos cargados del ArrayForm al form de receta.
agregarIngrediente(){
  const ingredienteForm = this.fb.group({
    name:['', Validators.required],
    amount: [0, [Validators.required, Validators.min(0.1)]],
    unit:['', Validators.required]
  });
  this.ingredientes.push(ingredienteForm)
}
eliminarIngrediente(index: number) {
  this.ingredientes.removeAt(index);
}

onImageSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  const files = input.files;
  
  if (files && files.length > 0) {
    const file = files[0];
    const reader = new FileReader();
    
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result as string;
      this.formulario.get('image')?.setValue(result);
    };
    
    reader.readAsDataURL(file);
  }
}

  clearImage(): void {
    this.formulario.get('image')?.setValue('img/logoUltimo.jpeg');
  }

  alertRecetaCreada()
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
      title: "Receta agregada con exito"
    }); 
  }

  alertaListanoEncontrada()
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
      title: "Lista no encontrada"
    }); 
  }


}











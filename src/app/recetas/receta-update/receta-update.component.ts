import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecetasService } from '../../service/recetas.service';
import { ListasPersonalizadasService } from '../../service/listas-personalizadas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navegadores/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
<<<<<<< HEAD
import { NavBarLoginComponent } from '../../navegadores/nav-bar-logeado/nav-bar-login.component';
=======
import { NavBarLoginComponent } from '../../navegadores/nav-bar-login/nav-bar-login.component';
>>>>>>> c3586fe39cf84e1486403381312f83b654918010
import { User } from '../../interfaces/user';
import { UserActivo } from '../../interfaces/user-activo';
import { UsuariosService } from '../../service/usuarios.service';
import { Ingredientes, ListaRecetasPersonalizadas, Receta } from '../../interfaces/recetas';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-receta-update',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,NavBarLoginComponent,FooterComponent],
  templateUrl: './receta-update.component.html',
  styleUrl: './receta-update.component.css'
})
export class RecetaUpdateComponent implements OnInit {
serviceRec = inject(RecetasService);
  //serviceListo = inject(ListasPersonalizadasService);
  servicio=inject(UsuariosService);
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  listas: ListaRecetasPersonalizadas[]= [];


  receta?:Receta;


  userACT:UserActivo={
    id:0,
    nombreUsuario:''
  };

  userComun:User={
    nombreUsuario:'',
    contrasena:'',
    listas:[]
  };

id: number|null=null;
 idLista!: number;

formulario=this.fb.nonNullable.group({

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
    ingredientes: this.fb.array([])
  });

  ngOnInit(): void {
    this.servicio.getUserActivo().subscribe(
      {
        next:(usuario)=>{
          this.userACT=usuario[0];
          console.log('Usuario activo:', usuario);
          this.servicio.getUSerById(this.userACT.id).subscribe({

            next:(usuario)=>
            {console.log('Usuario con listas:', usuario);
              this.userComun=usuario;
              this.listas=this.userComun.listas;
              console.log('Listas del usuario:', this.listas);
              this.idLista = Number(this.route.snapshot.paramMap.get('idLista'));
    console.log("lista:",this.idLista);
    this.route.paramMap.subscribe({
      next: (param) => {
        const idString = param.get('id'); // Obtener el valor como string o null
        this.id = idString !== null ? Number(idString) : null; // Convertir a número si no es null
        if (this.id === null || isNaN(this.id)) {
          console.log('El valor de id no es un número válido');
          this.id = null; // Opcional: asignar null si no es un número válido
        } else {
          console.log('ID numérico:', this.id);
          this.getRecetaUpdate();

        }
      },
      error: (e: Error) => {
        console.log(e.message);
      }
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

  createIngredientFormGroup(ingredient: Ingredientes): FormGroup {
    return this.fb.group({
      name: [ingredient.name || '', Validators.required],
      amount: [ingredient.amount || 0, Validators.required],
      unit: [ingredient.unit || '', Validators.required]
    });
  }


  getRecetaUpdate() {
    console.log('Listas del usuario:', this.userComun.listas);
    const listaSeleccionada = this.userComun.listas.find(lista => lista.id === this.idLista);
    console.log("Lista seleccionada:", listaSeleccionada);  // Verifica que la lista seleccionada no sea null

    if (listaSeleccionada) {
      const recetaSeleccionada = listaSeleccionada.recetas.find(receta => receta.id === this.id);
      console.log("Receta seleccionada:", recetaSeleccionada);  // Verifica que la receta seleccionada no sea null

      if (recetaSeleccionada) {
        this.receta = recetaSeleccionada;  // Aquí se actualiza la receta
        // Rellenamos el formulario con los valores
        this.formulario.controls['title'].setValue(this.receta.title);
        this.formulario.controls['vegetarian'].setValue(this.receta.vegetarian);
        this.formulario.controls['vegan'].setValue(this.receta.vegan);
        this.formulario.controls['glutenFree'].setValue(this.receta.glutenFree);
        this.formulario.controls['readyInMinutes'].setValue(this.receta.readyInMinutes);
        this.formulario.controls['servings'].setValue(this.receta.servings);
        this.formulario.controls['instructions'].setValue(this.receta.instructions);
        this.formulario.controls['image'].setValue(this.receta.image);
        this.formulario.controls['spoonacularScore'].setValue(this.receta.spoonacularScore);
        this.formulario.controls['listaId'].setValue(this.idLista);

        // Limpiar y agregar los ingredientes
        const ingredientesFormArray = this.formulario.get('ingredientes') as FormArray;
        ingredientesFormArray.clear();
        this.receta.ingredientes.forEach(ingredient => {
          ingredientesFormArray.push(this.createIngredientFormGroup(ingredient));
        });
      } else {
        console.log('Receta no encontrada en la lista.');
      }
    } else {
      console.log("Lista seleccionada no encontrada.");
    }
  }



  updateRecipe() {
    if (this.formulario.invalid || this.id === null) return;

    // Obtiene el valor del formulario y asegura que `ingredientes` sea del tipo `Ingredientes[]`
    const recetaFormValue = this.formulario.getRawValue();
    const receta: Receta = {
      ...recetaFormValue,
      ingredientes: recetaFormValue.ingredientes.map((ing: any) => ({
        id: ing.id,
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit
      }))
    };


    const listaSeleccionada = this.userComun.listas.find(lista => lista.id === this.idLista);

    if (listaSeleccionada) {
      const recetaIndex = listaSeleccionada.recetas.findIndex(r => r.id === this.id);

      if (recetaIndex !== -1) {
        listaSeleccionada.recetas[recetaIndex] = { ...listaSeleccionada.recetas[recetaIndex], ...receta };

        this.servicio.editUser(this.userComun).subscribe({
          next: () => {
           this.alertModificado();
            this.router.navigate(['/mis-listas']);
          },
          error: (e: Error) => {
            console.error("Error al modificar la receta:", e);
          }
        });
      } else {
        console.error('Receta no encontrada en la lista.');
      }
    } else {
      console.error("Lista seleccionada no encontrada.");
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

  alertModificado()
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
      title: "Receta modificada con exito"
    }); 
  }

}

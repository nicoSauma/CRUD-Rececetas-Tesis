import { Component, inject, OnInit } from '@angular/core';
import { ExtendedIngredient, Ingredientes, Receta, RecipeInfo } from '../../interfaces/recetas';
import { RecetasService } from '../../service/recetas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavBarLoginComponent } from "../../navegadores/nav-bar-login/nav-bar-login.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { UsuariosService } from '../../service/usuarios.service';
import { UserActivo } from '../../interfaces/user-activo';
import { User } from '../../interfaces/user';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-receta-detail',
  standalone: true,
  imports: [CommonModule, NavBarLoginComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './receta-detail.component.html',
  styleUrl: './receta-detail.component.css'
})
export class RecetaDetailComponent implements OnInit{

  recipe!: RecipeInfo;
  serviciouser = inject(UsuariosService);
  fb = inject(FormBuilder)
  activarAgregarLista : boolean = false;
  router = inject(Router)

  constructor(
    private route: ActivatedRoute,
    private servicio: RecetasService
  ) {}

  userACT:UserActivo={
    id:0,
    nombreUsuario:''
  };

  userComun:User={
    nombreUsuario:'',
    contrasena:'',
    listas:[]
  };

  formulario = this.fb.nonNullable.group({
    listaId: [0, Validators.required]
  })



  ngOnInit() {
    this.obtenerUSer()
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.servicio.getRecipeInfotmation(id).subscribe({
      next: (data) => (this.recipe = data),
      error: (e: Error) => console.log('Error al cargar los detalles de la receta', e)
    });
  }


  getInstructions() {

    if (!this.recipe?.instructions) return [];


    const cleanText = this.recipe.instructions.replace(/<\/?[^>]+(>|$)/g, "");


    return cleanText.split('\n').filter(step => step.trim() !== '');
}


  obtenerUSer () {
    this.serviciouser.getUserActivo().subscribe(
      {
        next:(usuario)=>{
          this.userACT=usuario[0];
          this.serviciouser.getUSerById(this.userACT.id).subscribe({

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
    
    const receta = this.mapearRecipeInfoAReceta(this.recipe);
    const listaId = this.formulario.get('listaId')?.value;
    console.log('ID de lista seleccionada:', listaId);

    // Encuentra la lista seleccionada en el usuario y agrega la receta
    const listaSeleccionada = this.userComun.listas.find(lista => lista.id === Number(listaId));
    console.log(listaSeleccionada);


    if (listaSeleccionada) {
      listaSeleccionada.recetas.push(receta);

      // Opcional: Guarda los cambios en el backend
      this.serviciouser.editUser(this.userComun).subscribe({
        next: () => {
          this.alertRecetaAdd();
          this.router.navigate(['/home']); // Redirige al usuario si es necesario
        },
        error: (err:Error) => {
          console.error("Error al guardar la receta:", err);
        }
      });
    } else {
      console.error("Lista seleccionada no encontrada.");
    }
  }

  mapearRecipeInfoAReceta(recipeInfo: RecipeInfo): Receta {
    return {
      vegetarian: recipeInfo.vegetarian,
      vegan: recipeInfo.vegan,
      glutenFree: recipeInfo.glutenFree,
      title: recipeInfo.title,
      readyInMinutes: recipeInfo.readyInMinutes,
      servings: recipeInfo.servings,
      image: recipeInfo.image,
      instructions: recipeInfo.instructions,
      spoonacularScore: recipeInfo.spoonacularScore,
      id: recipeInfo.id,
      ingredientes: recipeInfo.extendedIngredients.map(
        this.mapearExtendIngredientAIngrediente
      )// como ingredientes pertenece a Recetas al mapear Recetas, tambien se mapean los Ingredientes
    };
  }

  //convierto los ExtendedIngredients a Ingredientes
  mapearExtendIngredientAIngrediente(exIngr: ExtendedIngredient): Ingredientes{
    return {
      name: exIngr.name,
      unit: exIngr.unit,
      amount: exIngr.amount
    }
  }

  alertRecetaAdd()
  {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1400,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: "Receta agregada a la lista"
    });
  }




}

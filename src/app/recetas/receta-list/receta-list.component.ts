import { Component, inject, OnInit } from '@angular/core';
import { RecetasService } from '../../service/recetas.service';
import { Receta, RecipeInfo } from '../../interfaces/recetas';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ignoreElements, map } from 'rxjs';
import { RecetaCardComponent } from '../receta-card/receta-card.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';
<<<<<<< HEAD
import { NavBarLoginComponent } from '../../navegadores/nav-bar-logeado/nav-bar-login.component';
=======
import { NavBarLoginComponent } from '../../navegadores/nav-bar-login/nav-bar-login.component';
>>>>>>> c3586fe39cf84e1486403381312f83b654918010

@Component({
  selector: 'app-receta-list',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RecetaCardComponent,
    CommonModule,NavBarLoginComponent,FooterComponent],
  templateUrl: './receta-list.component.html',
  styleUrl: './receta-list.component.css'
})
export class RecetaListComponent{

  servicio = inject(RecetasService);
  fb = inject(FormBuilder);
  router = inject(Router)

  listaRecetas : RecipeInfo[]= [];
  // Lista que se muestra en UI (tras aplicar filtros)
  displayedRecetas: RecipeInfo[] = [];
  ingredients : string = ""
  contenedorRecetas = false; 
  idRecetaModelo: number = 0 

  // filtros (como controles del formulario reactivo)


  formulario = this.fb.nonNullable.group({
    ingredientes : ["", [Validators.required]],
    vegetarian: [false],
    vegan: [false],
    glutenFree: [false]
  })

  setIngredientes () {
    if (this.formulario.invalid) {
      console.log("formulario Invalido");
       return;
    }
    const ingredientesForm :string = this.formulario.get("ingredientes")?.value || ""; 
    this.ingredients=ingredientesForm;   
    this.listarRecetasPorIngredientes(ingredientesForm) // llamo a la funcion de abajo que usa el servicio y carga en el arreglo las recetas
  }


  //Devuelve recetas por ingredientes buscados, se le pasa un array con los ingredientes y la cantidad de respuestas que
  //queres que te devuelva
  listarRecetasPorIngredientes (ingredientes : string) {
    this.servicio.getRecetasByIngredients(ingredientes, 5).subscribe({
      next : (data) => {
        console.log(ingredientes);
        console.log(data);
          // `findByIngredients` devuelve objetos sin flags; pedimos info completa de cada receta
          const recetasCompletas = (data || []).map((r: any) => this.servicio.getRecipeInfotmation(r.id).toPromise());
          Promise.all(recetasCompletas).then((recetas: any[]) => {
            this.listaRecetas = recetas;
            this.displayedRecetas = recetas;
            this.applyFilters();
            this.contenedorRecetas = true;
          }).catch((err) => {
            console.error('Error al obtener info completa', err);
            this.listaRecetas = data;
            this.displayedRecetas = data;
            this.applyFilters();
            this.contenedorRecetas = true;
          });
      },
      error: (e:Error) => {
        console.log("Error al bajar las recetas", e);
      }
    })
  }


  actualizarRecetas() {
    this.idRecetaModelo = this.listaRecetas[0].id;
    const idModelo = this.idRecetaModelo;
  
    this.servicio.getSimilarRecipes(idModelo, 5).subscribe({
      next: (recetasSimilares) => {
        // Usamos `Promise.all` para esperar a que todas las recetas tengan su información completa
        const recetasCompletas = recetasSimilares.map((receta: any) => 
          this.servicio.getRecipeInfotmation(receta.id).toPromise()
        );
  
        Promise.all(recetasCompletas).then((recetas) => {
          // Filtrar por el ingrediente buscado
          const ingredienteLower = this.ingredients.toLowerCase();
          const recetasFiltradas = recetas.filter((receta: any) => 
            receta.extendedIngredients && 
            receta.extendedIngredients.some((ing: any) => 
              ing.name.toLowerCase().includes(ingredienteLower)
            )
          );
          
          this.listaRecetas = recetasFiltradas.length > 0 ? recetasFiltradas : recetas;
          this.displayedRecetas = this.listaRecetas;
          this.idRecetaModelo = this.listaRecetas[0].id;
        }).catch((error) => console.log(error));
      },
      error: (e: Error) => {
        console.log(e.message);
      }
    });
  }
  

  //devuelve la info de una receta por id
  recipe?:RecipeInfo;
  getRecipeInformation (id:number) {
    this.servicio.getRecipeInfotmation(id).subscribe({
      next : (data) => {
        console.log(data);
        this.recipe=data;
      },
      error:(e:Error) => {
        console.log(e.message);
      }
    })
  }

  applyFilters() {
    // Leer ingrediente actual del form (puede ser previo a pulsar Buscar)
    const ingredientesForm: string = this.formulario.get('ingredientes')?.value || this.ingredients || '';

    const vegetarianChecked = !!this.formulario.get('vegetarian')?.value;
    const veganChecked = !!this.formulario.get('vegan')?.value;
    const glutenFreeChecked = !!this.formulario.get('glutenFree')?.value;

    const any = vegetarianChecked || veganChecked || glutenFreeChecked;

    if (any) {
      // Si hay filtros dietéticos, pedir resultados al endpoint `complexSearch`
      const diet = veganChecked ? 'vegan' : (vegetarianChecked ? 'vegetarian' : undefined);
      const intolerances = glutenFreeChecked ? 'gluten' : undefined;

      if (!ingredientesForm || ingredientesForm.trim() === '') {
        // Si no hay ingrediente, no hacemos búsqueda
        return;
      }

      this.servicio.getRecetasByIngredientsAndDiet(ingredientesForm, 10, diet, intolerances).subscribe({
        next: (data) => {
          // `complexSearch` devuelve `results` cuando usamos addRecipeInformation
          const recetas = (data && data.results) ? data.results : data;
          this.listaRecetas = recetas || [];
          this.displayedRecetas = this.listaRecetas;
          this.contenedorRecetas = true;
        },
        error: (e: Error) => {
          console.error('Error al buscar con filtros dietéticos', e);
        }
      });
      return;
    }

    // Si no hay filtros, mostrar los ya cargados
    this.displayedRecetas = [...this.listaRecetas];
  }

  resetFilters() {
    this.formulario.patchValue({ vegetarian: false, vegan: false, glutenFree: false });
    this.applyFilters();
  }

  navigateToDetails(id: number) {
    this.router.navigate([`/recetas-detalles/${id}`]);
}
}

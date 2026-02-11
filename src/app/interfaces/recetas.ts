
export interface Receta {
  vegetarian:               boolean;
  vegan:                    boolean;
  glutenFree:               boolean;
  id?:                       number;
  title:                    string;
  readyInMinutes:           number;
  servings:                 number;
  image:                    string;
  instructions:             string;
  spoonacularScore:         number;
  anotaciones?:             string;
  ingredientes:             Ingredientes[];
}

export interface Ingredientes{
  id?:                      number;
  name:                     string;
  amount:                   number;
  unit:                     string;
}



export interface RecipeInfo {
    vegetarian:               boolean;
    vegan:                    boolean;
    glutenFree:               boolean;
    aggregateLikes:           number;
    healthScore:              number;
    extendedIngredients:      ExtendedIngredient[];
    id:                       number;
    title:                    string;
    readyInMinutes:           number;
    servings:                 number;
    sourceUrl:                string;
    image:                    string;
    summary:                  string;
    cuisines:                 any[];
    dishTypes:                string[];
    diets:                    any[];
    occasions:                any[];
    instructions:             string;
    analyzedInstructions:     any[];
    spoonacularScore:         number;
    spoonacularSourceUrl:     string;
}

export interface ExtendedIngredient {
    id:           number;
    aisle:        string;
    image:        string;
    name:         string;
    nameClean:    string;
    original:     string;
    originalName: string;
    amount:       number;
    unit:         string;
    measures:     Measures;
}


export interface Measures {
    us:     Metric;
    metric: Metric;
}

export interface Metric {
    amount:    number;
    unitShort: string;
    unitLong:  string;
}


export interface ListaRecetasPersonalizadas {
    id : number;
    nombre ?: string; // Nombre de la lista
    recetas: Receta[]; // Array de recetas (puedes usar la interfaz que ya tienes para recetas)
}

  export interface Receta2 {
    id?:                       string;
    title:                    string;
    ingredients:              (string | null)[];
    vegetarian:               boolean;
    vegan:                    boolean;
    glutenFree:               boolean;
    readyInMinutes:           number;
    servings:                 number;
    //image?:                    string;
    instructions:             string;

}

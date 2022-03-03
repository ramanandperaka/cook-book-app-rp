import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";


@Injectable({providedIn:'root'})
export class RecipeService {
    recipeSelected = new EventEmitter<Recipe>();
    recipesChanged = new EventEmitter<Recipe[]>();
    readonly recipesAPIURL = 'https://localhost:7228/api'

    
    private recipes: Recipe[] =[];
    
  

    constructor(private slService: ShoppingListService,private httpClient:HttpClient) {}
    
    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipesChanged.emit(this.recipes.slice());
    }
    
    getRecipes() {
        return this.recipes.slice();
    }

    getRecipe(index: number) 
    {
        const result = this.recipes.find(x=>x.id == index);
        return result;
    }
    getRecipesList():Observable<Recipe[]>{
        return this.httpClient.get<Recipe[]>('https://localhost:7228/api/Recipes');
    }
    addIngredientsToList(ingredients: Ingredient[]) {
        this.slService.addIngredients(ingredients);
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        
        this.recipesChanged.emit(this.recipes.slice());
    }
    sanitiseRecipes(recipe:Recipe)
    {
        if(recipe!=null && recipe.ingredients!=null)
        {
            if(recipe.id==null)
                recipe.id = 0;

            for(let i=0;i<recipe.ingredients.length;i++)
            {
                if(recipe.ingredients[i].id == null && recipe.ingredients[i].recipeId == null)
                {
                    recipe.ingredients[i].id = 0;
                    recipe.ingredients[i].recipeId = 0;
                }
            }
        }
        return recipe;
    }
    addRecipeAPICall(recipe:Recipe)
    {
        recipe = this.sanitiseRecipes(recipe);
         this.httpClient.post(this.recipesAPIURL+'/Recipes',recipe).subscribe(()=>{console.log("recipe added");this.showMessages(1);});
    }
updateRecipeAPICall(id:number|string,modifiedRecipe:Recipe)
{
    for(let i=0;i<this.recipes.length;i++)
    {
        if(this.recipes[i].id == modifiedRecipe.id)
        {
            this.recipes[i] = modifiedRecipe
        }
    }
    for(let i=0;i<modifiedRecipe.ingredients.length;i++)
            {
                if(modifiedRecipe.ingredients[i].id == null && modifiedRecipe.ingredients[i].recipeId == null)
                {
                    modifiedRecipe.ingredients[i].id = 0;
                    modifiedRecipe.ingredients[i].recipeId = 0;
                }
            }
     this.httpClient.put(this.recipesAPIURL+`/Recipes/${id}`,modifiedRecipe).subscribe(()=>{console.log("Updated");this.showMessages(2);});
}
    updateRecipe(id: number|string, modifiedRecipe: Recipe) {
        for(let i=0;i<this.recipes.length;i++)
        {
            if(this.recipes[i].id == modifiedRecipe.id)
            {
                this.recipes[i] = modifiedRecipe
            }
        }
        this.recipesChanged.emit(this.recipes.slice());
        
        
    }
    
    deleteRecipe(id: number) {
        for(let i=0;i<this.recipes.length;i++)
        {
            if(this.recipes[i].id == id)
            {
                this.recipes.splice(i, 1);
            }
        }
        
        this.recipesChanged.emit(this.recipes.slice());
        this.httpClient.delete(this.recipesAPIURL+'/Recipes/DeleteRecipeById/'+id).subscribe(()=>{console.log("recipe deleted");this.showMessages(3);});
    }

    showMessages(id:number)
    {
        switch(id)
        {
case 1:
    var element = document.getElementById('recipeAdded')
      element.classList.remove('hidden');
      break;
      case 2:
        var element1 = document.getElementById('recipeUpdated')
      element1.classList.remove('hidden');
      break;
      case 3:
        var element2 = document.getElementById('recipeDeleted');
      element2.classList.remove('hidden');
      break;
        }
    }


}
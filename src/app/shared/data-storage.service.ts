import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";

@Injectable({ providedIn: 'root' })
export class DataStorageService {
    constructor(private http: HttpClient, private recipeService: RecipeService) {}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        this.http.put(
                'https://cook-book-app-rp-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json',
                recipes
            )
            .subscribe(response => {
                console.log(response);
            });
    }

    storeRecipesToSqlExpress() {
        const recipes = this.recipeService.getRecipes();
        for(let i=0;i<recipes.length;i++)
        {
            if(recipes[i].id==null)
                recipes[i].id=0;

            if(recipes[i].ingredients!=null)
            {
                for(let j=0;j<recipes[i].ingredients.length;j++)
                {
                    if(recipes[i].ingredients[j].id == null && recipes[i].ingredients[j].recipeId == null)
                    {
                        recipes[i].ingredients[j].id = 0;
                        recipes[i].ingredients[j].recipeId = 0;
                    }
                }
            }
        }
        this.http.post(
                'https://localhost:7228/api/Recipes/AddUpdateRecipes',
                recipes
            )
            .subscribe(response => {
                console.log(response);
            });
    }

    fetchRecipes() {
        this.http.get<Recipe[]>(
        'https://cook-book-app-rp-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json'
        )
        .subscribe(recipes => {
            this.recipeService.setRecipes(recipes);
        })

    }

    fetchRecipesFromWebAPI() {
        this.http.get<Recipe[]>(
        'https://localhost:7228/api/Recipes'
        )
        .subscribe(recipes => {
            this.recipeService.setRecipes(recipes);
        })

    }
}
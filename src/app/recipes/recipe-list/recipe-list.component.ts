import { Component,  OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[];
  constructor(private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private dsService:DataStorageService) {
}
hideloader() {
  
  // Setting display of spinner
  // element to none
  document.getElementById('loading')
      .style.display = 'none';
}
dismissAlert(id:number)
{
  switch(id)
        {
case 1:
    var element = document.getElementById('recipeAdded')
      element.classList.add('hidden');
      break;
      case 2:
        var element1 = document.getElementById('recipeUpdated')
      element1.classList.add('hidden');
      break;
      case 3:
        var element2 = document.getElementById('recipeDeleted');
      element2.classList.add('hidden');
      break;
        }
}
  ngOnInit() {
    this.dsService.fetchRecipesFromWebAPI();
    this.recipeService.recipesChanged
      .subscribe(
        (recipes: Recipe[]) => {

          this.recipes = recipes;
          this.hideloader();
        }
      );
      
  }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

}

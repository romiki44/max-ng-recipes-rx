import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';

@Injectable()
export class RecipeService {
    recipesChanged=new Subject<Recipe[]>();

    // private recipes:Recipe[] =[
    //     new Recipe(
    //         'First recipe', 
    //         'Meat recipe', 
    //         'https://iowagirleats-iowagirleats.netdna-ssl.com/wp-content/uploads/2015/10/Crock-Pot-Chicken-and-Wild-Rice-Soup-iowagirleats-04.jpg',
    //         [
    //             new Ingredient('meat', 1),
    //             new Ingredient('French Fries', 20)
    //         ]
    //     ),
    //     new Recipe(
    //         'Second recipe', 
    //         'Vegatable recipe', 
    //         'https://culinaryarts.ca/wp-content/uploads/2015/08/Recipes-Widget.jpg',
    //         [
    //             new Ingredient('onion', 2),
    //             new Ingredient('tomato', 5),
    //             new Ingredient('rice', 10)
    //         ]
    //     )
    // ];
    private recipes: Recipe[]=[];

    constructor(
        private store: Store<fromShoppingList.AppState>
    ) {}

    setRecipes(recipes: Recipe[]) {
        this.recipes=recipes;
        this.recipesChanged.next(this.recipes.slice());
    }

    getRecipes() {
        return this.recipes.slice(); // return copy 
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }

    addIngredientToShoppingList(ingredients: Ingredient[]) {
        // this.slService.addIngredients(ingredients);
        this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index]=newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
}
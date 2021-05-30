import { Component, OnInit } from '@angular/core';
import { Nutrient } from 'src/models/nutrient.model';
import { HttpManager } from 'src/services/http-manager.service';
import { Dropdown } from 'primeng/dropdown';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HttpManager],
})
export class AppComponent implements OnInit {
  public nutrientList$: Observable<Nutrient[]> = new Observable<Nutrient[]>();
  public selectedNutrient: Nutrient = new Nutrient();
  public enteredUnitQuantity: number = 0;
  public enteredNutrientList: Nutrient[] = [];

  constructor(private _httpManager: HttpManager) {}

  ngOnInit() {
    this.nutrientList$ = this._httpManager.getAllNutrients();
  }

  public onAddClicked(nutrientDropdown: Dropdown) {
    const nutrient: Nutrient = new Nutrient();
    nutrient.key = this.selectedNutrient.key;
    nutrient.name = this.selectedNutrient.name;
    nutrient.unitType = this.selectedNutrient.unitType;
    nutrient.unitQuantity = this.enteredUnitQuantity;
    nutrient.protein = nutrient.unitQuantity * this.selectedNutrient.protein;
    nutrient.calories = nutrient.unitQuantity * this.selectedNutrient.calories;
    this.enteredNutrientList.push(nutrient);
    // cleanup
    this.enteredUnitQuantity = 0;
    this.selectedNutrient = new Nutrient();
    if (nutrientDropdown) nutrientDropdown.focus();
  }
}

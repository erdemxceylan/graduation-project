import { Component, OnInit } from '@angular/core';
import { Nutrient } from 'src/models/nutrient.model';
import { HttpManager } from 'src/services/http-manager.service';
import { Dropdown } from 'primeng/dropdown';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HttpManager],
})
export class AppComponent implements OnInit {
  public nutrientList: Nutrient[] = [];
  public selectedNutrient: Nutrient = new Nutrient();
  public enteredNutrientList: Nutrient[] = [];
  public gridSelectedNutrient: Nutrient = new Nutrient();

  private _originalNutrientList: Nutrient[] = [];
  constructor(private _httpManager: HttpManager) { }

  ngOnInit() {
    this._httpManager.getAllNutrients().subscribe((nutrientList: Nutrient[]) => {
      this.nutrientList = JSON.parse(JSON.stringify(nutrientList));
      this._originalNutrientList = JSON.parse(JSON.stringify(nutrientList));
    });
  }

  public onAddClicked(nutrientDropdown: Dropdown) {
    if (this.selectedNutrient && this.enteredNutrientList) {
      if (this.enteredNutrientList.some((n) => n.key === this.selectedNutrient.key)) {
        const index = this.enteredNutrientList.findIndex(n => n.key === this.selectedNutrient.key);
        const activeNutrient = this.enteredNutrientList[index];
        const updatedNutrient = new Nutrient();
        updatedNutrient.key = activeNutrient.key;
        updatedNutrient.name = activeNutrient.name;
        updatedNutrient.unitType = activeNutrient.unitType;
        updatedNutrient.unitQuantity = activeNutrient.unitQuantity + this.selectedNutrient.unitQuantity;
        updatedNutrient.calories = updatedNutrient.unitQuantity * this.selectedNutrient.calories;
        updatedNutrient.protein = updatedNutrient.unitQuantity * this.selectedNutrient.protein;
        this.enteredNutrientList[index] = updatedNutrient;
      } else {
        const newNutrient: Nutrient = new Nutrient();
        newNutrient.key = this.selectedNutrient.key;
        newNutrient.name = this.selectedNutrient.name;
        newNutrient.unitType = this.selectedNutrient.unitType;
        newNutrient.unitQuantity = this.selectedNutrient.unitQuantity;
        newNutrient.protein = newNutrient.unitQuantity * this.selectedNutrient.protein;
        newNutrient.calories = newNutrient.unitQuantity * this.selectedNutrient.calories;
        this.enteredNutrientList.push(newNutrient);
      }
      this._clearItems(nutrientDropdown);
    }
  }

  public onEditClicked(nutrientDropdown: Dropdown) {
    if (this.selectedNutrient && this.enteredNutrientList) {
      const index = this.enteredNutrientList.findIndex(n => n.key === this.selectedNutrient.key);
      const activeNutrient = this.enteredNutrientList[index];
      const updatedNutrient = new Nutrient();
      updatedNutrient.key = activeNutrient.key;
      updatedNutrient.name = activeNutrient.name;
      updatedNutrient.unitType = activeNutrient.unitType;
      updatedNutrient.unitQuantity = this.selectedNutrient.unitQuantity;
      updatedNutrient.calories = updatedNutrient.unitQuantity * this.selectedNutrient.calories;
      updatedNutrient.protein = updatedNutrient.unitQuantity * this.selectedNutrient.protein;
      this.enteredNutrientList[index] = updatedNutrient;
      this._clearItems(nutrientDropdown);
    }
  }

  public onDeleteClicked(nutrientDropdown: Dropdown) {
    if (this.selectedNutrient && this.enteredNutrientList) {
      this.enteredNutrientList = this.enteredNutrientList.filter(n => n.key !== this.selectedNutrient.key);
    }
    this._clearItems(nutrientDropdown);
  }

  public onRowSelect() {
    if (this.nutrientList && this.gridSelectedNutrient) {
      const originalNutrient = this.nutrientList.find((n) => n.key === this.gridSelectedNutrient.key) || new Nutrient();
      const nutrient = new Nutrient();
      nutrient.key = originalNutrient.key;
      nutrient.name = originalNutrient.name;
      nutrient.unitType = originalNutrient.unitType;
      nutrient.unitQuantity = this.gridSelectedNutrient.unitQuantity;
      nutrient.calories = originalNutrient.calories;
      nutrient.protein = originalNutrient.protein;
      this.selectedNutrient = nutrient;
    }
  }

  public onRowUnselect() {
    this.selectedNutrient = new Nutrient();
  }

  private _clearItems(nutrientDropdown: Dropdown) {
    this.nutrientList = JSON.parse(JSON.stringify(this._originalNutrientList));
    this.selectedNutrient = new Nutrient();
    this.gridSelectedNutrient = new Nutrient();
    if (nutrientDropdown) nutrientDropdown.focus();
  }
}

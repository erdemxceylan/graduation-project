import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Nutrient } from 'src/models/nutrient.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public nutrientList: Nutrient[] = [];
  constructor(private _http: HttpClient) {
    this._http
      .get(
        'https://graduation-project-7c908-default-rtdb.europe-west1.firebasedatabase.app/nutrients.json'
      )
      .pipe(
        map((response: any) => {
          const nutrientList: Nutrient[] = [];
          for (const key in response) {
            const nutrient: Nutrient = new Nutrient();
            nutrient.key = key;
            nutrient.name = response[key].name;
            nutrient.unit_quantity = response[key].unit_quantity;
            nutrient.unit_type = response[key].unit_type;
            nutrient.calories = response[key].calories;
            nutrient.protein = response[key].protein;
            nutrientList.push(nutrient);
          }
          return nutrientList;
        })
      )
      .subscribe((nutrientList: Nutrient[]) => this.nutrientList = nutrientList);
  }


}

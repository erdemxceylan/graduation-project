import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Nutrient } from 'src/models/nutrient.model';
import { PrimeNGConfig } from 'primeng/api';
import { Subject } from 'rxjs';
import { HttpManager } from 'src/services/http-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  public nutrientList: Nutrient[] = [];
  public selectedNutrient: Nutrient = new Nutrient();
  public unit_quantity: number = 0;

  private _unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private _httpManager: HttpManager,
    private _primengConfig: PrimeNGConfig
  ) {
    this._primengConfig.ripple = true;
  }

  ngOnInit() {
    this._httpManager
      .get('nutrients')
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
      .subscribe(
        (nutrientList: Nutrient[]) => (this.nutrientList = nutrientList)
      );
  }

  public onAddClicked() {
    console.log();
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}

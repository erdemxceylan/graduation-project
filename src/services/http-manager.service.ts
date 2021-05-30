import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { Nutrient } from 'src/models/nutrient.model';

@Injectable()
export class HttpManager implements OnDestroy {
  private _baseUrl: string =
    'https://graduation-project-7c908-default-rtdb.europe-west1.firebasedatabase.app';

  private _unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private _http: HttpClient) {}

  public getAllNutrients(): Observable<Nutrient[]> {
    return this._http.get<any>(`${this._baseUrl}/nutrients.json`).pipe(
      map((response: any) => {
        const nutrientList: Nutrient[] = [];
        for (const key in response) {
          const nutrient: Nutrient = new Nutrient();
          nutrient.key = key;
          nutrient.name = response[key].name;
          nutrient.unitQuantity = response[key].unit_quantity;
          nutrient.unitType = response[key].unit_type;
          nutrient.calories = response[key].calories;
          nutrient.protein = response[key].protein;
          nutrientList.push(nutrient);
        }
        return nutrientList;
      }),
      catchError((error: any) => throwError(error)),
      takeUntil(this._unsubscribe$)
    );
  }

  public post() {
    this._http.post<any>(this._baseUrl, {});
  }

  public put() {}

  public delete() {}

  public ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}

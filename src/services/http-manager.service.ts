import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { Nutrient } from 'src/models/nutrient.model';
import { Settings } from 'src/models/settings.model';

@Injectable()
export class HttpManager implements OnDestroy {
  // private _headers: HttpHeaders = new HttpHeaders();
  private _baseUrl: string = 'https://graduation-project-7c908-default-rtdb.europe-west1.firebasedatabase.app';
  private _unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private _http: HttpClient) {
    // this._headers.append("Access-Control-Allow-Origin", "*");
  }

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
        return nutrientList.sort((a: Nutrient, b: Nutrient) => {
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
            return 0;
          });
      }),
      catchError((error: any) => throwError(error)),
      takeUntil(this._unsubscribe$)
    );
  }

  public getDataSettings(): Observable<Settings> {
    return this._http.get<any>(`${this._baseUrl}/settings.json`).pipe(
      map((response: any) => {
        const dataSettings: Settings = new Settings();
        for (const key in response) {
          dataSettings.key = key;
          dataSettings.dailyCalorieNeed = response[key].daily_calorie_need;
          dataSettings.weight = response[key].weight;
          dataSettings.fatRatio = response[key].fat_ratio;
          dataSettings.target.key = response[key].target;
        }
        return dataSettings;
      }),
      catchError((error: any) => throwError(error)),
      takeUntil(this._unsubscribe$)
    );
  }

  public updateDataSettings(dataSettings: Settings): Observable<boolean> {
    return this._http.put<any>(`${this._baseUrl}/settings/${dataSettings.key}.json`, {
      "daily_calorie_need": dataSettings.dailyCalorieNeed,
      "weight": dataSettings.weight,
      "fat_ratio": dataSettings.fatRatio,
      "target": dataSettings.target.key
    }).pipe(
      map((response: any) => true),
      catchError((error: any) => throwError(error)),
      takeUntil(this._unsubscribe$)
    );
  }

  public addNutrient(nutrient: Nutrient): Observable<boolean> {
    return this._http.post<any>(`${this._baseUrl}/nutrients.json`, {
      "name": nutrient.name,
      "unit_quantity": 1,
      "unit_type": nutrient.unitType,
      "calories": nutrient.calories,
      "protein": nutrient.protein
    }).pipe(
      map((response: any) => true),
      catchError((error: any) => throwError(error)),
      takeUntil(this._unsubscribe$)
    );
  }

  public updateNutrient(nutrient: Nutrient): Observable<boolean> {
    return this._http.put<any>(`${this._baseUrl}/nutrients/${nutrient.key}.json`, {
      "name": nutrient.name,
      "unit_quantity": 1,
      "unit_type": nutrient.unitType,
      "calories": nutrient.calories,
      "protein": nutrient.protein
    }).pipe(
      map((response: any) => true),
      catchError((error: any) => throwError(error)),
      takeUntil(this._unsubscribe$)
    );
  }

  public deleteNutrient(key: string): Observable<boolean> {
    return this._http.delete<any>(`${this._baseUrl}/nutrients/${key}.json`).pipe(
      map((response: any) => true),
      catchError((error: any) => throwError(error)),
      takeUntil(this._unsubscribe$)
    );
  }

  public ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}

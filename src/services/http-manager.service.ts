import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpManager {
  private _baseUrl: string =
    'https://graduation-project-7c908-default-rtdb.europe-west1.firebasedatabase.app/';

  constructor(private _http: HttpClient) {}

  public get() {
    this._http.get<any>(this._baseUrl);
  }

  public post() {
    this._http.post<any>(this._baseUrl, {});
  }

  public put() {}

  public delete() {}
}

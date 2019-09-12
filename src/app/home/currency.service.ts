import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const base = {
  getData: (c: CurrencyContext) => `/latest?base=${c.currency}`
};

export interface CurrencyContext {
  currency: string;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  constructor(private httpClient: HttpClient) {}

  getBaseCurrency(context: CurrencyContext): Observable<string> {
    return this.httpClient
      .cache()
      .get(base.getData(context))
      .pipe(
        map((body: any) => body),
        catchError(() => of('Error, could not load list curency :-('))
      );
  }
}

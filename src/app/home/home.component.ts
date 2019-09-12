import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { CurrencyService } from './currency.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  dataCurrency: any | undefined;
  getSymbol: any | undefined;
  getCurrency: any | undefined;
  symbolForm!: FormGroup;
  inputValue: number = 10;
  getVal: number;
  isShow: Boolean = true;
  isLoading = false;

  newCurr: any;

  newCurrency: string;
  pushCurrency: any;
  objCurrency: any;

  constructor(private currencyService: CurrencyService, public formBuilder: FormBuilder) {
    this.newCurrency = '';
    this.pushCurrency = [];
  }

  deleteCurrency(index: any) {
    this.pushCurrency.splice(index, 1);
  }

  deleteSelectedCurrency() {
    //need ES5 to reverse loop in order to splice by index
    for (var i = this.pushCurrency.length - 1; i > -1; i--) {
      if (this.pushCurrency[i].completed) {
        this.pushCurrency.splice(i, 1);
      }
    }
  }

  ngOnInit() {
    this.getDataCurrency();
  }

  addCurrency() {
    this.isShow = this.isShow ? false : true;
  }

  changeSymbol(event: any) {
    console.log('event ' + event.target.value);
  }

  currencyForm = this.formBuilder.group({
    currency: [this.getSymbol],
    value: [this.getCurrency]
  });

  onSubmit() {
    this.isShow = true;
    console.log('Currency Name ' + JSON.stringify(this.currencyForm.value));
    this.newCurr = this.currencyForm.value;

    this.objCurrency = {
      newCurrency: this.newCurrency,
      completed: false
    };
    this.pushCurrency.push(this.objCurrency);
    event.preventDefault();
  }

  private Data: any = [];
  private Val: any = [];

  getDataCurrency() {
    this.isLoading = true;
    this.currencyService
      .getBaseCurrency({
        currency: 'USD'
      })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((data: any) => {
        this.dataCurrency = data;

        let symbol = data['rates'];
        this.getSymbol = Object.keys(symbol);
        this.getCurrency = Object.values(symbol);
        console.log('symbols ' + this.getSymbol);
        console.log('currency ' + this.getCurrency);

        for (let key in symbol) {
          this.Data.push(key);
          this.Val.push(symbol[key]);
        }

        type MyArrayType = Array<{ symbols: string; currency: number }>;
      });
  }
}

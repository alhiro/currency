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
  getNewValue: any | undefined;

  symbolForm!: FormGroup;
  inputValue: number = 10;
  isShow: Boolean = true;
  isLoading = false;

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
    // console.log('event ' + event.target.value);
  }

  currencyForm = this.formBuilder.group({
    getValue: ''
  });

  onSubmit() {
    this.isShow = true;
    // console.log('Currency Name ' + JSON.stringify(this.currencyForm.value));

    this.objCurrency = {
      newObjCurrency: this.newCurrency
    };
    this.pushCurrency.push(this.objCurrency);
    event.preventDefault();
  }

  getDataCurrency() {
    this.isLoading = true;
    this.currencyService
      .getBaseCurrency({
        // select default currency
        currency: 'USD'
      })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((data: any) => {
        // this for demo manual data
        this.dataCurrency = data;

        // select specific object and separate them
        let res = data['rates'];
        this.getSymbol = Object.keys(res);
        this.getCurrency = Object.values(res);
        // console.log('symbols ' + this.getSymbol);
        // console.log('currency ' + this.getCurrency);

        // push new currency base on length and get new value from object
        let customCurrency = [];
        for (let i = 0; i < this.getSymbol.length; i++) {
          let newCustom = {
            currency: this.getSymbol[i],
            value: this.getCurrency[i]
          };
          customCurrency.push(newCustom);
        }
        this.getNewValue = customCurrency;
        //console.log('newCurrency ' + JSON.stringify(newCurrency));
      });
  }
}

import { Type } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CoreModule, HttpCacheService } from '@app/core';
import { CurrencyService } from './currency.service';

describe('CurrencyService', () => {
  let currencyService: CurrencyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule, HttpClientTestingModule],
      providers: [HttpCacheService, CurrencyService]
    });

    currencyService = TestBed.get(CurrencyService);
    httpMock = TestBed.get(HttpTestingController as Type<HttpTestingController>);

    const htttpCacheService = TestBed.get(HttpCacheService);
    htttpCacheService.cleanCache();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getCurrency', () => {
    it('should return a data from exchangeratesapi', () => {
      // Arrange
      const mockCurrency = { value: 'latest currency' };

      // Act
      const currencySubscription = currencyService.getCurrency({ currency: 'USD' });

      // Assert
      currencySubscription.subscribe((currency: string) => {
        expect(currency).toEqual(mockCurrency.value);
      });
      httpMock.expectOne({}).flush(mockCurrency);
    });

    it('should return a string in case of error', () => {
      // Act
      const currencySubscription = currencyService.getCurrency({ currency: 'USD' });

      // Assert
      currencySubscription.subscribe((currency: string) => {
        expect(typeof currency).toEqual('string');
        expect(currency).toContain('Error');
      });
      httpMock.expectOne({}).flush(null, {
        status: 500,
        statusText: 'error'
      });
    });
  });
});

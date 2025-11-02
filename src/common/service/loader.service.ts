import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private _loading = new BehaviorSubject<boolean>(false);
  loading$ = this._loading.asObservable();
  private requestCount = 0;

  constructor() {console.log('Loader Service Initialized');}

  showLoader() {
    this.requestCount++;
    this._loading.next(true);
  }

  hideLoader() {
    this.requestCount--;
    if (this.requestCount === 0) {
      this._loading.next(false);
    }
  }
}

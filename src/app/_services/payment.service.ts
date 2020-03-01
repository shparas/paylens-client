import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { User } from '../_models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  receivePayment(amount, rawId) {
    return this.http.post<any>(`${environment.apiUrl}/receive-payment`, { amount, rawId })
      .pipe(map(data => {
        return data;
      }));
  }


  makePayment(id) {
    return this.http.post<any>(`${environment.apiUrl}/make-payment`, { id })
      .pipe(map(data => {
        return data;
      }));
  }

  getPendingPayments(page = 1) {
    return this.http.get<any>(`${environment.apiUrl}/receive-payment/pending?page=${page}`)
      .pipe(map(data => {
        return data;
      }));
  }

  getPaidPayments(page = 1) {
    return this.http.get<any>(`${environment.apiUrl}/receive-payment/paid?page=${page}`)
      .pipe(map(data => {
        return data;
      }));
  }

  getReceivedPayments(page = 1) {
    return this.http.get<any>(`${environment.apiUrl}/receive-payment/received?page=${page}`)
      .pipe(map(data => {
        return data;
      }));
  }

  getPaymentStatus(id) {
    return this.http.get<any>(`${environment.apiUrl}/receive-payment/status?id=${id}`)
      .pipe(map(data => {
        return data;
      }));
  }

  getBalance() {
    return this.http.get<any>(`${environment.apiUrl}/receive-payment/balance`)
      .pipe(map(data => {
        return data;
      }));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}

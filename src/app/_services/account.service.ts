import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private http: HttpClient
  ) { }

  addAccount(publicToken, account, institution) {
    return this.http.post<any>(`${environment.apiUrl}/account`, { publicToken, account, institution })
      .pipe(map(data => {
        return data;
      }));
  }

  getAllAccounts(){
    return this.http.get<any>(`${environment.apiUrl}/account`)
      .pipe(map(data => {
        return data;
      }));
  }

  processPayment(accountId: string, withdraw: boolean, amount: number){
    return this.http.post<any>(`${environment.apiUrl}/account/transfer`, {accountId, withdraw, amount})
      .pipe(map(data => {
        return data;
      }));
  }

  getTransfers(pageNumber){
    return this.http.get<any>(`${environment.apiUrl}/account/transfer`)
    .pipe(map(data => {
      return data;
    }));
  }
}

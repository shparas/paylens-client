import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/auth/login`);
    }

    getBalance() {
        return this.http.get<any>(`${environment.apiUrl}/user/balance`)
            .pipe(map(data => {
                return data;
            }));
    }
}
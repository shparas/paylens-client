import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/auth/login`);
    }

    register(user: User) {
        console.log(user);
        return this.http.post(`${environment.apiUrl}/auth/register`, user);
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/auth/login`);
    }
}
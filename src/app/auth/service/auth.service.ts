import { Injectable } from '@angular/core';
import { enviroments } from '../../../enviroments/enviroments';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user.interface';
import { Observable, tap, map, catchError } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = enviroments.baseUrl;
  private user?: User;

  constructor(private http:HttpClient  ) { }

  get CurrentUser(): User|undefined {
    if(!this.user) return undefined;
    return structuredClone(this.user);
  }

  login(email:string, password:string):Observable<User> {
   return this.http.get<User>(`${this.baseUrl}/users/1`)
   .pipe(
     tap(user => this.user = user),
     tap(user => localStorage.setItem('token', '123456'))
   );
  }

  checkAuthentication():Observable<boolean> {
    if(!localStorage.getItem('token')) return of (false);
    const token = localStorage.getItem('token');
    return this.http.get<User>(`${this.baseUrl}/users/1`)
    .pipe(
      tap(user => this.user = user),
      map(user => !!user),
      catchError(() => of(false))
    );

  }

  logout(){
    this.user = undefined;
    localStorage.clear();
  }

}
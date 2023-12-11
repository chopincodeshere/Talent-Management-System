import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserRoleService {
  constructor(private http: HttpClient) {}

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>('user/');
  }

  public addUser(user: User): Observable<User> {
    return this.http.post<User>(`user/join`, user);
  }
}

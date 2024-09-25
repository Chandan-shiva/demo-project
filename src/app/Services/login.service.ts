import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  /**
   * Check user email and password matches
   * 
   * @param email 
   * @param password 
   * @returns 
   */
  public checkLogin(email: string, password: string): Observable<boolean> {
    return this.getUsers().pipe(
      map(users => {
        
        console.log(users);
        // Find the user with the matching email and password
        const user = users.find((user: any) => user.email === email && user.password === password);
        return !!user; // Return true if a user is found, otherwise false
      })
    );
    
    // https://jsonplaceholder.typicode.com/users
  }
  forgotPassword(email: string, newPassword: string): Observable<any> {
    console.log(email + " " + newPassword);
    return this.getUsers().pipe(
      switchMap(users => {
        console.log(users);
        const user = users.find((user: any) => user.email === email);
        if (user) {
          const updatedUser = { ...user, password: newPassword };
          return this.http.put(`http://localhost:3000/users/${user.id}`, updatedUser);
          
        } else {
          console.log('user not found');
          return of(null);
        }
      })
    );
  }
  
  addUser(user:any):Observable<any>{
    return this.http.post(this.apiUrl,user);
  }
  
  getUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?email=${email}`);
  }
  updatePassword(id: number, newPassword: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, { password: newPassword });
  }
}

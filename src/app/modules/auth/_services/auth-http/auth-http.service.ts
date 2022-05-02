import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserModel } from '../../_models/user.model';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../_models/auth.model';

const API_USERS_URL = `${environment.apiDevUrl}/authentication`;
@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) { }

  // public methods
  login(username: string, password: string): Observable<any> {
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('client_id', environment.KEYCLOAK_CLIENT_ID)
      .set('username', username)
      .set('password', password);

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post<AuthModel>(`${environment.apiDevUrl}/auth/realms/${environment.KEYCLOAK_REALM}/protocol/openid-connect/token`, body.toString(), {
      headers: headers
    });
  }

  // CREATE =>  POST: add a new user to the server
  createUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(API_USERS_URL, user);
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiDevUrl}/authentication/forgotpassword`, {
      email,
    });
  }

  changePassword(params: any, userId: string): Observable<any> {
    const API_URL = `${environment.apiDevUrl}/auth/admin/realms/${environment.KEYCLOAK_REALM}`;
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('app_access_token'));
    return this.http.put<boolean>(`${API_URL}/users/${userId}/reset-password`, params, { headers });
  }

  logout(userId: string) {
    const API_URL = `${environment.apiDevUrl}/auth/admin/realms/${environment.KEYCLOAK_REALM}`;
    return this.http.post(`${API_URL}/user/${userId}/logout`, {});
  }
}

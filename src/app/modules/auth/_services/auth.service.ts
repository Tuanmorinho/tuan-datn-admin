import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../_models/user.model';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { AuthHTTPService } from '@app/modules/auth/_services/auth-http/auth-http.service';
import jwt_decode from "jwt-decode";
import { HttpClient, HttpHeaders } from "@angular/common/http";
export const authLocalStorgeUser = `user-${environment.appVersion}`;
export const authLocalStorageToken = `app_access_token`;
export const authLocalRefreshToken = `app_refresh_token`;
@Injectable({
  providedIn: "root",
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = [];

  // public fields
  currentUser$: Observable<UserModel>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserModel>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserModel) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router,
    private http: HttpClient
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserModel>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  // public methods
  login(username: string, password: string): Observable<UserModel> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(username, password).pipe(
      map((res: any) => {
        var decoded: any = jwt_decode(res.access_token);
        this.setAuthFromLocalStorage(res);
        decoded.accessToken = res.access_token;
        this.currentUserSubject = new BehaviorSubject<any>(decoded);
        return res;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout(url?) {
    localStorage.removeItem(authLocalStorageToken);
    this.router.navigate(["/auth/login"]);
  }

  getUserByToken() {
    if (!localStorage.getItem(authLocalStorageToken)) {
      return false;
    }
    const auth: any = jwt_decode(localStorage.getItem(authLocalStorageToken));
    if (!auth) {
      return undefined;
    }
    this.currentUserSubject = new BehaviorSubject<UserModel>(auth as UserModel);
    return auth;
  }

  // need create new user then login
  registration(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(user).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
      }),
      switchMap(() => this.login(user.email, user.password)),
      catchError((err) => {
        console.error("err", err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  changePassword(params: any): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .changePassword(params, this.currentUserValue.sub)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  // private methods
  private setAuthFromLocalStorage(auth: any): void {
    var decoded: any = jwt_decode(auth.access_token);
    decoded.accessToken = auth.access_token;
    localStorage.setItem(authLocalStorageToken, auth.access_token);
    localStorage.setItem(authLocalRefreshToken, auth.refresh_token);
    localStorage.setItem(authLocalStorgeUser, JSON.stringify(decoded));
    localStorage.setItem("isSmallFont", JSON.stringify(true));
  }

  getAuthFromLocalStorage(): any {
    try {
      const authData: any = jwt_decode(
        localStorage.getItem(authLocalStorageToken)
      );
      return authData;
    } catch (error) {
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

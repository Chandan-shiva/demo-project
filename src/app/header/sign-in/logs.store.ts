import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, of } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { LoginService } from 'src/app/Services/login.service';

interface LogsState {
  loading: boolean;
  loggedIn: boolean;
  error: string | null;
  passwordReset: boolean; 
  registerMessage:string;
}

@Injectable()
export class LogsStore extends ComponentStore<LogsState> {
  constructor(private loginService: LoginService) {
    super({ loading: false, loggedIn: false, error: null,passwordReset: false ,registerMessage:null});
  }

  readonly loading$ = this.select(state => state.loading);
  readonly loggedIn$ = this.select(state => state.loggedIn);
  readonly error$ = this.select(state => state.error);
  readonly passwordReset$ = this.select(state => state.passwordReset);
  readonly registerMessage$ = this.select(state => state.registerMessage);

  readonly logIn = this.effect((credentials$: Observable<{ email: string, password: string }>) =>
    credentials$.pipe(
      tap(() => this.patchState({ loading: true, error: null })),
      switchMap(({ email, password }) =>
        this.loginService.checkLogin(email, password).pipe(
          tap(isLoggedIn => {
            if (isLoggedIn) {
              this.patchState({ loggedIn: true, loading: false });
            } else {
              this.patchState({ error: 'Invalid email or password', loading: false });
            }
          })
        )
      )
    )
  );
  readonly forgotPassword = this.effect((credentials$: Observable<{ email: string, newPassword: string }>) =>
    credentials$.pipe(
      tap(() => this.patchState({ loading: true, error: null, passwordReset: false })),
      switchMap(({ email, newPassword }) =>
        this.loginService.forgotPassword(email, newPassword).pipe(
          tap(success => {
            if (success) {
              this.patchState({ passwordReset: true, loading: false });
            } else {
              this.patchState({ error: 'User not found', loading: false });
            }
          })
        )
      )
    )
  );

  readonly registerUser = this.effect((Credential$:Observable<{email:string,password:string,name:string,number:string}>) =>
    Credential$.pipe(
      tap(() => this.patchState({loading:true,error:null,registerMessage:null})),
      switchMap(({email,password,name,number}) => 
        this.loginService.getUsers().pipe(
          switchMap(users => {
            const existingUser = users.find((user:any) => user.email===email);
            if(existingUser){
              this.patchState({ error: 'User already exist', loading: false });
              return of(null);
            }else{
              const newuser = {
                name,
                number,
                email,
                password,
                id:users.length+1,
              }
              return this.loginService.addUser(newuser).pipe(
                tap(() => {
                  this.patchState({ registerMessage: 'User registered successfully', loading: false });

                })
              )
            }
          }),
          catchError(error => {
            this.patchState({ error: 'Registration failed', loading: false });
            return of(null);
          })
        ))
    )
  )

}

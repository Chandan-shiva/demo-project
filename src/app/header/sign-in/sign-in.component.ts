import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar'; // For toaster notifications
import { LogsStore } from './logs.store';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  providers: [LogsStore], // Provide LogsStore
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  forgotPasswordForm: FormGroup;

  errorMessage: string = '';
  formType: number = 1;
  hide:boolean = true;

  constructor(
    private fb: FormBuilder,
    private logsStore: LogsStore, // Inject LogsStore
    private snackBar: MatSnackBar, // Inject MatSnackBar for toast notifications,
    public dialogRef: MatDialogRef<SignInComponent>
  ) {}

  ngOnInit(): void {
    // Initialize the login form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.registerForm = this.fb.group({
      name:['',[Validators.required]],
      number:['',[Validators.required, 
                  Validators.pattern('^[0-9]*'), // Only digits allowed
                  Validators.minLength(10),       // Minimum length is 10
                  Validators.maxLength(10)        // Maximum length is 10
            ]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.forgotPasswordForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        newPassword: ['', Validators.required],
        confirmNewPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );

    // Subscribe to the store's loggedIn$ state
    this.logsStore.loggedIn$.subscribe((loggedIn) => {
      if (loggedIn) {
        this.closeDialogSignIn();
        this.snackBar.open('Login successful!', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: ['success-snackbar'],
        });
      }
    });

    // Subscribe to the store's error$ state
    this.logsStore.error$.subscribe((error) => {
      if (error) {
        this.snackBar.open(error, 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: ['error-snackbar'],
        });
      }
    });

    this.logsStore.passwordReset$.subscribe((passwordReset) =>{
      if(passwordReset){
        this.closeDialogSignIn();
        this.snackBar.open('Password changed successful!', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: ['success-snackbar'],
        });
      }
    })
    this.logsStore.registerMessage$.subscribe((registerMessage) =>{
      if(registerMessage){
        this.closeDialogSignIn();
        this.snackBar.open(registerMessage, 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['success-snackbar'],
      });
      }
    })
    
  }
 

  closeDialogSignIn():void{
    this.dialogRef.close(); 
  }
  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const newPassword = form.get('newPassword').value;
    const confirmNewPassword = form.get('confirmNewPassword').value;
    if (newPassword !== confirmNewPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  handleFormType(val: number) {
    this.formType = val;
  }

  // Function called on login form submit
  onSubmit(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      // Dispatch the logIn action in the LogsStore
      this.logsStore.logIn({ email, password });
    }
  }

  onRegisterSubmit(): void {
    if (this.registerForm.valid) {
      const email = this.registerForm.value.email;
      const password = this.registerForm.value.password;
      const name = this.registerForm.value.name;
      const number = this.registerForm.value.number;
      this.logsStore.registerUser({email,password,name,number});
      

    }
  }

  onForgotPasswordSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;
      const newPassword = this.forgotPasswordForm.value.newPassword;
      // Forgot password logic
      this.logsStore.forgotPassword({ email, newPassword });
  
    }
  }
}

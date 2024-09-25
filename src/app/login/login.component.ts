import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  forgetpass:boolean=false;
  /** Hold register */
  register:boolean = false;

  handleRegister(){
    this.register=true;
    this.forgetpass=false;
  }

  handleForgetpass(){
    this.forgetpass=true;
  }
}

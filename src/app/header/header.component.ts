import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignInComponent } from './sign-in/sign-in.component';
// import { MatDialog } from '@angular/material/dialog';
// import { SignInComponent } from './sign-in/sign-in.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(public dialog:MatDialog){}

  handleSignInDialog(){
    const dialogRef = this.dialog.open(SignInComponent,{
      disableClose: true
    }
      
    );
  } 

}

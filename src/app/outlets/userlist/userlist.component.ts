import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { LoginService } from 'src/app/Services/login.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements AfterViewInit, OnInit{
  loading:boolean = true;
  displayedColumns: string[] = ['id', 'name', 'number', 'email'];

  constructor(private loginService:LoginService){};

  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  users:User=null;

  ngOnInit(){
    this.getUserData();
  }
  getUserData(): void {
    this.loginService.getUsers().subscribe((users: User[]) => {
      // Set the MatTableDataSource with the retrieved data
      // this.dataSource.data = users;

      setTimeout(()=>{
        this.loading=false;
        this.dataSource.data = users
      },2000);

      // Set the paginator after the data is fetched
      this.dataSource.paginator = this.paginator;
    });
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}

export interface User{
  id:number,
  name:string,
  number:string,
  email:string,
  password:string,
} 

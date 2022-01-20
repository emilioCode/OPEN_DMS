import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Entity } from 'src/app/classes/entity';
import { CommonService, UserService, EntityService, ModalMessageService } from 'src/app/services/index';
import { User } from '../../../classes/user';
import { UserDialogComponent } from './user-dialog/user-dialog.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  columnsToDisplay: string[] = [
    'UserAccount',
    'Description',
    'TeamId',
    'actions'
  ];
  dataSource!: MatTableDataSource<any>;
  entities$: Observable<Entity[]>;
  session: any; 

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  
  constructor(
    private commonService: CommonService, 
    private entityService: EntityService, 
    private userService: UserService,
    private modalMessageService: ModalMessageService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.session = this.commonService.sessionStorage.get("user");
    this.entities$ = this.entityService._get(this.session);
    this.getUsers(this.session);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  setDataSource(data: any){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getUsers(session: any): void{
    this.userService._get(session).subscribe(res => {
      if(res.success){
        this.setDataSource(res.data);
      }else{
        this.modalMessageService.error(res.message)
        this.setDataSource([]);
      }
    },error => {
      this.setDataSource([]);
    });
  }

  openDialog = (element: User, action: string = 'read'): void => {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      height: '620px',
      width: '600px',
      data: { element, action }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result)this.getUsers(this.session);
    }); 
  }


}

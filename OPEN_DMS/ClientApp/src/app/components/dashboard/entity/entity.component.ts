import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { IEntity } from './../../../interfaces/ientity';
import { Observable } from 'rxjs';
import { EntityDialogComponent } from './entity-dialog/entity-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { ModalMessageService } from 'src/app/services/modal-message.service';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.css']
})
export class EntityComponent implements OnInit {
  entities$: Observable<any>;
  
  columnsToDisplay: string[] = ['Id', 'EntityName', 'Disabled', 'actions'];
  dataSource!: MatTableDataSource<any>;


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private commonService: CommonService, 
    private modalMessageService: ModalMessageService,
    public dialog: MatDialog
    ) { }

  ngOnInit() {
    this.getEntities();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getEntities(){
    // this.entities$ =  this.entityService.getEntities("api/Entities","/0/ROOT")
    //   this.entities$.subscribe(res => {
    //     this.dataSource = new MatTableDataSource(res);
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;
    //   });
    const session = this.commonService.sessionStorage.get("user");
    const data = `/${(session.entityId? session.entityId: 0)}/${session.accessLevel? session.accessLevel: "NONE"}`;
    this.entities$ =  this.commonService.getData("api/Entities", data)
    this.entities$.subscribe(res => {
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

  openDialog = (element: IEntity, action: string = 'read'): void => {
    const dialogRef = this.dialog.open(EntityDialogComponent, {
      height: '300px',
      width: '500px',
      data: { element, action }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result)this.getEntities();
    }); 
  }

  setDataSource(data: any){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}



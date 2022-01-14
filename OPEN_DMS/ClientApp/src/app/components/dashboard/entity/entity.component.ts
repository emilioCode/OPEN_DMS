import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Observable } from 'rxjs';
import { EntityDialogComponent } from './entity-dialog/entity-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { ModalMessageService } from 'src/app/services/modal-message.service';
import { Entity } from 'src/app/classes/entity';
import { EntityService } from 'src/app/services/entity.service';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.css']
})
export class EntityComponent implements OnInit {
  columnsToDisplay: string[] = ['Id', 'EntityName', 'Disabled', 'actions'];
  dataSource!: MatTableDataSource<any>;
  session: any; 

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private commonService: CommonService, 
    private entityService: EntityService, 
    private modalMessageService: ModalMessageService,
    public dialog: MatDialog
    ) { }

  ngOnInit() {
    this.session = this.commonService.sessionStorage.get("user");
    this.getEntities(this.session);
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

  getEntities(session: any): void{
    this.entityService._get(session).subscribe(res => {
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

  openDialog = (element: Entity, action: string = 'read'): void => {
    const dialogRef = this.dialog.open(EntityDialogComponent, {
      height: '220px',
      width: '500px',
      data: { element, action }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result)this.getEntities(this.session);
    }); 
  }


}



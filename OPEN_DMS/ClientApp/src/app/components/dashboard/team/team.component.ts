import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { ITeam } from 'src/app/interfaces/iteam';
import { CommonService } from 'src/app/services/common.service';
import { ModalMessageService } from 'src/app/services/modal-message.service';
import { TeamDialogComponent } from './team-dialog/team-dialog.component';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  teams$: Observable<any>;
  columnsToDisplay: string[] = [
    'Id', 
    // 'EntityId', 
    'TeamName', 
    'PathRoot', 
    // 'TelephoneNumber', 
    // 'HostName', 
    // 'PortNumber', 
    // 'Email', 
    // 'Pass', 
    // 'Disabled', 
    'actions'
  ];
  dataSource!: MatTableDataSource<any>;
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  
  constructor(
    private commonService: CommonService, 
    private modalMessageService: ModalMessageService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getTeams();
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

  getTeams(){
    const session = this.commonService.sessionStorage.get("user");
    const data = `?entityid=${session.entityId}`;
    this.teams$ =  this.commonService.getData("api/Teams", data)
    this.teams$.subscribe(res => {
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

  openDialog = (element: ITeam, action: string = 'read'): void => {
    const dialogRef = this.dialog.open(TeamDialogComponent, {
      height: '530px',
      width: '600px',
      data: { element, action }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result)this.getTeams();
    }); 
  }

}

import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { IEntity } from './../../../interfaces/ientity';
import { Observable } from 'rxjs';
import { EntityService } from 'src/app/services/entity.service';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.css']
})
export class EntityComponent implements OnInit {
  entities$: Observable<any>;
  
  columnsToDisplay: string[] = ['id', 'entityName', 'disabled', 'actions'];
  dataSource!: MatTableDataSource<any>;


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private entityService: EntityService) { }

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
    this.entities$ =  this.entityService.getEntities("api/Entities","/0/ROOT")
      this.entities$.subscribe(res => {console.log(res)
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  openDialog = (element: IEntity, action: string = 'read'): void => {

  }

}



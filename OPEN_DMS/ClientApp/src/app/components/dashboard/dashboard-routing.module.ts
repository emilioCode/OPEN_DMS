import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { EntityComponent } from './entity/entity.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, children:[
    { path: '', component: HomeComponent },
    { path: 'entity', component: EntityComponent }
  ]}
];


@NgModule({
  declarations:[
    DashboardComponent,
    HomeComponent,
    EntityComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

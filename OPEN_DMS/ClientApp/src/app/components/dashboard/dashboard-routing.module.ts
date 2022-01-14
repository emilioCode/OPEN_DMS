import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { EntityComponent } from './entity/entity.component';
import { EntityDialogComponent } from './entity/entity-dialog/entity-dialog.component';
import { TeamComponent } from './team/team.component';
import { TeamDialogComponent } from './team/team-dialog/team-dialog.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, children:[
    { path: '', component: HomeComponent },
    { path: 'entity', component: EntityComponent },
    { path: 'team', component: TeamComponent },
  ]}
];

@NgModule({
  declarations:[
    DashboardComponent,
    HomeComponent,
    EntityComponent,
    EntityDialogComponent,
    TeamComponent,
    TeamDialogComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [RouterModule],
  entryComponents: [
    EntityDialogComponent,
    TeamDialogComponent,
  ]
})
export class DashboardRoutingModule { }

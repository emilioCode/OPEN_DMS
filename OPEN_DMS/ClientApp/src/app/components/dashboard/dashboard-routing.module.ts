import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { EntityComponent } from './entity/entity.component';
import { EntityDialogComponent } from './entity/entity-dialog/entity-dialog.component';
import { TeamComponent } from './team/team.component';
import { TeamDialogComponent } from './team/team-dialog/team-dialog.component';
import { UserComponent } from './user/user.component';
import { UserDialogComponent } from './user/user-dialog/user-dialog.component';
import { FileGroupComponent } from './file-group/file-group.component';
import { ToobalComponent } from '../utilities/toobal/toobal.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, children:[
    { path: '', component: HomeComponent },
    { path: 'entity', component: EntityComponent },
    { path: 'team', component: TeamComponent },
    { path: 'user', component: UserComponent },
    { path: 'file-group', component: FileGroupComponent }
  ]}
];

@NgModule({
  declarations:[
    DashboardComponent,
    HomeComponent,
    EntityComponent,
    TeamComponent,
    UserComponent,
    EntityDialogComponent,
    TeamDialogComponent,
    UserDialogComponent,
    FileGroupComponent,
    ToobalComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [RouterModule],
  entryComponents: [
    EntityDialogComponent,
    TeamDialogComponent,
    UserDialogComponent,
  ]
})
export class DashboardRoutingModule { }

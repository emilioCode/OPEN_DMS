import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/classes/user';
import { CONSTANT } from 'src/app/enums/CONSTANT';
import { CommonService, ModalMessageService } from 'src/app/services/index';
import { UserDialogComponent } from './user/user-dialog/user-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  session: any;
  self: User;
  moduleList: any = [
    { name: 'Dashboard', class: 'primary', icon: 'dashboard', routerLink: '/dashboard', everyone: true },
    { name: 'Entity', class: 'primary', icon: 'group_work', routerLink: '/dashboard/entity', everyone: false },
    { name: 'Teams', class: 'primary', icon: 'folder_shared', routerLink: '/dashboard/team', everyone: false },
    { name: 'Manage Accounts', class: 'primary', icon: 'manage_accounts', routerLink: '/dashboard/user', everyone: false },
    { name: 'File Group', class: 'primary', icon: 'folder', routerLink: '/dashboard/file-group', everyone: true }
  ];
  modules: any=[];

  constructor(
    private commonService: CommonService,
    public dialog: MatDialog,
    private modalMessageService: ModalMessageService
    ) { }

  ngOnInit() {
    this.session = this.commonService.sessionStorage.get("user");
    this.self = new User(this.session.id,this.session.name,null,this.session.userName,null,this.session.teamId,
      this.session.entityId, this.session.accessLevel,new Date(),new Date(this.session.expirationDate), false);

      const isAdministrator = this.session.accessLevel == CONSTANT.ROOT || this.session.accessLevel == CONSTANT.ADMINISTRATOR;
      this.modules = isAdministrator? this.moduleList: this.moduleList.filter(m => m.everyone == true);
  }

  logOut = () => {
    this.commonService.sessionStorage.deleteArray(['user']);
    this.commonService.route.navigate(['/']);
  }
  
  openDialog = (element: User, action: string = 'read'): void => {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      height: '620px',
      width: '600px',
      data: { element, action }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) this.modalMessageService.error("The password account has been updated");
    }); 
  }

  changePassword(){
    this.openDialog(this.self, 'change_password');
  }
}

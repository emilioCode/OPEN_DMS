import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';
import { DocumentFileIcon } from 'src/app/classes/document';
import { CONSTANT } from 'src/app/enums/CONSTANT';
import { CommonService, ModalMessageService, FileGroupService, TeamService } from 'src/app/services/index';
import { ModalItemGridComponent } from '../../utilities/modal-item-grid/modal-item-grid.component';

@Component({
  selector: 'app-file-group',
  templateUrl: './file-group.component.html',
  styleUrls: ['./file-group.component.css']
})
export class FileGroupComponent implements OnInit {
  session: any;
  files: DocumentFileIcon[];
  teams$: Observable<any>;
  isAdministrator: boolean = false;
  formFiles: FormGroup;
  fileToUpload: File[] = [];
  // document: any;
  formFilesUpload: FormGroup;

  constructor(
    private commonService: CommonService,  
    private modalMessageService: ModalMessageService,
    private fileGroupService: FileGroupService,
    private teams: TeamService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.session = this.commonService.sessionStorage.get("user");
    this.isAdministrator = this.session.accessLevel == CONSTANT.ROOT || this.session.accessLevel == CONSTANT.ADMINISTRATOR;
    if(this.isAdministrator){
      this.teams$ = this.teams._get(this.session);
      this.initFormFiles();
      this.initFormFilesUpload();
    }
    this.getFiles(this.session);


  }

  openModal = (file) =>{
    console.log(file)
    const dialogRef = this.dialog.open(ModalItemGridComponent, {
      height: '400px',
      width: '400px',
      data: { file }
    });
  }

  getFiles(session, teamId: number = null){
    this.fileGroupService._get(session, teamId)
    .subscribe(res => {
      this.files = res.data.map(e =>{
        return new DocumentFileIcon(
          e.Id,
          e.FileName,
          e.Extension,
          e.Size,
          e.TeamId,
          e.EntityId,
          e.InsertionDate,
          e.PathAlternative,
          e.CommentDetail,
          e.DistinctDetail,
          e.IdUser,
          this.getIcon(e.Extension),
          e.Disabled
        )        
      })
    }, err => {
      this.modalMessageService.error(err);
    })
  }

  getIcon(extension: string): string {
    // picture_as_pdf
    // description
    // text_snippet
    // file_present
    // insert_photo
    // photo_filter
    // help_outline
    let icon: string = '';
    switch (extension.toLowerCase()) {
      case "pdf":
        icon = 'picture_as_pdf';
        break;
      case "jpg":
        icon = 'insert_photo';
        break;
      default:
        icon = 'help_outline';
        break;
    }
    return icon;
  }

  handleSubmit(){
    const teamId: number = this.formFiles.controls.TeamId.value != '' ? this.formFiles.controls.TeamId.value : null;
    this.getFiles(this.session, teamId);
  }

  initFormFiles = () => {
    this.formFiles = this.formBuilder.group({
      TeamId: [ null ]
    });
    this.formFiles.get('TeamId').valueChanges.subscribe( data => {
      this.handleSubmit();
    });
  }

  handleFileInput(files: FileList) {
    for (let index = 0; index < files.length; index++) {
      const element = files.item(index);
      this.fileToUpload.push(element);
    }
  }
  
  postFile(): void {
    var formData: FormData = new FormData();
    this.fileToUpload.forEach(element => {
      formData.append("files", element, element.name);
    });
    const teamId = this.formFiles.controls.TeamId.value? this.formFiles.controls.TeamId.value: '' ;
    const str = `api/File?userAccount=${this.session.userName}&passwordAccount=${this.session.hashCode}&teamId=${teamId}&commentDetail=&distinctDetail=`;
    this.commonService.postData(str, formData).subscribe(res => {
      this.modalMessageService.error(res.message);
      console.log(res.data);
      this.formFilesUpload.reset();
      this.fileToUpload =[];
      if(this.isAdministrator){
        this.handleSubmit();
      }else{
        this.getFiles(this.session);
      }
    }, err => {
      this.modalMessageService.error(err);
      console.error(err);
    })
 
  }

  initFormFilesUpload = () => {
    this.formFilesUpload = this.formBuilder.group({
      documentControl: [ null , Validators.required ]
    })
    // this.formFilesUpload.get('document').valueChanges.subscribe( data => {
    //   console.log(data)
    // });
  }

}

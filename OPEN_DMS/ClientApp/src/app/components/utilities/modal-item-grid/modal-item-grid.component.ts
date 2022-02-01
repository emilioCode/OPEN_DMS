import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentFileIcon } from 'src/app/classes/document';
import { CommonService, FileStreamService, ModalMessageService } from 'src/app/services';

@Component({
  selector: 'app-modal-item-grid',
  templateUrl: './modal-item-grid.component.html',
  styleUrls: ['./modal-item-grid.component.css']
})
export class ModalItemGridComponent implements OnInit {
  item: DocumentFileIcon = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<any>,
    private commonService: CommonService,
    private fileStream: FileStreamService,
    private modalMessageService: ModalMessageService
  ) { }

  ngOnInit(): void {
    this.item = this.data.file;
  }


  closeDialog(result:any = null){
    this.dialogRef.close(result);
  }

  downloadFile = () => {
    var list = [];
    list.push(this.item.Id)
    const idFiles = JSON.stringify(list);
    const session = this.commonService.sessionStorage.get("user");
    const data = `api/File/DownloadFile?userAccount=${session.userName}&passwordAccount=${session.hashCode}&idFiles=${idFiles}`;
     this.commonService.getData(data)
     .subscribe(res => {
      if(res.success){
        let arrays = [];
        arrays = res.data;
        arrays.forEach(e => {
          let bytes: Uint8Array = this.fileStream.base64ToArrayBuffer(e.FileContents);    
          this.fileStream.saveByteArray(bytes, e.ContentType, e.FileDownloadName);  
        });
      }else{
        this.modalMessageService.error(res.message);
      }
     }, err => {
      this.modalMessageService.error(err);
    });
  }




}

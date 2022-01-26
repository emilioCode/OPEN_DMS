import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentFileIcon } from 'src/app/classes/document';

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
  ) { }

  ngOnInit(): void {
    this.item = this.data.file;
  }


  closeDialog(result:any = null){
    this.dialogRef.close(result);
  }

  downloadFile = () => {
    console.log('download');
    console.log(this.item);
  }
}

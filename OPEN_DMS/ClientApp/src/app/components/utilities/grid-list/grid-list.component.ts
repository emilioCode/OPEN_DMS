import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DocumentFile, DocumentFileIcon } from 'src/app/classes/document';

@Component({
  selector: 'app-grid-list',
  templateUrl: './grid-list.component.html',
  styleUrls: ['./grid-list.component.css']
})
export class GridListComponent {
  @Input() cols: string = null;
  @Input() rowHeight: string = null;
  @Input() colspan: string = null;
  @Input() rowspan: string = null;
  @Input() arrayList: DocumentFileIcon[] = [];
  
  @Output() clickEvent = new EventEmitter<DocumentFile>();

  returnElement(item:DocumentFile): void {
    this.clickEvent.emit(item);
  }
  
}

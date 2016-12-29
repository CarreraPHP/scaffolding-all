import { Component, Optional, OnInit, Input } from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.scss']
})
export class DialogContentComponent implements OnInit {

  @Input()
  public currentValue:any;

  @Input()
  public attributeKey:string;

  constructor(@Optional() public dialogRef: MdDialogRef<DialogContentComponent>) { }

  doClose(value: any) {
    // debugger;
    if(typeof value === "string" && value.length > 0){
      this.dialogRef.close(value);
    }
  }

  ngOnInit() {
  }

}

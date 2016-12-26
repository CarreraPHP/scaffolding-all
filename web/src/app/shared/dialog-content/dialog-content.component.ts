import { Component, Optional, OnInit } from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.scss']
})
export class DialogContentComponent implements OnInit {

  constructor(@Optional() public dialogRef: MdDialogRef<DialogContentComponent>) { }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import {MdDialog, MdDialogRef, MdSnackBar} from '@angular/material';

import { DialogContentComponent } from '../shared/dialog-content/dialog-content.component';
import { EditorComponent } from '../editor/editor.component';

@Component({
  selector: 'app-viewport',
  templateUrl: './viewport.component.html',
  styleUrls: ['./viewport.component.scss']
})
export class ViewportComponent implements OnInit {

  isDarkTheme: boolean = true;
  lastDialogResult: string;

  foods: any[] = [
    {name: 'Pizza', rating: 'Excellent'},
    {name: 'Burritos', rating: 'Great'},
    {name: 'French fries', rating: 'Pretty good'},
  ];

  progress: number = 0;

  constructor(private _dialog: MdDialog, private _snackbar: MdSnackBar) {
    // Update the value for the progress-bar on an interval.
    setInterval(() => {
      this.progress = (this.progress + Math.floor(Math.random() * 4) + 1) % 100;
    }, 200);
  }

  downloadFile(editEl:EditorComponent) {
    console.log("%c step 2: Viewport method triggered", "color:red;font-size:medium;", arguments);
    editEl.downloadLatestJSON();
  }

  openDialog() {
    let dialogRef = this._dialog.open(DialogContentComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.lastDialogResult = result;
    })
  }

  showSnackbar() {
    this._snackbar.open('YUM SNACKS', 'CHEW');
  }

  ngOnInit() {
  }

}

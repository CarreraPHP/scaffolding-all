import { Component, OnInit } from '@angular/core';

import { EditorComponent } from '../editor/editor.component';

@Component({
  selector: 'app-viewport',
  templateUrl: './viewport.component.html',
  styleUrls: ['./viewport.component.scss']
})
export class ViewportComponent implements OnInit {

  constructor() { 
  }

  downloadFile(editEl:EditorComponent) {
    console.log("%c step 2: Viewport method triggered", "color:red;font-size:medium;", arguments);
    editEl.downloadLatestJSON();
  }

  ngOnInit() {
  }

}

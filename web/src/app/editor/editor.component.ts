import { Component, OnInit } from '@angular/core';
import 'codemirror/mode/javascript/javascript';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  public code:String = "";
  public cmOptions:Object = {}; 

  constructor() {
    this.cmOptions =  {
      lineNumbers: true,
      mode: {
        name: 'javascript',
        json: true
      }
    };
    
  }

  ngOnInit() {
  }

}

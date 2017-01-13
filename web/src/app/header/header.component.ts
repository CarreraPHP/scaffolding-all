import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output()
  private generateFile: EventEmitter<any> = new EventEmitter();

  constructor() { }


  generateJSONFile(): void {
    console.log('%c step 1: button clicked', 'color:red;font-size:medium;');
    this.generateFile.emit();
  }

  ngOnInit() {
  }

}

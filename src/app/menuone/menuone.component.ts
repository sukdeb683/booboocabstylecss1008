import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menuone',
  templateUrl: './menuone.component.html',
  styleUrls: ['./menuone.component.scss'],
})
export class MenuoneComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  menuClicked: boolean = true;

  openMenu() {
    this.menuClicked= !this.menuClicked;
  }

}

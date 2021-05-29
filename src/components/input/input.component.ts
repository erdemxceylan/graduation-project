import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  @Input() public list: string = '';
  @Input() public id: string = '';
  @Input() public placeholder: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}

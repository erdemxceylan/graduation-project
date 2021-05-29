import { Component, Input, OnInit } from '@angular/core';
import { Nutrient } from 'src/models/nutrient.model';

@Component({
  selector: 'app-nutrient-search',
  templateUrl: './nutrient-search.component.html',
  styleUrls: ['./nutrient-search.component.css'],
})
export class NutrientSearchComponent implements OnInit {
  @Input() public nutrientList: Nutrient[] = [];
  ngOnInit(): void {}
}

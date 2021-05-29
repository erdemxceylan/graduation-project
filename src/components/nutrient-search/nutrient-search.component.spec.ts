import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutrientSearchComponent } from './nutrient-search.component';

describe('NutrientSearchComponent', () => {
  let component: NutrientSearchComponent;
  let fixture: ComponentFixture<NutrientSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NutrientSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NutrientSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

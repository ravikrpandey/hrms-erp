import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatFormSelectFilterComponent } from './mat-form-select-filter.component';

describe('MatFormSelectFilterComponent', () => {
  let component: MatFormSelectFilterComponent;
  let fixture: ComponentFixture<MatFormSelectFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatFormSelectFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatFormSelectFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

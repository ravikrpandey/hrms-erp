import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrListActionComponent } from './pr-list-action.component';

describe('PrListActionComponent', () => {
  let component: PrListActionComponent;
  let fixture: ComponentFixture<PrListActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrListActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrListActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

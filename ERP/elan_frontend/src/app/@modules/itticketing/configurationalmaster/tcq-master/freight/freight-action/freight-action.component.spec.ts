import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightActionComponent } from './freight-action.component';

describe('FreightActionComponent', () => {
  let component: FreightActionComponent;
  let fixture: ComponentFixture<FreightActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreightActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreightActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

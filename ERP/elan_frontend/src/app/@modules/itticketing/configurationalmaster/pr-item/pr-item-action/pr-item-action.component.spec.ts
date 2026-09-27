import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrItemActionComponent } from './pr-item-action.component';

describe('PrItemActionComponent', () => {
  let component: PrItemActionComponent;
  let fixture: ComponentFixture<PrItemActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrItemActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrItemActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

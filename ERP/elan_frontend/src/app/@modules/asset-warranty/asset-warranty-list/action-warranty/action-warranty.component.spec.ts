import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionWarrantyComponent } from './action-warranty.component';

describe('ActionWarrantyComponent', () => {
  let component: ActionWarrantyComponent;
  let fixture: ComponentFixture<ActionWarrantyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionWarrantyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionWarrantyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

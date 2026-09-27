import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewProductionComponent } from './add-new-production.component';

describe('AddNewProductionComponent', () => {
  let component: AddNewProductionComponent;
  let fixture: ComponentFixture<AddNewProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewProductionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

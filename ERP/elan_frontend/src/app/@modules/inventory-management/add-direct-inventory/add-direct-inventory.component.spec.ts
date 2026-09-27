import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDirectInventoryComponent } from './add-direct-inventory.component';

describe('AddDirectInventoryComponent', () => {
  let component: AddDirectInventoryComponent;
  let fixture: ComponentFixture<AddDirectInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDirectInventoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDirectInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

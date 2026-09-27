import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAllocationDialogComponent } from './item-allocation-dialog.component';

describe('ItemAllocationDialogComponent', () => {
  let component: ItemAllocationDialogComponent;
  let fixture: ComponentFixture<ItemAllocationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemAllocationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemAllocationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

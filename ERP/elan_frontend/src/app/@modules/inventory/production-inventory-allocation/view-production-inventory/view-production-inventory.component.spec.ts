import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProductionInventoryComponent } from './view-production-inventory.component';

describe('ViewProductionInventoryComponent', () => {
  let component: ViewProductionInventoryComponent;
  let fixture: ComponentFixture<ViewProductionInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProductionInventoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewProductionInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

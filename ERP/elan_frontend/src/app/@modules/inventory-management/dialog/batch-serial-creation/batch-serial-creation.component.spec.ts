import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchSerialCreationComponent } from './batch-serial-creation.component';

describe('BatchSerialCreationComponent', () => {
  let component: BatchSerialCreationComponent;
  let fixture: ComponentFixture<BatchSerialCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchSerialCreationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchSerialCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

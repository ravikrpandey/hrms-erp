import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlloanceActionStatusComponent } from './alloance-action-status.component';

describe('AlloanceActionStatusComponent', () => {
  let component: AlloanceActionStatusComponent;
  let fixture: ComponentFixture<AlloanceActionStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlloanceActionStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlloanceActionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

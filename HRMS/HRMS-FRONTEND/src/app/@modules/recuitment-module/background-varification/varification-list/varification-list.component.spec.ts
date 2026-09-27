import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarificationListComponent } from './varification-list.component';

describe('VarificationListComponent', () => {
  let component: VarificationListComponent;
  let fixture: ComponentFixture<VarificationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VarificationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VarificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

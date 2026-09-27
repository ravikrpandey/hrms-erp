import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCompOffListComponent } from './assign-comp-off-list.component';

describe('AssignCompOffListComponent', () => {
  let component: AssignCompOffListComponent;
  let fixture: ComponentFixture<AssignCompOffListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignCompOffListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignCompOffListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgainstComplaintComponent } from './against-complaint.component';

describe('AgainstComplaintComponent', () => {
  let component: AgainstComplaintComponent;
  let fixture: ComponentFixture<AgainstComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgainstComplaintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgainstComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

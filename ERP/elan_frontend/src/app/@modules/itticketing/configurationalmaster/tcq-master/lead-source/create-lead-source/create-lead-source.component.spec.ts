import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLeadSourceComponent } from './create-lead-source.component';

describe('CreateLeadSourceComponent', () => {
  let component: CreateLeadSourceComponent;
  let fixture: ComponentFixture<CreateLeadSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateLeadSourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateLeadSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

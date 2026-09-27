import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRfpComponent } from './create-rfp.component';

describe('CreateRfpComponent', () => {
  let component: CreateRfpComponent;
  let fixture: ComponentFixture<CreateRfpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRfpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRfpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

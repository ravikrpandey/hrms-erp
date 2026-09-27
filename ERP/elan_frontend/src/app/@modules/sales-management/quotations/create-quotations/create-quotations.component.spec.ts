import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuotationsComponent } from './create-quotations.component';

describe('CreateQuotationsComponent', () => {
  let component: CreateQuotationsComponent;
  let fixture: ComponentFixture<CreateQuotationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateQuotationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateQuotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

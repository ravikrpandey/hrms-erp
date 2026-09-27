import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompOffFormComponent } from './comp-off-form.component';

describe('CompOffFormComponent', () => {
  let component: CompOffFormComponent;
  let fixture: ComponentFixture<CompOffFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompOffFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompOffFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

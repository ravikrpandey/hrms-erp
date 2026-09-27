import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateIrnActionComponent } from './generate-irn-action.component';

describe('GenerateIrnActionComponent', () => {
  let component: GenerateIrnActionComponent;
  let fixture: ComponentFixture<GenerateIrnActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateIrnActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateIrnActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

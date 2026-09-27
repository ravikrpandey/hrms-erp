import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateGrnMultiPoComponent } from './generate-grn-multi-po.component';

describe('GenerateGrnMultiPoComponent', () => {
  let component: GenerateGrnMultiPoComponent;
  let fixture: ComponentFixture<GenerateGrnMultiPoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateGrnMultiPoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateGrnMultiPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateIrnListComponent } from './generate-irn-list.component';

describe('GenerateIrnListComponent', () => {
  let component: GenerateIrnListComponent;
  let fixture: ComponentFixture<GenerateIrnListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateIrnListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateIrnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialRequestDetailsComponent } from './material-request-details.component';

describe('MaterialRequestDetailsComponent', () => {
  let component: MaterialRequestDetailsComponent;
  let fixture: ComponentFixture<MaterialRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialRequestDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

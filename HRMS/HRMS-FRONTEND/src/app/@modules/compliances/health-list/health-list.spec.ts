import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthList } from './health-list';

describe('HealthList', () => {
  let component: HealthList;
  let fixture: ComponentFixture<HealthList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

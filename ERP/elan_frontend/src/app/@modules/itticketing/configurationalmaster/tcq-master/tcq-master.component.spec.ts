import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TcqMasterComponent } from './tcq-master.component';

describe('TcqMasterComponent', () => {
  let component: TcqMasterComponent;
  let fixture: ComponentFixture<TcqMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TcqMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TcqMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

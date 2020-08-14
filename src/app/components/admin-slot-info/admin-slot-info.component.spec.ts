import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSlotInfoComponent } from './admin-slot-info.component';

describe('AdminSlotInfoComponent', () => {
  let component: AdminSlotInfoComponent;
  let fixture: ComponentFixture<AdminSlotInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSlotInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSlotInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

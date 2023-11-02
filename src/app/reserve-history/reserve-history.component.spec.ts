import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveHistoryComponent } from './reserve-history.component';

describe('ReserveHistoryComponent', () => {
  let component: ReserveHistoryComponent;
  let fixture: ComponentFixture<ReserveHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReserveHistoryComponent]
    });
    fixture = TestBed.createComponent(ReserveHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

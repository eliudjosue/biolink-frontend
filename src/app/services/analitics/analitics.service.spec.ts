import { TestBed } from '@angular/core/testing';

import { AnaliticsService } from './analitics.service';

describe('AnaliticsService', () => {
  let service: AnaliticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnaliticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

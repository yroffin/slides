import { TestBed, inject } from '@angular/core/testing';

import { FoldersStoreService } from './folders-store.service';

describe('FoldersStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FoldersStoreService]
    });
  });

  it('should be created', inject([FoldersStoreService], (service: FoldersStoreService) => {
    expect(service).toBeTruthy();
  }));
});

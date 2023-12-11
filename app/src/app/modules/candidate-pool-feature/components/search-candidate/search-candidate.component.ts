import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CandidateService } from 'src/app/services/candidate-service/candidate.service';
import { CandidateResponse } from 'src/app/core/models/candidateResponse';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CandidateDataService } from 'src/app/shared/services/candidate-data.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Candidate } from 'src/app/core/models/candidate';
import { EditCandidateAllFormComponent } from '../edit-candidate-all-form/edit-candidate-all-form.component';

@Component({
  selector: 'app-search-candidate',
  templateUrl: './search-candidate.component.html',
  styleUrls: ['./search-candidate.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class SearchCandidateComponent {
  candidates: CandidateResponse[];
  dataSource: MatTableDataSource<CandidateResponse>;
  numSelected: number;
  numRows: number;
  selectedRows: number[] = [];
  isDeleted: boolean = false;
  isDeleteClicked: boolean = false;
  popup: boolean = false;
  experienceValue: number = 0;
  showMoreCities: boolean = false;
  selectedCities: string[] = [];
  checkedCities: boolean[] = [];

  length: number;
  pageSize: number = 10;
  pageIndex: number = 0;

  salary = false;
  experience = false;
  location = false;

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  keywords: string[] = [];

  isLoading: boolean = false;

  salaryFrom: string;
  salaryTo: string;

  constructor(
    private candidateService: CandidateService,
    private changeDetectorRef: ChangeDetectorRef,
    private candidateDataService: CandidateDataService,
    private _liveAnnouncer: LiveAnnouncer,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
    'select',
    'Id',
    'candidate',
    'jobProfile',
    'enrolledDate',
    'source',
    'stage',
    'round',
    'action',
  ];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: CandidateResponse | null;

  allCities: any = [];

  selection = new SelectionModel<CandidateResponse>(true, []);

  ngOnInit() {
    this.isLoading = true;
    this.candidateDataService.dataSourceChanges.subscribe(
      (dataSource: MatTableDataSource<CandidateResponse>) => {
        this.dataSource = dataSource;
        this.isLoading = false;
      }
    );

    if (!this.route.snapshot.queryParams) {
      this.fetchCandidates();
    }

    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }

    this.candidateService
      .getTotalNumberOfRecords()
      .subscribe((totalNumberOfRecords) => {
        this.length = totalNumberOfRecords;
      });
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  fetchCandidates(
    columnName: string = 'id',
    sortDirection: string = 'asc'
  ): void {
    this.isLoading = true;
    this.candidateService
      .getCandidates(this.pageIndex, this.pageSize, columnName, sortDirection)
      .subscribe(
        (response: CandidateResponse[]) => {
          this.candidates = response;
          this.dataSource = new MatTableDataSource<CandidateResponse>(
            this.candidates
          );

          this.isLoading = false;
        },
        (error: HttpErrorResponse) => {
          this.isLoading = false;
          if (error.status === 404) {
            this.snackBar.open('Candidate not found', 'Close', {
              duration: 2000,
            });
          } else if (error.status === 500) {
            this.snackBar.open('Error on server side', 'Close', {
              duration: 2000,
            });
          } else {
            this.snackBar.open(
              'Failed to fetch candidates beacause ' + error.message,
              'Close',
              {
                duration: 2000,
              }
            );
          }
        }
      );
  }

  fetchResumeById(id: number): void {
    this.candidateService.getResumeFileById(id).subscribe(
      (file: Blob) => {
        const fileURL = URL.createObjectURL(file);
        const fileType = file.type;

        if (fileType === 'application/pdf') {
          window.open(fileURL, '_blank');
        } else {
          const link = document.createElement('a');
          link.href = fileURL;
          link.download = 'file'; // Set the desired file name
          link.click();
        }
      },
      (error: HttpErrorResponse) => {
        error.status === 404
          ? this.snackBar.open('Resume not found', 'Close', { duration: 2000 })
          : this.snackBar.open('Internal Server error', 'Close', {
              duration: 2000,
            });
      }
    );
  }

  openDeleteConfirmationDialog(): void {
    if (this.selection.isEmpty()) {
      // No rows selected, show snackbar message
      this.snackBar.open('No rows selected to delete', 'Close', {
        duration: 2000,
      });
      return;
    }

    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '250px',
      data: this.selection.selected.map((row) => row.id),
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.deleted) {
        // User confirmed the deletion, perform the delete operation here
        this.deleteCandidates();
      }
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      this.fetchCandidates(sortState.active, sortState.direction);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    let urlKeywords = this.candidateDataService.getKeywords();

    let filters = this.candidateDataService.getFilters();

    if (urlKeywords) {
      let searchKeywords = urlKeywords.join(',');
      const url = `/candidates/search?keywords=${searchKeywords}&page=${event.pageIndex}&size=${event.pageSize}&sort=id,asc`;
      this.http.get<CandidateResponse[]>(url).subscribe(
        (data) => {
          this.dataSource = new MatTableDataSource<CandidateResponse>(data);
          console.log(data);
          
          this.length = data.length;
          this.candidates = data;
          console.log(this.candidates);
        },
        (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.snackBar.open('Candidate not found', 'Close', {
              duration: 2000,
            });
          } else if (error.status === 500) {
            this.snackBar.open('Error on server side', 'Close', {
              duration: 2000,
            });
          } else {
            this.snackBar.open(
              `Failed to fetch candidates. Error code: ${error.status}`,
              'Close',
              {
                duration: 2000,
              }
            );
          }
        }
      );
    } else if (filters) {
      const location = filters.location === undefined ? '' : filters.location;
      const minCurrentCTC = isNaN(Number(filters.minCurrentCTC))
        ? 0
        : Number(filters.minCurrentCTC);
      const maxCurrentCTC = isNaN(Number(filters.maxCurrentCTC))
        ? 100
        : Number(filters.maxCurrentCTC);
      const totalExperience = isNaN(Number(filters.experience))
        ? 0
        : Number(filters.experience);

      const url = `/candidates/filter?location=${location}&minCurrentCTC=${minCurrentCTC}&maxCurrentCTC=${maxCurrentCTC}&totalExperience=${totalExperience}`;
      this.http.get<CandidateResponse[]>(url).subscribe((data) => {
        this.dataSource = new MatTableDataSource<CandidateResponse>(data);
        this.length = data.length;
        this.candidates = data;
      });
    } else {
      this.fetchCandidates();
    }
  }

  // Whether the number of selected elements matches the total number of rows.
  isAllSelected(): boolean {
    this.numSelected = this.selection ? this.selection.selected.length : 0;
    this.numRows = this.dataSource ? this.dataSource.data.length : 0;

    return this.numSelected === this.numRows;
  }

  // Selects all rows if they are not all selected; otherwise clear selection.
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: CandidateResponse): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id + 1
    }`;
  }

  // private getFileMimeType(base64: string): string | null {
  //   const data = atob(base64);
  //   const bytes = new Uint8Array(data.length);
  //   for (let i = 0; i < data.length; i++) {
  //     bytes[i] = data.charCodeAt(i);
  //   }

  //   let mimeType = null;

  // Checking the file signature
  //   const signature = bytes.subarray(0, 4);
  //   if (this.compareByteArrays(signature, [0x89, 0x50, 0x4e, 0x47])) {
  //     mimeType = 'image/png';
  //   } else if (this.compareByteArrays(signature, [0x25, 0x50, 0x44, 0x46])) {
  //     mimeType = 'application/pdf';
  //   } else if (this.compareByteArrays(signature, [0xff, 0xd8, 0xff])) {
  //     mimeType = 'image/jpeg';
  //   } else if (this.compareByteArrays(signature, [0x50, 0x4b, 0x03, 0x04])) {
  //     mimeType =
  //       'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  //   }

  //   return mimeType;
  // }

  // private compareByteArrays(array1: Uint8Array, array2: number[]): boolean {
  //   if (array1.length !== array2.length) {
  //     return false;
  //   }

  //   for (let i = 0; i < array1.length; i++) {
  //     if (array1[i] !== array2[i]) {
  //       return false;
  //     }
  //   }

  //   return true;
  // }

  // private downloadFile(base64: string, fileName: string, mimeType: string) {
  //   const byteString = atob(base64);
  //   const arrayBuffer = new ArrayBuffer(byteString.length);
  //   const uint8Array = new Uint8Array(arrayBuffer);
  //   for (let i = 0; i < byteString.length; i++) {
  //     uint8Array[i] = byteString.charCodeAt(i);
  //   }
  //   const blob = new Blob([uint8Array], { type: mimeType });

  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.target = '_blank';
  //   link.download = fileName;
  //   link.click();
  // }

  // private showFileInNewTab(base64: string, fileName: string, mimeType: string) {
  //   const byteString = atob(base64);
  //   const arrayBuffer = new ArrayBuffer(byteString.length);
  //   const uint8Array = new Uint8Array(arrayBuffer);
  //   for (let i = 0; i < byteString.length; i++) {
  //     uint8Array[i] = byteString.charCodeAt(i);
  //   }
  //   const blob = new Blob([uint8Array], { type: mimeType });

  //   const url = URL.createObjectURL(blob);

  //   window.open(url, '_blank');
  // }

  // showResume(element: any) {
  //   this.fetchResumeById(element.id);
  //   const base64 = this.resumeBase64;
  //   const fileName = element.firstName + ' ' + element.lastName;
  //   const mimeType = this.getFileMimeType(base64);

  //   if (mimeType !== 'application/pdf') {
  //     this.downloadFile(base64, fileName, mimeType!);
  //   } else {
  //     this.showFileInNewTab(base64, fileName, mimeType!);
  //   }
  // }

  rowNotSelected(): boolean {
    if (this.numSelected < 1 && this.isDeleteClicked) {
      setTimeout(() => {
        this.isDeleted = false;
        this.isDeleteClicked = false;
      }, 2000);

      return true;
    }

    return false;
  }

  editCandidate(element: Candidate) {
    // Fetch the candidate data or create a new instance of the Candidate model
    const candidate: Candidate = element;

    const dialogConfig: MatDialogConfig = {
      data: candidate, // Pass the candidate data to the dialog
      width: '50rem', // Set the width of the dialog box
      height: '40rem', // Set the height of the dialog box
    };

    // Open a dialog or navigate to a new component to edit the candidate data
    const dialogRef = this.dialog.open(
      EditCandidateAllFormComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.submitted) {
        this.updateCandidate(result.updatedCandidate, element.id);
      }
    });
  }

  updateCandidate(candidate: Candidate, candidateId: number): void {
    this.candidateService.updateCandidate(candidate, candidateId).subscribe(
      (updatedCandidate) => {
        this.snackBar.open('Candidate updated successfully', 'Close', {
          duration: 2000,
        });

        setTimeout(() => {
          this.fetchCandidates();
        }, 500);
      },
      (error) => {
        this.snackBar.open(
          'Failed to update candidate due to ' + error.message,
          'Close',
          {
            duration: 2000,
          }
        );
      }
    );
  }

  // Delete Selected Candidates
  deleteCandidates(): void {
    if (this.selection.selected.length > 0) {
      const selectedRows = this.selection.selected.map((row) => row.id);

      selectedRows.forEach((element) => {
        this.candidateService.deleteCandidate(element).subscribe(
          (response) => {
            this.dataSource.data = this.dataSource.data.filter(
              (row: { id: number }) => row.id !== element
            );

            this.isDeleted = true;

            this.candidateService
              .getTotalNumberOfRecords()
              .subscribe((response) => {
                this.length = response;
              });

            this.fetchCandidates();

            setTimeout(() => {
              this.isDeleted = false;
            }, 2000);

            this.selection.clear();
          },
          (error: HttpErrorResponse) =>
            this.snackBar.open(
              'Cannot delete canididate due to ' + error.message,
              'Close',
              {
                duration: 2000,
              }
            )
        );
      });
    }
  }
}

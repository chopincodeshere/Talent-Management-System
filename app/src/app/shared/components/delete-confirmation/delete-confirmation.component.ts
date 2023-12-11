import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.css'],
})
export class DeleteConfirmationComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public jobId: number,
    @Inject(MAT_DIALOG_DATA) public candidateIds: number[]
  ) {}

  deleteElement(): void {
    if (this.jobId) {
      this.deleteJob();
    }
    if (this.candidateIds.length > 0) {
      this.deleteCandidates();
    }
  }

  deleteJob(): void {
    // Close the dialog after the delete operation
    this.dialogRef.close({ deleted: true });
  }

  deleteCandidates(): void {
    this.dialogRef.close({ deleted: true });
  }
}

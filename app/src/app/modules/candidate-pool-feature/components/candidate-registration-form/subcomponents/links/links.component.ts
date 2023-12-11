import { Component, Inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.css'],
})
export class LinksComponent {
  linksForm: FormGroup;
  newLink = new FormControl('', [
    Validators.pattern('^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$'),
  ]);

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<LinksComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.linksForm = this.formBuilder.group({
      links: this.formBuilder.array([]),
    });

    if (data && data.links && Array.isArray(data.links)) {
      const linksArray = this.linksForm.get('links') as FormArray;
      data.links.forEach((link: string) => {
        linksArray.push(this.formBuilder.control(link));
      });
    }
  }

  addLink(): void {
    if (this.newLink.value && this.newLink.valid) {
      const linksArray = this.linksForm.get('links') as FormArray;
      const newLinkControl = new FormControl(this.newLink.value!.trim());
      linksArray.push(newLinkControl);
  
      this.snackBar.open('Link has been successfully added.', 'Close', {
        duration: 2000,
      });
  
      this.newLink.reset();
    } else {
      this.snackBar.open('Invalid link format. Please enter a valid link. Format: www.example.com', 'Close', {
        duration: 2000,
      });
    }
  }

  removeLink(index: number): void {
    const linksArray = this.linksForm.get('links') as FormArray;
    linksArray.removeAt(index);
  }

  closeDialog(): void {
    this.dialogRef.close({ updated: false });
  }

  submitLinks(): void {
    this.addLink();
    const linksArray = this.linksForm.get('links') as FormArray;
    const links = linksArray.value as string[];
    this.dialogRef.close({ updated: true, data: links });
  }
}

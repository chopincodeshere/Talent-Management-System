import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-resume-upload',
  templateUrl: './resume-upload.component.html',
  styleUrls: ['./resume-upload.component.css'],
})
export class ResumeUploadComponent implements OnInit {
  constructor(private _snackBar: MatSnackBar) {}
  selectedFiles: File;
  filename: string;
  filePreview: string;
  InputVar: ElementRef;
  uploaded: boolean = false;
  durationInSeconds: number = 2;
  message: string;
  action: string = 'Ok';
  pdfSrc: string;

  @ViewChild('pdfViewer') pdfViewer: any;

  setStyles(): void {
    const fileIconUrl = '../../../../assets/Images/FileIcon.png';
    const dragUploadElement = document.getElementById(
      'dragUpload'
    ) as HTMLElement;

    dragUploadElement.style.backgroundImage = `url("${fileIconUrl}")`;
    dragUploadElement.style.height = '20rem';
    dragUploadElement.style.opacity = '100%';

    if (this.isImageType(this.selectedFiles.type)) {
      const reader = new FileReader();

      reader.onload = () => {
        dragUploadElement.style.backgroundImage = `url("${reader.result}")`;
      };

      reader.readAsDataURL(this.selectedFiles);
    } else if (this.isPdfType(this.selectedFiles.type)) {
      const fileReader = new FileReader();

      fileReader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
        dragUploadElement.style.height = '5rem';
        dragUploadElement.style.opacity = '100%';
      };

      fileReader.readAsArrayBuffer(this.selectedFiles);
    }
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files[0];
    this.filename = this.selectedFiles.name;

    if (this.selectedFiles) {
      this.setStyles();

      const reader = new FileReader();

      reader.onload = () => {
        const base64 = reader.result as string;

        // Extract the Base64 content after the comma
        const base64Content = base64.split(',')[1];

        if (this.isImageType(this.selectedFiles.type)) {
          this.filePreview = base64;
        } else if (this.isPdfType(this.selectedFiles.type)) {
          this.filePreview = base64;
        }

        sessionStorage.setItem('resume', base64Content);
      };

      reader.readAsDataURL(this.selectedFiles);

      this.uploaded = true;
      this.message = this.filename + ' uploaded successfully!!!';
      this.openSnackBar();
    }
  }

  clearFile(): void {
    sessionStorage.removeItem('resume');
    this.uploaded = false;

    document.getElementById(
      'dragUpload'
    )!.style.backgroundImage = `url("../../../../assets/Images/drag-and-drop.png")`;

    document.getElementById('dragUpload')!.style.height = '100%';

    this.message = this.filename + ' deleted successfully!!!';

    this.filename = '';

    this.filePreview = '';

    this.openSnackBar();
  }

  isImageType(fileType: string): boolean {
    return fileType.startsWith('image/');
  }

  isPdfType(fileType: string): boolean {
    return fileType === 'application/pdf';
  }

  openSnackBar() {
    this._snackBar.open(this.message, this.action, {
      duration: this.durationInSeconds * 1000,
    });
  }

  ngOnInit(): void {}
}

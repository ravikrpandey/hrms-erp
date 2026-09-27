import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  downloadAsPDF(elementId: string, fileName: string = 'document.pdf') {
    const element = document.getElementById(elementId);

    if (!element) {
      console.error('Element not found!');

      return;
    }

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190; // Width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 10;
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);

      pdf.save(fileName);
    });
  }
}

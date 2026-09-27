import { Inject, Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
import * as XLSX from 'xlsx';
import { DOCUMENT } from '@angular/common';
import FileSaver from 'file-saver';

declare var $: any;


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Injectable({
    providedIn: 'root'
})

export class CommonService {

    constructor(
        private toast: ToastrService,
        private spinner: NgxSpinnerService,
        @Inject(DOCUMENT) private document: Document,
    ) { }
    showLoader() {
        this.spinner.show();
    }
    hideLoader() {
        this.spinner.hide();
    }

    checkForValidFile(event: any, isPdf = false, isBoth = false, onlyPng = false,isAll = true) {

        console.log(onlyPng);
        let isValidExtension = true;
        if (!event.currentTarget.files || event.currentTarget.files.length == 0) {
            return isValidExtension;
        }
        let file = event.currentTarget.files[0];
        var filePath = file.name;

        let allowedFileSize = 5000;
        let sizeLbl = "3 MB";
        var allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
        if (isPdf) {
            allowedFileSize = 5000;
            sizeLbl = "3 MB";
            allowedExtensions = /(\.pdf|\.docx|\.doc)$/i;
        }
        if (isBoth) {
            allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf|\.docx|\.doc)$/i;
            allowedFileSize = 5000;
            sizeLbl = "3 MB";
        }
        if (isAll) {
            allowedExtensions = /(\.jpg|\.jpeg|\.png|\.mp4|\.avi|\.mkv|\.xlsx|\.xls|\.csv|\.pdf|\.docx|\.doc|\.mp3|\.wav|\.ogg|\.m4a|\.aac)$/i;
            allowedFileSize = 500000;
            sizeLbl = "3 MB";
        }
        if (onlyPng) {
            allowedExtensions = /(\.png)$/i;
            allowedFileSize = 500;
            sizeLbl = "500 KB";
        }

        if (!allowedExtensions.exec(filePath)) {
            isValidExtension = false;
        }

        var fileSize = file.size / 1024;
        if (fileSize > allowedFileSize) {
            this.toast.error(`File cannot be greater than ${sizeLbl}`);
        }

        if (!isValidExtension) {
            this.toast.error('Please select valid file');
            $(event.currentTarget).val("");
        }
        return isValidExtension;
    }

    removePlus(event: any): void {
        const key = event.key;
        if (key === '+' || key === '-') {
            event.preventDefault();
        }
    }
    
    toggleLeftNav(val: any) {
        if (val) {
            document.getElementById('sidebar')?.classList.add('collapsed')
            document.getElementById('sidebar')?.classList.add('manage-sidebar')
            document.getElementsByClassName('router-page')[0]?.classList.add('router-page-remove')
            document.getElementsByClassName('footer')[0]?.classList.add('footer_e')

        }
        else {
            document.getElementById('sidebar')?.classList.remove('collapsed')
            document.getElementById('sidebar')?.classList.remove('manage-sidebar')
            document.getElementsByClassName('router-page')[0]?.classList.remove('router-page-remove')
            document.getElementsByClassName('footer')[0]?.classList.remove('footer_e')
        }
    }

    // downloadCSV(dataList: any) {
    //     dataList.map((item: any) => {
    //         for (let key in item) {
    //             let newKey = key.replace(/_/g, ' ')
    //                 .replace(/\b\w/g, char => char.toUpperCase());
    //             item[newKey] = item[key];
    //             delete item[key];
    //         }
    //     })
    //     const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataList);
    //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    //     XLSX.writeFile(wb, 'table_data.xlsx');
    // }

    downloadCSV(dataList: any[], fileName: string) {
        const transformedData = dataList.map(item => {
            const newItem: any = {};
            for (let key in item) {
                
                let newKey = key.replace(/_/g, ' ')
                    .replace(/\b\w/g, char => char.toUpperCase());
                newItem[newKey] = item[key];
            }
            return newItem;
        });
    
        
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(transformedData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
        
        XLSX.writeFile(wb, fileName);
    }

    getBaseHref() {
        return this.document.baseURI;
    }

      public exportAsExcelFile(json: any[], excelFileName: string): void {
   
        // Create the worksheet from JSON data
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    
        // Get the header keys (columns)
        const headers = Object.keys(json[0]);
    
        // Manually apply styles to each header cell (First row, index 0)
        headers.forEach((header, colIndex) => {
            const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIndex }); // Reference to the first row (headers)
            const headerCell = worksheet[cellRef];
             console.warn(headerCell,'fff');
             
            // Apply background color and font styling to header cells
            if (headerCell) {
                headerCell.t = {
                    fill: {
                        fgColor: { rgb: 'red'  }, // Red background
                    },
                    font: {
                        bold: true, // Bold font
                        color: { rgb: 'FFFFFF' }, // White text color
                    }
                };
            }
        });
    
        // Now create the workbook with the sheet and ensure it has the correct data
        const workbook: XLSX.WorkBook = {
            Sheets: { 'data': worksheet },
            SheetNames: ['data'],
        };
    
        // Write the workbook to a buffer
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
        // Save the buffer as an Excel file
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }
     private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE,
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }
}

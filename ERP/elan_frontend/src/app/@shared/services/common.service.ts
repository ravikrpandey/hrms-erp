import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Observable, Subject } from 'rxjs';
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
} from 'ngx-intl-tel-input';
import * as FileSaver from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import * as moment from 'moment';

import * as ExcelJS from 'exceljs';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  baseUrl = environment.servralUrl;
  exportExcelFile: any;

  constructor(
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
    private http: HttpClient
  ) { }

  showLoader() {
    this.spinner.show();
  }
  hideLoader() {
    this.spinner.hide();
  }

  checkForValidFile(event: any, isPdf = false, isBoth = true, onlyPng = false) {
    console.log(onlyPng);
    let isValidExtension = true;
    if (!event.currentTarget.files || event.currentTarget.files.length == 0) {
      return isValidExtension;
    }
    let file = event.currentTarget.files[0];
    var filePath = file.name;

    let allowedFileSize = 5000;
    let sizeLbl = '3 MB';
    var allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    if (isPdf) {
      allowedFileSize = 5000;
      sizeLbl = '5 MB';
      allowedExtensions = /(\.pdf|\.docx|\.doc)$/i;
    }
    if (isBoth) {
      allowedExtensions =
        /(\.jpg|\.jpeg|\.png|\.pdf|\.docx|\.doc|\.xls|\.xlsx)$/i;
      allowedFileSize = 5000;
      sizeLbl = '3 MB';
    }
    if (onlyPng) {
      allowedExtensions = /(\.png)$/i;
      allowedFileSize = 500;
      sizeLbl = '500 KB';
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
      $(event.currentTarget).val('');
    }
    return isValidExtension;
  }

  removePlus(event: any): void {
    const key = event.key;
    if (key === '+' || key === '-') {
      event.preventDefault();
    }
  }

  generateFullName(fn: any, mn: any, ln: any) {
    let full_name = fn + ' ' + ln;
    if (mn) {
      full_name = fn + ' ' + mn + ' ' + ln;
    }
    return full_name;
  }

  downloadCSV(dataList: any, fileName = 'table_data') {
    dataList.map((item: any) => {
      for (let key in item) {
        let newKey = key
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase());
        item[newKey] = item[key];
        delete item[key];
      }
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  downloadQRCode(url: string, filename: string) {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        saveAs(blob, filename);
      })
      .catch((error) => {
        //console.error('Error downloading QR code:', error)
      });
  }
  private sharedData: Subject<any> = new Subject<any>();
  sharedData$: Observable<any> = this.sharedData.asObservable();

  sendSelectedId(id: any) {
    this.sharedData.next(id);
  }

  getCountryISOByCode(countryCode: string): CountryISO | undefined {
    const countryCodeMap: { [key: string]: CountryISO } = {
      '+1': CountryISO.UnitedStates, // USA
      '+44': CountryISO.UnitedKingdom, // UK
      '+91': CountryISO.India, // India
      '+54': CountryISO.Argentina, // Argentina
      '+33': CountryISO.France, // France
      '+49': CountryISO.Germany, // Germany
      '+81': CountryISO.Japan, // Japan
      '+61': CountryISO.Australia, // Australia
      '+55': CountryISO.Brazil, // Brazil
      '+34': CountryISO.Spain, // Spain
      '+39': CountryISO.Italy, // Italy
      '+7': CountryISO.Russia, // Russia
      '+27': CountryISO.SouthAfrica, // South Africa
      '+64': CountryISO.NewZealand, // New Zealand
      '+60': CountryISO.Malaysia, // Malaysia
      '+86': CountryISO.China, // China
      '+62': CountryISO.Indonesia, // Indonesia
      '+41': CountryISO.Switzerland, // Switzerland
      '+46': CountryISO.Norway, // Norway
      '+47': CountryISO.Denmark, // Denmark
      '+358': CountryISO.Iceland, // Iceland
      '+351': CountryISO.Portugal, // Portugal
      '+353': CountryISO.Ireland, // Ireland
      '+421': CountryISO.Slovakia, // Slovakia
      '+420': CountryISO.CzechRepublic, // Czech Republic
      '+381': CountryISO.Serbia, // Serbia
      '+30': CountryISO.Greece, // Greece
      '+372': CountryISO.Estonia, // Estonia
      '+370': CountryISO.Lithuania, // Lithuania
      '+371': CountryISO.Latvia, // Latvia
      '+48': CountryISO.Hungary, // Hungary
      '+385': CountryISO.Croatia, // Croatia
      '+387': CountryISO.BosniaAndHerzegovina, // Bosnia and Herzegovina
      '+382': CountryISO.Montenegro, // Montenegro
      '+963': CountryISO.Syria, // Syria
      '+20': CountryISO.Egypt, // Egypt
      '+962': CountryISO.Jordan, // Jordan
      '+964': CountryISO.Iraq, // Iraq
      '+970': CountryISO.Palestine, // Palestine
      '+66': CountryISO.Thailand, // Thailand
      '+855': CountryISO.Cambodia, // Cambodia
      '+84': CountryISO.Vietnam, // Vietnam
      '+960': CountryISO.Maldives, // Maldives
      '+65': CountryISO.Singapore, // Singapore
      '+880': CountryISO.Bangladesh, // Bangladesh
      '+975': CountryISO.Bhutan, // Bhutan
      '+977': CountryISO.Nepal, // Nepal
      '+63': CountryISO.Philippines, // Philippines
      '+225': CountryISO.CôteDIvoire, // Ivory Coast
      '+235': CountryISO.Chad, // Chad
      '+249': CountryISO.Sudan, // Sudan
      '+255': CountryISO.Tanzania, // Tanzania
      '+256': CountryISO.Uganda, // Uganda
      '+260': CountryISO.Zambia, // Zambia
      '+263': CountryISO.Zimbabwe, // Zimbabwe
      '+254': CountryISO.Kenya, // Kenya
      '+250': CountryISO.Rwanda, // Rwanda
      '+268': CountryISO.Swaziland, // Eswatini (Swaziland)
      '+264': CountryISO.Namibia, // Namibia
      '+679': CountryISO.Fiji, // Fiji
      '+685': CountryISO.Samoa, // Samoa
      '+676': CountryISO.Tonga, // Tonga
      '+593': CountryISO.Ecuador, // Ecuador
      '+595': CountryISO.Paraguay, // Paraguay
      '+51': CountryISO.Peru, // Peru
      '+591': CountryISO.Bolivia, // Bolivia
      '+52': CountryISO.Mexico, // Mexico
      '+57': CountryISO.Colombia, // Colombia
      '+58': CountryISO.Venezuela, // Venezuela
      '+228': CountryISO.Togo, // Togo
      '+241': CountryISO.Gabon, // Gabon
      '+240': CountryISO.Gambia, // Gambia
      '+45': CountryISO.Portugal, // Portugal
      '+82': CountryISO.SouthKorea, // South Korea
      '+852': CountryISO.HongKong, // Hong Kong
      '+853': CountryISO.Macau, // Macau
      '+886': CountryISO.Taiwan, // Taiwan
      '+965': CountryISO.Kuwait, // Kuwait
      '+966': CountryISO.SaudiArabia, // Saudi Arabia
      '+971': CountryISO.UnitedArabEmirates, // UAE
      '+968': CountryISO.Oman, // Oman
      '+974': CountryISO.Qatar, // Qatar
      '+973': CountryISO.Bahrain, // Bahrain
      '+93': CountryISO.Afghanistan, // Afghanistan
      '+43': CountryISO.Austria, // Austria
      '+32': CountryISO.Belgium, // Belgium
      '+359': CountryISO.Bulgaria, // Bulgaria
      '+357': CountryISO.Cyprus, // Cyprus
      '+996': CountryISO.Kyrgyzstan, // Kyrgyzstan
      '+998': CountryISO.Uzbekistan, // Uzbekistan
    };

    return countryCodeMap[countryCode];
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
      console.warn(headerCell, 'fff');

      // Apply background color and font styling to header cells
      if (headerCell) {
        headerCell.t = {
          fill: {
            fgColor: { rgb: 'red' }, // Red background
          },
          font: {
            bold: true, // Bold font
            color: { rgb: 'FFFFFF' }, // White text color
          },
        };
      }
    });

    // Now create the workbook with the sheet and ensure it has the correct data
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };

    // Write the workbook to a buffer
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the buffer as an Excel file
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  formatNumbersCommas(number: any) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  getPostOfficeByPincode(pincode: string) {
    return this.http.get(
      `${this.baseUrl}/api/v1/getPostOfficeByPincode/${pincode}`
    );
  }

  getType(selectScheme: any[]): string {
    // return 'Normal';
    if (selectScheme.length === 0) {
      return 'Standard';
    } else if (selectScheme.includes('1') && selectScheme.includes('2')) {
      return 'Customization & Branding';
    } else if (selectScheme.includes('1')) {
      return 'Customization';
    } else if (selectScheme.includes('2')) {
      return 'Branding';
    } else {
      return 'Unknown';
    }
  }

  formatINR(num: any) {
    return num.toLocaleString('en-IN');
  }

  checkCurrentMonthActive(activeMonths: any[]): boolean {
    const currentMonth = moment().format('MMMM');
    console.log(currentMonth, 'month')
    return activeMonths?.some((item: any) => item.month === currentMonth);
  }
  //for direct asset
  public async exportExcelFileAsset(json: any[], excelFileName: string): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(excelFileName);


    // *Loop Through JSON Data & Add Rows*
    json.forEach((row, index) => {
      const newRow = worksheet.addRow(row);

      // *Apply Formatting for Specific Rows*
      if (index === 0) {
        // Title Row: Set company name in the first cell and Trial Balance in the second cell
        // worksheet.getCell('A1').value = company_name; // Set company name in A1
        worksheet.getCell('A1').font = { bold: true, size: 14 }; // Make it bold
        worksheet.getCell('A1').alignment = { horizontal: 'left', vertical: 'middle' }; // Align left

        worksheet.getCell('B1').value = ''; // Set 'Trial Balance' in B1
        worksheet.getCell('B1').font = { bold: true, size: 14 }; // Make it bold and set font size
        worksheet.getCell('B1').alignment = { horizontal: 'center', vertical: 'middle' }; // Center align 'Trial Balance'

        worksheet.mergeCells('C1:F1');
        worksheet.getCell('C1').alignment = { horizontal: 'center', vertical: 'middle' }; // Center the text across the cells

        // Additional formatting if necessary for the title row (optional)
        worksheet.getCell('C1').font = { bold: true, size: 14 }; // Optional: Make the merged cells bold as well
      }

      // else if (index === 2) {
      //     // Header Row: Apply Styles
      //     newRow.eachCell((cell: any) => {
      //         cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // White text
      //         cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0000FF' } }; // Blue background
      //         cell.alignment = { horizontal: 'center', vertical: 'middle' };
      //     });
      // }
    });

    // *Adjust Column Width*
    worksheet.columns = [
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 30 },
      { width: 15 }
    ];

    // *Generate and Save File*
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(blob, `${excelFileName}.xlsx`);
  }




formatCurrency(amount: number, currencyCode: string): string {

  const currencySymbols:any = {
    INR: '₹',
    USD: '$',
    CNY: '¥',
    EUR: '€',
    GBP: '£',
    AED: 'د.إ'
  };
  const symbol = currencySymbols[currencyCode] || currencyCode;
  let locale = 'en-US';
  if(currencyCode === 'INR'){
    locale = 'en-IN';
  }
  return `${symbol} ${amount.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

}

}


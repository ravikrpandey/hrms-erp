import { Component } from '@angular/core';

@Component({
  selector: 'app-it-statement',
  templateUrl: './it-statement.html',
  styleUrls: ['./it-statement.scss']
})
export class ItStatement {


   displayedColumns: string[] = [
    'item', 'annual', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'jan', 'feb'
  ];

  dataSource: any[] = [
    { type: 'section', item: '(i) Monthly Income' },
    { item: 'BASIC', annual: '74,004', apr: '6,167', may: '6,167', jun: '6,167', jul: '6,167', aug: '6,167', sep: '6,167', oct: '6,167', nov: '6,167', dec: '6,167', jan: '6,167', feb: '6,167' },
    { item: 'HRA', annual: '29,604', apr: '2,467', may: '2,467', jun: '2,467', jul: '2,467', aug: '2,467', sep: '2,467', oct: '2,467', nov: '2,467', dec: '2,467', jan: '2,467', feb: '2,467' },
    { item: 'CONVEYANCE', annual: '19,200', apr: '1,600', may: '1,600', jun: '1,600', jul: '1,600', aug: '1,600', sep: '1,600', oct: '1,600', nov: '1,600', dec: '1,600', jan: '1,600', feb: '1,600' },
    { item: 'SPECIAL ALLOWANCE', annual: '62,196', apr: '5,183', may: '5,183', jun: '5,183', jul: '5,183', aug: '5,183', sep: '5,183', oct: '5,183', nov: '5,183', dec: '5,183', jan: '5,183', feb: '5,183' },
    { type: 'subtotal', item: 'Total', annual: '1,85,004' },

    { type: 'section', item: '(ii) Adhoc Income' },
    { item: 'BONUS', annual: '6,997.2', apr: '583.1', may: '583.1', jun: '583.1', jul: '583.1', aug: '583.1', sep: '583.1', oct: '583.1', nov: '583.1', dec: '583.1', jan: '583.1', feb: '583.1' },
    { type: 'subtotal', item: 'Total', annual: '6,997.2' },

    { type: 'total', item: 'Sub Total', annual: '1,92,001.2', colspan: true }
  ];



 

  // Table data
  deductionsData: any[] = [
    { rowType: 'section', label: 'Deductions' },
    { 
      item: 'PF', 
      annualTotal: '8,880', 
      apr: '740', may: '740', jun: '740', jul: '740', aug: '740', sep: '740', 
      oct: '740', nov: '740', dec: '740', jan: '740', feb: '740'
    },
    { rowType: 'subtotal', label: 'Total', annualTotal: '8,880' }
  ];

  // Function to get the row type
  getRowType(row: any): string {
    return row.rowType || 'normal';
  }









}

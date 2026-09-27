import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface LedgerAccount {
    account_name: string;
    account_code: string;
    debit_amount: number;
    credit_amount: number;
}

export interface LedgerPreviewData {
    title: string;
    voucherNumber: string;
    voucherDate: string | Date;
    currencySymbol: string;
    currencyCode: string;
    accounts: LedgerAccount[];
    totalDebit: number;
    totalCredit: number;
    narration?: string;
    partyName?: string;
    showSubmitButton?: boolean;
    isViewMode?: boolean;
}

@Component({
    selector: 'app-ledger-preview',
    templateUrl: './ledger-preview.component.html',
    styleUrls: ['./ledger-preview.component.scss']
})
export class LedgerPreviewComponent {

    constructor(
        public dialogRef: MatDialogRef<LedgerPreviewComponent>,
        @Inject(MAT_DIALOG_DATA) public data: LedgerPreviewData
    ) {}

    // ============================================
    // FORMAT CURRENCY
    // ============================================
    formatCurrency(value: number): string {
        const symbol = this.data.currencySymbol || '₹';
        return `${symbol} ${Number(value || 0).toFixed(2)}`;
    }

    // ============================================
    // CLOSE DIALOG
    // ============================================
    closeDialog(): void {
        this.dialogRef.close({ action: 'close' });
    }

    // ============================================
    // PRINT DIALOG
    // ============================================
    printDialog(): void {
        const printContent = document.querySelector('.mat-dialog-content')?.innerHTML;
        if (!printContent) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>${this.data.voucherNumber || 'Ledger Preview'}</title>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { font-family: Arial, sans-serif; padding: 20px; background: white; }
                        .ledger-header {
                            background: #1a237e !important;
                            color: white !important;
                            padding: 12px 16px !important;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        .header-title { font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 10px; }
                        .voucher-badge {
                            background: rgba(255,255,255,0.2) !important;
                            padding: 2px 10px !important;
                            border-radius: 20px !important;
                            font-size: 12px !important;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        .dialog-content { padding: 16px !important; }
                        .ledger-table {
                            width: 100% !important;
                            border-collapse: collapse !important;
                            font-size: 12px !important;
                            margin-top: 10px !important;
                        }
                        .ledger-table thead th {
                            background: #e8eaf6 !important;
                            padding: 6px 10px !important;
                            border-bottom: 2px solid #1a237e !important;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        .ledger-table tbody td {
                            padding: 4px 10px !important;
                            border-bottom: 1px solid #e0e0e0 !important;
                        }
                        .total-row td {
                            background: #e8eaf6 !important;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        .difference-row.balanced td {
                            background: #e8f5e9 !important;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        .debit-amount { color: #2e7d32 !important; font-weight: 600 !important; }
                        .credit-amount { color: #c62828 !important; font-weight: 600 !important; }
                        .text-left { text-align: left; }
                        .text-center { text-align: center; }
                        .text-right { text-align: right; }
                        .fw-bold { font-weight: 700; }
                        .close-btn { display: none !important; }
                        .dialog-footer { display: none !important; }
                        .party-info {
                            padding: 6px 10px !important;
                            background: #f8f9fa !important;
                            border-left: 3px solid #1a237e !important;
                            margin-bottom: 10px !important;
                        }
                        .narration-box {
                            padding: 6px 10px !important;
                            background: #fafafa !important;
                            border-left: 3px solid #1a237e !important;
                            margin-top: 10px !important;
                        }
                        .account-code { color: #888; font-size: 11px; }
                        .diff-status { display: inline-flex; align-items: center; gap: 4px; padding: 2px 10px; border-radius: 4px; }
                        .diff-status.balanced { color: #2e7d32; }
                        .diff-status.unbalanced { color: #c62828; }
                    </style>
                </head>
                <body>
                    <div class="ledger-header">
                        <div class="header-title">
                            <i class="fa fa-book"></i>
                            ${this.data.title || 'Ledger Preview'}
                            <span class="voucher-badge">${this.data.voucherNumber || '-'}</span>
                        </div>
                    </div>
                    <div class="dialog-content">
                        ${printContent}
                    </div>
                </body>
            </html>
        `);

        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    }


    onSubmit(): void {
        this.dialogRef.close({ action: 'submit' });
    }
}

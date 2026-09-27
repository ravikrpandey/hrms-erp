import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { LedgerAccount, LedgerPreviewComponent, LedgerPreviewData } from '../ledger-preview/ledger-preview.component';


@Injectable({
    providedIn: 'root'
})
export class LedgerPreviewService {

    constructor(private dialog: MatDialog) {}


    openPreview(data: LedgerPreviewData): Observable<any> {
        return this.dialog.open(LedgerPreviewComponent, {
           width: '900px',
            maxWidth: '98vw',
            maxHeight: '92vh',
            minHeight: '400px',
            height: 'auto',
            panelClass: 'ledger-preview-dialog',
            data: data,
            disableClose: true,
            autoFocus: false
        }).afterClosed();
    }


    buildPreviewData(
        form: any,
        formArray: any,
        chartedAccount: any[],
        currencySymbol: string,
        currencyCode: string,
        options: {
            title: string;
            partyName?: any;
            voucherNumber?: string;
            voucherDate?: Date | string;
            narration?: string;
            showSubmitButton?: boolean;
            isViewMode?: boolean;
        }
    ): LedgerPreviewData {

        const accounts: LedgerAccount[] = [];
        let totalDebit = 0;
        let totalCredit = 0;

        // Build accounts from form array
        if (formArray && formArray.controls) {
            formArray.controls.forEach((control: any) => {
                const accountId = control.get('chart_account_id')?.value;
                const account = chartedAccount.find((acc: any) => acc.id === accountId);

                let debitAmount = Number(control.get('debit_amount')?.value) || 0;
                let creditAmount = Number(control.get('credit_amount')?.value) || 0;

                totalDebit += debitAmount;
                totalCredit += creditAmount;

                accounts.push({
                    account_name: account?.account_name || 'Unknown Account',
                    account_code: account?.account_code || '-',
                    debit_amount: debitAmount,
                    credit_amount: creditAmount
                });
            });
        }

        // Get voucher number from form
        let voucherNumber = options.voucherNumber || '-';
        if (!voucherNumber || voucherNumber === '-') {
            voucherNumber = form?.get('general_number')?.value ||
                           form?.get('voucher_number')?.value ||
                           form?.get('payment_number')?.value ||
                           form?.get('receipt_number')?.value ||
                           form?.get('contra_number')?.value ||
                           form?.get('purchase_number')?.value ||
                           form?.get('sales_number')?.value ||
                           form?.get('credit_note_number')?.value ||
                           form?.get('debit_note_number')?.value ||
                           '-';
        }

        // Get date from form
        let voucherDate = options.voucherDate || new Date();
        if (!voucherDate) {
            voucherDate = form?.get('transaction_date')?.value ||
                         form?.get('date')?.value ||
                         form?.get('payment_date')?.value ||
                         form?.get('receipt_date')?.value ||
                         form?.get('contra_date')?.value ||
                         form?.get('purchase_date')?.value ||
                         form?.get('sales_date')?.value ||
                         new Date();
        }

        // Get narration from form
        let narration = options.narration || '';
        if (!narration) {
            narration = form?.get('notes')?.value ||
                       form?.get('narration')?.value ||
                       form?.get('remarks')?.value ||
                       '';
        }

        return {
            title: options.title || 'Ledger Preview',
            voucherNumber: voucherNumber,
            voucherDate: voucherDate,
            currencySymbol: currencySymbol || '₹',
            currencyCode: currencyCode || 'INR',
            accounts: accounts,
            totalDebit: totalDebit,
            totalCredit: totalCredit,
            narration: narration,
            partyName: options.partyName || null,
            showSubmitButton: options.showSubmitButton !== false,
            isViewMode: options.isViewMode || false
        };
    }
}

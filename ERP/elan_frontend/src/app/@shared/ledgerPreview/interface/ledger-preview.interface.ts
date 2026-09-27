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

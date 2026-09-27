export const REPORT_CONFIG: any = {

  "rcm-purchase-register": {

    breadcrumbs: [ "RCM Purchase Register"],
    columns: [
  { valueGetter: "node.rowIndex + 1", headerName: 'S.No.' },
  // { field: "GSTIN", headerName: "GSTIN" },
  // { field: "Legal Name", headerName: "Legal Name" },
  { field: "vendor_name", headerName: "Vendor Name" },
  { field: "gst_in", headerName: "Vendor GSTIN" },
  { field: "gst_category_name", headerName: "Vendor Type (Registered / Unregistered / Import)" },
  { field: "document_number", headerName: "Invoice No" },
  { field: "posting_date", headerName: "Invoice Date" },
  // { field: "posting_date", headerName: "Posting Date" },
  // { field: "Voucher No", headerName: "Voucher No" },
  { field: "supply_type", headerName: "Supply Type (Intra / Inter / Import)" },
  // { field: "SAC / HSN Code", headerName: "SAC / HSN Code" },
  // { field: "Description", headerName: "Description" },
  { field: "total_amount", headerName: "Taxable Value" },
  // { field: "GST Rate %", headerName: "GST Rate %" },
  { field: "cgst_amount", headerName: "CGST Amount" },
  { field: "sgst_amount", headerName: "SGST Amount" },
  { field: "igst_amount", headerName: "IGST Amount" },
  { field: "total_gst_rcm", headerName: "Total GST (RCM)" },
  { field: "ITC_Eligible", headerName: "ITC Eligible (Y/N)" },
  { field: "ITC_Claimed", headerName: "ITC Claimed (Y/N)" },
  { field: "Reverse_Charge_Tax_Code", headerName: "Reverse Charge Tax Code" },
  { field: "GL_Posted_Expense", headerName: "GL Posted (Expense)" },
  { field: "RCM_Payable_GL", headerName: "RCM Payable GL" },
  { field: "Input_GST_GL", headerName: "Input GST GL" },
  // { field: "payment_status", headerName: "Payment Status (Paid / Unpaid)" },
  // { field: "RCM Payment Date", headerName: "RCM Payment Date" },
  // { field: "Cash_Ledger_Ref_No", headerName: "Cash Ledger Ref No" }
]
  },

  "rcm-liability-summary": {
    breadcrumbs: ["RCM Liability Summary"],
   columns: [
    { valueGetter: "node.rowIndex + 1", headerName: 'S.No.' },
  // { field: "month", headerName: "Month" },
  { field: "vendor_name", headerName: "Vendor Name" },
  { field: "credit_amount", headerName: "Taxable Value (RCM)" },
  { field: "cgst_amount", headerName: "CGST Liability" },
  { field: "sgst_amount", headerName: "SGST Liability" },
  { field: "igst_amount", headerName: "IGST Liability" },
  { field: "credit_amount", headerName: "Total RCM Liability" },
  { field: "rcmPaid", headerName: "RCM Paid (Yes/No)" },
  { field: "balancePayable", headerName: "Balance Payable" }
]
  },

  "rcm-itc-summary": {
    breadcrumbs: ["RCM ITC Summary"],
   columns: [
  { valueGetter: "node.rowIndex + 1", headerName: 'S.No.' },
  { field: "month", headerName: "Month" },
  { field: "taxableValue", headerName: "Taxable Value" },
  { field: "cgstItc", headerName: "CGST ITC" },
  { field: "sgstItc", headerName: "SGST ITC" },
  { field: "igstItc", headerName: "IGST ITC" },
  { field: "totalItcAvailable", headerName: "Total ITC Available" },
  { field: "itcClaimedThisMonth", headerName: "ITC Claimed This Month" },
  { field: "itcReversed", headerName: "ITC Reversed (if any)" },
  { field: "netItcAvailed", headerName: "Net ITC Availed" }
]
  },
  "vendor-wise-rcm-report": {
    breadcrumbs: ["Vendor-wise RCM Report"],
    columns: [
  { valueGetter: "node.rowIndex + 1", headerName: 'S.No.' },
  { field: "vendorName", headerName: "Vendor Name" },
  { field: "vendorGstin", headerName: "Vendor GSTIN" },
  { field: "totalTaxableValueRcm", headerName: "Total Taxable Value (RCM)" },
  { field: "totalCgst", headerName: "Total CGST" },
  { field: "totalSgst", headerName: "Total SGST" },
  { field: "totalIgst", headerName: "Total IGST" },
  { field: "totalRcmLiability", headerName: "Total RCM Liability" },
  { field: "invoiceCount", headerName: "No. of Invoices" },
  { field: "itcClaimed", headerName: "ITC Claimed" },
  { field: "itcPending", headerName: "ITC Pending" }
]
},

   "sac-wise-rcm-report": {

  breadcrumbs: ["SAC-wise RCM Report"],

columns: [
 {
  headerName: '',
  cellRenderer: 'agGroupCellRenderer',
  width: 70,
  pinned: 'left',

  cellRendererParams: {
    suppressCount: true
  }
},
  {
    field: "sac_code",
    headerName: "SAC Code"
  },

  {
    field: "description",
    headerName: "Description"
  },

  {
    field: "no_of_transactions",
    headerName: "No. of Transactions"
  },

  {
    field: "total_taxable_value",
    headerName: "Total Taxable Value",

    valueFormatter: (params:any) => {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
      }).format(params?.value || 0);
    }
  },

  {
    field: "gst_rate",
    headerName: "GST Rate",

    valueFormatter: (params:any) => {
      return `${params?.value || 0}%`;
    }
  },

  {
    field: "cgst",
    headerName: "CGST",

    valueFormatter: (params:any) => {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
      }).format(params?.value || 0);
    }
  },

  {
    field: "sgst",
    headerName: "SGST",

    valueFormatter: (params:any) => {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
      }).format(params?.value || 0);
    }
  },

  {
    field: "igst",
    headerName: "IGST",

    valueFormatter: (params:any) => {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
      }).format(params?.value || 0);
    }
  },

  {
    field: "total_rcm_amount",
    headerName: "Total RCM Amount",

    valueFormatter: (params:any) => {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
      }).format(params?.value || 0);
    }
  }

]
},
  "rcm-payment-tracking-report": {
    breadcrumbs: ["RCM Payment Tracking Report"],
    columns: [
      { valueGetter: "node.rowIndex + 1", headerName: 'S.No.' },
  { field: "month", headerName: "Month" },
  { field: "openingRcmLiability", headerName: "Opening RCM Liability" },
  { field: "currentMonthRcm", headerName: "Current Month RCM" },
  { field: "totalLiability", headerName: "Total Liability" },
  { field: "cashPaid", headerName: "Cash Paid" },
  { field: "paymentDate", headerName: "Date of Payment" },
  { field: "challanNo", headerName: "Challan No" },
  { field: "closingBalance", headerName: "Closing Balance" }
]
  },
  "rcm-gl-reconciliation-report": {
    breadcrumbs: ["RCM GL Reconciliation Report"],
   columns: [
    { valueGetter: "node.rowIndex + 1", headerName: 'S.No.' },
  { field: "rcmPayableGlBalance", headerName: "RCM Payable GL Balance" },
  { field: "inputGstRcmGlBalance", headerName: "Input GST (RCM) GL Balance" },
  { field: "gstr3bLiability", headerName: "GSTR-3B Liability" },
  { field: "difference", headerName: "Difference" },
  { field: "adjustmentEntryRef", headerName: "Adjustment Entry Ref" }
]
  },
   "rcm-compliance-report": {
    breadcrumbs: ["RCM Compliance Exception Report"],
    columns: [
      { valueGetter: "node.rowIndex + 1", headerName: 'S.No.' },
  { field: "invoiceNo", headerName: "Invoice No" },
  { field: "vendor", headerName: "Vendor" },
  { field: "sac", headerName: "SAC" },
  { field: "rcmApplicable", headerName: "RCM Applicable? (System)" },
  { field: "rcmTaxCodeUsed", headerName: "RCM Tax Code Used?" },
  { field: "gstCalculated", headerName: "GST Calculated?" },
  { field: "liabilityPosted", headerName: "Liability Posted?" },
  { field: "itcClaimed", headerName: "ITC Claimed?" },
  { field: "errorType", headerName: "Error Type" }
]
  },

};

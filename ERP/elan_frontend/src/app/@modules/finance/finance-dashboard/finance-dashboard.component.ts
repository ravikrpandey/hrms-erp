import { data } from 'jquery';
import { Component, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { InventoryManagementService } from '../../ware-house-management/inventory-management.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { FinanceDashboardServiceService } from 'src/app/@shared/services/finance-dashboard-service.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';

@Component({
  selector: 'app-finance-dashboard',
  templateUrl: './finance-dashboard.component.html',
  styleUrls: ['./finance-dashboard.component.scss']
})
export class FinanceDashboardComponent {
  @Input() keyboardActive: boolean = false;
  public chart1: Chart<any>;
  public chart2: Chart<any>;
  public chart3: Chart<any>;
  warehouseList: any;
  entity_id: any;
  warehouseLabel: any;
  cashOnHand: number = 0.00;
  currentMonth: any;
  bankTransaction: any[] = [];
  availableCash: any[] = [];
  postingPeriodList: any[] = [];
  financialYear: any = '';
  financial_id: any;
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",];
  constructor(private inventoryService: InventoryManagementService, private _finaceservice: FinaceService, private dasboardService: FinanceDashboardServiceService, private $miscellaneous: MiscellaneousService) {

  }


  moveLeft() {
    const firstCard = this.cards1.shift();
    if (firstCard) {
      this.cards1.push(firstCard);
    }
  }

  moveRight() {
    const lastCard = this.cards1.pop();
    if (lastCard) {
      this.cards1.unshift(lastCard);
    }
  }
  currentAccount2: any;
  month:any;
  moveLeft3() {
    const currentIndex = this.availableCash.findIndex(account => account.id === this.currentAccount2.id);
    const prevIndex = (currentIndex === 0) ? this.availableCash.length - 1 : currentIndex - 1;
    this.currentAccount2 = this.availableCash[prevIndex];
  }

  moveRight3() {
    const currentIndex = this.availableCash.findIndex(account => account.id === this.currentAccount2.id);
    const nextIndex = (currentIndex === this.availableCash.length - 1) ? 0 : currentIndex + 1;
    this.currentAccount2 = this.availableCash[nextIndex];
  }
  moveLeft4() {
    const currentIndex = this.postingPeriodList.findIndex(account => account.month === this.month);
    const prevIndex = (currentIndex === 0) ? this.postingPeriodList.length - 1 : currentIndex - 1;
    this.month = this.postingPeriodList[prevIndex].month;
    this.updateCards(3, 'Posting Period', this.month);
  }

  moveRight4() {
    const currentIndex = this.postingPeriodList.findIndex(account => account.month === this.month);
    const nextIndex = (currentIndex === this.postingPeriodList.length - 1) ? 0 : currentIndex + 1;
    this.month = this.postingPeriodList[nextIndex].month;
    this.updateCards(3, 'Posting Period', this.month);
  }
  currentAccount: any;
  moveLeft2() {

    const currentIndex = this.bankTransaction.findIndex(account => account.id === this.currentAccount.id);
    const prevIndex = (currentIndex === 0) ? this.bankTransaction.length - 1 : currentIndex - 1;
    this.currentAccount = this.bankTransaction[prevIndex];
  }

  moveRight2() {
    const currentIndex = this.bankTransaction.findIndex(account => account.id === this.currentAccount.id);
    const nextIndex = (currentIndex === this.bankTransaction.length - 1) ? 0 : currentIndex + 1;
    this.currentAccount = this.bankTransaction[nextIndex];
  }



  ngOnInit() {
    this.entity_id = localStorage.getItem('selectedEntityId');
    let financial_id = localStorage.getItem("financial_id");

    this.prepareData(this.entity_id);
    this.getCashBookData(this.entity_id);
    this.getBalanceSheet(this.entity_id);

    // this.getAccountList(this.entity_id);


    this.getPostingPeriod(this.entity_id, financial_id);
    this.getFinancialYear();
    this.createChart1();


  }
  totalAccount: any = 0;
  totalActiveAccount: any = 0;
  createChart1() {


    this.chart1 = new Chart("canvas1", {
      type: "bar",
      data: {
        labels: ['dddd', 'ddd'],
        datasets: [
          {
            label: "Capacity",
            data: [10, 20, 30, 50, 8, 8, 8, 8, 8, 8],
            backgroundColor: '#42A5F5',
            hoverBackgroundColor: '#64B5F6',
            barThickness: 10,
          },

        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              display: false,
            },
          },
          y: {
            grid: {
              display: false,
            },
            ticks: {
              display: false,
            },
            beginAtZero: true,
          }
        },
        layout: {
          padding: 0,
        }
      }
    });






  }
  balanceSheetChart() {
    this.chart3 = new Chart("canvas3", {
      type: "doughnut",
      data: {
        labels: ['Assets', 'Liabiltiy'],
        datasets: [
          {
            label: "Balance Sheet",
            data: [this.totalAssets, this.totalLiabilties],
            backgroundColor: ['#42A5F5', '#FF7043'],
            hoverBackgroundColor: ['#64B5F6', '#FF8A65'],
          },
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        layout: {
          padding: 0,
        }
      }
    });
  }
  profitLossChart() {
    this.chart2 = new Chart("canvas2", {
      type: "doughnut",
      data: {
        labels: ['Income', 'Expense'],
        datasets: [
          {
            label: "Profit and Loss",
            data: [this.totalDebit, this.totalCredit],
            backgroundColor: ['#42A5F5', '#FF7043'],
            hoverBackgroundColor: ['#64B5F6', '#FF8A65'],
          },
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        layout: {
          padding: 0,
        }
      }
    });
  }

  cards1: any = [
    {
      id: 1,
      name: 'Chart Of Account',
      icon: 'calender',
      text: 'Manage your organization complete account hierarchy and structure',
      url: '/master/finance/account-charts',

    },
    {
      id: 2,
      name: 'Financial Year',
      icon: 'calender',
      text: 'Configure and manage fiscal years for financial reporting periods',
      url: '/master/configurational-master/financial-year',

    },
    {
      id: 3,
      name: 'Posting Period',
      icon: 'calender',
      text: 'Control accounting periods and manage books closing schedule.',
      url: '/master/finance/posting-period'

    },
    {
      id: 4,
      name: 'Journal Book',
      icon: 'calender',
      text: ' Record and track all your journal entries and transactions.',
      url: '/master/finance/journal/journal-ledger'

    },
    {
      id: 5,
      name: 'Cash Book',
      icon: 'calender',
      text: 'Monitor and manage cash transactions and balances.',
      url: '/master/finance/cash-books/cash-book'

    },
    {
      id: 6,
      name: 'Bank Acoounting',
      icon: 'calender',
      text: ' Manage all your banks and bank accounts at one place with reconciliation tool.',
      url: '/master/finance/bank-accounting/bank'

    },

  ]



  getWarehouseValues: any = [];
  userCapacity: any = [];
  getWarehouseData() {
    this.inventoryService.getWarehouseDashoard(this.entity_id).subscribe((res: any) => {
      this.warehouseList = res.data || [];
      this.getWarehouseValues = this.warehouseList.map((res: any) => {
        return res.capacity;
      })
      this.userCapacity = this.warehouseList.map((res: any) => {
        return res.used_capacity;
      })

      this.createChart1();

    })
  }
  totalDebit: number = 0.00;
  income: number = 1;
  totalCredit: number = 0.00;
  totalProfitLoss: number = 0.00;
  categoryData: any = []
  prepareData(entity_id: any) {
const financial_id = localStorage.getItem('financial_id');
    this._finaceservice.getProfitAndLossList(entity_id,financial_id).subscribe((response: any) => {
      if (response) {

        this.categoryData = response.data.accountTypes.filter(
          (account: any) => account.name === "Expenses" || account.name === "Revenue"
        );

        const credit_amount = response.data.accountTypes.filter(
          (account: any) => account.name === "Expenses");

        const debit_amount = response.data.accountTypes.filter(
          (account: any) => account.name === "Revenue"
        );
        this.totalCredit = credit_amount[0].amount;
        this.totalDebit = Math.abs(debit_amount[0].amount);
        this.profitLossChart()


      }
    }, (err: any) => {
      // this.toast.error(err.error.message);
    })
  }
  totalAssets: number = 0.00;
  totalLiabilties: number = 0.00;
  getBalanceSheet(entity_id: any) {


    this._finaceservice.getBalanceSheetList(entity_id).subscribe((response: any) => {
      if (response) {

        this.categoryData = response.data.accountTypes.filter(
          (account: any) => account.name === "Assets" || account.name === "Liabilities" || account.name === "Equity"
        );
        const assets = response.data.accountTypes.filter(
          (account: any) => account.name === "Assets"
        );
        this.totalAssets = assets[0]?.amount;

        const Liabilities = response.data.accountTypes.filter(
          (account: any) => account.name === "Liabilities"
        );
        this.totalLiabilties = Math.abs(Liabilities[0]?.amount);
        this.balanceSheetChart()



      }
    }, (err: any) => {
      // this.toast.error(err.error.message);
    })


  }

  cashBook: number = 0;
  firstRowBalance: number = 0;
  getCashBookData(entity_id: any) {
    this._finaceservice.getCashBookData(entity_id).subscribe((response: any) => {
      if (response) {

        let Account_list = response.data;
        this.cashBook = Account_list.length;
        this.updateCards(5, 'Total Transactions', this.cashBook);
        for (let index = Account_list.length - 1; index >= 0; index--) {
          const element = Account_list[index];
          if (index === Account_list.length - 1) {
            element['balance'] = Number(element.debit_amount) - Number(element.credit_amount);
          } else {
            if (element.debit_amount > 0) {
              element['balance'] = Number(Account_list[index + 1].balance) + Number(element.debit_amount);
            } else {
              element['balance'] = Number(Account_list[index + 1].balance) - Number(element.credit_amount);
            }
          }

          if (index === 0) {
            this.firstRowBalance = element['balance'];
            let x = element['balance'];
            this.availableCash.push({ id: 1, text: 'Cash on Hand', amount: x });
          }
        }
        // this.cashBookForm.get('available_amount')?.setValue(firstRowBalance);


      } else {


      }
    },
      (err: any) => {
        console.error("Error while fetching journal list:", err);
      });
  }





  updateCards(id: any, text: any, active: any) {

    const data = this.cards1.find((card: any) => card.id === id);
    if (data) {
      data.total = text;
      data.totalActive = active;
    }
  }





  getFinancialYear() {
    this.$miscellaneous.getAllActivefinancial_year().subscribe((res) => {
      if (res) {
        let financial_id = localStorage.getItem("financial_id");
        if (financial_id) {
          this.financial_id = Number(financial_id);
          this.financialYear = res?.data?.find((x: any) => x.id === this.financial_id)?.financial_year;
          this.updateCards(2, 'Financial Year', this.financialYear);
        }
      }
    }
    )
  }


  postingPeriod: any;
  getPostingPeriod(entity_id: any, financial_id:any) {
    this.inventoryService.getDashBoardFinanceData(entity_id,financial_id).subscribe((res: any) => {

      this.postingPeriod = res?.data?.postingPeriod[0];
      this.postingPeriodList = res?.data?.postingPeriod;
      this.month= this.postingPeriodList[0].month;
      this.currentMonth = res?.data?.postingPeriod[0]?.month_name;
      this.updateCards(3, 'Posting Period', this.month);

      this.updateCards(4, 'Total Transactions', res?.data?.journalData[1]?.totalJournal);

      this.bankTransaction = res.data?.chartOfAccount;
      this.currentAccount = this.bankTransaction[0];
      let debit = res.data?.cashOnHand[0]?.total_debit;
      let credit = res.data?.cashOnHand[0]?.total_credit;

      this.cashOnHand = debit - credit;
      let data = this.cashOnHand;
      this.availableCash.push({ id: 2, text: 'Petty Cash', amount: data });
      this.currentAccount2 = this.availableCash[0];

      this.updateCards(1, 'Total Accounts', res?.data?.totalChartOfAccount?.totalChartOfAccounts)
      this.updateCards(6, 'Total Bank', res?.data?.bankList?.totalBank);
    })
  }


}

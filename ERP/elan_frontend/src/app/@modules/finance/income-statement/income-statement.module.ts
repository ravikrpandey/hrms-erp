import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { IncomeStatementActionComponent } from './income-statement-action/income-statement-action.component';
import { IncomeStatementTabComponent } from './income-statement-tab/income-statement-tab.component';
import { IncomeStatementRoutingModule } from './income-statement-routing.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { GenerateIncomeStatementComponent } from './generate-income-statement/generate-income-statement.component';
import { TotalRevenueComponent } from './total-revenue/total-revenue.component'
import { DepreciationAmortizationComponent } from './depreciation-amortization/depreciation-amortization.component';
import { OperatingExpenseComponent } from'./operating-expense/operating-expense.component';
import { EbitdaComponent  } from './ebitda/ebitda.component';
import { VariableCostComponent } from './variable-cost/variable-cost.component'
import { IncomeStatementComponent } from './income-statement.component';
import { IncomeStatementListComponent } from './income-statement-list/income-statement-list.component';
@NgModule({
    declarations: [
        IncomeStatementListComponent,
        IncomeStatementTabComponent,
        IncomeStatementActionComponent,
        IncomeStatementComponent,
        GenerateIncomeStatementComponent,
        TotalRevenueComponent,
        DepreciationAmortizationComponent,
        OperatingExpenseComponent,
        EbitdaComponent,
        VariableCostComponent
    ],
    imports: [
        CommonModule,
        IncomeStatementRoutingModule,
        MaterialModule,
        AgGridModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatDialogModule,
        MatExpansionModule,
        MatSidenavModule,
        MatListModule,
        MatSelectFilterModule,
        MatSelectModule,
        MatButtonModule,
        MatDatepickerModule,
        MatIconModule,
        MatTooltipModule,
        ShairedModule
    ]
})
export class IncomeStatementModule { }

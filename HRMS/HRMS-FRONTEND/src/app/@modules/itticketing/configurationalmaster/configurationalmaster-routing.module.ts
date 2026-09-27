import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationalmasterComponent } from './configurationalmaster.component';
// import { JobTypeComponent } from './job-type/job-type.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationalmasterComponent,
    children: [
      {
        path: 'config-master',
        loadChildren: () =>
          import('./countrymaster/countrymaster.module').then(
            (m) => m.CountrymasterModule
          ),
      },
      {
        path: 'state-master',
        loadChildren: () =>
          import('./statemaster/statemaster.module').then(
            (m) => m.StatemasterModule
          ),
      },
      {
        path: 'checklist',
        loadChildren: () =>
          import('./checklist/checklist.module').then((m) => m.ChecklistModule),
      },
      {
        path: 'city-master',
        loadChildren: () =>
          import('./city-master/city-master.module').then(
            (m) => m.CityMasterModule
          ),
      },

      {
        path: 'department',
        loadChildren: () =>
          import('./department/department.module').then(
            (m) => m.DepartmentModule
          ),
      },
      {
        path: 'municipality',
        loadChildren: () =>
          import('./municipality-master/municipality.module').then(
            (m) => m.MunicipalityModule
          ),
      },
      {
        path: 'bank',
        loadChildren: () =>
          import('./bank-master/bank.module').then((m) => m.BankModule),
      },
      {
        path: 'contract-type',
        loadChildren: () =>
          import('./contract-type-master/contract-type.module').then(
            (m) => m.ContractTypeModule
          ),
      },
      {
        path: 'designation',
        loadChildren: () =>
          import('./designation/designation.module').then(
            (m) => m.DesignationModule
          ),
      },

      {
        path: 'designations',
        loadChildren: () =>
          import('./rbac-role-master/rbac-role-master.module').then(
            (m) => m.RbacRoleMasterModule
          ),
      },

      {
        path: 'grade',
        loadChildren: () =>
          import('./grade/grade.module').then((m) => m.GradeModule),
      },
      {
        path: 'division',
        loadChildren: () =>
          import('./division/division.module').then((m) => m.DivisionModule),
      },
      {
        path: 'branch',
        loadChildren: () =>
          import('./branch/branch.module').then((m) => m.BranchModule),
      },

      {
        path: 'leave-type',
        loadChildren: () =>
          import('./leavetype/leavetype.module').then((m) => m.LeavetypeModule),
      },
      {
        path: 'marital-status',
        loadChildren: () =>
          import('./maritalstatus/maritalstatus.module').then(
            (m) => m.MaritalstatusModule
          ),
      },
      {
        path: 'employment-type',
        loadChildren: () =>
          import('./employement-type/employement-type.module').then(
            (m) => m.EmployementTypeModule
          ),
      },
      {
        path: 'industry-sector-master',
        loadChildren: () =>
          import('./industry-sector-master/industry-sector-master.module').then(
            (m) => m.IndustrySectorMasterModule
          ),
      },
      // {
      //   path: 'auditor-master',
      //   loadChildren: () =>
      // import('./auditor-master/auditor-master.module').then(
      //       (m) => m.AuditorMasterModule
      //     ),
      // },
      {
        path: 'quotationcurrency',
        loadChildren: () =>
          import('./quotation-currency/quotation-currency.module').then(
            (m) => m.QuotationCurrencyModule
          ),
      },

      {
        path: 'vendor-type',
        loadChildren: () =>
          import('./vendor-type/vendor-type.module').then(
            (m) => m.VendorTypeModule
          ),
      },
      {
        path: 'customer-type',
        loadChildren: () =>
          import('./customer-type/customer-type.module').then(
            (m) => m.CustomerTypeModule
          ),
      },
      {
        path: 'training-name',
        loadChildren: () =>
          import('./training-name/training-name.module').then(
            (m) => m.TrainingNameModule
          ),
      },
      {
        path: 'level-slab',
        loadChildren: () =>
          import('./level-slab/level-slab.module').then(
            (m) => m.LevelSlabModule
          ),
      },
      {
        path: 'pricemapping-product',
        loadChildren: () =>
          import('./pricemapping/pricemapping.module').then(
            (m) => m.PricemappingModule
          ),
      },
      {
        path: 'pricing-level',
        loadChildren: () =>
          import('./pricing-level/pricing-level.module').then(
            (m) => m.PricingLevelModule
          ),
      },
      // {
      //   path: 'price-master',
      //   loadChildren: () =>
      //     import('./pricemapping/pricemapping.module').then(
      //       (m) => m.PricemappingModule
      //     ),
      // },
      // {
      //   path: 'product-master',
      //   loadChildren: () =>
      //     import('./product-master/product-master.module').then(
      //       (m) => m.ProductMasterModule
      //     ),
      // },

      {
        path: 'asset-category',
        loadChildren: () =>
          import('./asset-category/asset-category.module').then(
            (m) => m.AssetCategoryModule
          ),
      },

      {
        path: 'pr-item',
        loadChildren: () =>
          import('./pr-item/pr-item.module').then((m) => m.PrItemModule),
      },
      {
        path: 'currency-master',
        loadChildren: () =>
          import('./currency-master/currency-master.module').then(
            (m) => m.CurrencyMasterModule
          ),
      },
      {
        path: 'expense-category',
        loadChildren: () =>
          import('./expense-category/expense-category.module').then(
            (m) => m.ExpenseCategoryModule
          ),
      },
      {
        path: 'unit-master',
        loadChildren: () =>
          import('./unit-master/unit-master.module').then(
            (m) => m.UnitMasterModule
          ),
      },

      {
        path: 'courier-service-name',
        loadChildren: () =>
          import('./courier-service-name/courier-service-name.module').then(
            (m) => m.CourierServiceNameModule
          ),
      },

      {
        path: 'courier-contains',
        loadChildren: () =>
          import('./courier-contain/courier-contain.module').then(
            (m) => m.CourierContainModule
          ),
      },

      {
        path: 'product-asset-master',
        loadChildren: () =>
          import('./product-asset-master/product-asset-master.module').then(
            (m) => m.ProductAssetMasterModule
          ),
      },

      {
        path: 'product-asset-create',
        loadChildren: () =>
          import('./product-asset-create/product-asset-create.module').then(
            (m) => m.ProductAssetCreateModule
          ),
      },
      {
        path: 'new-price-master',
        loadChildren: () =>
          import(
            './new-price-master/new-price-master.module'
          ).then((m) => m.NewPriceMasterModule),
      },

      {
        path: 'language-master',
        loadChildren: () =>
          import('./language-master/language-master.module').then(
            (m) => m.LanguageMasterModule
          ),
      },

      {
        path: 'amc-discription',
        loadChildren: () =>
          import('./amc-discription/amc-discription.module').then(
            (m) => m.AmcDiscriptionModule
          ),
      },
      {
        path: 'employe-doc',
        loadChildren: () =>
          import('./employe-sign-doc/employe-sign-doc.module').then(
            (m) => m.EmployeSignDocModule
          ),
      },
      {
        path: 'branch-setup',
        loadChildren: () =>
          import('./branch-setup/branch-setup.module').then(
            (m) => m.BranchSetupModule
          ),
      },
      {
        path: 'my-expense-role',
        loadChildren: () =>
          import('./my-expense-role/my-expense-role.module').then(
            (m) => m.MyExpenseRoleModule
          ),
      },
      {
        path: 'plant-master',
        loadChildren: () =>
          import('./plant-master/plant-master.module').then(
            (m) => m.PlantMasterModule
          ),
      },

      {
        path: 'uom',
        loadChildren: () => import('./uom/uom.module').then((m) => m.UomModule),
      },

      {
        path: 'service-category',
        loadChildren: () =>
          import('./service-category/service-category.module').then(
            (m) => m.ServiceCategoryModule
          ),
      },

      {
        path: 'service-master',
        loadChildren: () =>
          import('./service-master/service-master.module').then(
            (m) => m.ServiceMasterModule
          ),
      },

      {
        path: 'work-station',
        loadChildren: () =>
          import('./work-station/work-station.module').then(
            (m) => m.WorkStationModule
          ),
      },
      {
        path: 'product-master',
        loadChildren: () =>
          import('./product-master/product-master.module').then(
            (m) => m.ProductMasterModule
          ),
      },
      {
        path: 'customer-review-master',
        loadChildren: () =>
          import('./customer-review/customer-review.module').then(
            (m) => m.CustomerReviewModule
          ),
      },

      {
        path: 'quality-master',
        loadChildren: () =>
          import('./quality-master/quality-master.module').then(
            (m) => m.QualityMasterModule
          ),
      },
      {
        path: 'vehicle-registration',
        loadChildren: () =>
          import('./vehicle-registration/vehicle-registration.module').then(
            (m) => m.VehicleRegistrationModule
          ),
      },
      {
        path: 'area',
        loadChildren: () =>
          import('./area/area.module').then((m) => m.AreaModule),
      },
      {
        path: 'company-master',
        loadChildren: () =>
          import('./company-master/company-master.module').then(
            (m) => m.CompanyMasterModule
          ),
      },

      {
        path: 'budget-category',
        loadChildren: () =>
          import('./budget-category/budget-category.module').then(
            (m) => m.BudgetCategoryModule
          ),
      },
      {
        path: 'type-of-expense',
        loadChildren: () =>
          import('./type-of-expence/type-of-expense.module').then(
            (m) => m.TypeOfExpenseModule
          ),
      },
      {
        path: 'type-of-need',
        loadChildren: () =>
          import('./type-of-need/type-of-need.module').then(
            (m) => m.TypeOfNeedModule
          ),
      },
      {
        path: 'region',
        loadChildren: () =>
          import('./region/region.module').then((m) => m.RegionModule),
      },
      {
        path: 'reason',
        loadChildren: () =>
          import('./reason/reason.module').then((m) => m.ReasonModule),
      },
      {
        path: 'allowance',
        loadChildren: () =>
          import('./allowance/allowance.module').then((m) => m.AllowanceModule),
      },
      {
        path: 'seal-type',
        loadChildren: () =>
          import('./seal-type/seal-type.module').then((m) => m.SealTypeModule),
      },
      {
        path: 'financial-year',
        loadChildren: () =>
          import('./financial-year/financial-year.module').then(
            (m) => m.FinancialYearModule
          ),
      },
      {
        path: 'global-minutes',
        loadChildren: () =>
          import('./global-minutes/globalminutes.module').then(
            (m) => m.GlobalMinutesModule
          ),
      },
      {
        path: 'lms-course-category',
        loadChildren: () =>
          import('./lms-course-category/lms-course-category.module').then(
            (m) => m.LmsCourseCategoryModule
          ),
      },
      {
        path: 'ticket-category',
        loadChildren: () =>
          import('./ticket-category/ticket-category.module').then(
            (m) => m.TicketCategoryModule
          ),
      },
      {
        path: 'complaint-master',
        loadChildren: () =>
          import('./complaint-master/complaint-master.module').then(
            (m) => m.ComplaintMasterModule
          ),
      },
      {
        path: 'entity-list',
        loadChildren: () =>
          import('../../entity/entity.module').then((m) => m.EntityModule),
      },
      {
        path: 'work-flow-job',
        loadChildren: () =>
          import('./work-flow/work-flow.module').then(
            (m) => m.WorkFlowModule
          ),
      },
      {
        path: 'reimbursement-master',
        loadChildren: () =>
          import('./reimbursement-master/reimbursement-master.module').then(
            (m) => m.ReimbursementMasterModule
          ),
      },
      {
        path: 'business-unit',
        loadChildren: () =>
          import('./business-unit/business-unit-module').then(
            (m) => m.BusinessUnitModule
          ),
      },
      {
        path: 'kt-master',
        loadChildren: () =>
          import('./kt-master/kt-master-module').then(
            (m) => m.KtMasterModule)
      },
      {
        path: 'assets',
        loadChildren: () =>
          import('./assets/assets-module').then(
            (m) => m.AssetsModule
          ),
      },
      {
        path: 'notice-period',
        loadChildren: () => import('./notice-period-list/notice-period-list-module').then((m) => m.NoticePeriodListModule)
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationalmasterRoutingModule { }

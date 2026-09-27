import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationalmasterComponent } from './configurationalmaster.component';
import { ExpectedDeliveryDaysComponent } from './expected-delivery-days/expected-delivery-days.component';
import { ItemCostCategoryComponent } from './item-cost-category/item-cost-category.component';
import { InstallationKitBomComponent } from './installation-kit-bom/installation-kit-bom.component';
import { CreateKitComponent } from './installation-kit-bom/create-kit/create-kit.component';
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
        path: 'city-master',
        loadChildren: () =>
          import('./city-master/city-master.module').then(
            (m) => m.CityMasterModule
          ),
      },
      {
        path: 'location-master',
        loadChildren: () =>
          import('./location-master/location-master.module').then(
            m => m.LocationMasterModule
          ),
      },
      {
        path: 'branding-master',
        loadChildren: () =>
          import('./branding-master/branding-master.module').then(
            m => m.BrandingMasterModule
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
        path: 'zone-type-master',
        loadChildren: () =>
          import('./zone-type/zone-type.module').then(
            m => m.ZoneTypeModule
          ),
      },
      {
        path: 'customer-type-master',
        loadChildren: () =>
          import('./customer-type-master/customer-type-master.module').then(
            (m) => m.CustomerTypeMasterModule
          ),
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
        path: 'grade',
        loadChildren: () =>
          import('./grade/grade.module').then((m) => m.GradeModule),
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
            '../configurationalmaster/new-price-master/new-price-master.module'
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
        path: 'hsn-sac-master',
        loadChildren: () =>
          import('./hsn-sac/hsn-sac.module').then((m) => m.HsnSacModule),
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
        path: 'shift-master',
        loadChildren: () =>
          import('./shift-master/shift-master.module').then(
            (m) => m.ShiftMasterModule
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
        path: 'financial-year',
        loadChildren: () =>
          import('./financial-year/financial-year.module').then(
            (m) => m.FinancialYearModule
          ),
      },
      {
        path: 'checklist',
        loadChildren: () =>
          import('./checklist/checklist.module').then((m) => m.ChecklistModule),
      },
      {
        path: 'uses-master',
        loadChildren: () =>
          import('./uses-master/uses-master.module').then(
            (m) => m.UsesMasterModule
          ),
      },
      {
        path: 'product-category',
        loadChildren: () =>
          import('./product-category/product-category.module').then(
            (m) => m.ProductCategoryModule
          ),
      },
      {
        path: 'ai-integration',
        loadChildren: () =>
          import('./ai-integration/ai-integration.module').then(
            (m) => m.aiIntegrationModule
          ),
      },
      {
        path: 'issue-master',
        loadChildren: () =>
          import('./isuue-master/isuue-master.module').then(
            (m) => m.IsuueMasterModule
          ),
      },
      {
        path: 'maintenance-check',
        loadChildren: () =>
          import(
            './maintenance-check-master/maintenance-check-master.module'
          ).then((m) => m.MaintenanceCheckMasterModule),
      },
      {
        path: 'service-center',
        loadChildren: () =>
          import('./service-center/service-center.module').then(
            (m) => m.ServiceCenterModule
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
        path: 'subcategory-master',
        loadChildren: () =>
          import('./subcategory/subcategory.module').then(
            (m) => m.SubcategoryMasterModule
          ),
      },
      {
        path: 'customer-category',
        loadChildren: () =>
          import('./customer-category/customer-category.module').then(
            (m) => m.CustomerCategoryMasterModule
          ),
      },
      {
        path: 'customer-sub-category',
        loadChildren: () =>
          import('./customer-sub-category/subcategory.module').then(
            (m) => m.CustomerSubcategoryMasterModule
          ),
      },
      {
        path: 'customer-micro-category',
        loadChildren: () =>
          import(
            './customer-micro-category/customer-micro-category.module'
          ).then((m) => m.CustomerMicroCategoryMasterModule),
      },
      {
        path: 'itemgroup-master',
        loadChildren: () =>
          import('./item-group-master/itemgroup-module').then(
            (m) => m.ItemGroupMasterModule
          ),
      },
      {
        path: 'product-customer-copy',
        loadChildren: () =>
          import('./product-master-copy/product-master-copy.module').then(
            (m) => m.ProductMasterCopyModule
          ),
      },
      {
        path: 'scheme-master',
        loadChildren: () =>
          import('./scheme-master/scheme-master.module').then(
            (m) => m.SchemeMasterModule
          ),
      },
      {
        path: 'price-master',
        loadChildren: () =>
          import('./price-master/price-master.module').then(
            (m) => m.PriceMasterModule
          ),
      },
      {
        path: 'additional-charge',
        loadChildren: () =>
          import('./additional-charge/additional-charge.module').then(
            (m) => m.AdditionalChargeModule
          ),
      },

      {
        path: 'gst-gl-account-mapping',
        loadChildren: () =>
          import('./gst-gl-mapping/gst-gl-mapping.module').then(
            (m) => m.GstGlMappingModule
          ),
      },

      {
        path: 'voucher-master',
        loadChildren: () =>
          import('./voucher-master/voucher-master.module').then(
            (m) => m.VoucherMasterModule
          ),
      },
      {
        path: 'payment-advice-voucher',
        loadChildren: () =>
          import('./payment-advice-voucher/payment-advice-voucher.module').then(
            (m) => m.PaymentAdviceVoucherModule
          ),
      },
      {
        path: 'bank-receipt-voucher',
        loadChildren: () =>
          import('./bank-receipt-voucher/bank-receipt-voucher.module').then(
            (m) => m.BankReceiptVoucherModule
          ),
      },
      {
        path: 'bank-receipt-voucher',
        loadChildren: () =>
          import('./bank-receipt-voucher/bank-receipt-voucher.module').then(
            (m) => m.BankReceiptVoucherModule
          ),
      },
      {
        path: 'bank-payment-voucher',
        loadChildren: () =>
          import('./bank-payment-voucher/bank-payment-voucher.module').then(
            (m) => m.BankPaymentVoucherModule
          ),
      },

      {
        path: 'trip-category',
        loadChildren: () =>
          import('./trip-category/trip-category.module').then(
            (m) => m.TripCategoryModule
          ),
      },
      {
        path: 'proposal-type',
        loadChildren: () =>
          import('./proposal-type/proposal-type.module').then(
            (m) => m.ProposalTypeModule
          ),
      },
      {
        path: 'tds-list',
        loadChildren: () =>
          import('./tds-master/tds-master.module').then(
            (m) => m.TdsMasterModule
          ),
      },
      {
        path: 'master-voucher-type',
        loadChildren: () =>
          import('./master-voucher-type/master-voucher-type.module').then(
            (m) => m.MasterVoucherTypeModule
          ),
      },
      {
        path: 'master-voucher-type',
        loadChildren: () =>
          import('./master-voucher-type/master-voucher-type.module').then(
            (m) => m.MasterVoucherTypeModule
          ),
      },
      {
        path: 'expected-delivery-days',
        component: ExpectedDeliveryDaysComponent,
      },
      {
        path: 'installation-kit',
        component: InstallationKitBomComponent,
      },
      {
        path: 'create-kit',
        component: CreateKitComponent,
      },
      {
        path: 'travel-master',
        loadChildren: () =>
          import('./travel-master/travel-master.module').then(
            (m) => m.TravelMasterModule
          ),
      },
      {
        path: 'accessory-category',
        loadChildren: () =>
          import('./accessory-category/accessory-category.module').then(
            (m) => m.AccessoryCategoryModule
          ),
      },
      {
        path: 'accessory-sub-category',
        loadChildren: () =>
          import('./accessory-sub-category/accessory-subcategory.module').then(
            (m) => m.AccessorySubcategoryMasterModule
          ),
      },
      { path: 'tcq-master', loadChildren: () => import('./tcq-master/tcq-master.module').then(m => m.TcqMasterModule) },
      {
        path: 'accessory-item',
        loadChildren: () =>
          import('./accessory-item/accessory-item.module').then(
            (m) => m.AccessoryItemModule
          ),
      },

      {
        path: 'basket-master',
        loadChildren: () =>
          import('./basket-master/basket-master.module').then(
            (m) => m.BasketMasterModule
          ),
      },
      {
        path: 'gl-mapping-transactions',
        loadChildren: () =>
          import('./gl-mapping-transactions/gl-mapping-transactions.module').then(
            (m) => m.GlMappingTransactionsModule
          ),
      },
      {
        path: 'financial-transactions-integrations',
        loadChildren: () =>
          import('./financial-transactions-integrations/financial-transactions-integrations.module').then(
            (m) => m.FinancialTransactionsIntegrationsModule
          ),
      },
      {
        path: 'cost-profit-center',
        loadChildren: () =>
          import('./cost-profit-center/cost-profit-center.module').then(
            (m) => m.CostProfitCenterModule
          ),
      },
      {
        path: 'item-cost-category', component: ItemCostCategoryComponent
      },
      { path: 'purchase-masters', loadChildren: () => import('./purchase-masters/purchase-masters.module').then(m => m.PurchaseMastersModule) },
      { path: 'transport-charge-master', loadChildren: () => import('./transport-charge-master/transport-charge-master.module').then(m => m.TransportChargeMasterModule) },

    ],
  },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationalmasterRoutingModule { }

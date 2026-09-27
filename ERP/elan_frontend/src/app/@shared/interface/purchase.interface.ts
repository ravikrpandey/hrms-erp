export interface PurchaseItemFormInterface {
  id?: number;
  item_master_id: number;
  item_name: string;
  item_code: string;
  quantity: number;
  mvp: number;
  total_mvp: number;
  grand_total: number;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  vendor_ids?: number[];
  item_image: string;
  asset_category_id: number;
  tax?: number;
  questions?: any[];
  unit_price?: number;
  hsn_sac_code?: string;
  discount?: number;
  expected_delivery_date?: string;
}

import { APIResponse } from "./core.interface";

export interface ItemResponseInterface extends APIResponse<ItemInterface[]> {
}

export interface ItemInterface {
    id: number;
    item_type_id: any;
    item_group_id: any;
    item_name: string;
    item_code: string;
    Bar_QR_Code: any;
    manage_by: string;
    minimum_level: any;
    maximum_level: any;
    Variant: any;
    cgst: number;
    sgst: number;
    igst: number;
    MVP: string;
    MRP: string;
    usage_details: any;
    description: string;
    Item_Print_Name: any;
    Color: any;
    Elanpro_Item_Code: any;
    Factory_Item_Code: any;
    Item_length_before: any;
    Item_width_before: any;
    Item_height_before: any;
    Item_volume_before: any;
    external_length_after: any;
    external_width_after: any;
    external_height_after: any;
    volumetric_weight_air_domestic: any;
    volumetric_weight_air_international: any;
    volumetric_weight_by_sea: any;
    volumetric_weight_by_road: any;
    volumetric_space: any;
    default_lead_time_for_sales: any;
    default_lead_time_for_purchase: any;
    auto_requisition_on_level: any;
    warranty_applicable: string;
    warranty_period: string;
    maximum_discount: any;
    status: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    hsn_code_id: number;
    asset_id: number;
    uom_id: number;
    entity_id: number;
    sub_category_id: number;
    financial_year_id: number;
    MASTER_ITEM_IMAGE_DOCUMENTs: MasterItemImageDocument[];
    MASTER_HSN_SAC_CODE: MasterHsnSacCode;
    vendor_details: any[];
    quantity: number;
}

export interface MasterItemImageDocument {
    id: number;
    image: string;
    createdAt: string;
    updatedAt: string;
    item_id: number;
}

export interface MasterHsnSacCode {
    id: number;
    gst_rate_id: number;
    hsn_sac_code: string;
    GST_RATE_MASTER: GstRateMaster;
}

export interface GstRateMaster {
    id: number;
    value: number;
}

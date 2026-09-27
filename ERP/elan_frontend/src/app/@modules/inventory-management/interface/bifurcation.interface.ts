
export interface Zone {
    id?: number;
    name: string;
    area: number;
    zone_type_id: number;
    status: string;
    item_category: number[];
    bulk_status?: string;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    warehouseBay: Bay[];
}

export interface Bay {
    id?: number;
    name: string;
    area: number;
    volume: number;
    zone_id: number;
    status: string;
    item_category: number[];
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    warehouseRack: Rack[];
}

export interface Rack {
    id?: number;
    name: string;
    area: number;
    volume: number;
    bay_id: number;
    status: string;
    item_category: number[];
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    warehouseBin: Bin[];
}

export interface Bin {
    id?: number;
    name: string;
    area: number;
    volume: number;
    rack_id: number;
    status: string;
    item_category: number[];
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface BulkStorage {
    zoneType: string;
    zone: string;
    size: number;
    occupied: number;
    vacant: number;
    attributes: {
        brssCapacity: number;
        fragilityFactor: number;
        temperatureControl: number;
        zone_status: number;
        stackingRules: number;
        productCategoryCompatibility: number;
    };
}
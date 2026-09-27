const db = require("../../../models/index");
let fs = require("fs");
const XLSX = require("xlsx");
const ExcelJS = require('exceljs');
const { resStatus } = require("../../../master/reason/controller/reasonController");
const logger = require('../../../../logger/index');

exports.createAssetWarranty = async (req, res) => {
    const {
        entity_id,
        assetTagId,
        invoiceRefNumber,
        warrantyNumber,
        invoiceDate,
        fromDate,
        toDate,
        supplierNameId,
        remarks
    } = req.body;

    try {
        const newWarranty = await db.assetWarranty.create({
            entity_id,
            assetTagId,
            invoiceRefNumber,
            warrantyNumber,
            invoiceDate,
            fromDate,
            toDate,
            supplierNameId,
            remarks
        });

        return res.status(201).json({
            message: 'Asset warranty created successfully!',
            data: newWarranty
        });
    } catch (error) {
        console.error('Error creating asset warranty:', error);
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};


exports.getAssetWarranties = async (req, res) => {
    try {
        const{entity_id}= req.params;
        const warranties = await db.assetWarranty.findAll({
            where:{
                entity_id:entity_id,
                isDeleted:false
            },
            order:[["createdAt","DESC"]]
        });

        const vendorIds = warranties.map(asset => asset.supplierNameId);
        const vendorData = await db.vendor_basic_details.findAll({
            where: {
                id: {
                    [db.Sequelize.Op.in]: vendorIds
                }
            }
        });
        
        const vendorMap = {};
        vendorData.forEach(vendor => {
            vendorMap[vendor.id] = vendor.vendor_name;
        });
        const response = warranties.map(asset => {
            const assetData = asset.get({ plain: true }); 
            return {
                ...assetData, 
                supplierName : vendorMap[asset.supplierNameId ] || null
            };
        });

        const assetTagIds = response.map(tagId =>tagId.assetTagId);
        const assetData = await db.grnItemStatus.findAll({
            where: {
                id: {
                    [db.Sequelize.Op.in]: assetTagIds
                }
            }
        });
        
        const assetDataMap = {};
        assetData.forEach(vendor => {
            assetDataMap[vendor.id] = vendor.asset_tagId;
        });
        const finalResponse = response.map(asset => {
            
            return {
                ...asset, 
                asset_tagId : assetDataMap[asset.assetTagId ] || null
            };
        });

        
        return res.status(200).json({
            message: 'Asset warranties fetched successfully!',
            data: finalResponse
        });
    } catch (error) {
        console.error('Error fetching asset warranties:', error);
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};
exports.getAssetWarrantiesById = async (req, res) => {
    try {
        const { id } = req.params;

        const warranties = await db.assetWarranty.findAll({
            where: {
                id: id,
                isDeleted:false
            }
        });

        if (!warranties || warranties.length === 0) {
            return res.status(404).json({
                message: 'No warranties found for the given ID.'
            });
        }

        const warranty = warranties[0]; 
        const supplierId = warranty.dataValues.supplierNameId;

       
        const vendorData = await db.vendor_basic_details.findOne({
            where: {
                id: supplierId
            }
        });
       if (vendorData) {
            warranty.dataValues.supplierName = vendorData.vendor_name; 
        } else {
            warranty.dataValues.supplierName = null; 
        }

        // const assetTagId = warranty.dataValues.assetTagId; 
        // const assetData = await db.grnItemStatus.findOne({
        //     where: {
        //         id: assetTagId
        //     }
        // });

        // if (assetData) {
        //     warranty.dataValues.assetTagId = assetData.asset_tagId; 
        // } else {
        //     warranty.dataValues.assetTagId = null; 
        // }

        return res.status(200).json({
            message: 'Asset warranties fetched successfully!',
            data: warranty
        });

    } catch (error) {
        console.error('Error fetching asset warranties:', error);
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};


exports.updateAssetWarranty = async (req, res) => {
    const{id} = req.params;
    const {
        assetTagId,
        invoiceRefNumber,
        warrantyNumber,
        invoiceDate,
        fromDate,
        toDate,
        supplierName,
        remarks
    } = req.body;

    try {

        const warrantyRecord = await db.assetWarranty.findOne({
            where: {
                id: id,
                isDeleted:false
            }
        });

        if (!warrantyRecord) {
            return res.status(404).json({
                message: `Warranty record for asset  not found.`
            });
        }

        const updatedWarranty = await warrantyRecord.update({
            assetTagId,
            invoiceRefNumber,
            warrantyNumber,
            invoiceDate,
            fromDate,
            toDate,
            supplierName,
            remarks
        });

        return res.status(200).json({
            message: 'Asset warranty updated successfully!',
            data: updatedWarranty
        });
    } catch (error) {
        console.error('Error updating asset warranty:', error);
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};

exports.deleteAssetWarranty = async (req,res) =>{
    const{id} =req.params;
    try{
    const data = await db.assetWarranty.findOne({
        where:{
            id:id
        }
    })

    if(!data){
      return res.status(404).send({
        message:"Record Not Found"
      })
    }else{
    const deletedData = await db.assetWarranty.update(
        {isDeleted:true},
        {where:{
            id:id
        }
    })
    return res.status(200).send({
        message:"Asset Warranty Deleted Successfully",
        deletedData
    })
}
}catch(error){
    return res.status(500).send({
        message:"Internal Server Error "
    })
}
}


exports.getAssetWarrantiesByIdForAssetView = async (req, res) => {
    try {
        const { assetTagId } = req.params;

        const warranties = await db.assetWarranty.findAll({
            where: {
                assetTagId: assetTagId,
                isDeleted:false
            }
        });

        if (!warranties || warranties.length === 0) {
            return res.status(404).json({
                message: 'No warranties found for the given ID.'
            });
        }
            const vendorIds = warranties.map(asset => asset.supplierNameId);
            const vendorData = await db.vendor_basic_details.findAll({
                where: {
                    id: {
                        [db.Sequelize.Op.in]: vendorIds
                    }
                }
            });
            
            const vendorMap = {};
            vendorData.forEach(vendor => {
                vendorMap[vendor.id] = vendor.vendor_name;
            });
            const response = warranties.map(asset => {
                const assetData = asset.get({ plain: true }); 
                return {
                    ...assetData, 
                    supplierName : vendorMap[asset.supplierNameId ] || null
                };
            });
    
            const assetTagIds = response.map(tagId =>tagId.assetTagId);
            const assetData = await db.grnItemStatus.findAll({
                where: {
                    id: {
                        [db.Sequelize.Op.in]: assetTagIds
                    }
                }
            });
            
            const assetDataMap = {};
            assetData.forEach(vendor => {
                assetDataMap[vendor.id] = vendor.asset_tagId;
            });
            const finalResponse = response.map(asset => {
                
                return {
                    ...asset, 
                    asset_tagId : assetDataMap[asset.assetTagId ] || null
                };
            });
    
            
            return res.status(200).json({
                message: 'Asset warranties fetched successfully!',
                data: finalResponse
            });


    } catch (error) {
        console.error('Error fetching asset warranties:', error);
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};
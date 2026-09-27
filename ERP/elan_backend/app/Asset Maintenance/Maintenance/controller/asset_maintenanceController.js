const db = require("../../../models/index");
const { Op } = require("sequelize");

exports.createAssetMaintenance = async (req, res) => {
  const {
    entity_id,
    isUnderAmc,
    expireAmc,
    asset_tagIds,
    repair_category_id,
    maintenanceBy,
    repairDetails,
    completionDate,
    scheduledDate,
    amount,
    maintenanceStatus,
  } = req.body;

  try {
    const newMaintenance = await db.assetMaintenance.create({
      isUnderAmc,
      expireAmc,
      maintenanceBy,
      repairDetails,
      completionDate,
      scheduledDate,
      amount,
      maintenanceStatus,
      entity_id,
    });

    const maintenanceId = newMaintenance.id;

    if (asset_tagIds && asset_tagIds.length > 0) {
      for (let tagId of asset_tagIds) {
        await db.assetMaintenanceMapping.create({
          asset_tagIds: tagId,
          maintenanceMappingId: maintenanceId,
        });
      }
    }

    if (repair_category_id?.length > 0) {
      for (let repId of repair_category_id) {
        await db.assetMaintenanceRepairCategoryMapping.create({
          repair_category_id: repId,
          asset_maintainance_id: maintenanceId,
        });
      }
    }

    return res.status(201).json({
      message: "Maintenance record created successfully!",
      data: newMaintenance,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllVendorsForMaintenance = async (req, res) => {
  try {
    const { entity_id } = req.params;

    const data = await db.vendor_basic_details.findAll({
      where: {
        entity_id: entity_id,
      },
    });
    return res.status(201).json({
      message: "vendor record ferched successfully!",
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllAssetsForMaintenance = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const datas = await db.grnMaster.findAll({
      // employee_id:employee_id,
      entity_id: entity_id,
    });
    const Ids = datas.map((grn) => grn.grn_Id);
    const grnItems = await db.grnItem.findAll({
      grn_Id: Ids,
    });
    const itemIds = grnItems.map((item) => item.item_id);
    const grnIds = grnItems.map((item) => item.grn_Id);

    const assets = await db.ItemMaster.findAll({
      where: {
        id: itemIds,
        item_type_id: "2",
        isDeleted: false,
        status: "ACTIVE",
        // manage_by:"S.No. Only"
      },
    });

    const assetItemIds = assets.map((asset) => asset.id);
    const selectedAssets = await db.grnItemStatus.findAll({
      attributes: ["id", "asset_tagId", "Item_name", "grn_item_id"],
      where: {
        item_id: assetItemIds,
        itemStatus: "SELECTED",
        asset_tagId: { [db.Sequelize.Op.ne]: null },
      },
      order: [["asset_tagId", "DESC"]],
    });

    //    for (const element1 of selectedAssets) {
    //         const grnItem = grnItems.find(element2 => element2.id === element1.grn_item_id);
    //         if (grnItem) {
    //             const asset = assets.find(element3 => element3.id === grnItem.item_id);
    //             if (asset) {
    //             element1.dataValues.asset_category_id = asset.asset_id;
    //             } else {
    //             element1.dataValues.asset_category_id = null;
    //             }
    //         } else {
    //             element1.dataValues.asset_category_id = null;
    //         }
    //     }

    return res.status(201).json({
      message: "vendor record ferched successfully!",
      data: selectedAssets,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getAllMaintenanceList = async (req, res) => {
  try {
    const { entity_id } = req.params;

    const allAssets = await db.assetMaintenance.findAll({
      include: [
        {
          model: db.assetMaintenanceMapping,
          attributes: ["asset_tagIds"],
          where: { isDeleted: false },
        },
      ],
      where: {
        entity_id: entity_id,
        isDeleted: false,
      },
      order: [["createdAt", "DESC"]],
    });

    if (!allAssets || allAssets.length === 0) {
      return res.status(200).json({ message: "No maintenance records found.", data: [] });
    }

    const vendorIds = allAssets.map((asset) => asset.maintenanceBy);
    const vendorData = await db.vendor_basic_details.findAll({
      where: {
        id: {
          [db.Sequelize.Op.in]: vendorIds,
        },
      },
    });

    const vendorMap = {};
    vendorData.forEach((vendor) => {
      vendorMap[vendor.id] = vendor.vendor_name;
    });

    const response = allAssets.map((asset) => {
      const assetData = asset.get({ plain: true });
      return {
        ...assetData,
        maintenanceBy: vendorMap[asset.maintenanceBy] || null,
        asset_tagIds: asset.ASSETMAINTENANCE_MAPPINGs.map(
          (mapping) => mapping.asset_tagIds,
        ),
      };
    });

    const tagIdCounts = {};
    allAssets.forEach((asset) => {
      asset.ASSETMAINTENANCE_MAPPINGs.forEach((mapping) => {
        const tagId = mapping.asset_tagIds.trim();
        tagIdCounts[tagId] = (tagIdCounts[tagId] || 0) + 1;
      });
    });

    const tagIds = response.flatMap((asset) =>
      asset.asset_tagIds.map((tagId) => tagId.trim()),
    );
    console.log("Extracted and normalized tagIds:", tagIds);

    if (tagIds.length === 0) {
      return res.status(200).json({
        message: "All AssetMaintenance list fetched successfully!",
        data: response,
      });
    }

    const data = await db.grnItemStatus.findAll({
      where: {
        id: {
          [db.Sequelize.Op.in]: tagIds,
        },
      },
    });
    console.log("grnItemStatus data:", data);

    if (data.length === 0) {
      return res.status(200).json({
        message: "All AssetMaintenance list fetched successfully!",
        data: response,
      });
    }

    const assetTagIdsMap = {};
    data.forEach((asset) => {
      assetTagIdsMap[asset.id] = asset.asset_tagId;
    });

    const totalTagIdFrequency = {};

    response.forEach((asset) => {
      asset.asset_tagIds.forEach((tagId) => {
        const cleanedTagId = tagId.trim();
        totalTagIdFrequency[cleanedTagId] =
          (totalTagIdFrequency[cleanedTagId] || 0) + 1;
      });
    });

    const finalResponse = response.map((asset) => {
      const quantity = asset.ASSETMAINTENANCE_MAPPINGs.reduce(
        (sum, mapping) => {
          const tagId = mapping.asset_tagIds.trim();
          return sum + (tagIdCounts[tagId] || 0);
        },
        0,
      );
      const cleanedTagIds = asset.asset_tagIds.map((tagId) => tagId.trim());
      return {
        ...asset,
        asset_tagIds: asset.asset_tagIds.map(
          (tagId) => assetTagIdsMap[tagId] || null,
        ),
        assetQuantity: quantity,
        no_of_assets: cleanedTagIds.length,
        maintenance_asset_count: cleanedTagIds
          .map((tagId) => totalTagIdFrequency[tagId] || 0)
          .join(","),
      };
    });

    return res.status(200).json({
      message: "All AssetMaintenance list fetched successfully!",
      data: finalResponse,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateAssetMaintenance = async (req, res) => {
  const { id } = req.params;
  const {
    asset_tagIds,
    repair_category_id,
    maintenanceBy,
    repairDetails,
    completionDate,
    scheduledDate,
    amount,
    maintenanceStatus,
  } = req.body;

  try {
    const maintenanceRecord = await db.assetMaintenance.findOne({
      where: {
        id: id,
      },
    });

    if (!maintenanceRecord) {
      return res.status(404).json({
        message: `Maintenance record for asset ID ${id} not found.`,
      });
    }

    await db.assetMaintenanceMapping.destroy({
      where: {
        maintenanceMappingId: id,
      },
    });

    await db.assetMaintenanceRepairCategoryMapping.destroy({
      where: {
        asset_maintainance_id: id,
      },
    });

    const updatedMaintenance = await maintenanceRecord.update({
      maintenanceBy,
      repairDetails,
      completionDate,
      scheduledDate,
      amount,
      maintenanceStatus,
    });

    if (asset_tagIds && asset_tagIds.length > 0) {
      for (let tagId of asset_tagIds) {
        await db.assetMaintenanceMapping.create({
          asset_tagIds: tagId,
          maintenanceMappingId: updatedMaintenance.id,
        });
      }
    }
    if (repair_category_id?.length > 0) {
      for (let tagId of repair_category_id) {
        await db.assetMaintenanceRepairCategoryMapping.create({
          repair_category_id: tagId,
          asset_maintainance_id: updatedMaintenance.id,
        });
      }
    }

    return res.status(200).json({
      message: "Maintenance records updated successfully!",
      data: updatedMaintenance,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMaintenanceListById = async (req, res) => {
  try {
    const { id } = req.params;
    const allAssets = await db.assetMaintenance.findOne({
      where: { id: id },
      include: [
        {
          model: db.assetMaintenanceMapping,
          attributes: ["asset_tagIds"],
          where: { isDeleted: false },
          required: false,
        },
        {
          model: db.assetMaintenanceRepairCategoryMapping,
          attributes: ["repair_category_id"],
          where: { isDeleted: false },
          required: false,
        },
      ],
    });

    if (!allAssets) {
      return res.status(404).json({ message: "No maintenance records found." });
    }

    const vendorData = await db.vendor_basic_details.findOne({
      where: {
        id: allAssets.maintenanceBy,
      },
    });

    allAssets.dataValues.maintenanceByName = vendorData
      ? vendorData.vendor_name
      : null;

    return res.status(200).json({
      message: "All AssetMaintenance list fetched successfully!",
      data: allAssets,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMaintenanceListByIdForAssetView = async (req, res) => {
  try {
    const { asset_tagIds } = req.params;

    const allAssets = await db.assetMaintenance.findAll({
      include: [
        {
          model: db.assetMaintenanceMapping,
          attributes: ["asset_tagIds"],
          where: {
            isDeleted: false,
            asset_tagIds: asset_tagIds,
          },
        },
      ],
    });

    if (!allAssets) {
      return res.status(404).json({ message: "No maintenance records found." });
    }
    const vendorIds = allAssets.map((asset) => asset.maintenanceBy);
    const vendorData = await db.vendor_basic_details.findAll({
      where: {
        id: {
          [db.Sequelize.Op.in]: vendorIds,
        },
      },
    });

    const vendorMap = {};
    vendorData.forEach((vendor) => {
      vendorMap[vendor.id] = vendor.vendor_name;
    });

    const response = allAssets.map((asset) => {
      const assetData = asset.get({ plain: true });
      return {
        ...assetData,
        maintenanceBy: vendorMap[asset.maintenanceBy] || null,
        asset_tagIds: asset.ASSETMAINTENANCE_MAPPINGs.map(
          (mapping) => mapping.asset_tagIds,
        ),
      };
    });
    const tagIds = response.flatMap((asset) =>
      asset.asset_tagIds.map((tagId) => tagId.trim()),
    );
    console.log("Extracted tagIds:", tagIds);

    if (tagIds.length === 0) {
      return res.status(404).json({ message: "No asset_tagIds found." });
    }

    const data = await db.grnItemStatus.findAll({
      where: {
        id: {
          [db.Sequelize.Op.in]: tagIds,
        },
      },
    });
    console.log("grnItemStatus data:", data);

    if (data.length === 0) {
      return res.status(404).json({
        message: "No grnItemStatus records found for the given asset_tagIds.",
      });
    }
    const assetTagIdsMap = {};
    data.forEach((asset) => {
      assetTagIdsMap[asset.id] = asset.asset_tagId;
    });
    const finalResponse = response.map((asset) => ({
      ...asset,
      asset_tagIds: asset.asset_tagIds.map(
        (tagId) => assetTagIdsMap[tagId] || null,
      ),
    }));

    return res.status(200).json({
      message: "All AssetMaintenance list fetched successfully!",
      data: finalResponse,
    });
  } catch (error) {
    console.error("Error in getMaintenanceListByIdForAssetView:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createAssetCategory = async (req, res) => {
  const { entity_id, asset_category, repair_categories } = req.body;

  try {
    const repairCategory = repair_categories.map((element) => ({
      entity_id: entity_id,
      aaset_category_id: asset_category,
      remarks: element.remarks,
      repair_category_name: element.repair_category_name,
    }));

    await db.repairCategory.bulkCreate(repairCategory);

    return res
      .status(201)
      .send({ message: "Asset category created successfully!" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateAssetCategory = async (req, res) => {
  const { id } = req.params;
  const { entity_id, asset_category, repair_categories } = req.body;

  try {
    const categoryRecord = await db.repairCategory.findAll({
      where: {
        aaset_category_id: id,
      },
    });

    if (!categoryRecord) {
      return res.status(404).send({
        message: `Repair Category doesn't exist.`,
      });
    }
    await db.repairCategory.update(
      { isDeleted: true },
      { where: { aaset_category_id: id } },
    );

    const newRecords = repair_categories.map((item) => ({
      entity_id,
      aaset_category_id: asset_category,
      repair_category_name: item.repair_category_name,
      remarks: item.remarks,
    }));

    await db.repairCategory.bulkCreate(newRecords);

    return res.status(200).send({
      message: "Repair Category updated successfully!",
    });
  } catch (error) {
    return res
      .status(500)
      .send({ error: error.message || "Internal Server Error" });
  }
};

exports.getAllAssetCategory = async (req, res) => {
  const { entity_id } = req.params;

  try {
    const [categoryRecord] = await db.sequelize.query(`
        SELECT MA.asset_category_name, ARC.id, ARC.aaset_category_id, ARC.repair_category_name, ARC.remarks FROM ASSET_REPAIR_CATEGORY AS ARC LEFT JOIN MASTER_ASSET AS MA ON ARC.aaset_category_id = MA.id
        WHERE ARC.entity_id = ${entity_id} AND ARC.isDeleted = 'false' GROUP BY ARC.aaset_category_id ORDER BY ARC.createdAt DESC
    `);

    if (!categoryRecord || categoryRecord.length === 0) {
      return res.status(404).send({
        message: "No Repair Categories found.",
      });
    }

    return res.status(200).send({
      message: "Repair categories fetched successfully.",
      data: categoryRecord,
    });
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getAssetCategoryById = async (req, res) => {
  const { category_id } = req.params;

  try {
    const categoryRecord = await db.repairCategory.findAll({
      where: { aaset_category_id: category_id, isDeleted: false },
    });

    if (!categoryRecord) {
      return res.status(404).send({
        message: "No Repair Category found.",
      });
    }

    return res.status(200).send({
      message: "Repair category fetched successfully.",
      data: categoryRecord,
    });
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.changeRepairCategoryStatus = async (req, res) => {
  const { id, isDeleted } = req.body;
  try {
    if (id) {
      const response = await db.repairCategory.update(
        {
          isDeleted: isDeleted,
        },
        {
          where: {
            aaset_category_id: id,
          },
        },
      );

      return res
        .status(200)
        .send({ code: 200, message: "Deleted successfully", data: response });
    } else {
      return res
        .status(201)
        .send({ code: 200, message: "category  not exist!" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getRepairCategoryByAssetCat = async (req, res) => {
  try {
    const grnstatusIds = Object.values(req.body);

    if (!grnstatusIds || grnstatusIds.length === 0) {
      return res.status(400).send({ message: "No GRN status IDs provided." });
    }

    const grnStatusRecords = await db.grnItemStatus.findAll({
      where: {
        id: {
          [Op.in]: grnstatusIds,
        },
      },
      attributes: ["grn_item_id"],
    });

    const grnItemIds = grnStatusRecords.map((record) => record.grn_item_id);

    if (grnItemIds.length === 0) {
      return res
        .status(404)
        .send({ message: "No GRN Items found for provided status IDs." });
    }

    const grnItems = await db.grnItem.findAll({
      where: {
        id: {
          [Op.in]: grnItemIds,
        },
      },
      attributes: ["item_id"],
    });

    const itemIds = grnItems.map((item) => item.item_id);

    if (itemIds.length === 0) {
      return res
        .status(404)
        .send({ message: "No Items found for provided GRN Items." });
    }

    const itemRecords = await db.ItemMaster.findAll({
      where: {
        id: {
          [Op.in]: itemIds,
        },
      },
      attributes: ["asset_id"],
    });

    const assetCategoryIds = itemRecords.map((item) => item.asset_id);

    if (assetCategoryIds.length === 0) {
      return res
        .status(404)
        .send({ message: "No Asset Categories found for Items." });
    }
    const repairCategories = await db.repairCategory.findAll({
      where: {
        aaset_category_id: {
          [Op.in]: assetCategoryIds,
        },
        isDeleted: false,
      },
      attributes: ["id", "repair_category_name", "aaset_category_id"],
    });

    if (!repairCategories || repairCategories.length === 0) {
      return res.status(404).send({
        message: "No matching Repair Categories found.",
      });
    }

    return res.status(200).send({
      message: "Repair Categories fetched successfully.",
      data: repairCategories,
    });
  } catch (error) {
    console.error("Error fetching Repair Categories:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

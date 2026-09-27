const db = require("../../../models/index");
const Sequelize = require("sequelize");
const itemSpecifications = db.itemSpecification;
const MASTER_ITEM = db.ItemMaster;
const asset = db.asset;
const MASTER_UOM = db.uom;
const { Op } = require("sequelize");
const logger = require("../../../../logger/index");
const fs = require("fs");
const path = require("path");

let getPagination = async function (page, pageSize) {
  // If either page or pageSize is missing/null/undefined, return null to skip pagination
  if (!page || isNaN(page) || !pageSize || isNaN(pageSize)) {
    return null;
  }

  page = parseInt(page, 10);
  pageSize = parseInt(pageSize, 10);
  const offset = (page - 1) * pageSize;

  return { offset, pageSize };
};

exports.createItem = async (req, res) => {
  try {
    let {
      item_type_id,
      asset_id,
      item_name,
      uom_id,
      hsn_code_id,
      manage_by,
      // minimum_level,
      // maximum_level,
      // cgst,
      // sgst,
      // igst,
      MVP,
      MRP,
      // usage_details,
      // customerDetail,
      entity_id,
      financial_year_id,
      // Bar_QR_Code,
      item_code,
      description,
      // Item_Print_Name,
      // Color,
      // Elanpro_Item_Code,
      // Factory_Item_Code,
      Variant,
      sub_category_id,
      Item_length_before,
      Item_width_before,
      Item_height_before,
      // Item_volume_before,
      external_length_after,
      external_width_after,
      external_height_after,
      external_volume_after,
      item_weight,
      // volumetric_weight_air_domestic,
      // volumetric_weight_air_international,
      // volumetric_weight_by_sea,
      // volumetric_weight_by_road,
      // volumetric_space,
      // default_lead_time_for_sales,
      // default_lead_time_for_purchase,
      // auto_requisition_on_level,
      warranty_applicable,
      warranty_period,
      // item_group_id,
      // maximum_discount,
    } = req.body;

    // cgst = cgst ? parseFloat(cgst) : null;
    // sgst = sgst ? parseFloat(sgst) : null;
    // igst = igst ? parseFloat(igst) : null;
    let images = req.files;
    // console.log('imagefiles======', images)

    const imagePaths = images.map((image) => {
      return path.normalize(image.path).replace(/\\/g, "/");
    });

    const existingItem = await MASTER_ITEM.findOne({
      where: {
        [db.Sequelize.Op.and]: [
          { item_name },
          { asset_id },
          { isDeleted: false },
        ],
      },
    });
    // const designation = await db.product_master.findOne({ where: { product_name: item_name } });
    // Color = Color.split(",");
    if (existingItem) {
      return res
        .status(403)
        .send({ code: 403, message: "Item Already Exists" });
    } else if (existingItem) {
      if (existingItem.status === "INACTIVE") {
        await existingItem.update(
          { status: "ACTIVE" },
          { where: { id: existingItem.id } },
        );
        return res.status(200).send({
          code: 200,
          message: "Item Updated Successfully",
          data: existingItem,
        });
      } else {
        return res
          .status(403)
          .send({ code: 403, message: "Item Already Exists!" });
      }
    } else {
      const response = await MASTER_ITEM.create({
        item_name,
        item_type_id,
        asset_id,
        hsn_code_id,
        item_code,
        uom_id,
        manage_by,
        // minimum_level,
        // maximum_level,
        // cgst,
        // sgst,
        // igst,
        MVP,
        MRP,
        // usage_details,
        entity_id,
        financial_year_id,
        // Bar_QR_Code,
        description,
        // Item_Print_Name,
        // Color,
        // Elanpro_Item_Code,
        // Factory_Item_Code,
        Variant: Variant == "null" ? null : Variant,
        sub_category_id,
        Item_length_before:
          typeof Item_length_before == "string" ? null : Item_length_before,
        Item_width_before:
          typeof Item_width_before == "string" ? null : Item_width_before,
        Item_height_before:
          typeof Item_height_before == "string" ? null : Item_height_before,
        // Item_volume_before,
        external_length_after:
          typeof external_length_after == "string"
            ? null
            : external_length_after,
        external_width_after:
          typeof external_width_after == "string" ? null : external_width_after,
        external_height_after:
          typeof external_height_after == "string"
            ? null
            : external_height_after,
        external_volume_after:
          typeof external_volume_after == "string"
            ? null
            : external_volume_after,
        item_weight: typeof item_weight == "string" ? null : item_weight,
        // volumetric_weight_air_domestic,
        // volumetric_weight_air_international,
        // volumetric_weight_by_sea,
        // volumetric_weight_by_road,
        // volumetric_space,
        // default_lead_time_for_sales,
        // default_lead_time_for_purchase,
        // auto_requisition_on_level,
        warranty_applicable:
          warranty_applicable == "null" ? null : warranty_applicable,
        warranty_period: warranty_period == "null" ? null : warranty_period,
        // item_group_id,
        // maximum_discount,
      });
      const imagePromises = imagePaths.map((imagePath) => {
        return db.imageDocument.create({
          image: imagePath,
          item_id: response.id,
        });
      });
      return res.status(200).send({
        code: 200,
        message: "Item Created Successfully",
        data: response,
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error("Error:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.updateItemMaster = async (req, res) => {
  try {
    const Item_id = req.params.id;
    let {
      item_type_id,
      asset_id,
      item_name,
      item_code,
      uom_id,
      hsn_code_id,
      manage_by,
      // minimum_level,
      // maximum_level,
      // cgst,
      // sgst,
      // igst,
      MVP,
      MRP,
      // usage_details,
      //customerDetail,
      // entity_id,
      // financial_year_id,
      description,
      // Item_Print_Name,
      // Color,
      // Elanpro_Item_Code,
      // Factory_Item_Code,
      Variant,
      sub_category_id,
      Item_length_before,
      // item_group_id,
      Item_width_before,
      Item_height_before,
      // Item_volume_before,
      external_length_after,
      external_width_after,
      external_height_after,
      external_volume_after,
      item_weight,
      // volumetric_weight_air_domestic,
      // volumetric_weight_air_international,
      // volumetric_weight_by_sea,
      // volumetric_weight_by_road,
      // volumetric_space,
      // default_lead_time_for_sales,
      // default_lead_time_for_purchase,
      // auto_requisition_on_level,
      warranty_applicable,
      warranty_period,
      // maximum_discount,
    } = req.body;
    // cgst = cgst ? parseFloat(cgst) : null;
    // sgst = sgst ? parseFloat(sgst) : null;
    // igst = igst ? parseFloat(igst) : null;

    const existingItem = await MASTER_ITEM.findOne({
      where: { id: Item_id },
      include: [
        {
          model: db.imageDocument,
          attributes: ["image", "id"],
        },
      ],
    });

    if (!existingItem) {
      return res.status(404).send({ code: 404, message: "Data not found" });
    }

    const duplicateItem = await MASTER_ITEM.findOne({
      where: {
        item_name: item_name,
        asset_id: asset_id,
        id: { [Op.ne]: Item_id },
        isDeleted: 0,
      },
    });
    if (duplicateItem) {
      return res
        .status(400)
        .send({ code: 400, message: "Item name already exists" });
    } else if (duplicateItem) {
      if (duplicateItem.status === "INACTIVE") {
        await duplicateItem.update(
          { status: "ACTIVE" },
          { where: { id: duplicateItem.id } },
        );
        return res.status(200).send({
          code: 200,
          message: "Item Updated Successfully",
          data: duplicateItem,
        });
      } else {
        return res
          .status(403)
          .send({ code: 403, message: "Item Already Exists!" });
      }
    } else {
      const response = await MASTER_ITEM.update(
        {
          item_type_id,
          asset_id,
          item_name,
          item_code,
          hsn_code_id,
          uom_id,
          manage_by,
          // minimum_level,
          // maximum_level,
          // entity_id,
          // financial_year_id,
          // cgst,
          // sgst,
          // igst,
          MVP,
          MRP,
          // usage_details,
          // item_code,
          description,
          // Item_Print_Name,
          // item_group_id,
          // Color,
          // Elanpro_Item_Code,
          // Factory_Item_Code,
          Variant,
          sub_category_id,
          Item_length_before,
          Item_width_before,
          Item_height_before,
          external_length_after,
          external_width_after,
          external_height_after,
          external_volume_after,
          item_weight,
          // volumetric_weight_air_domestic,
          // volumetric_weight_air_international,
          // volumetric_weight_by_sea,
          // volumetric_weight_by_road,
          // volumetric_space,
          // default_lead_time_for_sales,
          // default_lead_time_for_purchase,
          // auto_requisition_on_level,
          warranty_applicable,
          warranty_period,
          // maximum_discount,
        },
        {
          where: { id: Item_id },
        },
      );
      let imagePaths = [];
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          const imagePath = file.path.replace(/\\/g, "/");
          imagePaths.push(imagePath);

          const existingImages =
            existingItem.MASTER_ITEM_IMAGE_DOCUMENTs ||
            existingItem.MASTER_ITEM_IMAGE_DOCUMENT ||
            existingItem.item_document ||
            [];
          existingImages.forEach((imageDoc) => {
            const oldImagePath = path.join(
              __dirname,
              "../../../",
              imageDoc.image,
            );
            if (fs.existsSync(oldImagePath)) {
              fs.unlink(oldImagePath, (err) => {
                if (err)
                  console.error(`Failed to remove image: ${oldImagePath}`, err);
              });
            }
          });
        });
      }

      if (imagePaths.length === 0) {
        const existingImages =
          existingItem.MASTER_ITEM_IMAGE_DOCUMENTs ||
          existingItem.MASTER_ITEM_IMAGE_DOCUMENT ||
          existingItem.item_document ||
          [];
        imagePaths = existingImages.map((imageDoc) => imageDoc.image);
      }
      await db.imageDocument.destroy({
        where: { item_id: Item_id },
      });

      const imageDocs = imagePaths.map((imagePath) => ({
        item_id: Item_id,
        image: imagePath,

        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await db.imageDocument.bulkCreate(imageDocs);

      return res.status(200).send({
        code: 200,
        message: "Item Updated Successfully",
        data: response,
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error("Error:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.getAllItemMasterList = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search } = req.body;
    const pagination = await getPagination(page, pageSize);
    let keyword;
    // Create base where condition
    let rawWhere = "MI.isDeleted = 0";
    // Add search filter
    if (search !== undefined && search !== null) {
      keyword = `%${search.trim()}%`;
      rawWhere = `MI.isDeleted = 0 AND MI.item_name LIKE '%${keyword}%'`;
    }

    const [items] = await db.sequelize.query(`
  SELECT 
      MI.*,
      UOM.uom_name,
      MA.asset_category_name,
      MSC.sub_category_name,
      HSN.hsn_sac_code,
      GST.value as gstRate
  FROM MASTER_ITEM MI
  LEFT JOIN MASTER_ASSET MA ON MA.id = MI.asset_id
  LEFT JOIN MASTER_SUB_CATEGORY MSC ON MSC.id = MI.sub_category_id
  LEFT JOIN MASTER_UOM UOM ON UOM.uom_id = MI.uom_id
  LEFT JOIN MASTER_HSN_SAC_CODE HSN ON HSN.id = MI.hsn_code_id 
  LEFT JOIN GST_RATE_MASTER GST ON GST.id = HSN.gst_rate_id 
  WHERE ${rawWhere} AND MI.item_type_id = 1 OR MI.item_type_id = 2
  ORDER BY id DESC
  LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
`);

    const [[countResult]] = await db.sequelize.query(`
  SELECT COUNT(*) AS total
  
  FROM MASTER_ITEM MI
  LEFT JOIN MASTER_ASSET MA ON MA.id = MI.asset_id
  LEFT JOIN MASTER_SUB_CATEGORY MSC ON MSC.id = MI.sub_category_id
  LEFT JOIN MASTER_HSN_SAC_CODE HSN ON HSN.id = MI.hsn_code_id 
  WHERE ${rawWhere} AND MI.item_type_id = 1
`);

    if (items.length > 0) {
      const response = {
        code: 200,
        message: "Get All Item data successfully",
        data: items,
      };

      if (pagination) {
        response.pagination = {
          totalItems: countResult,
          currentPage: parseInt(page) || 1,
          pageSize: pagination.pageSize,
          totalPages: Math.ceil(countResult / pagination.pageSize),
        };
      }

      return res.status(200).send(response);
    } else {
      return res.status(201).send({
        code: 201,
        message: "No Item found",
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.getAllItem = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search } = req.body;
    const pagination = await getPagination(page, pageSize);
    let keyword;
    // Create base where condition
    let whereCondition = { isDeleted: false };
    // Add search filter
    if (search !== undefined && search !== null) {
      keyword = `%${search.trim()}%`;
      whereCondition = {
        ...whereCondition,
        [Op.or]: [
          { item_name: { [Op.like]: keyword } }, // if item_name exists
        ],
      };
    }

    // Query options
    const queryOptions = {
      where: whereCondition,
      include: [
        { model: asset },
        {
          model: db.uom,
          attributes: ["uom_name"],
        },
        { model: db.imageDocument },
        { model: db.SubCategory },
        {
          model: db.hsn_sac_master,
          attributes: {
            include: [
              // 👇 Subquery to inject gst_rate directly
              [
                db.Sequelize.literal(`(
              SELECT value 
              FROM GST_RATE_MASTER AS gr
              WHERE gr.id = MASTER_HSN_SAC_CODE.gst_rate_id
            )`),
                "gst_value",
              ],
            ],
          },
        },
      ],
      order: [["id", "DESC"]],
      attributes: {
        include: [["warranty_period", "warranty"]],
      },
    };

    // Add offset and limit only if pagination is defined
    if (pagination) {
      queryOptions.offset = pagination.offset;
      queryOptions.limit = pagination.pageSize;
    }

    const { count, rows: items } =
      await db.ItemMaster.findAndCountAll(queryOptions);

    if (items.length > 0) {
      const response = {
        code: 200,
        message: "Get All Item data successfully",
        data: items,
      };

      if (pagination) {
        response.pagination = {
          totalItems: count,
          currentPage: parseInt(page) || 1,
          pageSize: pagination.pageSize,
          totalPages: Math.ceil(count / pagination.pageSize),
        };
      }

      return res.status(200).send(response);
    } else {
      return res.status(201).send({
        code: 201,
        message: "No Item found",
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.getAllActiveItem = async (req, res) => {
  try {
    const items = await db.ItemMaster.findAll({
      where: { isDeleted: false, status: "ACTIVE" },
      include: [
        { model: asset },
        {
          model: db.uom,
          attributes: ["uom_name"],
        },
        { model: db.imageDocument },
      ],
    });

    if (items.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get All Item data successfully",
        data: items,
      });
    } else {
      return res.status(201).send({
        code: 201,
        message: "No Item found",
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.getAllItemByAsset = async (req, res) => {
  try {
    const serviceData = await MASTER_ITEM.findAll({
      where: {
        isDeleted: false,
        asset_id: req.params.id,
      },
      include: [
        {
          model: asset,
        },
        {
          model: MASTER_UOM,
        },
        {
          model: itemSpecifications,
          where: { isDeleted: false },
        },
      ],
      order: [["id", "DESC"]],
    });
    if (serviceData) {
      return res.status(200).send({
        code: 200,
        message: "Get All Item data successfully",
        data: serviceData,
      });
    } else {
      return res.status(404).send({ code: 404, message: "No Item found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error, "Error");
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

// exports.getItemsBySubCategory = async (req, res) => {
//     try {
//         let { asset_id, sub_category_id } = req.params;
//         const serviceData = await db.ItemMaster.findAll({
//             where: {
//                 isDeleted: false,
//                 status: 'ACTIVE',
//                 asset_id: asset_id,
//                 sub_category_id: sub_category_id,
//             },
//             include: [
//                 {
//                     model: db.hsn_sac_master,
//                 },
//                 {
//                     model: MASTER_UOM,
//                 },

//                 // {
//                 //     model: itemSpecifications,
//                 //     where: { isDeleted: false }
//                 // }
//             ],
//             order: [['id', 'DESC']],
//         });
//         if (serviceData.length > 0) {
//             return res.status(200).send({ code: 200, message: "Get All Item data successfully", data: serviceData });
//         } else {
//             return res.status(201).send({ code: 201, message: "Item not found" });
//         }
//     } catch (error) {
//         logger.error(`Error ${error.message}`, { error });
//         console.log(error, "Error");
//         return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
//     }
// }

exports.getItemsBySubCategory = async (req, res) => {
  try {
    let { asset_id, sub_category_id, customer_id } = req.params;

    const items = await db.sequelize.query(
      `
            SELECT 
                im.*,
                IIMG.image,
                hsm.id AS hsn_id,
                hsm.code_type AS hsn_code_type,
                hsm.hsn_sac_code,
                hsm.description AS hsn_description,
                hsm.exemption AS hsn_exemption,
                hsm.status AS hsn_status,
                hsm.isDeleted AS hsn_isDeleted,
                hsm.createdAt AS hsn_createdAt,
                hsm.updatedAt AS hsn_updatedAt,
                hsm.gst_rate_id AS hsn_gst_rate_id,
                hsm.entity_id AS hsn_entity_id,
                grm.value AS hsn_gst_value,
                im.warranty_period as warranty,

                mu.uom_id AS mu_id,
                mu.uom_name,
                mu.uom_description,
                mu.status AS mu_status,
                mu.isDeleted AS mu_isDeleted,
                mu.createdAt AS mu_createdAt,
                mu.updatedAt AS mu_updatedAt

            FROM MASTER_ITEM im
            LEFT JOIN MASTER_HSN_SAC_CODE hsm ON hsm.id = im.hsn_code_id
            LEFT JOIN GST_RATE_MASTER grm ON grm.id = hsm.gst_rate_id
            LEFT JOIN MASTER_UOM mu ON mu.uom_id = im.uom_id
            LEFT JOIN MASTER_ITEM_IMAGE_DOCUMENT AS IIMG
            ON im.id=IIMG.item_id
            WHERE im.isDeleted = false
              AND im.status = 'ACTIVE'
              AND im.asset_id = :asset_id
              AND im.sub_category_id = :sub_category_id

            ORDER BY im.id DESC
            `,
      {
        replacements: { asset_id, sub_category_id, customer_id },
        type: db.Sequelize.QueryTypes.SELECT,
      },
    );

    // Restructure results to nest MASTER_HSN_SAC_CODE and MASTER_UOM
    const formatted = items.map((item) => {
      const {
        hsn_id,
        hsn_code_type,
        hsn_sac_code,
        hsn_description,
        hsn_exemption,
        hsn_status,
        hsn_isDeleted,
        hsn_createdAt,
        hsn_updatedAt,
        hsn_gst_rate_id,
        hsn_entity_id,
        hsn_gst_value,
        hsn_DBP,
        discount_1 = 0,
        discount_2 = 0,
        discount_3 = 0,
        discount1Flat = 0,
        discount2Flat = 0,
        discount3Flat = 0,

        customer_price_mapstatus = false,

        mu_id,
        uom_name,
        uom_description,
        mu_status,
        mu_isDeleted,
        mu_createdAt,
        mu_updatedAt,

        ...mainItem
      } = item;

      return {
        ...mainItem,
        discount_1,
        discount_2,
        discount_3,
        discount1Flat,
        discount2Flat,
        discount3Flat,
        customer_price_mapstatus,

        MASTER_HSN_SAC_CODE: hsn_id
          ? {
              id: hsn_id,
              code_type: hsn_code_type,
              hsn_sac_code,
              description: hsn_description,
              exemption: hsn_exemption,
              status: hsn_status,
              isDeleted: hsn_isDeleted,
              createdAt: hsn_createdAt,
              updatedAt: hsn_updatedAt,
              gst_rate_id: hsn_gst_rate_id,
              gst_value: hsn_gst_value,
              entity_id: hsn_entity_id,
            }
          : null,
        MASTER_UOM: mu_id
          ? {
              uom_id: mu_id,
              uom_name,
              uom_description,
              status: mu_status,
              isDeleted: mu_isDeleted,
              createdAt: mu_createdAt,
              updatedAt: mu_updatedAt,
            }
          : null,
      };
    });

    if (formatted.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get All Item data successfully",
        data: formatted,
      });
    } else {
      return res.status(201).send({
        code: 201,
        message: "Item not found",
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error, "Error");
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.getItemsPriceBySubCategory = async (req, res) => {
  try {
    let { asset_id, sub_category_id, item_id, customer_id, version_id } =
      req.query;

    // ✅ First query - check mapped prices
    let items = await db.sequelize.query(
      `
            SELECT 
                mp.id AS price_master_id,
                mp.customer_id,
                mp.category_id,
                mp.subcategory_id,
                mip.id AS item_price_id,
                mip.item_id,
                mi.MRP,
                mi.MVP,
                mip.final_price AS DBP,
                mip.discount_1,
                mip.discount_2, 
                mip.discount_3,
                COALESCE(NULLIF(CP.discount1Flat, 0), mip.discount1Flat) AS discount1Flat,
                COALESCE(NULLIF(CP.discount2Flat, 0), mip.discount2Flat) AS discount2Flat,
                COALESCE(NULLIF(CP.discount3Flat, 0), mip.discount3Flat) AS discount3Flat,
                mi.warranty_period AS warranty,
                mip.status
            FROM MASTER_PRICE mp
            LEFT JOIN MASTER_ITEM_PRICE AS mip 
                ON mip.price_master_id = mp.id AND mip.item_id = :item_id
            LEFT JOIN MASTER_ITEM mi ON mi.id = :item_id
            LEFT JOIN CRM_PROPOSAL_LIST_MST AS CP ON CP.product_master_id=mi.id AND CP.version_id = :version_id
            WHERE mp.customer_id = :customer_id
                AND mip.item_id = :item_id
                AND mip.isDeleted = false
                AND mip.status = 'ACTIVE'
            ORDER BY mip.id DESC
            `,
      {
        replacements: { item_id, customer_id, version_id },
        type: db.Sequelize.QueryTypes.SELECT,
      },
    );

    // ✅ Second query - fallback master item (if no mapping found)
    let items_mst = await db.sequelize.query(
      `
            SELECT 
                mi.id AS item_id,
                mi.item_name,
                mi.item_code,
                mi.MRP,
                mi.MVP,
                COALESCE(NULLIF(CP.discount1Flat, 0), 0) AS discount1Flat,
                COALESCE(NULLIF(CP.discount2Flat, 0), 0) AS discount2Flat,
                COALESCE(NULLIF(CP.discount3Flat, 0), 0) AS discount3Flat,
                mi.warranty_period AS warranty
            FROM MASTER_ITEM mi
            LEFT JOIN CRM_PROPOSAL_LIST_MST AS CP ON CP.product_master_id=mi.id AND CP.version_id = :version_id
            WHERE mi.id = :item_id
                AND mi.isDeleted = false
                AND mi.status = 'ACTIVE'
            `,
      {
        replacements: { item_id, version_id },
        type: db.Sequelize.QueryTypes.SELECT,
      },
    );

    // ✅ Response handling
    if (items.length > 0) {
      items = items.map((row) => ({
        ...row,
        customer_price_mapstatus: true,
      }));
      return res.status(200).send({
        code: 200,
        message: "Get All Item data successfully",
        data: items[0],
      });
    } else if (items_mst.length > 0) {
      items_mst = items_mst.map((row) => ({
        ...row,
        subCategory_id: sub_category_id,
        customer_price_mapstatus: false,
        discount_1: 0, // ✅ static values
        discount_2: 0,
        discount_3: 0,
        // discount1Flat: 0,
        // discount2Flat: 0,
        // discount3Flat: 0,
        category_id: asset_id,
        DBP: items_mst[0].MRP,
      }));
      return res.status(200).send({
        code: 200,
        message: "Get All Item data successfully (fallback master item)",
        data: items_mst[0],
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "Item not found",
        customer_price_mapstatus: false,
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error, "Error");
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.getSubCategory = async (req, res) => {
  try {
    const serviceData = await db.productSubCategory.findAll({
      where: {
        isDeleted: false,
        product_category_id: req.params.id,
      },

      order: [["id", "DESC"]],
    });
    if (serviceData) {
      return res.status(200).send({
        code: 200,
        message: "Get All Item data successfully",
        data: serviceData,
      });
    } else {
      return res.status(404).send({ code: 404, message: "No Item found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error, "Error");
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item_id = req.params.id;
    const serviceData = await MASTER_ITEM.findOne({
      where: {
        id: item_id,
        isDeleted: false,
      },
      include: [
        {
          model: asset,
        },
        {
          model: MASTER_UOM,
        },
        {
          model: itemSpecifications,
          where: { isDeleted: false },
          required: false,
        },
        { model: db.imageDocument },
      ],
    });
    if (serviceData) {
      // const customerTypeData = await db.sequelize.query(
      //     `SELECT
      //         ctm.id,
      //         ctm.customer_type_name,
      //         ctm.lavel,
      //         itcm.amount
      //      FROM
      //         CUSTOMER_TYPE_MASTER ctm
      //      LEFT JOIN
      //         ITEM_CUSTOMER_TYPE_MST itcm ON ctm.id = itcm.customer_type_id
      //      WHERE
      //         itcm.item_id = :item_id AND
      //         itcm.isDeleted = false`,
      //     {
      //         replacements: { item_id },
      //         type: db.Sequelize.QueryTypes.SELECT
      //     }
      // );
      // serviceData.dataValues.customerTypeData = customerTypeData;

      return res.status(200).send({
        code: 200,
        message: "Get Item data successfully",
        data: serviceData,
      });
    } else {
      return res.status(404).send({ code: 404, message: "No Item found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error, "Error");
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.deleteItemMaster = async (req, res) => {
  try {
    const id = req.params.id;
    const getAllData = await MASTER_ITEM.findOne({ where: { id: id } });
    // const getAllDataproduct = await db.product_master.findOne({ where: { id: id } });
    if (getAllData) {
      await MASTER_ITEM.update({ isDeleted: true }, { where: { id: id } });
      // await db.product_master.update({ isDeleted: true, status: "INACTIVE" }, { where: { id: id } });
      await db.ItemMasterCustomerType.update(
        { isDeleted: true },
        { where: { item_id: id } },
      );
      return res.status(200).send({
        code: 200,
        message: "Item and its associated data are deleted successfully!",
      });
    } else {
      return res.status(404).send({ code: 404, message: "Data not found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error("Error:", error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

exports.updateItemStatus = async (req, res) => {
  try {
    const Item_id = req.params.itemId;
    const { status } = req.body;
    const editData = await MASTER_ITEM.findOne({ where: { id: Item_id } });
    if (editData) {
      const updateData = await MASTER_ITEM.update(
        {
          status,
        },
        { where: { id: Item_id } },
      );
      return res.status(200).send({
        code: 200,
        message: "Status Updated Successfully",
        data: updateData,
      });
    } else {
      return res.status(400).send({ code: 400, message: "Record Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.getItemType = async (req, res) => {
  try {
    const itemTypes = await db.tbl_itemType.findAll({
      where: {
        status: "ACTIVE",
        isDeleted: false,
      },
    });
    return res.status(200).send({
      code: 200,
      message: "Item types fetched successfully",
      data: itemTypes,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.getSFGItem = async (req, res) => {
  try {
    const entity_id = req.params.entity_id;
    const getData = await db.ItemMaster.findAll({
      where: { item_type_id: "3", entity_id, isDeleted: false },
      attributes: ["id", "item_name", "item_code", "description"],
      include: [
        {
          model: db.tbl_itemType,
          attributes: ["id", "itemType"],
        },
      ],
    });

    if (getData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Data retrieved successfully",
        data: getData,
      });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "Data Not Found", data: getData });
    }
  } catch (error) {
    console.error("Error fetching item category by item type:", error); // Logging the error for debugging
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getItemCategoryByItemType = async (req, res) => {
  try {
    const item_type = req.params.item_type;
    if (!item_type) {
      return res
        .status(400)
        .send({ code: 400, message: "Item type is required" });
    }
    const distinctAssetIds = await db.sequelize.query(
      `SELECT DISTINCT asset_id FROM MASTER_ITEM WHERE item_type_id = :item_type AND isDeleted = false`,
      {
        replacements: { item_type },
        type: db.Sequelize.QueryTypes.SELECT,
      },
    );
    const assetIds = distinctAssetIds.map((record) => record.asset_id);
    if (assetIds.length === 0) {
      return res.status(404).send({ code: 404, message: "Record not found" });
    }
    const getData = await db.asset.findAll({
      where: { id: assetIds },
      attributes: ["id", "asset_category_name", "asset_category_code"],
    });
    return res.status(200).send({
      code: 200,
      message: "Data retrieved successfully",
      data: getData,
    });
  } catch (error) {
    console.error("Error fetching item category by item type:", error); // Logging the error for debugging
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

/////////////////////////////////////////// item group master ///////////////////////////

exports.createItemgroup = async (req, res) => {
  try {
    let { Item_group, Item_group_code, entity_id, financial_year_id } =
      req.body;
    const getItemGroup = await db.ItemGroup.findOne({
      where: { Item_group: Item_group, isDeleted: false, status: "ACTIVE" },
    });
    if (getItemGroup) {
      return res
        .status(400)
        .send({ code: 400, message: "Item Group Already Exist" });
    }
    const createData = await db.ItemGroup.create({
      Item_group,
      Item_group_code,
      entity_id,
      financial_year_id,
    });
    // await db.ProductGroup.create({
    //     id: createData.id,
    //     product_group: createData.Item_group,
    //     product_group_code: createData.Item_group_code,
    //     entity_id: createData.entity_id, financial_year_id: createData.financial_year_id
    // })

    return res.status(200).json({
      code: 200,
      message: "Item group Master Successfully",
      data: createData,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getAllItemgroup = async (req, res) => {
  try {
    const items = await db.ItemGroup.findAll({
      where: { isDeleted: false },
      order: [["id", "DESC"]],
    });
    if (items.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get All Item group data successfully",
        data: items,
      });
    } else {
      return res.status(201).send({
        code: 201,
        message: "No Item found",
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};
exports.getAllItemgroup_byId = async (req, res) => {
  try {
    const id = req.params.id;
    const items = await db.ItemGroup.findOne({
      where: { id: id, isDeleted: false },
    });
    if (items) {
      return res.status(200).send({
        code: 200,
        message: "Get Item group data successfully",
        data: items,
      });
    } else {
      return res.status(201).send({
        code: 201,
        message: "No Item found",
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.deleteItemMasterGroup = async (req, res) => {
  try {
    const id = req.params.id;
    const getAllData = await db.ItemGroup.findOne({ where: { id: id } });
    if (getAllData) {
      await db.ItemGroup.update({ isDeleted: true }, { where: { id: id } });
      // await db.ProductGroup.update({ isDeleted: true, status: "INACTIVE" }, { where: { id: id } });
      return res.status(200).send({
        code: 200,
        message: "Item and its associated data are soft-deleted successfully!",
      });
    } else {
      return res.status(404).send({ code: 404, message: "Data not found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error("Error:", error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

exports.ItemGroupCategoryStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const getData = await db.ItemGroup.findOne({
      where: {
        id: id,
        isDeleted: false,
      },
    });
    if (getData) {
      const updated = await db.ItemGroup.update(
        { status },
        { where: { id: id } },
      );
      return res.status(200).send({
        code: 200,
        message: "ItemGroup Status Change Successfully!",
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.updateItemGroupCategory = async (req, res) => {
  try {
    const id = req.params.id;
    let { Item_group, Item_group_code } = req.body;

    const getItemGroup = await db.ItemGroup.findOne({
      where: { Item_group: Item_group, isDeleted: false, status: "ACTIVE" },
    });
    if (getItemGroup) {
      return res
        .status(400)
        .send({ code: 400, message: "Item Group Already Exist" });
    }

    const Item_groups = await db.ItemGroup.findOne({
      where: { id, isDeleted: false },
    });

    if (!Item_groups) {
      return res
        .status(404)
        .json({ code: 404, message: "ItemGroup Not Found or Deleted" });
    }

    await db.ItemGroup.update(
      {
        Item_group,
        Item_group_code,
      },
      {
        where: { id: id },
      },
    );

    const updatedItemGroup = await db.ItemGroup.findOne({
      where: { id: id },
    });

    if (!updatedItemGroup) {
      return res
        .status(404)
        .json({ code: 404, message: "Updated ItemGroup Not Found" });
    }

    await db.ProductGroup.update(
      {
        product_group: updatedItemGroup.Item_group,
        product_group_code: updatedItemGroup.Item_group_code,
      },
      {
        where: { id: id },
      },
    );

    return res.status(200).json({
      code: 200,
      message: "ItemGroup and ProductGroup Updated Successfully",
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error("Error:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getItemName = async (req, res) => {
  try {
    const id = req.params.id;
    const items = await db.ItemMaster.findAll({
      where: { sub_category_id: id, isDeleted: false, status: "ACTIVE" },
      attributes: ["id", "item_name", "item_code", "sub_category_id"],
    });
    if (items) {
      return res.status(200).send({
        code: 200,
        message: "Item Name Feched data successfully",
        data: items,
      });
    } else {
      return res.status(201).send({
        code: 201,
        message: "No Item found",
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

const xlsx = require("xlsx");
exports.importExcel = async (req, res) => {
  try {
    const filePath = req.file?.path;
    if (!filePath) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // 1. Read Excel File
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    fs.unlinkSync(filePath); // Clean up uploaded file

    // 2. Filter Unique Items
    const getUniqueItems = (data) => {
      const seen = new Set();
      const uniqueItems = [];

      data.forEach((ele) => {
        const itemName = ele["Item Name"];
        if (itemName && !seen.has(itemName)) {
          seen.add(itemName);
          uniqueItems.push(ele);
        }
      });

      return uniqueItems;
    };

    const uniqueData = getUniqueItems(data);
    const resultLog = [];

    // 3. Process each unique item
    for (const elem of uniqueData) {
      const itemType = elem["Item Type"];
      const itemName = elem["Item Name"];
      const subCategoryName = elem["Sub Category"];
      const itemCode = elem["Item Code"];
      const hsnCodeValue = elem["Hsn Code Id"];
      const itemPrintName = elem["Item Print Name"];

      // Validate mandatory fields
      if (!itemName || !itemType) {
        resultLog.push({
          item: itemName || "Unknown",
          status: "Missing required fields",
        });
        continue;
      }

      // Asset lookup
      const existData = await db.asset.findOne({
        where: { asset_category_name: itemType },
      });

      if (!existData) {
        resultLog.push({ item: itemType, status: "Asset Not Found" });
        continue;
      }

      // SubCategory lookup
      const subCategory = await db.SubCategory.findOne({
        where: {
          sub_category_name: subCategoryName,
          item_category_id: existData.id,
          status: "ACTIVE",
          isDeleted: false,
        },
      });

      // Existing item check
      const existingItem = await db.ItemMaster.findOne({
        where: {
          item_name: itemName,
          asset_id: existData.id,
          isDeleted: false,
        },
      });

      const designation = await db.product_master.findOne({
        where: { product_name: itemName },
      });

      if (existingItem && !designation) {
        resultLog.push({ item: itemName, status: "Item Already Exists" });
        continue;
      }

      if (existingItem && designation) {
        if (existingItem.status === "INACTIVE") {
          await existingItem.update({ status: "ACTIVE" });
          resultLog.push({ item: itemName, status: "Item Reactivated" });
        } else {
          resultLog.push({ item: itemName, status: "Item Already Exists" });
        }
        continue;
      }

      // HSN code lookup (optional)
      let hsnCode = null;
      if (hsnCodeValue) {
        hsnCode = await db.hsn_sac_master.findOne({
          where: { hsn_sac_code: hsnCodeValue },
        });
      }

      // Create new item
      const createdItem = await db.ItemMaster.create({
        item_name: itemName,
        asset_id: existData.id,
        hsn_code_id: hsnCode?.id || null,
        item_code: itemCode,
        entity_id: 1,
        Item_Print_Name: itemPrintName,
        sub_category_id: subCategory?.id || null,
      });

      // // Add to product master
      // await db.product_master.create({
      //   id: createdItem.id,
      //   product_name: createdItem.item_name,
      //   product_code: createdItem.item_code,
      //   asset_id: createdItem.asset_id,
      //   sub_category_id: createdItem.sub_category_id,
      //   hsn_code_id: createdItem.hsn_code_id,
      //   entity_id: createdItem.entity_id
      // });

      resultLog.push({ item: itemName, status: "Created Successfully" });
    }

    // 4. Respond with results
    return res.status(200).json({ success: true, results: resultLog });
  } catch (error) {
    console.error("❌ Error in Excel import handler:", error);
    return res.status(500).json({
      success: false,
      message: "Error parsing Excel file",
      error: error.message,
    });
  }
};

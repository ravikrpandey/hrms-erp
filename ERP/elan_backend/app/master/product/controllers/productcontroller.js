const {
  attribute,
} = require("@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js");
const db = require("../../../models/index");
const productDetails = db.product_master;
const product__variant_Details = db.product__variant_master;

exports.createProduct = async (req, res) => {
  try {
    const {
      product_name,
      uom_id,
      product_series,
      product_model,
      product_rating,
      product_spv_wattage,
      product_warranty,
      product_spv_voc,
      product_list_price,
      product_mrp,
      product_length,
      product_breadth,
      product_height,
      product_weight,
      product_description,
      capacity,
      product_specification,
      product_image,
      product_category_id,
      maximum_discount,
      varient_name,
      entity_id,
      hsn_code_id,
      igst,
    } = req.body;

    const product_code = btoa(Math.random()).slice(0, 10).toUpperCase();
    const product_variant_code = btoa(Math.random()).slice(0, 10).toUpperCase();
    // let image = "";
    // if (req.file && req.file['filename'] && req.file['filename'].length > 0) {
    //     image = req.file.path;
    // } else {
    //     image = "";
    // }
    const cgst = igst ? igst / 2 : null;
    const sgst = igst ? igst / 2 : null;
    const product = await productDetails.create({
      product_name,
      uom_id,
      product_series,
      product_model,
      product_rating,
      product_spv_wattage,
      product_warranty,
      product_spv_voc,
      product_list_price,
      product_mrp,
      product_length,
      product_breadth,
      product_height,
      product_weight,
      product_description,
      product_code,
      maximum_discount,
      capacity,
      product_specification,
      product_image,
      product_category_id,
      entity_id,
      hsn_code_id,
      igst,
      cgst,
      sgst,
    });
    if (product) {
      const productVariant = await product__variant_Details.create({
        variant_name: varient_name,
        product_variant_code,
        product_master_id: product.id,
        uom_id,
      });
      return res.status(200).send({
        code: 200,
        message: `Product created Successfully`,
        data: product,
      });
    } else {
      return res.status(201).send({
        code: 201,
        message: `Product not created`,
        data: product,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server error",
      data: [],
    });
  }
};

exports.getAllproduct = async (req, res) => {
  try {
    const entity_id = req.params.entity_id;
    const getAllData = await productDetails.findAll({
      include: [
        {
          model: db.uom,
          attributes: ["uom_name"],
          where: { isDeleted: false, status: "ACTIVE" },
        },
        {
          model: db.product__variant_master,
          attributes: ["product_variant_code", "variant_name"],
        },
      ],
      order: [["id", "DESC"]],
      where: { isDeleted: false, entity_id },
    });
    return res.status(200).send({
      code: 200,
      message: "Get all product Deatils Data Successfully",
      data: getAllData,
    });
  } catch (error) {
    console.log(error, "Error");
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.update_product = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      product_name,
      uom_id,
      product_series,
      product_model,
      product_rating,
      product_spv_wattage,
      product_warranty,
      product_spv_voc,
      product_list_price,
      product_mrp,
      product_length,
      product_breadth,
      product_height,
      product_weight,
      capacity,
      product_description,
      product_specification,
      maximum_discount,
      product_image,
      product_category_id,
      product_subcategory_id,
      varient_name,
      hsn_code_id,
      igst,
    } = req.body;

    const numericFields = [
      product_spv_wattage,
      product_warranty,
      product_list_price,
      product_mrp,
      product_length,
      product_breadth,
      product_height,
      product_weight,
    ];

    if (numericFields.some((value) => value < 0)) {
      return res
        .status(400)
        .send({ code: 400, message: "Values should be positive." });
    }
    const cgst = igst ? igst / 2 : null;
    const sgst = igst ? igst / 2 : null;

    const update_product = await productDetails.update(
      {
        product_name,
        product_series,
        product_model,
        product_rating,
        product_spv_wattage,
        product_warranty,
        product_spv_voc,
        product_list_price,
        product_mrp,
        product_length,
        product_breadth,
        hsn_code_id,
        igst,
        cgst,
        sgst,
        product_height,
        product_weight,
        product_description,
        product_specification,
        product_image,
        maximum_discount,
        capacity,
        product_category_id,
        uom_id,
      },
      {
        where: { id: id, status: "ACTIVE" },
      },
    );
    if (update_product) {
      await product__variant_Details.update(
        {
          variant_name: varient_name,
        },
        {
          where: { product_master_id: id, status: "ACTIVE" },
        },
      );
      return res.status(200).send({
        code: 200,
        message: "Product details updated successfully!",
        data: update_product,
      });
    } else {
      return res.status(201).send({
        code: 201,
        message: "Something went wrong.",
        data: update_product,
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.product_id;
    const productDetail = await productDetails.findOne({
      where: {
        id: productId,
        status: "ACTIVE",
      },
      include: [
        {
          model: db.uom,
          attributes: ["uom_name"],
        },
        {
          model: db.productcategory,
          attributes: ["category_name"],
        },
        {
          model: db.product__variant_master,
          attributes: ["variant_name"],
        },
      ],
    });

    if (!productDetail) {
      return res.status(404).send({
        code: 404,
        message: "Product not found with the provided ID.",
      });
    }
    return res.status(200).send({
      code: 200,
      message: "Product retrieved successfully.",
      data: productDetail,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.delete_product = async (req, res) => {
  try {
    const id = req.params.id;
    const getAllData = await productDetails.findOne({ where: { id: id } });
    if (getAllData) {
      await productDetails.update({ isDeleted: true }, { where: { id: id } });
      return res
        .status(200)
        .send({ code: 200, message: "Product is Deleted Successfully!" });
    } else {
      return res.status(404).send({ code: 403, message: "Data not found" });
    }
  } catch (error) {
    console.log(error, "Error");
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

exports.productStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    if (status === undefined) {
      return res.status(400).send({
        code: 400,
        message:
          "Bad Request: 'status' property is missing in the request body",
      });
    }
    const getData = await productDetails.findOne({
      where: {
        id: id,
        isDeleted: false,
      },
    });
    if (getData) {
      await productDetails.update(
        {
          status,
        },
        {
          where: {
            id: id,
          },
        },
      );
      return res.status(200).send({
        code: 200,
        message: "Product Status Change Successfully!",
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_variants_by_product_id = async (req, res) => {
  try {
    const productId = req.params.productId;

    if (!productId) {
      return res.status(400).send({
        code: 400,
        message: "Product ID is required.",
      });
    }

    const productDetailsInstance = await productDetails.findOne({
      where: {
        id: productId,
        status: "ACTIVE",
      },
      attributes: [
        "id",
        "product_code",
        "product_description",
        "product_rating",
      ],
      include: [
        {
          model: product__variant_Details,
          where: {
            status: "ACTIVE",
          },
          attributes: ["id", "product_variant_code", "variant_name"],
        },
      ],
    });

    if (!productDetailsInstance) {
      return res.status(404).send({
        code: 404,
        message: "Product not found with the provided ID.",
      });
    }
    return res.status(200).send({
      code: 200,
      message: "Product detail retrieved successfully.",
      product_code: productDetailsInstance.product_code,
      data: productDetailsInstance,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.getProductDetailsByVariantId = async (req, res) => {
  try {
    const variantId = req.params.variantId;

    if (!variantId) {
      return res.status(400).send({
        code: 400,
        message: "Variant ID is required.",
      });
    }

    const variantDetailsInstance = await product__variant_Details.findOne({
      where: {
        id: variantId,
        isDeleted: false,
      },
      include: [
        {
          model: productDetails,
          where: {
            status: "ACTIVE",
          },
        },
      ],
    });

    if (!variantDetailsInstance) {
      return res.status(404).send({
        code: 404,
        message: "Variant not found with the provided ID.",
      });
    }

    return res.status(200).send({
      code: 200,
      message: "Get product Details Data Successfully",
      data: {
        product_variant_masters: variantDetailsInstance,
      },
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.get_active_variants_by_product_id = async (req, res) => {
  try {
    const productId = req.params.productId;

    if (!productId) {
      return res.status(400).send({
        code: 400,
        message: "Product ID is required.",
      });
    }

    const productDetailsInstance = await productDetails.findOne({
      where: {
        id: productId,
        status: "ACTIVE",
      },
    });

    if (!productDetailsInstance) {
      return res.status(404).send({
        code: 404,
        message: "Product not found with the provided ID.",
      });
    }
    const variantsList = await product__variant_Details.findAll({
      where: {
        product_master_id: productId,
        isDeleted: false,
        status: "ACTIVE",
      },
    });

    return res.status(200).send({
      code: 200,
      message: "Variants list retrieved successfully.",
      data: variantsList,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.getAllCustomerItemList = async (req, res) => {
  try {
    const customer_id = req.params.id ? parseInt(req.params.id) : null;

    if (!customer_id) {
      return res.status(400).send({
        code: 400,
        message: "Invalid Customer Id",
      });
    }

    const sql = `
            SELECT 
                pm.*,
                ma.asset_category_name,
                ma.asset_category_code,
                msc.sub_category_name,     
                msc.sub_category_code, 
                em.entity_name,
                mct.customer_type_name,
                cpm.company_name,
                cpm.customer_code,
                cpm.data_status AS customer_status
            FROM MASTER_PRICE pm
            LEFT JOIN ENTITY_MASTER em ON pm.entity_id = em.id
            LEFT JOIN MASTER_CUSTOMER_TYPE mct ON mct.id = pm.customer_type_id
            LEFT JOIN CUSTOMER_PROFILE_MST cpm ON cpm.id = pm.customer_id
            LEFT JOIN MASTER_ASSET ma ON ma.id = pm.category_id
            LEFT JOIN MASTER_SUB_CATEGORY msc ON msc.id = pm.subcategory_id

            WHERE pm.customer_id = :customer_id 
              AND pm.isDeleted = false
        `;

    const priceData = await db.sequelize.query(sql, {
      replacements: { customer_id },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (priceData.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "Record Not Found",
        data: [],
      });
    }

    let finalData = [];

    for (let price of priceData) {
      const sqlItems = `
                SELECT 
                    mip.*, mi.item_name, mi.item_code
                FROM MASTER_ITEM_PRICE mip
                LEFT JOIN MASTER_ITEM mi ON mi.id = mip.item_id
                WHERE mip.price_master_id = :priceId
                  AND mip.isDeleted = false
            `;

      const disList = await db.sequelize.query(sqlItems, {
        replacements: { priceId: price.id },
        type: db.Sequelize.QueryTypes.SELECT,
      });

      finalData.push({
        ...price,
        disList,
      });
    }

    return res.status(200).send({
      code: 200,
      message: "Fetch Data Successfully",
      data: finalData,
    });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.getProductByCatAndSubcatId = async (req, res) => {
  try {
    const catid = req.params.cat_id;
    const subCatid = req.params.sub_cat_id; // Corrected this line

    const productDetail = await productDetails.findAll({
      where: {
        product_category_id: catid,
        product_subcategory_id: subCatid,
        status: "ACTIVE",
      },
      attributes: [
        "id",
        "product_name",
        "product_code",
        "product_description",
        "product_rating",
      ],
    });

    if (!productDetail) {
      return res.status(404).send({
        code: 404,
        message: "Product not found.",
      });
    }
    return res.status(200).send({
      code: 200,
      message: "Product retrieved successfully.",
      data: productDetail,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.getProductBycat_Id = async (req, res) => {
  try {
    const catid = req.params.cat_id;

    const productDetail = await productDetails.findAll({
      where: {
        product_category_id: catid,
        status: "ACTIVE",
      },
      attributes: [
        "id",
        "product_name",
        "product_code",
        "product_description",
        "product_rating",
      ],
    });

    if (!productDetail) {
      return res.status(404).send({
        code: 404,
        message: "Product not found.",
      });
    }
    return res.status(200).send({
      code: 200,
      message: "Product retrieved successfully.",
      data: productDetail,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};
exports.getProductVariantByproduct_id = async (req, res) => {
  try {
    const id = req.params.id;

    const productDetail = await db.product__variant_master.findAll({
      where: {
        product_master_id: id,
        status: "ACTIVE",
      },
      attributes: ["id", "variant_name"],
    });

    if (!productDetail) {
      return res.status(404).send({
        code: 404,
        message: "Product not found.",
      });
    }
    return res.status(200).send({
      code: 200,
      message: "Product retrieved successfully.",
      data: productDetail,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};
exports.getProductBycat_Id = async (req, res) => {
  try {
    const catid = req.params.cat_id;

    const productDetail = await productDetails.findAll({
      where: {
        product_category_id: catid,
        status: "ACTIVE",
      },
      attributes: [
        "id",
        "product_name",
        "product_code",
        "product_description",
        "product_rating",
      ],
    });

    if (!productDetail) {
      return res.status(404).send({
        code: 404,
        message: "Product not found.",
      });
    }
    return res.status(200).send({
      code: 200,
      message: "Product retrieved successfully.",
      data: productDetail,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};
exports.getProductVariantByproduct_id = async (req, res) => {
  try {
    const id = req.params.id;

    const productDetail = await db.product__variant_master.findAll({
      where: {
        product_master_id: id,
        status: "ACTIVE",
      },
      attributes: ["id", "variant_name"],
    });

    if (!productDetail) {
      return res.status(404).send({
        code: 404,
        message: "Product not found.",
      });
    }
    return res.status(200).send({
      code: 200,
      message: "Product retrieved successfully.",
      data: productDetail,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.getHSNCode = async (req, res) => {
  try {
    let entity_id = req.params?.id;
    let { code_type } = req.query;
    if (code_type === "SAC") {
      code_type = "SAC";
    } else {
      code_type = "HSN";
    }

    const [query] = await db.sequelize
      .query(`SELECT MHSC.*,GRM.value FROM MASTER_HSN_SAC_CODE AS MHSC 
            LEFT JOIN GST_RATE_MASTER AS GRM ON GRM.id = MHSC.gst_rate_id
            WHERE MHSC.code_type = '${code_type}' AND MHSC.entity_id = ${entity_id} AND MHSC.isDeleted = 0`);

    if (query.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Fetched Data Successfully !",
        data: query,
      });
    } else {
      return res
        .status(200)
        .send({ code: 404, message: "Record Not Found", data: query });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

exports.createProductgroup = async (req, res) => {
  try {
    let { product_group, product_group_code, entity_id, financial_year_id } =
      req.body;
    const createData = await db.ProductGroup.create({
      product_group,
      product_group_code,
      entity_id,
      financial_year_id,
    });

    return res.status(200).json({
      code: 200,
      message: "product group Master Successfully",
      data: createData,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.createProductType = async (req, res) => {
  try {
    let { product_type_name, lavel } = req.body;

    const createData = await db.productType.create({
      product_type_name,
      lavel,
    });

    return res.status(200).json({
      code: 200,
      message: "product Type Master Successfully",
      data: createData,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.add_product_price = async (req, res) => {
  try {
    const { product_data } = req.body;

    if (!Array.isArray(product_data) || product_data.length === 0) {
      return res.status(400).send({
        code: 400,
        message: "product_data must be a non-empty array",
        data: [],
      });
    }

    const pairs = product_data.map((item) => ({
      customer_id: item.customer_id,
      product_id: item.product_id,
    }));

    const existingRecords = await db.customer_Product_Price.findAll({
      where: {
        [db.Sequelize.Op.or]: pairs,
      },
    });

    const existingMap = new Map();
    for (const item of existingRecords) {
      const key = `${item.customer_id}_${item.product_id}`;
      existingMap.set(key, item);
    }

    const toUpdate = [];
    const toInsert = [];

    for (const item of product_data) {
      const key = `${item.customer_id}_${item.product_id}`;
      const existing = existingMap.get(key);

      if (existing) {
        if (existing.product_price !== item.product_price) {
          toUpdate.push({
            ...existing.dataValues,
            product_price: item.product_price,
          });
        }
      } else {
        toInsert.push(item);
      }
    }

    const created =
      toInsert.length > 0
        ? await db.customer_Product_Price.bulkCreate(toInsert)
        : [];

    const updated = [];
    for (const item of toUpdate) {
      const updatedRow = await db.customer_Product_Price.update(
        { product_price: item.product_price },
        {
          where: {
            customer_id: item.customer_id,
            product_id: item.product_id,
          },
        },
      );
      updated.push(item);
    }

    return res.status(201).send({
      code: 201,
      message: "Product prices processed successfully",
      data: {
        inserted: created,
        updated: updated,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server error",
      data: [],
    });
  }
};

exports.getAll_product_price = async (req, res) => {
  try {
    let customer_id = req.params.id;

    let saveProduct = await db.customer_Product_Price.findAll({
      where: {
        customer_id: customer_id,
        isDeleted: false,
      },
    });

    if (saveProduct.length === 0) {
      return res
        .status(404)
        .send({ code: 404, message: "Product With Price Not Found" });
    }

    return res.status(201).send({
      code: 201,
      message: "Product price added successfully",
      data: saveProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server error",
      data: [],
    });
  }
};

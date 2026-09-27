const { SequelizeScopeError } = require("sequelize");
const db = require("../../../models/index");
const path = require('path');

exports.create_branding_master = async (req, res) => {
  try {
    const {
     
      type_of_branding,
      branding_sides,
      price_per_unit,
      hsn_code_id,
      uom_id,
      item_id,
      customer_name
    } = req.body;

    if (!hsn_code_id  || !type_of_branding || !branding_sides || !price_per_unit || !customer_name ) {
      return res.status(400).json({
        code: 400,
        message: "Missing required fields"
      });
    }


    // const gstValue = parseFloat(gst);
    // if (isNaN(gstValue) || gstValue < 0 || gstValue > 100) {
    //   return res.status(400).json({
    //     code: 400,
    //     message: "Invalid GST value. It must be between 0 and 100."
    //   });
    // }

    // const formattedGst = parseFloat(gstValue.toFixed(2));

   
    const priceValue = parseFloat(price_per_unit);
    if (isNaN(priceValue) || priceValue <= 0) {
      return res.status(400).json({
        code: 400,
        message: "Invalid Price per unit. It must be greater than 0."
      });
    }

 
    let imagePath = null;
    if (req.files && req.files.length > 0) {
      imagePath = req.files
        .map(file => path.normalize(file.path).replace(/\\/g, "/"))
        .join(",");
    }


    let brandingSidesValue = Array.isArray(branding_sides)
      ? branding_sides.join(",")
      : branding_sides;

  
    const isExist = await db.branding_master.findOne({
      where: {
        hsn_code_id,
        type_of_branding,
        isDeleted: false,
      }
    });

    if (isExist) {
      return res.status(409).json({
        code: 409,
        message: "HSN & GST with same Type of Branding already exists"
      });
    }


    const saveData = await db.branding_master.create({
      hsn_code_id,
      type_of_branding,
      branding_sides: brandingSidesValue,
      price_per_unit: priceValue,
      image: imagePath,
      uom_id:uom_id,
      customer_id:customer_name,
      item_id
    });

    return res.status(201).json({
      code: 201,
      message: "Branding created successfully",
      data: saveData
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: error.message || "Server Error"
    });
  }
};



exports.getAll_branding_master = async (req, res) => {
  try {
    const [data] = await db.sequelize.query(`
      SELECT mb.id, mb.type_of_branding, mb.branding_sides, mb.price_per_unit, mb.image, mb.status, 
            mb.hsn_code_id, hsn.hsn_sac_code, grn.value AS gst_value,u.uom_name,mb.customer_id , CP.company_name,mb.item_id,MI.item_name
      FROM MASTER_BRANDING AS mb
      LEFT JOIN MASTER_HSN_SAC_CODE AS hsn ON hsn.id = mb.hsn_code_id
      LEFT JOIN GST_RATE_MASTER AS grn ON grn.id = hsn.gst_rate_id
      LEFT JOIN MASTER_UOM AS u ON u.uom_id = mb.uom_id
      LEFT JOIN CUSTOMER_PROFILE_MST CP ON mb.customer_id = CP.id
      LEFT JOIN MASTER_ITEM AS MI ON mb.item_id = MI.id
      WHERE mb.isDeleted = false
      ORDER BY mb.id DESC
    `);

    const formattedData = data.map((item) => {
      return {
        ...item,
        image: item.image ? item.image.split(",") : [],
        branding_sides: item.branding_sides ? item.branding_sides.split(",") : [],
      };
    });

    return res.status(200).json({
      code: 200,
      message: "Branding fetched successfully",
      data: formattedData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};
exports.getBrandingWithCustomerItem = async (req, res) => {
  try {
    let {customer_id,item_id}=req.query;
    const [data] = await db.sequelize.query(`
      SELECT mb.id, mb.type_of_branding, mb.branding_sides, mb.price_per_unit, mb.image, mb.status, 
            mb.hsn_code_id, hsn.hsn_sac_code, grn.value AS gst_value,u.uom_name,mb.customer_id , CP.company_name,mb.item_id,MI.item_name
      FROM MASTER_BRANDING AS mb
      LEFT JOIN MASTER_HSN_SAC_CODE AS hsn ON hsn.id = mb.hsn_code_id
      LEFT JOIN GST_RATE_MASTER AS grn ON grn.id = hsn.gst_rate_id
      LEFT JOIN MASTER_UOM AS u ON u.uom_id = mb.uom_id
      LEFT JOIN CUSTOMER_PROFILE_MST CP ON mb.customer_id = CP.id
      LEFT JOIN MASTER_ITEM AS MI ON mb.item_id = MI.id
      WHERE mb.isDeleted = false AND mb.customer_id=${customer_id} AND mb.item_id=${item_id}
      ORDER BY mb.id DESC
    `);

    const formattedData = data.map((item) => {
      return {
        ...item,
        image: item.image ? item.image.split(",") : [],
        branding_sides: item.branding_sides ? item.branding_sides.split(",") : [],
      };
    });

    return res.status(200).json({
      code: 200,
      message: "Branding fetched successfully",
      data: formattedData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};


exports.
getById_branding_master = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        code: 400,
        message: "Branding ID is required",
      });
    }

    const [data] = await db.sequelize.query(`
      SELECT mb.id, mb.type_of_branding, mb.branding_sides, mb.price_per_unit, mb.image, mb.status, 
             mb.hsn_code_id, hsn.hsn_sac_code, grn.value AS gst_value,mb.uom_id,mb.customer_id,mb.item_id
      FROM MASTER_BRANDING AS mb
      LEFT JOIN MASTER_HSN_SAC_CODE AS hsn ON hsn.id = mb.hsn_code_id
      LEFT JOIN GST_RATE_MASTER AS grn ON grn.id = hsn.gst_rate_id
      WHERE mb.isDeleted = false AND mb.id = :id
      LIMIT 1
    `, {
      replacements: { id },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (!data) {
      return res.status(404).json({
        code: 404,
        message: "Branding not found",
      });
    }

    const formattedData = {
      ...data,
      image: data.image ? data.image.split(",") : [],
      branding_sides: data.branding_sides ? data.branding_sides.split(",") : [],
    };

    return res.status(200).json({
      code: 200,
      message: "Branding fetched successfully",
      data: formattedData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};



exports.update_branding_master = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      hsn_code_id,
      type_of_branding,
      branding_sides,
      price_per_unit,
      existing_files,
      uom_id ,
      customer_name,
      item_id
    } = req.body;

    
    if (!id || !hsn_code_id || !type_of_branding || !branding_sides || !price_per_unit || !customer_name) {
      return res.status(400).json({
        code: 400,
        message: "Missing required fields"
      });
    }

    const existingBranding = await db.branding_master.findOne({
      where: { id, isDeleted: false }
    });

    if (!existingBranding) {
      return res.status(404).json({
        code: 404,
        message: "Branding not found"
      });
    }

    let imagePath = "";
    if (existing_files && existing_files.length > 0) {
      imagePath = existing_files.join(",");
    }

    if (req.files && req.files.length > 0) {
      const newFiles = req.files
        .map(file => path.normalize(file.path).replace(/\\/g, "/"))
        .join(",");
      
      imagePath = imagePath ? imagePath + "," + newFiles : newFiles;
    }

    let brandingSidesValue = Array.isArray(branding_sides)
      ? branding_sides.join(",")
      : branding_sides;

    const isExist = await db.branding_master.findOne({
      where: {
        hsn_code_id,
        type_of_branding,
        isDeleted: false,
        id: { [db.Sequelize.Op.ne]: id }
      }
    });

    if (isExist) {
      return res.status(409).json({
        code: 409,
        message: "HSN & GST with same Type of Branding already exists"
      });
    }

 
    await db.branding_master.update(
      {
        hsn_code_id,
        type_of_branding,
        branding_sides: brandingSidesValue,
        price_per_unit,
        image: imagePath,
        uom_id:uom_id,
        customer_id: customer_name,
        item_id
      },
      { where: { id } }
    );

    return res.status(200).json({
      code: 200,
      message: "Branding updated successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: error.message || "Server Error"
    });
  }
};

exports.delete_branding_master = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        code: 400,
        message: "ID is required",
      });
    }

    const existingBranding = await db.branding_master.findOne({
      where: { id, isDeleted: false },
    });

    if (!existingBranding) {
      return res.status(404).json({
        code: 404,
        message: "Branding not found or already deleted",
      });
    }

    await db.branding_master.update(
      { isDeleted: true },
      { where: { id } }
    );

     console.log("chekced here branding_master")
    return res.status(200).json({
      code: 200,
      message: "Branding deleted successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};







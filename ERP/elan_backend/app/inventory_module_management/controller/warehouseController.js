const db = require("../../models");
const { Op } = require("sequelize");

exports.getAllmainWarehouseList = async (req, res) => {
  try {
    const { entity_id, vpId } = req.params;
    const organization_id = req.user?.organization_id ?? null;
    let vpIdValue = null;
    if (
      vpId !== undefined &&
      vpId !== null &&
      vpId !== "undefined" &&
      vpId !== ""
    ) {
      const num = Number(vpId);
      vpIdValue = Number.isNaN(num) ? null : num;
    }

    const result = await db.sequelize.query(
      `
        SELECT DISTINCT W.id, W.name, W.code, W.address, L.location_name, L.location_code,W.postal_address
        FROM CRM_CREATE_PROPOSAL_MST AS C
        INNER JOIN SALES_ORDER_MST AS SO ON SO.proposal_id = C.id
        LEFT JOIN WH_VH_PLANNING_SO AS WVPP ON WVPP.sale_order_id = SO.id
        LEFT JOIN WH_VH_PLANNING_MST AS WVP ON WVP.id = WVPP.planning_id
        INNER JOIN WAREHOUSE_MASTER AS W ON C.warehouse_id = W.id
        INNER JOIN LOCATION_MASTER AS L ON C.location_id = L.id
        WHERE SO.is_proceed_to_dispatched = 1 AND C.entity_id = :entity_id
        AND (:organization_id IS NULL OR W.organization_id = :organization_id)
        AND (
              -- NORMAL usable warehouses (NEW + EDIT both)
              (
                WVPP.sale_order_id IS NULL
                OR WVP.status = 'Rejected'
              )
              AND W.isDeleted = 0

              -- FORCE include selected warehouse in EDIT
              OR (
                :vpId IS NOT NULL
                AND WVP.id = :vpId
              )
            )
        ORDER BY W.name DESC`,
      {
        replacements: {
          entity_id,
          vpId: vpIdValue,
          organization_id,
        },
        type: db.Sequelize.QueryTypes.SELECT,
      },
    );

    res
      .status(200)
      .json({ code: 200, message: "Record fetch successfully", data: result });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, message: error?.message || "Internal server error" });
  }
};

exports.getAllWarehouseList = async (req, res) => {
  try {
    const { entity_id, financial_year_id } = req.params;
    const result = await db.warehouse.findAll({
      where: {
        isDeleted: false,
        entity_id: entity_id,
        //financial_year_id
      },
    });
    res
      .status(200)
      .json({ code: 200, message: "Available list", data: result });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, message: error?.message || "Internal server error" });
  }
};

exports.getAllNewWarehouseList = async (req, res) => {
  try {
    const { entity_id, financial_year_id } = req.params;
    const result = await db.warehouse.findAll({
      where: {
        isDeleted: false,
        entity_id: entity_id,
        //financial_year_id
      },
    });
    res
      .status(200)
      .json({ code: 200, message: "Available list", data: result });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, message: error?.message || "Internal server error" });
  }
};

exports.getAllActiveWarehouseList = async (req, res) => {
  try {
    const { entity_id, financial_year_id } = req.params;
    const result = await db.warehouse.findAll({
      where: {
        isDeleted: false,
        entity_id: entity_id,
        status: "ACTIVE",
        //financial_year_id
      },
    });
    res
      .status(200)
      .json({ code: 200, message: "Available list", data: result });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, message: error?.message || "Internal server error" });
  }
};

exports.generateWareHouseCode = async (req, res) => {
  try {
    const lastEntry = await db.warehouse.findOne({
      order: [["createdAt", "DESC"]],
      attributes: ["code"],
    });

    let number;
    if (lastEntry) {
      const lastCode = parseInt(lastEntry.code.split("WH")[1]);
      const newCode = lastCode + 1;
      number = "WH" + newCode.toString().padStart(2, "0");
    } else {
      number = `WH01`;
    }
    return res
      .status(200)
      .send({ code: 200, message: "Warehouse Code Generated", data: number });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.createWarehouse = async (req, res) => {
  try {
    const { entity_id, financial_year_id } = req.params;
    const { body } = req;
    if (!entity_id) {
      return res.status(500).json({
        code: 500,
        message: "entity_id is Required!",
      });
    }

    const createdWarehouse = await db.warehouse.create({
      name: body.warehouse_name,
      type: body.warehouse_type,
      code: body.warehouse_code,
      address: body.address,
      country_id: body.country_id,
      state_id: body.State_id,
      city_id: body.city_id,
      pin: body.pin,
      mark_as_default: body.mark_as_default,
      manager_name: body.manager_name,
      contact_info: body.contact_info,
      entity_id: parseInt(entity_id),
      financial_year_id: parseInt(financial_year_id),
      capacity: body.capacity,
      remaining_capacity: body.capacity,
      plant_id: body.plant_id,
      branch_id: body.branch_id,
      location: body.location,
    });
    res.status(201).json({
      code: 201,
      message: "Warehouse Created successfully!",
      data: createdWarehouse,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error?.message || "Internal server error",
    });
  }
};

// delete api for the warehouse

exports.deleteWarehouseById = async (req, res) => {
  try {
    const { id } = req.params;
    const rowdata = await db.warehouse.findOne({ where: { id: id } });
    if (rowdata) {
      await db.warehouse.update({ isDeleted: true }, { where: { id: id } });
      return res
        .status(200)
        .send({ code: 200, message: "Data Deleted Successfully!" });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.getWarehouseByIdData = async (req, res) => {
  try {
    const { id } = req.params;
    const rowData = await db.warehouse.findOne({
      where: { id: id },
      include: [
        {
          model: db.user,
        },
      ],
    });

    if (rowData) {
      return res
        .status(200)
        .send({ code: 200, data: rowData, message: "getting single Data" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: "internal server error" });
  }
};

exports.updatewarehouseByid = async (req, res) => {
  try {
    await db.warehouse.update(
      {
        name: req.body.warehouse_name,
        type: req.body.warehouse_type,
        code: req.body.warehouse_code,
        address: req.body.address,
        country_id: req.body.country_id,
        state_id: req.body.State_id,
        city_id: req.body.city_id,
        pin: req.body.pin,
        mark_as_default: req.body.mark_as_default,
        manager_name: req.body.manager_name,
        contact_info: req.body.contact_info,
        entity_id: parseInt(req.body.entity_id),
        capacity: req.body.capacity,
        remaining_capacity: req.body.capacity,
        plant_id: req.body.plant_id,
        branch_id: req.body.branch_id,
        location: req.body.location,
      },
      {
        where: {
          id: req.params.id,
          isDeleted: false,
        },
      },
    );

    return res
      .status(200)
      .send({ code: 200, message: "Warehouse updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: "Internal server error" });
  }
};

exports.getAllWarehouseWithoutId = async (req, res) => {
  try {
    const { warehouse_id } = req.params;

    const result = await db.warehouse.findAll({
      where: {
        isDeleted: false,
        id: { [Op.ne]: warehouse_id },
        status: "ACTIVE",
      },
    });

    res.status(200).json({
      code: 200,
      message: "Warehouse list fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error?.message || "Internal server error",
    });
  }
};

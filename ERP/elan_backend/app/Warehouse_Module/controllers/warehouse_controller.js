const db = require("../../models/index");
const { Sequelize, sequelize } = db;
const {
  manageInventoryLedger,
} = require("../../../src/common/common.controller");

module.exports.getAll_ActiveWarehouseType = async (req, res) => {
  try {
    const [results] = await db.sequelize.query(`
      SELECT * 
      FROM WAREHOUSE_TYPE
      WHERE status = 'Active' 
        AND isDeleted = false
      ORDER BY createdAt DESC
    `);

    return res.status(200).send({
      code: 200,
      message: "Active warehouse types fetched successfully",
      data: results,
    });
  } catch (error) {
    console.error("Error fetching warehouse types:", error);
    return res.status(500).send({
      code: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// post created By ashutosh
module.exports.create_warehouse = async (req, res) => {
  try {
    const {
      warehouse_name,
      warehouse_type_id,
      area,
      pin,
      address,
      gst,
      pan_tin,
      license_number,
      entity_id,
      financial_year_id,
      inOut,
      postal_address,
      location_id,
      manager_id,
    } = req.body;
    const { organization_id } = req.user;
    const warehouseExist = await db.warehouse.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ name: warehouse_name }],
        isDeleted: false,
      },
    });

    if (warehouseExist) {
      return res
        .status(409)
        .send({ code: 409, message: "Warehouse already exists" });
    }

    const lastWarehouse = await db.warehouse.findOne({
      where: {
        code: { [Sequelize.Op.like]: "WH%" },
        isDeleted: false,
      },
      order: [["id", "DESC"]],
    });

    let warehouse_code;
    if (lastWarehouse && lastWarehouse.code) {
      const lastNumber = parseInt(lastWarehouse.code.replace("WH", "")) || 0;
      warehouse_code = "WH" + String(lastNumber + 1).padStart(4, "0");
    } else {
      warehouse_code = "WH0001";
    }

    const createdWarehouse = await db.warehouse.create({
      name: warehouse_name,
      code: warehouse_code,
      warehouse_type_id: warehouse_type_id,
      manager_id: manager_id,
      area,
      address,
      postal_address,
      pin,
      gst,
      pan_tin,
      license_number,
      entity_id,
      financial_year_id,
      inOut,
      location_id,
      organization_id,
    });
    if (createdWarehouse) {
      return res
        .status(201)
        .send({ code: 201, message: "Warehouse successfully created" });
    } else {
      return res
        .status(400)
        .send({ code: 400, message: "Failed to create warehouse" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.getAllWarehouseMst = async (req, res) => {
  try {
    const { employee_id, role_code, organization_id } = req.user;
    let whereClause = "WM.isDeleted = false";
    if (role_code === "3PL_Org_Admin") {
      whereClause += " AND WM.organization_id = :organization_id";
    } else if (role_code === "Super Admin") {
      whereClause += " AND WM.organization_id IS NULL";
    } else {
      // whereClause += " AND WM.manager_id = :employee_id";
      whereClause += " AND 1=1";
    }
    const warehouses = await db.sequelize.query(
      `SELECT WM.*, WT.warehouse_type_name, LM.location_name
            FROM 
                WAREHOUSE_MASTER AS WM 
                LEFT JOIN WAREHOUSE_TYPE AS WT ON WT.id = WM.warehouse_type_id
                LEFT JOIN LOCATION_MASTER AS LM ON LM.id = WM.location_id
            WHERE ${whereClause}
            ORDER BY WM.name ASC;`,
      {
        type: db.Sequelize.QueryTypes.SELECT,
        replacements: { employee_id, organization_id },
      },
    );

    return res.status(200).send({
      code: 200,
      message: "Warehouse list fetched successfully",
      data: warehouses,
    });
  } catch (error) {
    console.error("Error in getAllWarehouseMst:", error);
    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
};

// get by id created By ashutosh
// module.exports.getWarehouseById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const warehouse = await db.sequelize.query(
//       `
//             SELECT
//                 wm.*,
//                 wt.warehouse_type_name,
//                 hru.first_name,
//                 hru.last_name,
//                 mc.countryss_name
//             FROM
//                 WAREHOUSE_MASTER AS wm
//             LEFT JOIN WAREHOUSE_TYPE AS wt ON wt.id = wm.warehouse_type_id
//             LEFT JOIN HRMS_REGISTERED_USER AS hru ON hru.employee_id = wm.manager_name
//             LEFT JOIN MASTER_COUNTRY AS mc ON mc.countryss_id = wm.country_id
//             WHERE
//                 wm.isDeleted = false
//                 AND wm.id = :id
//             ORDER BY
//                 wm.createdAt DESC;
//             `,
//       {
//         replacements: { id },
//         type: db.Sequelize.QueryTypes.SELECT,
//       }
//     );

//     if (!warehouse || warehouse.length === 0) {
//       return res.status(404).send({
//         code: 404,
//         message: "Warehouse not found",
//       });
//     }

//     const warehouseData = warehouse[0];

//     // 2. Fetch documents for the warehouse
//     const documents = await db.sequelize.query(
//       `
//             SELECT *
//             FROM WAREHOUSE_DOCUMENTS
//             WHERE warehouse_id = :id
//             `,
//       {
//         replacements: { id },
//         type: db.Sequelize.QueryTypes.SELECT,
//       }
//     );

//     // 3. Respond with both details
//     return res.status(200).send({
//       code: 200,
//       message: "Warehouse fetched successfully",
//       data: {
//         ...warehouseData,
//         documents: documents || [],
//       },
//     });
//   } catch (error) {
//     console.error("Error in getWarehouseById:", error);
//     return res.status(500).send({
//       code: 500,
//       message: error.message,
//     });
//   }
// };

module.exports.getWarehouseById = async (req, res) => {
  try {
    const { id } = req.params;

    // =====================================================
    // 1️⃣ WAREHOUSE MASTER DATA
    // =====================================================
    const warehouseResult = await db.sequelize.query(
      `SELECT wm.*
      FROM WAREHOUSE_MASTER wm
      WHERE wm.isDeleted = false AND wm.id = :id`,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.SELECT,
      },
    );

    if (!warehouseResult.length) {
      return res.status(404).send({
        code: 404,
        message: "Warehouse not found",
      });
    }

    const warehouseData = warehouseResult[0];
    // =====================================================
    // 3️⃣ BIFURCATION
    // =====================================================
    // const bifurcation = await db.warehouse_bifurcation.findOne({
    //   where: { warehouse_id: id }
    // });

    // let zone_data = [];

    // if (bifurcation) {
    //   const zones = await db.warehouse_bifurcation_zone.findAll({
    //     where: { warehouse_bifurcation_id: bifurcation.id }
    //   });

    //   // =====================================================
    //   // 4️⃣ ZONES → RACKS → SHELVES → BINS
    //   // =====================================================
    //   for (const zone of zones) {
    //     const racks = await db.warehouse_rack.findAll({
    //       where: { warehouse_zone_id: zone.id }
    //     });

    //     const rackData = [];

    //     for (const rack of racks) {
    //       const shelves = await db.warehouse_shelf.findAll({
    //         where: { warehouse_rack_id: rack.id }
    //       });

    //       const shelfData = [];

    //       for (const shelf of shelves) {
    //         const bins = await db.warehouse_bins.findAll({
    //           where: { warehouse_shelf_id: shelf.id }
    //         });

    //         shelfData.push({
    //           shelfName: shelf.shelf_name,
    //           shelf_capacity: shelf.shelf_area,
    //           numberOfBins: shelf.number_Of_bins,
    //           shelf_item_category: shelf.shelf_item_category,
    //           bins: bins.map(bin => ({
    //             binName: bin.bin_name,
    //             bin_capacity: bin.bin_area,
    //             bin_item_category: bin.bin_item_category
    //           }))
    //         });
    //       }

    //       rackData.push({
    //         rackName: rack.rack_name,
    //         rack_capacity: rack.rack_area,
    //         numberOfShelves: rack.number_Of_shelves,
    //         rack_item_category: rack.rack_item_category,
    //         shelves: shelfData
    //       });
    //     }

    //     zone_data.push({
    //       zoneType: zone.zoneType,
    //       zone_name: zone.zone_name,
    //       zone_size: zone.zone_size,
    //       bulk_zone_area: zone.bulk_zone_area,
    //       // ✅ ADD THESE (IMPORTANT)
    //       bulk_item_category: zone.bulk_item_category
    //         ? JSON.parse(zone.bulk_item_category)
    //         : [],
    //       bulk_zone_status: zone.bulk_zone_status || null,
    //       numberOfRacks: zone.number_Of_racks,
    //       racks: rackData
    //     });

    //   }
    // }

    // =====================================================
    // ✅ FINAL RESPONSE (EDIT READY)
    // =====================================================
    return res.status(200).send({
      code: 200,
      message: "Warehouse fetched successfully",
      data: {
        ...warehouseData,
        // documents: documents || [],
        // zone_data
      },
    });
  } catch (error) {
    console.error("getWarehouseByIdWithBifurcation Error:", error);
    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
};

module.exports.getWarehouseByIdWithBifurcation = async (req, res) => {
  try {
    const { id } = req.params;

    const warehouseResult = await db.sequelize.query(
      `SELECT wm.name, wm.id, wm.code, wm.area, wm.address
      FROM WAREHOUSE_MASTER wm
      WHERE wm.isDeleted = false AND wm.id = :id`,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.SELECT,
      },
    );

    if (!warehouseResult.length) {
      return res.status(404).send({
        code: 404,
        message: "Warehouse not found",
      });
    }

    const warehouseData = warehouseResult[0];
    let zone_data = [];

    const zones = await db.warehouse_bifurcation_zone.findAll({
      where: { warehouse_id: id, isDeleted: false },
      include: [
        {
          model: db.WAREHOUSE_BAY,
          as: "warehouseBay",
          include: [
            {
              model: db.WAREHOUSE_RACK,
              as: "warehouseRack",
              include: [
                {
                  model: db.WAREHOUSE_BIN,
                  as: "warehouseBin",
                },
              ],
            },
          ],
        },
      ],
    });

    return res.status(200).send({
      code: 200,
      message: "Warehouse fetched successfully",
      data: {
        ...warehouseData,
        // zone_data,
        zones,
      },
    });
  } catch (error) {
    console.error("getWarehouseByIdWithBifurcation Error:", error);
    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
};

module.exports.update_warehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      warehouse_name,
      code,
      warehouse_type_id,
      manager_id,
      area,
      pin,
      address,
      gst,
      pan_tin,
      license_number,
      entity_id,
      financial_year_id,
      inOut,
      postal_address,
      location_id,
      organization_id,
    } = req.body;

    // Check if warehouse exists
    const warehouse = await db.warehouse.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!warehouse) {
      return res.status(404).send({
        code: 404,
        message: "Warehouse not found",
      });
    }

    // Check for duplicate warehouse_name or warehouse_code (excluding current id)
    const duplicate = await db.warehouse.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ name: warehouse_name }, { code }],
        id: { [db.Sequelize.Op.ne]: id },
        isDeleted: false,
      },
    });

    if (duplicate) {
      return res.status(409).send({
        code: 409,
        message: "Warehouse with this name or code already exists",
      });
    }

    // Update warehouse
    await warehouse.update({
      name: warehouse_name,
      code,
      warehouse_type_id,
      address,
      pin,
      area,
      manager_id,
      gst,
      pan_tin,
      license_number,
      entity_id,
      financial_year_id,
      inOut,
      location_id,
      postal_address,
      organization_id,
    });

    return res.status(200).send({
      code: 200,
      message: "Warehouse updated successfully",
      data: warehouse,
    });
  } catch (error) {
    console.error("Error in update_warehouse:", error);
    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
};

module.exports.delete_warehouse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({
        code: 400,
        message: "Warehouse ID is required",
      });
    }

    // 1. Check if the warehouse exists and is not already deleted
    const warehouse = await db.WAREHOUSE_MASTER.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!warehouse) {
      return res.status(404).send({
        code: 404,
        message: "Warehouse not found or already deleted",
      });
    }

    // 2. Soft delete the warehouse
    await warehouse.update({ isDeleted: true });
    // 3. Soft delete related documents
    await db.warehouse_doc.update(
      { isDeleted: true },
      {
        where: { warehouse_id: id },
      },
    );

    return res.status(200).send({
      code: 200,
      message: "Warehouse deleted successfully",
    });
  } catch (error) {
    console.error("Error in delete_warehouse:", error);
    return res.status(500).send({
      code: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports.update_warehouse_bifurcation = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      total_storage_capacity,
      brss_id,
      capacity,
      stacking_rules,
      total_area,
      status,
      remark,
      weight_limit,
      documents = [], // [{ documents: 'doc1' }, ...]
      zone_data = [], // [{ zone_id, zone_size, zoneType_id }, ...]
      warehouse_id,
    } = req.body;

    // Check if bifurcation exists
    const bifurcation = await db.warehouse_bifurcation.findOne({
      where: { id: id, isDeleted: false },
    });

    if (!bifurcation) {
      return res.status(404).send({
        code: 404,
        message: "Warehouse bifurcation not found",
      });
    }

    // Update main bifurcation record
    await bifurcation.update({
      total_storage_capacity,
      brss_id,
      capacity,
      stacking_rules,
      total_area,
      status,
      remark,
      weight_limit,
      warehouse_id, // [{ zone_id, zone_size, zoneType_id }, ...]
    });

    // Delete existing zones and re-insert
    await db.warehouse_bifurcation_zone.destroy({
      where: { warehouse_bifurcation_id: id },
    });

    for (let item of zone_data) {
      await db.warehouse_bifurcation_zone.create({
        zone_id: item.zone_id,
        zone_size: item.zone_size,
        zoneType_id: item.zoneType_id,
        warehouse_id,
        warehouse_bifurcation_id: id,
      });
    }

    return res.status(200).send({
      code: 200,
      message: "Warehouse bifurcation updated successfully",
      data: bifurcation,
    });
  } catch (error) {
    console.error("Error in update_warehouse_bifurcation:", error);
    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
};

module.exports.getWarehouseBifurcationById = async (req, res) => {
  try {
    const { id } = req.params;

    // ======================================================
    // 1️⃣ BIFURCATION + WAREHOUSE DATA
    // ======================================================
    const [bifurcationData] = await db.sequelize.query(
      `
      SELECT 
        B.id,
        B.warehouse_id,
        W.area
      FROM WAREHOUSE_BIFURCATION B
      INNER JOIN WAREHOUSE_MASTER W ON W.id = B.warehouse_id
      WHERE B.id = :id AND B.isDeleted = false
      `,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.SELECT,
      },
    );

    if (!bifurcationData) {
      return res.status(404).send({
        code: 404,
        message: "Warehouse bifurcation not found",
      });
    }

    // ======================================================
    // 2️⃣ NORMAL ZONES (zoneType = 1)
    // ======================================================
    const zones = await db.sequelize.query(
      `
      SELECT 
        id,
        zoneType,
        zone_name,
        zone_size,
        bulk_zone_area,
        bulk_item_category,
        bulk_zone_status,
        number_Of_racks
      FROM WAREHOUSE_BIFURCATION_ZONE
      WHERE warehouse_bifurcation_id = :id
        AND zoneType = 1
        AND isDeleted = false
      `,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.SELECT,
      },
    );

    // ======================================================
    // 3️⃣ BULK ZONES (zoneType = 2)
    // ======================================================
    const bulkZones = await db.sequelize.query(
      `
      SELECT 
        id,
        zoneType,
        zone_name,
        bulk_zone_area,
        bulk_item_category,
        bulk_zone_status
      FROM WAREHOUSE_BIFURCATION_ZONE
      WHERE warehouse_bifurcation_id = :id
        AND zoneType = 2
        AND isDeleted = false
      `,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.SELECT,
      },
    );

    // ======================================================
    // 4️⃣ BUILD NESTED STRUCTURE (ZONE → RACK → SHELF → BIN)
    // ======================================================
    for (const zone of zones) {
      const racks = await db.sequelize.query(
        `
        SELECT 
          id,
          rack_name AS rackName,
          rack_area AS rack_capacity,
          number_Of_shelves AS numberOfShelves,
          rack_item_category
        FROM WAREHOUSE_RACK
        WHERE warehouse_zone_id = :zoneId
          AND isDeleted = false
        `,
        {
          replacements: { zoneId: zone.id },
          type: db.Sequelize.QueryTypes.SELECT,
        },
      );

      for (const rack of racks) {
        const shelves = await db.sequelize.query(
          `
          SELECT 
            id,
            shelf_name AS shelfName,
            shelf_area AS shelf_capacity,
            number_Of_bins AS numberOfBins,
            shelf_item_category
          FROM WAREHOUSE_SHELF
          WHERE warehouse_rack_id = :rackId
            AND isDeleted = false
          `,
          {
            replacements: { rackId: rack.id },
            type: db.Sequelize.QueryTypes.SELECT,
          },
        );

        for (const shelf of shelves) {
          const bins = await db.sequelize.query(
            `
            SELECT 
              id,
              bin_name AS binName,
              bin_area AS bin_capacity,
              bin_item_category
            FROM WAREHOUSE_BINS
            WHERE warehouse_shelf_id = :shelfId
              AND isDeleted = false
            `,
            {
              replacements: { shelfId: shelf.id },
              type: db.Sequelize.QueryTypes.SELECT,
            },
          );

          shelf.bins = bins;
        }

        rack.shelves = shelves;
      }

      zone.racks = racks;
    }

    return res.status(200).send({
      code: 200,
      message: "Warehouse bifurcation fetched successfully",
      data: {
        ...bifurcationData,
        zone_data: zones,
        zoneDataBulk: bulkZones,
      },
    });
  } catch (error) {
    console.error("Error in getWarehouseBifurcationById:", error);
    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
};

module.exports.getAllWarehouseBifurcation = async (req, res) => {
  try {
    const { employee_id, role_code, organization_id } = req.user;
    let whereClause = "w.isDeleted = false";
    if (role_code === "3PL_Org_Admin") {
      whereClause += " AND w.organization_id = :organization_id";
    } else if (role_code === "Super Admin") {
      whereClause += " AND w.organization_id IS NULL";
    } else {
      whereClause += " AND w.manager_id = :employee_id";
    }
    const bifurcations = await db.sequelize.query(
      `SELECT w.id as warehouse_id, w.name, w.code, w.license_number, w.area, u.first_name as manager_name, u.contact_number
      FROM WAREHOUSE_MASTER AS w 
      INNER JOIN WAREHOUSE_BIFURCATION_ZONE AS wbz ON w.id = wbz.warehouse_id
      LEFT JOIN HRMS_REGISTERED_USER AS u ON w.manager_id = u.employee_id
      WHERE ${whereClause}
      GROUP BY w.id ORDER BY w.createdAt DESC`,
      {
        type: db.Sequelize.QueryTypes.SELECT,
        replacements: { employee_id, organization_id },
      },
    );

    if (!bifurcations || bifurcations.length === 0) {
      return res.status(200).send({
        code: 404,
        message: "No warehouse bifurcations found",
        data: [],
      });
    }
    return res.status(200).send({
      code: 200,
      message: "Warehouse bifurcation list fetched successfully",
      data: bifurcations,
    });
  } catch (error) {
    console.error("Error in getAllWarehouseBifurcation:", error);
    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
};

module.exports.delete_warehouse_bifurcation = async (req, res) => {
  try {
    const { id } = req.params;

    const bifurcation = await db.warehouse_bifurcation.findOne({
      where: { id, isDeleted: false },
    });

    if (!bifurcation) {
      return res.status(404).send({
        code: 404,
        message: "Warehouse bifurcation not found or already deleted",
      });
    }

    await bifurcation.update({ isDeleted: true });

    return res.status(200).send({
      code: 200,
      message: "Warehouse bifurcation soft deleted successfully",
    });
  } catch (error) {
    console.error("Error in soft_delete_warehouse_bifurcation:", error);
    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
};

module.exports.create_warehouse_bifurcation = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { zones, warehouse_id } = req.body;

    const warehouseExist = await db.warehouse.findOne({
      where: { id: warehouse_id },
      transaction,
    });

    if (!warehouseExist) {
      return res.status(404).send({
        code: 404,
        message: "Warehouse not found",
      });
    }

    let createdZones = [];

    // ---------------- CREATE IF NOT EXIST ----------------

    if (Array.isArray(zones) && zones.length > 0) {
      for (const zone of zones) {
        let createdZone;
        if (zone.id && typeof zone.id === "number") {
          const zoneExist = await db.warehouse_bifurcation_zone.findOne({
            where: { id: zone.id },
            transaction,
          });
          if (zoneExist) {
            createdZone = await zoneExist.update(
              {
                name: zone.name,
                area: zone.area,
                item_category: zone.item_category,
                zone_type_id: zone.zone_type_id,
                warehouse_id: warehouse_id,
              },
              { transaction },
            );
          }
        } else {
          createdZone = await db.warehouse_bifurcation_zone.create(
            {
              name: zone.name,
              area: zone.area,
              item_category: zone.item_category,
              zone_type_id: zone.zone_type_id,
              warehouse_id: warehouse_id,
            },
            { transaction },
          );
        }

        const zoneData = { ...createdZone.toJSON(), warehouseBay: [] };

        if (Array.isArray(zone.warehouseBay) && zone.warehouseBay.length > 0) {
          for (const bay of zone.warehouseBay) {
            let createdBay;
            if (bay.id && typeof bay.id === "number") {
              const bayExist = await db.WAREHOUSE_BAY.findOne({
                where: { id: bay.id },
                transaction,
              });
              if (bayExist) {
                createdBay = await bayExist.update(
                  {
                    name: bay.name,
                    area: bay.area,
                    volume: bay.volume,
                    item_category: bay.item_category,
                    zone_id: createdZone.id,
                  },
                  { transaction },
                );
              }
            } else {
              createdBay = await db.WAREHOUSE_BAY.create(
                {
                  name: bay.name,
                  area: bay.area,
                  volume: bay.volume,
                  item_category: bay.item_category,
                  zone_id: createdZone.id,
                },
                { transaction },
              );
            }

            const bayData = { ...createdBay.toJSON(), warehouseRack: [] };

            for (const rack of bay.warehouseRack || []) {
              let createdRack;
              if (rack.id && typeof rack.id === "number") {
                const rackExist = await db.WAREHOUSE_RACK.findOne({
                  where: { id: rack.id },
                  transaction,
                });
                if (rackExist) {
                  createdRack = await rackExist.update(
                    {
                      name: rack.name,
                      area: rack.area,
                      volume: rack.volume,
                      item_category: rack.item_category,
                      bay_id: createdBay.id,
                    },
                    { transaction },
                  );
                }
              } else {
                createdRack = await db.WAREHOUSE_RACK.create(
                  {
                    name: rack.name,
                    area: rack.area,
                    volume: rack.volume,
                    item_category: rack.item_category,
                    bay_id: createdBay.id,
                  },
                  { transaction },
                );
              }
              const rackData = { ...createdRack.toJSON(), warehouseBin: [] };

              for (const bin of rack.warehouseBin || []) {
                let createdBin;
                if (bin.id && typeof bin.id === "number") {
                  const binExist = await db.WAREHOUSE_BIN.findOne({
                    where: { id: bin.id },
                    transaction,
                  });
                  if (binExist) {
                    createdBin = await binExist.update(
                      {
                        name: bin.name,
                        area: bin.area,
                        volume: bin.volume,
                        item_category: bin.item_category,
                        rack_id: createdRack.id,
                      },
                      { transaction },
                    );
                  }
                } else {
                  createdBin = await db.WAREHOUSE_BIN.create(
                    {
                      name: bin.name,
                      area: bin.area,
                      volume: bin.volume,
                      item_category: bin.item_category,
                      rack_id: createdRack.id,
                    },
                    { transaction },
                  );
                }
                rackData.warehouseBin.push(createdBin.toJSON());
              }
              bayData.warehouseRack.push(rackData);
            }
            zoneData.warehouseBay.push(bayData);
          }
        }
        createdZones.push(zoneData);
      }
    }

    await transaction.commit();

    return res.status(200).send({
      code: 200,
      message: "Warehouse bifurcation updated successfully",
      data: {
        createdZones,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);

    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
};

module.exports.update_warehouse_bifurcation = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { zone_data, warehouse_id } = req.body;

    const warehouseExist = await db.warehouse.findOne({
      where: { id: warehouse_id },
      transaction,
    });

    if (!warehouseExist) {
      return res
        .status(404)
        .send({ code: 404, message: "Warehouse not found" });
    }

    const bifurcation = await db.warehouse_bifurcation.findOne({
      where: { warehouse_id },
      transaction,
    });

    if (!bifurcation) {
      return res.status(404).send({
        code: 404,
        message: "Warehouse bifurcation not found",
      });
    }

    let zoneArea = 0,
      zoneSize = 0,
      rackArea = 0,
      shelfArea = 0,
      binArea = 0;

    for (const z of zone_data) {
      if (z.zoneType == "1" && !z.zone_size) {
        let autoZone = 0;
        if (z.racks?.length) {
          for (const r of z.racks) {
            autoZone += Number(r.rack_capacity || 0);
          }
        }
        z.zone_size = autoZone;
      }
    }

    for (const i of zone_data) {
      if (i.zoneType == "2") zoneArea += Number(i.bulk_zone_area || 0);

      if (i.zoneType == "1") {
        zoneSize += Number(i.zone_size || 0);
        for (const rack of i.racks || []) {
          rackArea += Number(rack.rack_capacity || 0);
          for (const shelf of rack.shelves || []) {
            shelfArea += Number(shelf.shelf_capacity || 0);
            for (const bin of shelf.bins || []) {
              binArea += Number(bin.bin_capacity || 0);
            }
          }
        }
      }
    }

    if (Number(warehouseExist.area) < zoneArea + zoneSize)
      return res
        .status(400)
        .send({ code: 400, message: "Zone area exceeds warehouse area" });

    if (zoneSize < rackArea)
      return res
        .status(400)
        .send({ code: 400, message: "Rack area exceeds zone area" });

    if (rackArea < shelfArea)
      return res
        .status(400)
        .send({ code: 400, message: "Shelf area exceeds rack area" });

    if (shelfArea < binArea)
      return res
        .status(400)
        .send({ code: 400, message: "Bin area exceeds shelf area" });

    /* ---------------- DELETE OLD DATA ---------------- */
    const oldZones = await db.warehouse_bifurcation_zone.findAll({
      where: { warehouse_bifurcation_id: bifurcation.id },
      transaction,
    });

    for (const zone of oldZones) {
      const racks = await db.warehouse_rack.findAll({
        where: { warehouse_zone_id: zone.id },
        transaction,
      });

      for (const rack of racks) {
        const shelves = await db.warehouse_shelf.findAll({
          where: { warehouse_rack_id: rack.id },
          transaction,
        });

        for (const shelf of shelves) {
          await db.warehouse_bins.destroy({
            where: { warehouse_shelf_id: shelf.id },
            transaction,
          });
        }

        await db.warehouse_shelf.destroy({
          where: { warehouse_rack_id: rack.id },
          transaction,
        });
      }

      await db.warehouse_rack.destroy({
        where: { warehouse_zone_id: zone.id },
        transaction,
      });
    }

    await db.warehouse_bifurcation_zone.destroy({
      where: { warehouse_bifurcation_id: bifurcation.id },
      transaction,
    });

    /* ---------------- INSERT UPDATED DATA (SAME AS CREATE) ---------------- */
    for (const item of zone_data) {
      if (item.zoneType == "2") {
        await db.warehouse_bifurcation_zone.create(
          {
            zoneType: item.zoneType,
            zone_name: item.zone_name,
            bulk_stack_height: item.bulk_stack_height,
            bulk_zone_area: item.bulk_zone_area,
            lifo_fifo: item.lifo_fifo,
            bulk_zone_status: item.bulk_zone_status,
            bulk_item_category: item.bulk_item_category,
            dimentions: item.dimentions,
            warehouse_bifurcation_id: bifurcation.id,
            warehouse_id,
          },
          { transaction },
        );
      }

      if (item.zoneType == "1") {
        const zone = await db.warehouse_bifurcation_zone.create(
          {
            zoneType: item.zoneType,
            zone_name: item.zone_name,
            zone_size: item.zone_size,
            number_Of_racks: item.numberOfRacks,
            warehouse_bifurcation_id: bifurcation.id,
            warehouse_id,
          },
          { transaction },
        );

        for (const rack of item.racks || []) {
          const createdRack = await db.warehouse_rack.create(
            {
              rack_name: rack.rackName,
              rack_area: rack.rack_capacity,
              rack_Of_volume: rack.rack_capacity,
              number_Of_shelves: rack.numberOfShelves,
              warehouse_zone_id: zone.id,
            },
            { transaction },
          );

          for (const shelf of rack.shelves || []) {
            const createdShelf = await db.warehouse_shelf.create(
              {
                shelf_name: shelf.shelfName,
                shelf_area: shelf.shelf_capacity,
                shelf_volume: shelf.shelf_capacity,
                number_Of_bins: shelf.numberOfBins,
                warehouse_rack_id: createdRack.id,
              },
              { transaction },
            );

            for (const bin of shelf.bins || []) {
              await db.warehouse_bins.create(
                {
                  bin_name: bin.binName,
                  bin_area: bin.bin_capacity,
                  warehouse_shelf_id: createdShelf.id,
                },
                { transaction },
              );
            }
          }
        }
      }
    }

    await transaction.commit();

    return res.status(200).send({
      code: 200,
      message: "Warehouse bifurcation updated successfully",
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).send({ code: 500, message: error.message });
  }
};
// find location

module.exports.find_location = async (req, res) => {
  try {
    const { state, city } = req.body;

    const states = await db.states.findOne({
      where: {
        states_name: state,
      },
    });

    const cityCheck = await db.city.findOne({
      where: {
        states_id: states.states_id,
        city_name: city,
      },
    });

    const locationCheck = await db.locationMaster.findAll({
      where: {
        city_id: cityCheck.city_id,
        isDeleted: false,
      },
    });

    return res
      .status(200)
      .send({ code: 200, message: "All States", data: locationCheck });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

module.exports.getWarehouseByBranch = async (req, res) => {
  try {
    let branch_id = req.params.branch_id;
    let warehouseList = await db.warehouse.findAll({
      where: { branch_id, isDeleted: 0 },
    });
    if (!warehouseList.length) {
      return res.status(404).send({ code: 404, message: "Warhouse not found" });
    }
    return res
      .status(200)
      .send({ code: 200, message: "Warehouse list", data: warehouseList });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

module.exports.getWarehouseByLocation = async (req, res) => {
  try {
    let location = req.params.location;
    let warehouseList = await db.warehouse.findAll({
      where: { location_id: location, isDeleted: 0 },
    });
    if (!warehouseList.length) {
      return res.status(404).send({ code: 404, message: "Warhouse not found" });
    }
    return res
      .status(200)
      .send({ code: 200, message: "Warehouse list", data: warehouseList });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

//// ------------------------ warehouse Recieved ----------------------------

module.exports.getRecievingWarehouseData = async (req, res) => {
  try {
    const { id, category_id } = req.query;
    let condition = "";
    if (category_id) {
      condition = `AND  MI.asset_id IN (${category_id})`;
    }

    const [recievingData] = await db.sequelize.query(
      `SELECT DISTINCT WB.id,WB.warehouse_id,W.name AS warehouse_name,GI.receiveQty,GIS.batchNo,GI.item_id,MI.asset_id,GIS.allocation_status,
             GIS.itemSerialNo,MI.Item_name,MI.item_code,MA.asset_category_name,(MI.Item_length_before * MI.Item_width_before) AS area,GIS.id AS grn_item_status_id
             FROM WAREHOUSE_BIFURCATION AS WB
             INNER JOIN WAREHOUSE_MASTER AS W ON W.id = WB.warehouse_id
             INNER JOIN GRN_MASTER AS G ON G.warehouse_id=W.id
             INNER JOIN GRN_ITEM AS GI ON GI.grn_Id=G.id
             INNER JOIN GRN_ITEM_STATUS AS GIS ON GIS.grn_item_id = GI.id
             INNER JOIN MASTER_ITEM AS MI ON MI.id = GI.item_id 
             INNER JOIN MASTER_ASSET AS MA ON MA.id = MI.asset_id
             WHERE WB.id = ${id} AND GIS.allocation_status = 'PENDING'  ${condition}`,
    );
    if (recievingData) {
      return res
        .status(200)
        .send({ code: 200, message: "success", data: recievingData });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "Data not Found", data: [] });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.getAllZonesByWarehouseId = async (req, res) => {
  try {
    const { warehouse_bifurcation_id } = req.query;
    const [zoneData] = await db.sequelize.query(
      `SELECT WB.warehouse_id,WBZ.*,WBZ.id AS warehouse_zone_id
            FROM WAREHOUSE_MASTER AS W 
            INNER JOIN WAREHOUSE_BIFURCATION AS WB ON WB.warehouse_id=W.id
            INNER JOIN WAREHOUSE_BIFURCATION_ZONE AS WBZ ON WBZ.warehouse_bifurcation_id=WB.id
            WHERE WB.id = ${warehouse_bifurcation_id}`,
    );
    if (zoneData.length > 0) {
      return res
        .status(200)
        .send({ code: 200, message: "success", data: zoneData });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "Data Not Found", data: [] });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.getAllRacksByZoneId = async (req, res) => {
  try {
    const { warehouse_zone_id } = req.query;
    const [rackData] = await db.sequelize.query(
      `SELECT WR.*
            FROM WAREHOUSE_BIFURCATION_ZONE AS WBZ
            INNER JOIN WAREHOUSE_RACK AS WR ON WR.warehouse_zone_id=WBZ.id
            WHERE WR.warehouse_zone_id = ${warehouse_zone_id}`,
    );
    if (rackData.length > 0) {
      return res
        .status(200)
        .send({ code: 200, message: "success", data: rackData });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "Data Not Found", data: [] });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.getAllShelfByRackId = async (req, res) => {
  try {
    const { warehouse_rack_id } = req.query;
    const [shelfkData] = await db.sequelize.query(
      `SELECT WS.*
            FROM WAREHOUSE_RACK AS WR
            INNER JOIN WAREHOUSE_SHELF AS WS ON WS.warehouse_rack_id=WR.id
            WHERE WS.warehouse_rack_id = ${warehouse_rack_id}`,
    );
    if (shelfkData.length > 0) {
      return res
        .status(200)
        .send({ code: 200, message: "success", data: shelfkData });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "Data Not Found", data: [] });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.getAllBinByShelfId = async (req, res) => {
  try {
    const { warehouse_shelf_id } = req.query;
    const [binData] = await db.sequelize.query(
      `SELECT WB.*
            FROM WAREHOUSE_SHELF AS WS
            INNER JOIN WAREHOUSE_BINS AS WB ON WB.warehouse_shelf_id=WS.id
            WHERE WB.warehouse_shelf_id = ${warehouse_shelf_id}`,
    );
    if (binData.length > 0) {
      return res
        .status(200)
        .send({ code: 200, message: "success", data: binData });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "Data Not Found", data: [] });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.allocateItemInWarehouse = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const {
      warehouse_id,
      zone_type_id,
      zone_id,
      bay_id,
      rack_id,
      bin_id,
      batchNo,
      item_id,
      area,
      serialNoList,
      receiveQty,
      bypass_approval,
    } = req.body;

    const safeValue = (value) => (value === "" ? null : value);

    if (
      !Array.isArray(serialNoList) ||
      (serialNoList.length === 0 && sr?.itemSerialNo != null)
    ) {
      serialNoList.forEach((sr) => {
        const year = new Date(sr.expiryDate).getFullYear();
        const paddedSerial = sr.itemSerialNo?.toString().padStart(4, "0");
        const paddedId = sr.id.toString().padStart(6, "0");
        sr.barcode = `${sr.batchNo}-${year}-${paddedSerial}-${paddedId}`;
      });
    }
    const allocationStatusVal = bypass_approval ? "ALLOCATED" : "PENDING";
    const allocationData = serialNoList.map((element) => ({
      warehouse_id: safeValue(warehouse_id),
      zone_type_id: safeValue(element.zone_type_id || zone_type_id),
      zone_id: safeValue(element.zone_id || zone_id),
      area: safeValue(element.area || area),
      bay_id: safeValue(element.bay_id || bay_id),
      rack_id: safeValue(element.rack_id || rack_id),
      bin_id: safeValue(element.bin_id || bin_id),
      grn_item_status_id: safeValue(element.id),
      receiveQty: element.batchType === "Batch Only" ? receiveQty : 1,
      batchNo: safeValue(batchNo),
      item_id: safeValue(item_id),
      allocation_status: allocationStatusVal,
    }));
    const createdAllocations = await db.warehouseAllocation.bulkCreate(
      allocationData,
      { transaction },
    );

    await db.grnItemStatus.update(
      { allocation_status: "SELECTED" },
      {
        where: {
          id: serialNoList.map((e) => e.id),
        },
        transaction,
      },
    );

    if (bypass_approval) {
      const createdIds = createdAllocations.map((a) => a.id);
      if (createdIds.length > 0) {
        const query = `SELECT WA.*, GM.grn_number, PO.po_number, PO.financial_year_id, PO.entity_id
        FROM WAREHOUSE_ALLOCATION AS WA
        INNER JOIN GRN_ITEM_STATUS AS GIS ON GIS.id = WA.grn_item_status_id
        INNER JOIN GRN_ITEM AS GI ON GI.id = GIS.grn_item_id
        INNER JOIN GRN_MASTER AS GM ON GM.id = GI.grn_id
        INNER JOIN PROCUREMENT_PURCHASE_ORDER AS PO ON PO.id = GM.po_id
        WHERE WA.id IN (${createdIds.join(",")})
        `;
        const [allData] = await db.sequelize.query(query, { transaction });
        for (const item of allData) {
          await manageInventoryLedger(
            {
              id: item.id,
              sales_order_no: item.grn_number,
              warehouse_id: item.warehouse_id,
              financial_id: item.financial_year_id,
              entity_id: item.entity_id,
              loginEmployee: req.user.employee_id,
            },
            "GRN",
            transaction,
          );
        }
      }
    }

    await transaction.commit();

    return res.status(200).send({
      code: 200,
      message: "Allocation Created Successfully",
    });
  } catch (error) {
    console.log("Error in allocateItemInWarehouse:", error);
    await transaction.rollback();

    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
  //   try {
  //     const {
  //       warehouse_id,
  //       zone_type_id,
  //       zone_id,
  //       bay_id,
  //       rack_id,
  //       bin_id,
  //       receiveQty,
  //       batchNo,
  //       item_id,
  //       area,
  //       itemSerialNo,
  //       serialNoList
  //     } = req.body;
  // serialNoList.forEach(sr => {
  //  const year = new Date(sr.expiryDate).getFullYear();
  //   const paddedSerial = sr.itemSerialNo.toString().padStart(4, '0');
  //   const paddedId = sr.id.toString().padStart(6, '0');

  //   sr.barcode = `${sr.batchNo}-${year}-${paddedSerial}-${paddedId}`;

  // });

  //     const safeValue = (value) => (value == "" ? null : value);
  //     const grnItemStatus = await db.grnItemStatus.findOne({
  //       where: { batchNo: safeValue(batchNo) },transaction
  //     });
  //     if (!grnItemStatus) {
  //       return res.status(404).send({ code: 404, message: "Batch Not Found" });
  //     }

  //     for (const element of serialNoList) {

  //     const data = await db.warehouseAllocation.create({
  //       warehouse_id: safeValue(warehouse_id),
  //       zone_type_id: safeValue(zone_type_id),
  //       zone_id: safeValue(zone_id),
  //       area: safeValue(area),
  //       bay_id: safeValue(bay_id),
  //       rack_id: safeValue(rack_id),
  //       bin_id: safeValue(bin_id),
  //       grn_item_status_id: safeValue(element.id),
  //       receiveQty: safeValue(receiveQty),
  //       batchNo: safeValue(batchNo),
  //       item_id: safeValue(item_id),
  //       itemSerialNo: safeValue(itemSerialNo),
  //       barcode_no:safeValue(element.barcode)
  //     },{transaction});
  //     await db.grnItemStatus.update(
  //       { allocation_status: "SELECTED" },
  //       { where: { id: safeValue(element.id) },transaction }
  //     );
  //   }

  //     if (data) {
  //       await transaction.commit();
  //       return res.status(200).send({ code: 200, message: "Created SuccessFully" });
  //     } else {
  //       await transaction.rollback();
  //       return res.status(404).send({ code: 404, message: "Data Not Found" });
  //     }
  //   } catch (error) {
  //       await transaction.rollback();

  //     return res.status(500).send({ code: 500, message: error.message });
  //   }
};

module.exports.getBulkStorageDataById = async (req, res) => {
  try {
    const { id, zone_type } = req.query;
    let dataList;
    if (zone_type == "2") {
      [dataList] = await db.sequelize.query(
        `SELECT DISTINCT WA.*,MI.item_name,MI.item_code,MA.asset_category_name,WM.name AS warehouse_name
                FROM WAREHOUSE_ALLOCATION AS WA
                INNER JOIN WAREHOUSE_BIFURCATION AS WB ON WB.id = WA.warehouse_bifurcation_id
                INNER JOIN MASTER_ITEM AS MI ON MI.id=WA.item_id
                INNER JOIN MASTER_ASSET AS MA ON MA.id = MI.asset_id
                INNER JOIN WAREHOUSE_MASTER AS WM ON WM.id = WA.warehouse_id
                WHERE WA.zone_type = ${zone_type} AND WA.warehouse_bifurcation_id = ${id}`,
      );
    } else {
      [dataList] = await db.sequelize.query(
        `SELECT DISTINCT WA.*,MI.item_name,MI.item_code,MA.asset_category_name,WM.name AS warehouse_name
                FROM WAREHOUSE_ALLOCATION AS WA
                INNER JOIN WAREHOUSE_BIFURCATION AS WB ON WB.id = WA.warehouse_bifurcation_id
                INNER JOIN WAREHOUSE_BINS AS WBS ON WBS.id = WA.bin_id
                INNER JOIN MASTER_ITEM AS MI ON MI.id=WA.item_id
                INNER JOIN MASTER_ASSET AS MA ON MA.id = MI.asset_id
                INNER JOIN WAREHOUSE_MASTER AS WM ON WM.id = WA.warehouse_id
                WHERE WA.zone_type = ${zone_type} AND WBS.id = ${id}
                UNION ALL 
                SELECT DISTINCT WA.*,MI.item_name,MI.item_code,MA.asset_category_name,WM.name AS warehouse_name
                FROM WAREHOUSE_ALLOCATION AS WA
                INNER JOIN WAREHOUSE_BIFURCATION AS WB ON WB.id = WA.warehouse_bifurcation_id
                INNER JOIN WAREHOUSE_SHELF AS WS ON WS.id = WA.shelf_id
                INNER JOIN MASTER_ITEM AS MI ON MI.id=WA.item_id
                INNER JOIN MASTER_ASSET AS MA ON MA.id = MI.asset_id
                INNER JOIN WAREHOUSE_MASTER AS WM ON WM.id = WA.warehouse_id
                WHERE WA.zone_type = ${zone_type} AND WS.id = ${id}
                UNION ALL 
                SELECT DISTINCT WA.*,MI.item_name,MI.item_code,MA.asset_category_name,WM.name AS warehouse_name
                FROM WAREHOUSE_ALLOCATION AS WA
                INNER JOIN WAREHOUSE_BIFURCATION AS WB ON WB.id = WA.warehouse_bifurcation_id
                INNER JOIN WAREHOUSE_RACK AS WR ON WR.id = WA.rack_id
                INNER JOIN MASTER_ITEM AS MI ON MI.id=WA.item_id
                INNER JOIN MASTER_ASSET AS MA ON MA.id = MI.asset_id
                INNER JOIN WAREHOUSE_MASTER AS WM ON WM.id = WA.warehouse_id
                WHERE WA.zone_type = ${zone_type} AND WR.id = ${id}`,
      );
    }

    if (dataList) {
      return res
        .status(200)
        .send({ code: 200, message: "success", data: dataList });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "Data Not Found", data: [] });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

exports.getWarehouseHierarchy = async (req, res) => {
  try {
    const { warehouse_id } = req.query;

    if (!warehouse_id) {
      return res.status(400).send({
        code: 400,
        message: "Warehouse ID is required",
      });
    }

    const zones = await db.warehouse_bifurcation_zone.findAll({
      where: { warehouse_id: warehouse_id, isDeleted: false },
      include: [
        {
          model: db.WAREHOUSE_BAY,
          as: "warehouseBay",
          include: [
            {
              model: db.WAREHOUSE_RACK,
              as: "warehouseRack",
              include: [
                {
                  model: db.WAREHOUSE_BIN,
                  as: "warehouseBin",
                },
              ],
            },
          ],
        },
      ],
    });

    return res.status(200).send({
      code: 200,
      message: "Zones retrieved successfully",
      data: zones,
    });
  } catch (error) {
    console.error("getWarehouseHierarchy Error:", error);

    return res.status(500).send({
      code: 500,
      message: "Internal Server Error",
    });
  }
};

exports.getWarehouseBifurcationByTypeId = async (req, res) => {
  try {
    const { id, warehouse_id, type, asset_id } = req.query;

    if (!id || !warehouse_id || !type || !asset_id) {
      return res.status(400).send({
        code: 400,
        message: `${type} ID and Warehouse ID and Type and Asset ID are required`,
      });
    }

    const { Op } = db.Sequelize;

    // Validate required params
    if (!type || !id) {
      return res.status(400).json({ message: "Type and id are required" });
    }

    // Convert asset_id properly
    let assetIdArray = [];

    if (Array.isArray(asset_id)) {
      assetIdArray = asset_id;
    } else if (typeof asset_id === "string" && asset_id.includes(",")) {
      assetIdArray = asset_id.split(",").map(Number);
    } else if (asset_id) {
      assetIdArray = [parseInt(asset_id)];
    }

    // Base where condition
    let whereCondition = {
      isDeleted: false,
    };
    const { literal } = db.Sequelize;

    // Add item_category filter only if assetIdArray has values
    if (assetIdArray.length > 0) {
      whereCondition[Op.or] = assetIdArray.map((id) =>
        literal(`JSON_CONTAINS(item_category, '${id}')`),
      );
    }

    let dataList;

    switch (type.toLowerCase()) {
      case "zone":
        whereCondition.zone_type_id = id;
        whereCondition.warehouse_id = warehouse_id;
        dataList = await db.warehouse_bifurcation_zone.findAll({
          where: whereCondition,
        });
        break;

      case "bay":
        whereCondition.zone_id = id;
        dataList = await db.WAREHOUSE_BAY.findAll({ where: whereCondition });
        break;

      case "rack":
        whereCondition.bay_id = id;
        dataList = await db.WAREHOUSE_RACK.findAll({ where: whereCondition });
        break;

      case "bin":
        whereCondition.rack_id = id;
        dataList = await db.WAREHOUSE_BIN.findAll({ where: whereCondition });
        break;

      default:
        return res.status(400).json({ message: "Invalid type" });
    }

    if (!dataList || dataList.length === 0) {
      return res.status(404).send({
        code: 404,
        // message: `${type} not found for the given ${type} Type and Warehouse ID and Item Category`,
        message: `No Sub Location found for the specified Sub Location Type, Warehouse, and Item Category.`,
      });
    }

    return res.status(200).send({
      code: 200,
      message: `Data retrieved successfully.`,
      data: dataList,
    });
  } catch (error) {
    console.error("getWarehouseBifurcationByTypeId Error:", error);

    return res.status(500).send({
      code: 500,
      message: "Internal Server Error",
    });
  }
};

exports.getAllPendingGrnAllcation = async (req, res) => {
  try {
    const { entity_id } = req.query;
    const { employee_id, role_code, organization_id } = req.user;
    let whereClause = " W.isDeleted = false";
    if (role_code === "3PL_Org_Admin") {
      whereClause += " AND W.organization_id = :organization_id";
    } else if (role_code === "Super Admin") {
      whereClause += " AND W.organization_id IS NULL";
    } else {
      whereClause += " AND W.manager_id = :employee_id";
    }

    if (!entity_id) {
      return res
        .status(400)
        .send({ code: 400, message: "Missing query parameters" });
    }

    const query = `
    SELECT
      GM.grn_number,
      GM.po_category_type,
      GM.grnStatus AS discardStatus,
      GM.invoiceNo,
      GM.invoiceDate,
      PO.id,
      G.version,
      GM.total_amount AS total_purchase,
      GM.invoiceDoc,
      GM.grnStatus,
      GM.po_Id,
      GM.financial_year_id,
      GM.entity_id,
      GM.employee_id,
      GM.version_id,
      GM.grn_date,
      PO.po_number,
      PO.po_type,
      PO.po_category,
      PO.createdAt AS po_date,
      GM.mltiple_data,
      VB.vendor_name,
      W.name AS warehouse_name,
      GM.addstock_status
      -- 👇 removed IM.invoice_status, IM.mode, IM.invoice_number
    FROM GRN_MASTER AS GM
    INNER JOIN PROCUREMENT_PURCHASE_ORDER AS PO ON PO.id = GM.po_Id
    INNER JOIN VENDOR_BASIC_DETAILS AS VB ON VB.id = PO.vendor_id
    INNER JOIN WAREHOUSE_MASTER AS W ON W.id = PO.warehouse_id
    INNER JOIN GRN_VERSION_MST AS G ON G.id = GM.version_id
    INNER JOIN GRN_ITEM AS GI ON GI.grn_Id = GM.id
    INNER JOIN GRN_ITEM_STATUS AS GIS ON GIS.grn_item_id = GI.id
    WHERE GM.grnStatus = 'COMPLETED'
      AND GM.entity_id = ${entity_id}
      AND ${whereClause}
      AND GM.isDeleted = FALSE
      AND GM.status = 'ACTIVE'
      AND GIS.allocation_status = 'PENDING' AND GIS.itemStatus = 'SELECTED'
      GROUP BY GM.id
    ORDER BY GM.id DESC
`;
    const getData = await db.sequelize.query(query, {
      type: db.Sequelize.QueryTypes.SELECT,
      replacements: { employee_id, organization_id },
    });

    if (!getData || getData.length === 0) {
      return res.status(200).send({
        code: 404,
        message: "No Pending GRN Allocation Found",
        data: [],
      });
    }

    const [itemList] = await db.sequelize.query(
      `SELECT G.id,G.po_Id,SUM(GI.selection_item) AS qty,G.version_id
         FROM GRN_MASTER AS G
         INNER JOIN GRN_ITEM AS GI ON GI.grn_Id=G.id
         GROUP BY G.id,G.po_Id`,
    );

    const itemListWithQtyAsInt = itemList.map((item) => ({
      ...item,
      qty: parseInt(item.qty, 10) || 0,
    }));

    const finalCount = [...itemListWithQtyAsInt];

    function mergeDataValue(finalCount) {
      const mergedData = [];
      finalCount.forEach((item) => {
        const existingItem = mergedData.find(
          (i) => i.id === item.id && i.version_id == item.version_id,
        );
        if (existingItem) {
          existingItem.qty += parseInt(item.qty);
        } else {
          mergedData.push({ ...item });
        }
      });

      return mergedData;
    }
    const result = mergeDataValue(finalCount);
    const finalData = await getData.map((md) => {
      const item = result.find(
        (item) => item.po_Id == md.po_Id && item.version_id == md.version_id,
      );
      md.item_quantity = item ? item.qty : 0;
      return md;
    });

    if (finalData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Data Retrieved Successfully",
        data: finalData,
      });
    } else {
      return res
        .status(200)
        .send({ code: 404, message: "Record Not Found", data: finalData });
    }
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getPendingGrnAllcationById = async (req, res) => {
  try {
    let { id, version_id } = req.query;
    const { invoice_number } = req.query;
    version_id = version_id && version_id != "undefined" ? version_id : 0;

    if (invoice_number && invoice_number != "undefined") {
      const [grnResult] = await db.sequelize.query(
        `SELECT group_concat(GM.po_Id) as po_Id 
                             FROM GRN_MASTER AS GM
                             WHERE invoiceNo = '${invoice_number}'`,
      );

      if (grnResult) {
        id = grnResult[0].po_Id;
      } else {
        return res.status(404).send({
          code: 404,
          message: "No PO found for given invoice number",
        });
      }
    } else {
      id = id;
    }

    const [valueData] = await db.sequelize.query(
      `SELECT G.grn_number, G.po_category_type, P.po_type, G.invoiceDate, G.invoiceNo, G.invoiceDoc, G.po_Id, G.id, G.version_id, G.total_amount,
                P.po_number, P.po_date, P.vendor_id, V.vendor_name, G.grn_date, P.grn_status, G.grnStatus, P.warehouse_id, WM.name AS warehouse_name
                FROM GRN_MASTER AS G
                INNER JOIN PROCUREMENT_PURCHASE_ORDER AS P ON P.id = G.po_Id
                INNER JOIN VENDOR_BASIC_DETAILS AS V ON V.id = P.vendor_id
                INNER JOIN WAREHOUSE_MASTER AS WM ON WM.id = P.warehouse_id
                WHERE  P.id IN (${id}) AND G.version_id=${version_id} `,
    );
    const [itemList] = await db.sequelize.query(
      `SELECT DISTINCT G.po_Id,P.po_number,GI.id AS grn_item_id, GI.receiveQty,GI.amount,GI.total_mvp,
                COALESCE(GI.rejectQty, 0) AS final_reject, GI.selection_item,GI.po_qty AS quantity,
                GI.invoice_status,I.item_name,I.manage_by,I.item_code,A.asset_category_name,
                GI.grn_Id, GI.item_id, GI.po_item_id, GI.version_id,GIS.batchNo,I.sub_category_id,I.asset_id, HC.hsn_sac_code AS hsnCode, GR.value AS gstRate
                FROM GRN_MASTER AS G
                INNER JOIN GRN_ITEM AS GI ON GI.grn_Id=G.id
                INNER JOIN MASTER_ITEM AS I ON I.id = GI.item_id
                INNER JOIN MASTER_HSN_SAC_CODE AS HC ON HC.id = I.hsn_code_id
                INNER JOIN GST_RATE_MASTER AS GR ON GR.id = HC.gst_rate_id
                INNER JOIN MASTER_ASSET AS A ON A.id = I.asset_id
                INNER JOIN PROCUREMENT_PURCHASE_ORDER AS P ON P.id=G.po_Id
                LEFT JOIN GRN_ITEM_STATUS AS GIS ON GIS.grn_item_id = GI.id
                LEFT JOIN PROCUREMENT_PURCHASE_ORDER_ITEM AS POI ON POI.purchase_order_id = G.po_Id
                WHERE P.id IN (${id}) AND GI.version_id=${version_id} AND GIS.allocation_status = 'PENDING' AND GIS.itemStatus = 'SELECTED'
                `,
    );
    if (itemList.length == 0) {
      return res.status(404).send({
        code: 404,
        message: "Record Not Found",
      });
    }
    if (invoice_number !== "undefined") {
      const idArray = id.split(",").map(Number);
      id = [idArray[0]].join(",");
    }
    const [addtiondata] = await db.sequelize.query(
      `SELECT PP.*
                 FROM PO_PAYMENT_ADDTIONAL_LIST_MST AS PP
                 WHERE  PP.po_id IN (${id}) AND PP.version_id=${version_id}`,
    );

    const Obj = {
      ...valueData[0],
      ItemList: itemList,
      list: addtiondata,
    };
    if (Obj) {
      return res.status(200).send({
        code: 200,
        message: "Get Data Successfully",
        data: Obj,
      });
    } else {
      return res.status(200).send({
        code: 404,
        message: "Record Not Found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.getAllStocksByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const { employee_id, role_code, organization_id } = req.user;
    let whereClause = " WM.isDeleted = false";
    if (role_code === "3PL_Org_Admin") {
      whereClause += " AND WM.organization_id = :organization_id";
    } else if (role_code === "Super Admin") {
      whereClause += " AND WM.organization_id IS NULL";
    } else {
      whereClause += " AND WM.manager_id = :employee_id";
    }
    if (status === "All") {
      whereClause += ` AND 1=1 `;
    } else {
      whereClause += ` AND WA.allocation_status = '${status}'`;
    }
    const query = `
SELECT 
    SUM(WA.receiveQty) AS quantity,
    WA.item_id,
    WA.id,
    WA.warehouse_id,
    WA.zone_type_id,
    WA.zone_id,
    WA.bay_id,
    WA.rack_id,
    WA.bin_id,
    WA.allocation_status,

    MI.item_name,
    MI.item_code,

    WM.name AS warehouse_name,

    ZT.zone_type,
    WBZ.name AS zone_name,
    WB.name AS bay_name,
    WR.name AS rack_name,
    WBIN.name AS bin_name,

    MA.asset_category_name,
    MSC.sub_category_name,
    GM.source_type

FROM WAREHOUSE_ALLOCATION AS WA

INNER JOIN MASTER_ITEM AS MI 
    ON MI.id = WA.item_id

INNER JOIN MASTER_ASSET AS MA 
    ON MA.id = MI.asset_id

INNER JOIN MASTER_SUB_CATEGORY AS MSC 
    ON MSC.id = MI.sub_category_id

INNER JOIN WAREHOUSE_MASTER AS WM 
    ON WM.id = WA.warehouse_id

INNER JOIN MASTER_ZONE_TYPE AS ZT 
    ON ZT.id = WA.zone_type_id

LEFT JOIN WAREHOUSE_BIFURCATION_ZONE AS WBZ 
    ON WBZ.id = WA.zone_id

LEFT JOIN WAREHOUSE_BAY AS WB 
    ON WB.id = WA.bay_id

LEFT JOIN WAREHOUSE_RACK AS WR 
    ON WR.id = WA.rack_id

LEFT JOIN WAREHOUSE_BIN AS WBIN 
    ON WBIN.id = WA.bin_id

INNER JOIN GRN_ITEM_STATUS AS GS 
    ON WA.grn_item_status_id = GS.id

INNER JOIN GRN_ITEM AS GI 
    ON GS.grn_item_id = GI.id

INNER JOIN GRN_MASTER AS GM
    ON GM.id = GI.grn_Id

WHERE ${whereClause}

GROUP BY WA.id

ORDER BY WA.id DESC
`;
    const data = await db.sequelize.query(query, {
      type: db.Sequelize.QueryTypes.SELECT,
      replacements: { employee_id, organization_id },
    });

    if (data && data.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Data Retrieved Successfully",
        data: data,
      });
    } else {
      return res
        .status(200)
        .send({ code: 404, message: "Record Not Found", data: data });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.updateStockStatus = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { id, ids, allocation_status } = req.body;
    let idList = [];
    if (ids && Array.isArray(ids)) {
      idList = ids;
    } else if (id) {
      idList = [id];
    }

    if (idList.length === 0) {
      await transaction.rollback();
      return res.status(400).send({ code: 400, message: "No IDs provided" });
    }

    const query = `SELECT WA.*, GM.grn_number, PO.po_number, PO.financial_year_id, PO.entity_id
    FROM WAREHOUSE_ALLOCATION AS WA
    INNER JOIN GRN_ITEM_STATUS AS GIS ON GIS.id = WA.grn_item_status_id
    INNER JOIN GRN_ITEM AS GI ON GI.id = GIS.grn_item_id
    INNER JOIN GRN_MASTER AS GM ON GM.id = GI.grn_id
    INNER JOIN PROCUREMENT_PURCHASE_ORDER AS PO ON PO.id = GM.po_id
    WHERE WA.id IN (${idList.join(",")})
    `;
    const [allocationData] = await db.sequelize.query(query);

    if (allocationData.length == 0) {
      await transaction.rollback();
      return res.status(404).send({
        code: 404,
        message: "Record Not Found",
        allocationData,
      });
    }

    const data = await db.warehouseAllocation.update(
      {
        allocation_status: allocation_status,
      },
      {
        where: {
          id: idList,
        },
        transaction,
      },
    );
    if (data) {
      if (allocation_status === "ALLOCATED") {
        for (const item of allocationData) {
          await manageInventoryLedger(
            {
              id: item.id,
              sales_order_no: item.grn_number,
              warehouse_id: item.warehouse_id,
              financial_id: item.financial_year_id,
              entity_id: item.entity_id,
              loginEmployee: req.user.employee_id,
            },
            "GRN",
            transaction,
          );
        }
      }
      await transaction.commit();
      return res.status(200).send({
        code: 200,
        message: "Data Updated Successfully",
        data: data,
      });
    } else {
      await transaction.rollback();
      return res
        .status(404)
        .send({ code: 404, message: "Record Not Found", data: data });
    }
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.getsSerialNo = async (req, res) => {
  try {
    const { grn_item_id } = req.params;
    const transaction = await db.sequelize.transaction();
    const serialNo = await db.grnItemStatus.findAll({ where: { grn_item_id } });
    if (!serialNo.length) {
      return res.status(404).send({
        code: 404,
        message: "Serial no. or Batch no. not found",
      });
    }
    await transaction.commit();
    return res.status(200).send({
      code: 200,
      message: "Data Updated Successfully",
      data: serialNo,
    });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

module.exports.getAllWarehouseList = async (req, res) => {
  try {
    const { entity_id } = req.query;

    const [warehouses] = await db.sequelize.query(
      `SELECT WM.*, WT.warehouse_type_name, LM.location_name
            FROM 
                WAREHOUSE_MASTER AS WM 
                LEFT JOIN WAREHOUSE_TYPE AS WT ON WT.id = WM.warehouse_type_id
                LEFT JOIN LOCATION_MASTER AS LM ON LM.id = WM.location_id
            WHERE WM.entity_id=${entity_id} AND WM.isDeleted = 0
            ORDER BY WM.name ASC`,
    );

    return res.status(200).send({
      code: 200,
      message: "Warehouse list fetched successfully",
      data: warehouses,
    });
  } catch (error) {
    console.error("Error in getAllWarehouseMst:", error);
    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
};

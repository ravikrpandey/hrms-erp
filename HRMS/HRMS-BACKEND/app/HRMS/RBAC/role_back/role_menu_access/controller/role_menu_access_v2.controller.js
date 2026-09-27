const db = require("../../../../../models/index");
const { Op } = require("sequelize");

// Destructure models for cleaner code
const {
  role_menu_access: roleMenuAccessDetails,
  read_write_access: readWriteAccessDetails,
} = db;

exports.editroleMenuAccess_v2 = async (req, res) => {
  const timings = {}; // For performance measurement
  try {
    timings.start = new Date();

    const { employee_id, role_master_id, entity_list = [] } = req.body;
    let roleMenuUpdateData;

    // --- Removing Extra Entries ---
    timings.removeExtraEntriesStart = new Date();

    // Fetch existing entity_ids more efficiently
    const existingEntityAccess = await roleMenuAccessDetails.findAll({
      where: { employee_id, role_master_id },
      attributes: ["entity_id"],
      group: ["entity_id"], // Group to get distinct entity_ids
      raw: true, // Get plain data objects
    });

    const existingEntityIds = new Set(
      existingEntityAccess.map((entry) => entry.entity_id)
    );
    const entityListSet = new Set(entity_list);

    // Determine entity_ids to delete (those existing but not in the new list)
    const dEntityIds = Array.from(existingEntityIds).filter(
      (entityId) => !entityListSet.has(entityId)
    );

    if (dEntityIds.length > 0) {
      // Use a transaction for atomicity when deleting
      await db.sequelize.transaction(async (t) => {
        await Promise.all([
          roleMenuAccessDetails.destroy({
            where: {
              employee_id,
              role_master_id,
              entity_id: { [Op.in]: dEntityIds },
            },
            transaction: t,
          }),
          readWriteAccessDetails.destroy({
            where: {
              employee_id,
              role_master_id,
              entity_id: { [Op.in]: dEntityIds },
            },
            transaction: t,
          }),
        ]);
      });
      console.log("Deleted entries for entity_ids:", dEntityIds);
    }
    timings.removeExtraEntriesEnd = new Date();

    // --- Main Processing: Upserting Records ---
    timings.mainProcessingStart = new Date();
    const allRecordsToProcess = [];

    // Iterate through the input data structure to prepare records for upsert
    for (const entity_id of entity_list) {
      for (const module of req.body?.main_array || []) {
        const {
          role_module_master_id,
          role_module_master_name,
          role_module_master_completed,
        } = module;

        for (const menu of module.HRMS_RBAC_MENU_MASTER || []) {
          const {
            menu_master_id,
            menu_master_name,
            menu_completed,
            HRMS_RBAC_SUBMENU_MASTER,
          } = menu;

          if (HRMS_RBAC_SUBMENU_MASTER && HRMS_RBAC_SUBMENU_MASTER.length) {
            for (const submenu of HRMS_RBAC_SUBMENU_MASTER) {
              const {
                submenu_master_id,
                submenu_master_name,
                submenu_completed,
              } = submenu;

              allRecordsToProcess.push({
                role_module_master_id,
                role_module_master_name,
                role_module_master_completed,
                menu_master_id,
                menu_master_name,
                submenu_master_id,
                submenu_master_name,
                employee_id,
                role_master_id,
                entity_id,
                menu_completed,
                submenu_completed,
                status: "ACTIVE",
              });
            }
          } else {
            allRecordsToProcess.push({
              role_module_master_id,
              role_module_master_name,
              role_module_master_completed,
              menu_master_id,
              menu_master_name,
              submenu_master_id: null,
              submenu_master_name: null,
              employee_id,
              role_master_id,
              entity_id,
              menu_completed,
              submenu_completed: false,
              status: "ACTIVE",
            });
          }
        }
      }
    }

    if (allRecordsToProcess.length > 0) {
      // Perform a single bulkCreate operation with updateOnDuplicate
      roleMenuUpdateData = await roleMenuAccessDetails.bulkCreate(
        allRecordsToProcess,
        {
          updateOnDuplicate: [
            "role_module_master_completed",
            "menu_completed",
            "submenu_completed",
            "status", // Ensure status is updated if it changes
          ],
          // The fields that form the unique key for conflict detection should be defined
          // as a unique index in your `role_menu_access` model.
          // For example, in your model definition:
          // uniqueKeys: {
          //   composite_key: {
          //     fields: ['employee_id', 'role_master_id', 'entity_id', 'role_module_master_id', 'menu_master_id', 'submenu_master_id']
          //   }
          // }
        }
      );
    } else {
      roleMenuUpdateData = []; // No records to process
    }

    timings.mainProcessingEnd = new Date();

    timings.end = new Date();

    // Calculate durations
    timings.totalDuration = timings.end - timings.start;
    timings.removeExtraEntriesDuration =
      timings.removeExtraEntriesEnd - timings.removeExtraEntriesStart;
    timings.mainProcessingDuration =
      timings.mainProcessingEnd - timings.mainProcessingStart;

    return res.status(200).send({
      code: 200,
      message: "Role Updated Successfully",
      result: roleMenuUpdateData,
      timings: {
        totalDuration: timings.totalDuration,
        removeExtraEntriesDuration: timings.removeExtraEntriesDuration,
        mainProcessingDuration: timings.mainProcessingDuration,
      },
    });
  } catch (err) {
    console.error("Error in editroleMenuAccess_v2:", err); // Log the full error
    return res.status(500).send({
      code: 500,
      message: "Server Error",
      error: err.message,
    });
  }
};

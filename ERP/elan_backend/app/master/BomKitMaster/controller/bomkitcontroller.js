const db = require("../../../models/index");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");

exports.getItemList = async (req, res) => {
  try {
    const itemData = await db.ItemMaster.findAll({
      where: {
        status: 'ACTIVE',
        isDeleted: false,
        // entity_id: req.query.entity_id,
        item_type_id: {
          [Op.in]: [1, 7, 8],
        },
      },
      attributes: ["id", "item_code", "item_name", "manage_by"],
      include: [
        {
          model: db.tbl_itemType,
          attributes: ["itemType"],
        },
      ],
      order: [["item_name", "ASC"]],
    });

    if (itemData) {
      return res.status(200).send({
        code: 200,
        message: "Get All Item data successfully",
        data: itemData,
      });
    } else {
      return res.status(404).send({ code: 404, message: "No Item found" });
    }
  } catch (error) {
    console.log(error, "Error");
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.getBOMList = async (req, res) => {
  try {
    const data = await db.BOM_KIT_GROUP.findAll({
      where: {
        entity_id: req.query.entity_id
      },
      attributes: ["bom_code"],
      include: [
        {
          model: db.BOM_KIT_MASTER,
          as: "bomMasters",
          separate: true,
          limit: 1,
          where: {
            isDeleted: false
          },
          order: [["id", "DESC"]],
          attributes: [
            "id",
            "version_no",
            "bom_name",
            "bom_price",
            "hsn_id",
            "gst",
            "created_by",
            "createdAt",
            "status"
          ],
          include: [
            {
              model: db.BOM_KIT_ITEM,
              as: "bomItems"
            },
            {
              model: db.hsn_sac_master,
              as: "hsnCode",
              attributes: ["hsn_sac_code"]
            },
            {
              model: db.user,
              as: "createUser",
              attributes: ["first_name", "employee_code"]
            }
          ]
        }
      ],
      order: [["id", "DESC"]]
    });

    const result = await Promise.all(
      data.map(async group => {
        const master = group.bomMasters?.[0];

        // all version delete case
        if (!master) {
          return null;
        }

        const version_count = await db.BOM_KIT_MASTER.count({
          where: {
            bom_group_id: group.id, isDeleted: false
          }
        });

        const versions = await db.BOM_KIT_MASTER.findAll({
          where: {
            bom_group_id: group.id, isDeleted: false
          },
          attributes: [
            "id",
            "version_no",
            "bom_name",
            "bom_price",
            "status",
            "createdAt"
          ],
          include: [
            {
              model: db.user,
              as: "createUser",
              attributes: ["first_name", "employee_code"]
            }
          ],
          order: [["id", "DESC"]]
        });

        return {
          bom_code: group.bom_code,
          id: master?.id,
          bom_name: master?.bom_name || "",
          bom_price: master?.bom_price || 0,
          hsn_code: master?.hsnCode?.hsn_sac_code || "",
          gst: master?.gst || 0,
          version_no: master?.version_no || 1,
          item_count: master?.bomItems?.length || 0,
          created_by: master?.createUser
                    ? `${master.createUser.first_name} [${master.createUser.employee_code}]`
                    : "",
          createdAt: master?.createdAt,
          status: master?.status,
          version_count: version_count,
          versions: versions
        };
      })
    );

    const finalResult = result.filter(Boolean);

    return res.status(200).send({
      code: 200,
      message: "Data fetched successfully",
      data: finalResult
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      code: 500,
      message: error.message
    });
  }
};

exports.createUpdateBOM = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { bom_id, bom_name, bom_price, hsn_id, gst_value, items, entity_id, financial_id, pageMode } = req.body;

    let isNewVersion = false;
    // CREATE LOGIC
    if (!bom_id) {
        // CREATE BOM GROUP
        const lastGroup = await db.BOM_KIT_GROUP.findOne({
            where: {
                entity_id: entity_id
            },
            order: [["id", "DESC"]],
            transaction
        });

        const nextNo = lastGroup ? lastGroup.id + 1 : 1;
        const bomCode = `BOM${String(nextNo).padStart(5, "0")}`;

        const bomGroup = await db.BOM_KIT_GROUP.create(
            {
                bom_code: bomCode, entity_id: entity_id
            },
            { transaction }
        );

        // CREATE BOM MASTER
        const bomMaster = await db.BOM_KIT_MASTER.create(
            {
              bom_group_id: bomGroup.id,
              version_no: 1,
              bom_name,
              bom_price,
              hsn_id,
              gst: gst_value,
              created_by: req.user?.employee_id,
              financial_id,
              ...(pageMode === 'salesCRM' && {
                status: 'Approved',
                approved_by: req.user?.employee_id,
                approved_at: new Date()
              })
            },
            { transaction }
        );

        // CREATE ITEMS
        for (const item of items || []) {

            const bomItem = await db.BOM_KIT_ITEM.create(
            {
                bom_id: bomMaster.id,
                item_id: item.itemId,
                quantity: item.quantity
            },
            { transaction }
            );

            // CREATE SUBSTITUTE ITEMS
            if (item.substituteItems && item.substituteItems.length) {

                const substitutePayload =
                    item.substituteItems.map((substituteId) => ({
                    bom_item_id: bomItem.id,
                    substitute_item_id: substituteId
                    }));

                await db.BOM_KIT_SUBSTITUTE_ITEM.bulkCreate(
                    substitutePayload,
                    { transaction }
                );
            }
        }
    } else {
      // UPDATE LOGIC
      const checkStatus = await db.BOM_KIT_MASTER.findOne({where: {id: bom_id},attributes: ["status", "bom_group_id"]});
      if (!checkStatus) {
        await transaction.rollback();

        return res.status(404).send({
          code: 404,
          message: "BOM not found"
        });
      }

      if (checkStatus.status === "Draft") {
        // Update BOM Master
        await db.BOM_KIT_MASTER.update(
          {
            bom_name,
            bom_price,
            hsn_id,
            gst: gst_value
          },
          {
            where: { id: bom_id },
            transaction
          }
        );

        // Existing BOM Items
        const existingItems = await db.BOM_KIT_ITEM.findAll({
          where: { bom_id },
          attributes: ["id"],
          transaction
        });

        const bomItemIds = existingItems.map(item => item.id);

        // Delete Existing Substitute Items
        if (bomItemIds.length) {
          await db.BOM_KIT_SUBSTITUTE_ITEM.destroy({
            where: {
              bom_item_id: bomItemIds
            },
            transaction
          });
        }

        // Delete Existing BOM Items
        await db.BOM_KIT_ITEM.destroy({
          where: { bom_id },
          transaction
        });

        // Recreate Items & Substitute Items
        for (const item of items) {

          const bomItem = await db.BOM_KIT_ITEM.create(
            {
              bom_id,
              item_id: item.itemId,
              quantity: item.quantity
            },
            { transaction }
          );

          if (item.substituteItems?.length) {

            await db.BOM_KIT_SUBSTITUTE_ITEM.bulkCreate(
              item.substituteItems.map(substituteId => ({
                bom_item_id: bomItem.id,
                substitute_item_id: substituteId
              })),
              { transaction }
            );
          }
        }
      }else{
        // CREATE BOM MASTER WITH NEW VERSION
        isNewVersion = true;
        const latestVersion = await db.BOM_KIT_MASTER.max("version_no", {
          where: {
            bom_group_id: checkStatus.bom_group_id
          },
          transaction
        });

        const bomMaster = await db.BOM_KIT_MASTER.create(
          {
            bom_group_id: checkStatus.bom_group_id,
            version_no: latestVersion+1,
            bom_name,
            bom_price,
            hsn_id,
            gst: gst_value,
            created_by: req.user?.employee_id,
            financial_id,
            ...(pageMode === 'salesCRM' && {
              status: 'Approved',
              approved_by: req.user?.employee_id,
              approved_at: new Date()
            })
          },
          { transaction }
        );

        // Recreate Items & Substitute Items with new version
        for (const item of items) {

          const bomItem = await db.BOM_KIT_ITEM.create(
            {
              bom_id: bomMaster.id,
              item_id: item.itemId,
              quantity: item.quantity
            },
            { transaction }
          );

          if (item.substituteItems?.length) {

            await db.BOM_KIT_SUBSTITUTE_ITEM.bulkCreate(
              item.substituteItems.map(substituteId => ({
                bom_item_id: bomItem.id,
                substitute_item_id: substituteId
              })),
              { transaction }
            );
          }
        }
      }
    }

    await transaction.commit();

    let message = "BOM Created Successfully";

    if (bom_id) {
      message = isNewVersion
        ? "New BOM Version Created Successfully"
        : "BOM Updated Successfully";
    }

    return res.status(200).send({
      code: 200,
      message
    });

  } catch (error) {

    await transaction.rollback();

    return res.status(500).send({
      code: 500,
      message: error.message
    });
  }
};

exports.getBOMDataById = async (req, res) => {
  try {
    const data = await db.BOM_KIT_MASTER.findOne({
      where: {
        id: req.query.bomId
      },
      attributes: [
        "id",
        "bom_name",
        "bom_price",
        "hsn_id",
        "status"
      ],
      include: [
        {
          model: db.BOM_KIT_ITEM,
          as: "bomItems",
          attributes: [
            "item_id",
            "quantity"
          ],
          include: [
            {
              model: db.BOM_KIT_SUBSTITUTE_ITEM,
              as: "substituteItems",
              attributes: ["substitute_item_id"]
            }
          ]
        }
      ]
    });

    const result = {
      bom_name: data.bom_name,
      bom_price: data.bom_price,
      hsn_id: data.hsn_id,
      items: data.bomItems.map(item => ({
        itemId: item.item_id,
        quantity: Number(item.quantity),
        substituteItems:
          item.substituteItems?.map(
            sub => sub.substitute_item_id
          ) || []
      }))
    };

    return res.status(200).send({
      code: 200,
      message: "Data fetched successfully",
      data: result
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      code: 500,
      message: error.message
    });
  }
};

exports.approveBOM = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { bom_id, status } = req.body;

    if(status === 'Delete'){
       const findAllIds = await db.BOM_KIT_MASTER.findByPk(bom_id, {
        attributes: ["bom_group_id"],
        transaction
      });

      if (!findAllIds) {
        throw new Error("BOM not found.");
      }

      await db.BOM_KIT_MASTER.update(
        {
          isDeleted: 1,
          updatedAt: new Date(),
        },
        {
          where: {
            bom_group_id: findAllIds.bom_group_id,
          },
          transaction,
        }
      );
    }else{
      const bomData = await db.BOM_KIT_MASTER.findByPk(bom_id, {
        attributes: ["id", "status", "bom_group_id"],
        transaction
      });

      if (!bomData) {
        await transaction.rollback();

        return res.status(404).send({
          code: 404,
          message: "BOM not found"
        });
      }

      const allowedTransitions = {
        Draft: ["Approved"],
        Approved: ["Inactive"],
        Inactive: ["Approved"]
      };

      if (!allowedTransitions[bomData.status]?.includes(status)) {
        await transaction.rollback();

        return res.status(400).send({
          code: 400,
          message: `Cannot change status from ${bomData.status} to ${status}`
        });
      }

      if (status === "Approved") {
        await db.BOM_KIT_MASTER.update(
          {
            status: "Inactive",
            updatedAt: new Date(),
          },
          {
            where: {
              bom_group_id: bomData.bom_group_id,
              status: "Approved",
            },
            transaction,
          }
        );

        // Current version Approved
        await db.BOM_KIT_MASTER.update(
          {
            status: "Approved",
            approved_by: req.user?.employee_id,
            approved_at: new Date(),
            updatedAt: new Date(),
          },
          {
            where: { id: bom_id },
            transaction,
          }
        );

      } else {

        await db.BOM_KIT_MASTER.update(
          {
            status,
            updatedAt: new Date(),
          },
          {
            where: { id: bom_id },
            transaction,
          }
        );

      }
    }

    await transaction.commit();

    return res.status(200).send({
      code: 200,
      message:
        status === "Approved"
          ? "BOM Approved Successfully"
          : "BOM Deleted Successfully"
    });

  } catch (error) {

    await transaction.rollback();

    console.log(error);

    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error"
    });
  }
};
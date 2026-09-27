const db = require("../../../../models/index");
const { Op } = require("sequelize");

exports.getAllMenuList = async (req, res) => {
  try {
    const menuList = await db.role_module_master.findAll({
      include: [
        {
          model: db.menu_master,
          include: [
            {
              model: db.submenu_master,
            },
          ],
        },
      ],
      order: [
        ["mOrderBy", "ASC"], // role_module_master level
        [db.menu_master, "sbOrderBy", "ASC"], // menu_master level
        [db.menu_master, db.submenu_master, "smOrderBy", "ASC"], // submenu_master level
      ],
    });
    return res.status(200).send({
      code: 200,
      message: "Fetch all menus successfully",
      data: menuList,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.createUpdateMenu = async (req, res) => {
  try {
    const { name, sequencing, link, icon, menuMode, menuType, id, newStatus } =
      req.body;
    let createdResponse, updatedResponse, statusResponse, duplicateNameRes;
    if (menuType == "Parent") {
      duplicateNameRes = await db.role_module_master.findOne({
        where: {
          role_module_master_name: name,
          ...(id && { role_module_master_id: { [Op.ne]: id } }),
        },
      });
    } else if (menuType == "Child") {
      let parentId = null;
      if (menuMode === "update" && id) {
        const existingMenu = await db.menu_master.findOne({
          where: { menu_master_id: id },
        });

        if (existingMenu) {
          parentId = existingMenu.role_module_master_id;
        }
      }

      if (menuMode === "create") {
        parentId = id;
      }

      duplicateNameRes = await db.menu_master.findOne({
        where: {
          menu_master_name: name,
          role_module_master_id: parentId,
          ...(menuMode === "update" &&
            id && { menu_master_id: { [Op.ne]: id } }),
        },
      });
    } else {
      let parentId = null;
      if (menuMode === "update" && id) {
        const existingMenu = await db.submenu_master.findOne({
          where: { submenu_master_id: id },
        });

        if (existingMenu) {
          parentId = existingMenu.menu_master_id;
        }
      }

      if (menuMode === "create") {
        parentId = id;
      }

      duplicateNameRes = await db.submenu_master.findOne({
        where: {
          submenu_master_name: name,
          menu_master_id: parentId,
          ...(menuMode === "update" &&
            id && { submenu_master_id: { [Op.ne]: id } }),
        },
      });
    }
    if (duplicateNameRes) {
      return res
        .status(400)
        .send({ code: 400, message: "Menu Name is already exists!" });
    }

    if (menuMode == "create") {
      if (!name && !sequencing && !link) {
        return res.status(400).send({
          code: 400,
          message: "Name, Sequencing & Link required fields",
        });
      }

      if (menuType == "Parent") {
        createdResponse = await db.role_module_master.create({
          role_module_master_name: name,
          mOrderBy: sequencing,
          module_master_link: link,
          module_master_icon: icon,
          module_master_endIcon: icon,
        });
      } else if (menuType == "Child") {
        createdResponse = await db.menu_master.create({
          menu_master_name: name,
          sbOrderBy: sequencing,
          menu_master_link: link,
          menu_masters_icon: icon,
          role_module_master_id: id,
          menu_title: name,
        });
      } else {
        createdResponse = await db.submenu_master.create({
          submenu_master_name: name,
          smOrderBy: sequencing,
          submenu_masters_link: link,
          submenu_masters_icon: icon,
          menu_master_id: id,
        });
      }
      if (createdResponse) {
        return res
          .status(200)
          .send({ code: 200, message: "Menu created successfully" });
      } else {
        return res.status(400).send({ code: 400, message: "Create Failed" });
      }
    } else if (menuMode == "update") {
      if (!id) {
        return res
          .status(400)
          .send({ code: 400, message: "Menu ID not found" });
      }

      if (!name && !sequencing) {
        return res
          .status(400)
          .send({ code: 400, message: "Name, Sequencing required fields" });
      }

      if (menuType == "Parent") {
        updatedResponse = await db.role_module_master.update(
          {
            role_module_master_name: name,
            module_master_icon: icon,
            module_master_link: link,
            mOrderBy: sequencing,
          },
          { where: { role_module_master_id: id } }
        );
      } else if (menuType == "Child") {
        updatedResponse = await db.menu_master.update(
          {
            menu_master_name: name,
            menu_masters_icon: icon,
            menu_master_link: link,
            sbOrderBy: sequencing,
          },
          { where: { menu_master_id: id } }
        );
      } else {
        updatedResponse = await db.submenu_master.update(
          {
            submenu_master_name: name,
            submenu_masters_icon: icon,
            submenu_masters_link: link,
            smOrderBy: sequencing,
          },
          { where: { submenu_master_id: id } }
        );
      }
      if (updatedResponse) {
        return res
          .status(200)
          .send({ code: 200, message: "Menu updated successfully" });
      } else {
        return res.status(400).send({ code: 400, message: "Update Failed" });
      }
    } else if (menuMode == "Status") {
      if (!id) {
        return res
          .status(400)
          .send({ code: 400, message: "Menu ID not found" });
      }

      if (menuType == "Parent") {
        statusResponse = await db.role_module_master.update(
          { status: newStatus },
          { where: { role_module_master_id: id } }
        );
      } else if (menuType == "Child") {
        statusResponse = await db.menu_master.update(
          { status: newStatus },
          { where: { menu_master_id: id } }
        );
      } else {
        statusResponse = await db.submenu_master.update(
          { status: newStatus },
          { where: { submenu_master_id: id } }
        );
      }
      if (statusResponse) {
        return res
          .status(200)
          .send({ code: 200, message: "Status updated successfully" });
      } else {
        return res.status(400).send({ code: 400, message: "Status Failed" });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: "Server Error", error: error });
  }
};

const db = require("./../../../models/index");
const { Op, where } = require("sequelize");

class RbacController {
  // ------------------------------------------
  // CREATE MODULE
  // ------------------------------------------
  async createModule(req, res) {
    try {
      const data = req.body;
      let moduleData;
      if (data.id) {
        moduleData = await db.HRMS_RBAC_MODULE_MASTER.findByPk(data.id);
        if (!moduleData) {
          return res.status(404).json({ message: "Module not found" });
        }

        await db.HRMS_RBAC_MODULE_MASTER.update(req.body, {
          where: { id: data.id },
        });

        moduleData = await db.HRMS_RBAC_MODULE_MASTER.findByPk(data.id);
      } else {
        moduleData = await db.HRMS_RBAC_MODULE_MASTER.create({
          name: data.name,
          title: data.title,
          path: data.path,
          icon: data.icon,
          lastIcon: data.lastIcon,
          parentId: data.parentId || null,
          order: data.order,
          status: data.status ?? true,
        });
      }
      return res.status(201).json({
        message: "Module created successfully",
        data: moduleData,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating module", error });
    }
  }

  // ------------------------------------------
  // GET ALL MODULES (flat list)
  // ------------------------------------------
  async getAllModules(req, res) {
    try {
      const modules = await db.HRMS_RBAC_MODULE_MASTER.findAll();
      res.status(200).json(modules);
    } catch (err) {
      res.status(500).json({ message: "Error fetching modules", err });
    }
  }

  // ------------------------------------------
  // GET MODULE BY ID
  // ------------------------------------------
  async getModuleById(req, res) {
    try {
      const id = req.params.id;
      const moduleData = await db.HRMS_RBAC_MODULE_MASTER.findByPk(id);

      if (!moduleData) {
        return res.status(404).json({ message: "Module not found" });
      }

      return res.status(200).json(moduleData);
    } catch (error) {
      res.status(500).json({ message: "Error fetching module", error });
    }
  }

  // ------------------------------------------
  // DELETE MODULE
  // ------------------------------------------
  async deleteModule(req, res) {
    try {
      const id = req.params.id;

      const moduleData = await db.HRMS_RBAC_MODULE_MASTER.findByPk(id);
      if (!moduleData) {
        return res.status(404).json({ message: "Module not found" });
      }

      // Optional: also delete children
      await db.HRMS_RBAC_MODULE_MASTER.destroy({
        where: {
          [Op.or]: [{ id: id }, { parentId: id }],
        },
      });

      res.status(200).json({
        message: "Module and its children deleted successfully",
      });
    } catch (error) {
      res.status(500).json({ message: "Error deleting module", error });
    }
  }

  // ------------------------------------------
  // GET FULL MENU TREE (PARENT → CHILDREN → SUBCHILDREN)
  // ------------------------------------------
  async getRBACMenuTree(req, res) {
    try {
      const modules = await db.HRMS_RBAC_MODULE_MASTER.findAll({
        where: {
          parentId: null,
        },
        include: [
          {
            model: db.HRMS_RBAC_MODULE_MASTER,
            as: "children", // 2nd level children
            include: [
              {
                model: db.HRMS_RBAC_MODULE_MASTER,
                as: "children", // 3rd level children
              },
            ],
          },
        ],
        order: [
          ["status", "DESC"],
          ["order", "ASC"],

          [
            { model: db.HRMS_RBAC_MODULE_MASTER, as: "children" },
            "status",
            "DESC",
          ],
          [
            { model: db.HRMS_RBAC_MODULE_MASTER, as: "children" },
            "order",
            "ASC",
          ],

          [
            { model: db.HRMS_RBAC_MODULE_MASTER, as: "children" },
            { model: db.HRMS_RBAC_MODULE_MASTER, as: "children" },
            "status",
            "DESC",
          ],
          [
            { model: db.HRMS_RBAC_MODULE_MASTER, as: "children" },
            { model: db.HRMS_RBAC_MODULE_MASTER, as: "children" },
            "order",
            "ASC",
          ],
        ],
      });

      return res.status(200).json({
        code: 200,
        message: "Fetch all menus successfully",
        data: modules,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error generating RBAC menu tree",
        error,
      });
    }
  }

  // ------------------------------------------
  // TOGGLE ACTIVE/INACTIVE
  // ------------------------------------------
  async toggleStatus(req, res) {
    try {
      const id = req.params.id;

      const moduleData = await db.HRMS_RBAC_MODULE_MASTER.findByPk(id);
      if (!moduleData) {
        return res.status(404).json({ message: "Module not found" });
      }

      const newStatus = moduleData.status ? false : true;

      await db.HRMS_RBAC_MODULE_MASTER.update(
        { status: newStatus },
        { where: { id: id } }
      );

      res.status(200).json({
        message: "Status updated successfully",
        status: newStatus,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating status", error });
    }
  }

  

}

module.exports = new RbacController();

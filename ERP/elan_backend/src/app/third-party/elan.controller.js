const db = require("../../../app/models/index");
const {
  createThirdPartyUser,
} = require("../../../app/HRMS/Employee_Master/controllers/auth.controller");

class ElanThirdPartyController {
  async createOrgTypeMaster(req, res) {
    try {
      const { name, description } = req.body;
      const newOrgType = await db.ORG_TYPE_MASTER.create({
        name: name,
        description: description,
        status: true,
      });
      return res.status(201).json({
        message: "Organization Type created successfully",
        data: newOrgType,
      });
    } catch (error) {
      console.error("Error creating Organization Type:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async getAllOrgTypeMasters(req, res) {
    try {
      const orgTypes = await db.ORG_TYPE_MASTER.findAll();
      return res.status(200).json({
        data: orgTypes,
      });
    } catch (error) {
      console.error("Error fetching Organization Types:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async deleteOrgTypeMasterById(req, res) {
    try {
      const orgTypeId = req.params.id;
      const orgType = await db.ORG_TYPE_MASTER.findByPk(orgTypeId);
      if (!orgType) {
        return res.status(404).json({ message: "Organization Type not found" });
      }
      await orgType.destroy();
      return res.status(200).json({
        message: "Organization Type deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting Organization Type:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async updateOrgTypeMaster(req, res) {
    try {
      const orgTypeId = req.params.id;
      const { name, description, status } = req.body;

      const orgType = await db.ORG_TYPE_MASTER.findByPk(orgTypeId);

      if (!orgType) {
        return res.status(404).json({ message: "Organization Type not found" });
      }
      orgType.name = name;
      orgType.description = description;
      orgType.status = status;
      await orgType.save();

      return res.status(200).json({
        message: "Organization Type updated successfully",
        data: orgType,
      });
    } catch (error) {
      console.error("Error updating Organization Type:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async createOrgSetup(req, res) {
    try {
      const { orgData, userData } = req.body;
      const newOrgData = await db.THIRD_PARTY_ORGANIZATION.create(orgData);
      if (userData) {
        userData.organization_id = newOrgData.id;
        const newUser = await createThirdPartyUser(userData);
        return res.status(201).json({
          message: "Organization and User created successfully",
          organization: newOrgData,
          user: newUser,
        });
      }
    } catch (error) {
      console.error("Error updating Organization Type:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async updateOrgSetup(req, res) {
    try {
      const orgId = req.params.id;
      const { orgData, userData } = req.body;

      const organization = await db.THIRD_PARTY_ORGANIZATION.findByPk(orgId);

      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }
      organization.name = orgData.name;
      organization.gst = orgData.gst;
      organization.email = orgData.email;
      organization.phone = orgData.phone;
      organization.address = orgData.address;
      organization.orgTypeId = orgData.orgTypeId;
      organization.status = orgData.status;
      await organization.save();

      if (userData) {
        userData.organization_id = orgId;
        const newUser = await createThirdPartyUser(userData);
        return res.status(200).json({
          message: "Organization and User updated successfully",
          organization,
          user: newUser,
        });
      }
      orgType.description = orgData.description;
      orgType.status = orgData.status;
      await orgType.save();

      return res.status(200).json({
        message: "Organization Type updated successfully",
        data: orgType,
      });
    } catch (error) {
      console.error("Error updating Organization Type:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async getAllOrgSetups(req, res) {
    try {
      const query = `
  SELECT 
    tpo.*,
    type.name AS orgTypeName,
    COUNT(u.employee_id) AS userCount
  FROM 3PL_ORGANIZATION AS tpo
  INNER JOIN 3PL_ORG_TYPE_MASTER AS type 
    ON tpo.orgTypeId = type.id
  LEFT JOIN HRMS_REGISTERED_USER AS u 
    ON tpo.id = u.organization_id
  where tpo.isDeleted = false
  GROUP BY tpo.id
  ORDER BY tpo.id DESC
`;

      const orgData = await db.sequelize.query(query, {
        type: db.sequelize.QueryTypes.SELECT,
      });

      return res.status(200).json({
        data: orgData,
      });
    } catch (error) {
      console.error("Error fetching Organization Setups:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async deleteOrgSetupById(req, res) {
    try {
      const orgId = req.params.id;
      const org = await db.THIRD_PARTY_ORGANIZATION.findByPk(orgId);
      if (!org) {
        return res.status(404).json({ message: "Organization not found" });
      }
      // soft delete
      org.isDeleted = true;
      await org.save();
      return res.status(200).json({
        message: "Organization deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting Organization:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async getAllOrgUsers(req, res) {
    try {
      const orgId = req.params.orgId;
      const users = await db.user.findAll({
        where: { organization_id: orgId, isDeleted: false },
        attributes: [
          "employee_id",
          "first_name",
          "last_name",
          "middle_name",
          "employee_official_email",
          "contact_number",
          "status",
          "role_master_id",
          "primary_entity_id",
        ],
      });
      return res.status(200).json({
        data: users,
      });
    } catch (error) {
      console.error("Error fetching Organization Users:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async getOrgPrimaryUser(req, res) {
    try {
      const orgId = req.params.orgId;
      const users = await db.user.findAll({
        where: { organization_id: orgId, isDeleted: false, middle_name: "3PL_ADMIN" },
        attributes: [
          "employee_id",
          "first_name",
          "last_name",
          "middle_name",
          "employee_official_email",
          "contact_number",
          "status",
          "role_master_id",
          "primary_entity_id",
        ],
      });
      return res.status(200).json({
        data: users[0],
      });
    } catch (error) {
      console.error("Error fetching Organization Users:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async createOrgUser(req, res) {
    try {
      const { userData } = req.body;
      if (userData) {
        const newUser = await createThirdPartyUser(userData);
        return res.status(201).json({
          message: "User created successfully",
          user: newUser,
        });
      }
    } catch (error) {
      console.error("Error updating User:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async updateOrgUser(req, res) {
    try {
      const employee_id = req.params.id;
      const { userData } = req.body;

      if (userData) {
        userData.employee_id = employee_id;
        const newUser = await createThirdPartyUser(userData);
        return res.status(200).json({
          message: "User updated successfully",
          user: newUser,
        });
      }
    } catch (error) {
      console.error("Error updating User:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async deleteOrgUser(req, res) {
    try {
      const employee_id = req.params.id;
      const user = await db.user.findByPk(employee_id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // soft delete
      user.isDeleted = true;
      await user.save();
      return res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting User:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
}

module.exports = new ElanThirdPartyController();

const db = require("./../../../models");

function isMissing(value) {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    value === "undefined"
  );
}

class RbacPermissionController {
  /* =========================================================================
      ROLE PERMISSION CRUD
    ========================================================================= */

  // 6️⃣ Bulk Save Role Permissions (For Permission Matrix Screens)
  async bulkSaveRolePermissions(req, res) {
    try {
      const { roleId, permissions, entityId } = req.body;

      if (!roleId || !Array.isArray(permissions)) {
        return res
          .status(400)
          .json({ message: "roleId & permissions array required" });
      }

      for (const perm of permissions) {
        const { moduleId, read, write, remove } = perm;

        if (!moduleId) continue;

        if (!read && !write && !remove) {
          await db.HRMS_RBAC_ROLE_PERMISSION.destroy({
            where: { roleId, moduleId, entityId },
          });
          continue;
        }

        const [permission, created] =
          await db.HRMS_RBAC_ROLE_PERMISSION.findOrCreate({
            where: { roleId, moduleId, entityId },
            defaults: { read, write, remove },
          });

        if (!created) {
          await permission.update({ read, write, remove });
        }
      }

      return res
        .status(200)
        .json({ message: "Permissions updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error in bulk update", error });
    }
  }

  // GET /rbac/role/:roleId/permissions
  async getRolePermissions(req, res) {
    try {
      const { roleId } = req.params;

      // 1. Get full 3-level module structure
      const modules = await db.HRMS_RBAC_MODULE_MASTER.findAll({
        where: { parentId: null, status: true },
        include: [
          {
            model: db.HRMS_RBAC_MODULE_MASTER,
            as: "children",
            separate: true,
            where: { status: true },
            order: [["order", "ASC"]],
            include: [
              {
                model: db.HRMS_RBAC_MODULE_MASTER,
                as: "children",
                separate: true,
                where: { status: true },
                order: [["order", "ASC"]],
              },
            ],
          },
        ],
        order: [["order", "ASC"]],
      });

      // 2. Get role permissions
      const rolePermissions = await db.HRMS_RBAC_ROLE_PERMISSION.findAll({
        where: { roleId },
      });

      // Fast lookup map
      const permissionMap = {};
      rolePermissions.forEach((p) => {
        permissionMap[p.moduleId] = {
          read: p.read,
          write: p.write,
          remove: p.remove,
        };
      });

      // 3. Build final tree with permissions injected
      const finalModules = modules.map((parent) => {
        const parentPerm = permissionMap[parent.id] || {
          read: false,
          write: false,
          remove: false,
        };

        return {
          id: parent.id,
          name: parent.name,
          selected: parentPerm.read || parentPerm.write || parentPerm.remove,
          ...parentPerm,

          children: (parent.children || []).map((level1) => {
            const level1Perm = permissionMap[level1.id] || {
              read: false,
              write: false,
              remove: false,
            };

            return {
              id: level1.id,
              name: level1.name,
              selected:
                level1Perm.read || level1Perm.write || level1Perm.remove,
              ...level1Perm,

              children: (level1.children || []).map((level2) => {
                const level2Perm = permissionMap[level2.id] || {
                  read: false,
                  write: false,
                  remove: false,
                };

                return {
                  id: level2.id,
                  name: level2.name,
                  selected:
                    level2Perm.read || level2Perm.write || level2Perm.remove,
                  ...level2Perm,
                };
              }),
            };
          }),
        };
      });

      return res.status(200).json({
        roleId,
        modules: finalModules,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Failed to fetch role permissions",
        error: err.message,
      });
    }
  }

  /* =========================================================================
      USER PERMISSION CRUD
    ========================================================================= */

  // 1️⃣ Create or update user permission
  async createOrUpdateUserPermission(req, res) {
    try {
      const { userId, moduleId, read, write, remove } = req.body;

      if (!userId || !moduleId) {
        return res.status(400).json({ message: "userId & moduleId required" });
      }

      const [permission, created] =
        await db.HRMS_RBAC_USER_PERMISSION.findOrCreate({
          where: { userId, moduleId },
          defaults: { read, write, remove },
        });

      if (!created) {
        await permission.update({ read, write, remove });
      }

      return res.status(200).json({
        message: created
          ? "User permission created"
          : "User permission updated",
        permission,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error saving user permission", error });
    }
  }

  // 2️⃣ Get all user permissions
  async getAllUserPermissions(req, res) {
    try {
      const { userId } = req.query;

      const where = {};
      if (userId) where.userId = userId;

      const permissions = await db.HRMS_RBAC_USER_PERMISSION.findAll({
        where,
        include: [
          { model: db.user, as: "user", attributes: ["id", "name", "email"] },
          {
            model: db.HRMS_RBAC_MODULE_MASTER,
            as: "module",
            attributes: ["id", "name"],
          },
        ],
      });

      return res.status(200).json(permissions);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching user permissions", error });
    }
  }

  // 4️⃣ Bulk save for User Permissions
  async bulkSaveUserPermissions(req, res) {
    try {
      const { userId, permissions } = req.body;

      if (!userId || !Array.isArray(permissions)) {
        return res
          .status(400)
          .json({ message: "userId & permissions array required" });
      }

      for (const perm of permissions) {
        const { moduleId, read, write, remove } = perm;

        if (!moduleId) continue;

        const [permission, created] =
          await db.HRMS_RBAC_USER_PERMISSION.findOrCreate({
            where: { userId, moduleId },
            defaults: { read, write, remove },
          });

        if (!created) {
          await permission.update({ read, write, remove });
        }
      }

      return res
        .status(200)
        .json({ message: "User permissions updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error in bulk update", error });
    }
  }

  async getRoleAndUserPermissions(req, res) {
    try {
      const { roleId, userId, entityId } = req.params;

      // ==========================================================
      // 🚀 OPTIMIZED: Single query with LEFT JOINs
      // ==========================================================
      const results = await db.sequelize.query(
        `
        SELECT 
          m.id, 
          m.name, 
          m.parentId, 
          m.order,
          rp.read AS roleRead,
          rp.write AS roleWrite,
          rp.remove AS roleRemove,
          up.read AS userRead,
          up.write AS userWrite,
          up.remove AS userRemove
        FROM HRMS_RBAC_MODULE_MASTER AS m
        LEFT JOIN HRMS_RBAC_ROLE_PERMISSION AS rp 
          ON m.id = rp.moduleId 
          AND rp.roleId = :roleId 
          AND rp.entityId = :entityId
        LEFT JOIN HRMS_RBAC_USER_PERMISSION AS up 
          ON m.id = up.moduleId 
          AND up.userId = :userId
        WHERE m.status = 1
        ORDER BY m.parentId ASC, m.order ASC
        `,
        {
          replacements: { roleId, userId, entityId },
          type: db.sequelize.QueryTypes.SELECT,
        }
      );

      // ==========================================================
      // 🚀 OPTIMIZED: Build tree with Map for O(1) lookup
      // ==========================================================
      const moduleMap = new Map();
      const rootModules = [];

      // First pass: Create all nodes
      results.forEach((row) => {
        // User permissions override role permissions
        const hasUserPerm =
          row.userRead !== null ||
          row.userWrite !== null ||
          row.userRemove !== null;

        const read = hasUserPerm ? !!row.userRead : !!row.roleRead;
        const write = hasUserPerm ? !!row.userWrite : !!row.roleWrite;
        const remove = hasUserPerm ? !!row.userRemove : !!row.roleRemove;

        const node = {
          id: row.id,
          name: row.name,
          read,
          write,
          remove,
          selected: read || write || remove,
          isUser: hasUserPerm,
          children: [],
        };

        moduleMap.set(row.id, node);

        if (row.parentId === null) {
          rootModules.push(node);
        }
      });

      // Second pass: Build parent-child relationships
      results.forEach((row) => {
        if (row.parentId !== null) {
          const parent = moduleMap.get(row.parentId);
          const child = moduleMap.get(row.id);
          if (parent && child) {
            parent.children.push(child);
          }
        }
      });

      return res.status(200).json({
        roleId,
        userId,
        entityId,
        modules: rootModules,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Failed to fetch role & user permissions",
        error: err.message,
      });
    }
  }

  /* =========================================================================
      MODULE ACCESS CHECK (For Frontend Access Control)
    ========================================================================= */

  /**
   * Get effective module access for a user
   * Returns a flat map of moduleId -> permissions for easy frontend access control
   * User permissions override role permissions
   *
   * GET /rbac/getModuleAccess/:employeeId/:roleId/:entityId
   */
  async getModuleAccess(req, res) {
    try {
      const { employeeId, roleId, entityId } = req.params;

      if (isMissing(employeeId) || isMissing(roleId) || isMissing(entityId)) {
        return res.status(400).json({
          message: "employeeId, roleId, and entityId are required",
        });
      }

      // ==========================================================
      // 🚀 Single optimized query with LEFT JOINs
      // ==========================================================
      const results = await db.sequelize.query(
        `
        SELECT 
          m.id, 
          m.name,
          m.path,
          m.icon,
          m.lastIcon,
          m.parentId,
          m.order,
          rp.read AS roleRead,
          rp.write AS roleWrite,
          rp.remove AS roleRemove,
          up.read AS userRead,
          up.write AS userWrite,
          up.remove AS userRemove
        FROM HRMS_RBAC_MODULE_MASTER AS m
        LEFT JOIN HRMS_RBAC_ROLE_PERMISSION AS rp 
          ON m.id = rp.moduleId 
          AND rp.roleId = :roleId 
          AND rp.entityId = :entityId
        LEFT JOIN HRMS_RBAC_USER_PERMISSION AS up 
          ON m.id = up.moduleId 
          AND up.userId = :employeeId
        WHERE m.status = 1
        ORDER BY m.parentId ASC, m.order ASC
        `,
        {
          replacements: { roleId, employeeId, entityId },
          type: db.sequelize.QueryTypes.SELECT,
        }
      );

      // ==========================================================
      // Build module map with access info
      // ==========================================================
      const moduleMap = new Map();
      const accessMap = {};

      results.forEach((row) => {
        // User permissions override role permissions
        const hasUserPerm =
          row.userRead !== null ||
          row.userWrite !== null ||
          row.userRemove !== null;

        const read = hasUserPerm ? !!row.userRead : !!row.roleRead;
        const write = hasUserPerm ? !!row.userWrite : !!row.roleWrite;
        const remove = hasUserPerm ? !!row.userRemove : !!row.roleRemove;
        const hasAccess = read || write || remove;

        const node = {
          id: row.id,
          name: row.name,
          path: row.path,
          icon: row.icon,
          lastIcon: row.lastIcon,
          parentId: row.parentId,
          read,
          write,
          remove,
          selected: hasAccess,
          isUser: hasUserPerm,
          hasAccess,
          children: [],
        };

        moduleMap.set(row.id, node);

        // Flat access map for quick lookups
        accessMap[row.id] = {
          moduleId: row.id,
          moduleName: row.name,
          modulePath: row.path,
          read,
          write,
          remove,
          hasAccess,
          isUserOverride: hasUserPerm,
        };
      });

      // ==========================================================
      // Build parent-child relationships
      // ==========================================================
      const rootModules = [];

      moduleMap.forEach((node) => {
        if (node.parentId === null) {
          rootModules.push(node);
        } else {
          const parent = moduleMap.get(node.parentId);
          if (parent) {
            parent.children.push(node);
          }
        }
      });

      // ==========================================================
      // Filter tree to include only accessible modules
      // A parent is included if it or any of its descendants have access
      // ==========================================================
      const filterAccessibleModules = (modules) => {
        return modules
          .map((module) => {
            // Recursively filter children
            const filteredChildren =
              module.children.length > 0
                ? filterAccessibleModules(module.children)
                : [];

            // Only include module if it has direct access
            if (module.hasAccess) {
              return {
                id: module.id,
                name: module.name,
                path: module.path,
                icon: module.icon,
                lastIcon: module.lastIcon,
                read: module.read,
                write: module.write,
                remove: module.remove,
                // selected: module.selected,
                isUser: module.isUser,
                children: filteredChildren,
              };
            }

            return null;
          })
          .filter((module) => module !== null);
      };

      const accessibleTree = filterAccessibleModules(rootModules);

      // ==========================================================
      // Helper data for frontend
      // ==========================================================
      // const accessibleModules = Object.values(accessMap).filter(
      //   (m) => m.hasAccess
      // );

      // const accessiblePaths = accessibleModules
      //   .filter((m) => m.modulePath)
      //   .map((m) => m.modulePath);
      const entity_details = await db.entityMaster.findOne({
        where: { id: entityId, status: "Active", isDeleted: false },
        attributes: ["id", "entity_name"],
      });
      return res.status(200).json({
        success: true,
        employeeId,
        roleId,
        entityId,
        data: {
          modules: accessibleTree, // Clean tree with only accessible modules
          entity_details,
          // Flat map for quick access checks: accessMap[moduleId]
          accessMap,

          // Summary stats
          summary: {
            totalModules: results.length,
            userOverrides: Object.values(accessMap).filter(
              (m) => m.isUserOverride
            ).length,
          },
        },
      });
    } catch (err) {
      console.error("Error in getModuleAccess:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch module access",
        error: err.message,
      });
    }
  }

  /**
   * Check if user has access to a specific module
   * POST /rbac/checkModuleAccess
   * Body: { employeeId, roleId, entityId, moduleId, requiredPermission: 'read'|'write'|'delete' }
   */
  async checkModuleAccess(req, res) {
    try {
      const { employeeId, roleId, entityId, moduleId, requiredPermission } =
        req.body;

      if (!employeeId || !roleId || !entityId || !moduleId) {
        return res.status(400).json({
          success: false,
          message: "employeeId, roleId, entityId, and moduleId are required",
        });
      }

      const result = await db.sequelize.query(
        `
        SELECT 
          m.id,
          m.name,
          m.path,
          COALESCE(up.read, rp.read, 0) AS read,
          COALESCE(up.write, rp.write, 0) AS write,
          COALESCE(up.remove, rp.remove, 0) AS remove
        FROM HRMS_RBAC_MODULE_MASTER AS m
        LEFT JOIN HRMS_RBAC_ROLE_PERMISSION AS rp 
          ON m.id = rp.moduleId 
          AND rp.roleId = :roleId 
          AND rp.entityId = :entityId
        LEFT JOIN HRMS_RBAC_USER_PERMISSION AS up 
          ON m.id = up.moduleId 
          AND up.userId = :employeeId
        WHERE m.id = :moduleId AND m.status = 1
        LIMIT 1
        `,
        {
          replacements: { roleId, employeeId, entityId, moduleId },
          type: db.sequelize.QueryTypes.SELECT,
        }
      );

      if (!result || result.length === 0) {
        return res.status(404).json({
          success: false,
          hasAccess: false,
          message: "Module not found",
        });
      }

      const module = result[0];
      const permissions = {
        read: !!module.read,
        write: !!module.write,
        delete: !!module.remove,
      };

      let hasAccess = false;
      if (requiredPermission) {
        hasAccess = permissions[requiredPermission] || false;
      } else {
        hasAccess = permissions.read || permissions.write || permissions.delete;
      }

      return res.status(200).json({
        success: true,
        hasAccess,
        moduleId: module.id,
        moduleName: module.name,
        modulePath: module.path,
        permissions,
        requiredPermission: requiredPermission || "any",
      });
    } catch (err) {
      console.error("Error in checkModuleAccess:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to check module access",
        error: err.message,
      });
    }
  }
}

module.exports = new RbacPermissionController();

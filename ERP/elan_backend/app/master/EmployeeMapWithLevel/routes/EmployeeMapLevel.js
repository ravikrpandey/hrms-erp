const employeeMapLevel = require('../controllers/EmployeeMapLevelController');

module.exports = app => {
    app.post("/api/v1/create_levelmap_employee", employeeMapLevel.create_level_employee);
    app.get("/api/v1/get_all_levelmap_employee", employeeMapLevel.get_all_emplevel_map);
    app.get("/api/v1/get_levelmap_employeeById/:id", employeeMapLevel.get_levelmap_employeeById);
    app.put("/api/v1/update_levelmap_employee/:id", employeeMapLevel.update_level_employee);
    app.delete("/api/v1/delete_levelmap_employee/:id", employeeMapLevel.delete_levelmap_employee);
  
    app.get("/api/v1/all_employeeMap_list", employeeMapLevel.getEmployeeListForLevel);
    app.get("/api/v1/reportingManager_ExistinWorkflow/:id", employeeMapLevel.reportingManager_ExistinWorkflow);
}
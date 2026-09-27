const db = require("../../../../../models/index");
const roleMenuAccessDetails = db.role_menu_access;
const menuMasterDetails = db.menu_master;
const submenuMasterDetails = db.submenu_master;
const read_write_accessrDetails = db.read_write_access;

const logger = require("../../../../../../logger/index");

exports.getAllroleMenuAccess = async (req, res) => {
  const status = "ACTIVE";
  try {
    const getData = await roleMenuAccessDetails.findAll({
      where: { status: status },
      attributes: [
        "role_menu_access_id",
        "employee_id",
        "menu_master_id",
        "menu_completed",
      ],
      include: [
        {
          model: menuMasterDetails,
          attributes: ["menu_master_name"],
          include: [
            {
              model: submenuMasterDetails,
            },
          ],
        },
      ],
    });
    let modifiedArr = [];
    for (let i = 0; i < getData.length; i++) {
      modifiedArr.push({
        role_menu_access_id: getData[i].role_menu_access_id,
        employee_id: getData[i].employee_id,
        menu_master_id: getData[i].menu_master_id,
        menu_completed: getData[i].menu_completed,
        menu_master_name: getData[i].menu_master.menu_master_name,
        HRMS_RBAC_SUBMENU_MASTER:
          getData[i].menu_master.HRMS_RBAC_SUBMENU_MASTER,
      });
    }

    if (getData) {
      return res.status(200).send({
        code: 200,
        message: "Fetch All Data Successfully",
        data: getData,
      });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

// /////////////// GetById roleMenuAccess //////////////
exports.getByIdroleMenuAccess = async (req, res) => {
  try {
    const { employee_id, role_master_id, entity_id, roleType } = req.query;
    let query;
    const baseQuery = `SELECT 
    rma.role_module_master_id,
    rma.role_module_master_completed,
    rma.menu_master_id, 
    rma.submenu_master_id, 
    rma.menu_completed, 
    rma.submenu_completed,
    rma.role_master_id,  
    rma.employee_id,
    rmm.status,
    rmm.role_module_master_id,
    rmm.role_module_master_name,
    rmm.module_master_link,
    rmm.module_master_icon,
    rmm.module_master_endIcon,
    sm.submenu_master_id,
    mm.menu_master_id,
    mm.menu_master_name,
    mm.menu_title,
    mm.menu_masters_icon,
    mm.menu_master_link,
    mm.menu_master_lastIcon,
    sm.submenu_masters_link,
    sm.submenu_masters_icon,
    sm.submenu_master_name
FROM HRMS_RBAC_ROLE_MODULE_MASTER rmm
LEFT JOIN HRMS_RBAC_MENU_MASTER mm 
    ON rmm.role_module_master_id = mm.role_module_master_id 
    AND rmm.status ='ACTIVE' AND mm.status='ACTIVE'
LEFT JOIN HRMS_RBAC_SUBMENU_MASTER sm 
    ON mm.menu_master_id = sm.menu_master_id AND sm.status='ACTIVE'
LEFT JOIN HRMS_RBAC_ROLE_MENU_ACCESS rma 
    ON (rma.role_module_master_id = rmm.role_module_master_id OR rma.role_module_master_id IS NULL) 
    AND (rma.menu_master_id = mm.menu_master_id OR rma.menu_master_id IS NULL) 
    AND (rma.submenu_master_id = sm.submenu_master_id OR rma.submenu_master_id IS NULL) 
    AND rma.employee_id = ${employee_id} 
    AND rma.role_master_id = ${role_master_id} 
    AND rma.entity_id = ${entity_id}
`;

    if (roleType === "superAdmin") {
      query = baseQuery;
    } else {
      query =
        baseQuery.replace(
          "LEFT JOIN HRMS_RBAC_ROLE_MENU_ACCESS rma ON",
          "INNER JOIN HRMS_RBAC_ROLE_MENU_ACCESS rma ON"
        ) + " AND rma.role_module_master_completed = 1";
    }

    const getData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    let uniqueData = getData.map((item) => item.menu_master_id);
    uniqueData = [...new Set(uniqueData)];

    let uniqueDataInf = getData.map((index) => index.role_module_master_id);
    uniqueDataInf = [...new Set(uniqueDataInf)];

    let maindata = [];
    const Data = [];
    uniqueData.forEach((element) => {
      let data = getData.filter((obj) => obj.menu_master_id == element);

      for (let i of data) {
        if (i?.role_module_master_completed == 1) {
          i.role_module_master_completed = true;
        } else if (i?.role_module_master_completed == 0) {
          i.role_module_master_completed = false;
        }
        if (i?.menu_completed == 1) {
          i.menu_completed = true;
        } else if (i?.menu_completed == 0) {
          i.menu_completed = false;
        }
        if (i?.submenu_completed == 1) {
          i.submenu_completed = true;
        } else if (i?.submenu_completed == 0) {
          i.submenu_completed = false;
        }
      }

      let object = {
        role_menu_access_id: data[0]?.role_menu_access_id,
        employee_id: data[0]?.employee_id,
        role_master_id: data[0]?.role_master_id,
        entity_id: data[0]?.entity_id,
        role_module_master_id: data[0]?.role_module_master_id,
        role_module_master_name: data[0]?.role_module_master_name,
        module_master_link: data[0]?.module_master_link,
        module_master_icon: data[0]?.module_master_icon,
        module_master_endIcon: data[0]?.module_master_endIcon,
        role_module_master_completed: data[0]?.role_module_master_completed,
        menu_master_id: data[0]?.menu_master_id,
        menu_master_name: data[0]?.menu_master_name,
        menu_title: data[0]?.menu_title,
        menu_masters_icon: data[0]?.menu_masters_icon,
        menu_master_link: data[0]?.menu_master_link,
        menu_master_lastIcon: data[0]?.menu_master_lastIcon,
        menu_completed: data[0]?.menu_completed,
        status: data[0]?.status,
        HRMS_RBAC_SUBMENU_MASTER: data,
      };
      Data.push(object);
    });

    uniqueDataInf?.forEach((index) => {
      let data2 = Data.filter((obj) => obj?.role_module_master_id == index);

      let parentObj = {
        role_module_master_id: data2[0]?.role_module_master_id,
        role_module_master_name: data2[0]?.role_module_master_name,
        module_master_link: data2[0]?.module_master_link,
        module_master_icon: data2[0]?.module_master_icon,
        module_master_endIcon: data2[0]?.module_master_endIcon,
        role_module_master_completed: data2[0]?.role_module_master_completed,
        menu_masters_icon: data2[0]?.menu_masters_icon,
        menu_master_link: data2[0]?.menu_master_link,
        menu_master_lastIcon: data2[0]?.menu_master_lastIcon,
        HRMS_RBAC_MENU_MASTER: data2,
      };
      maindata.push(parentObj);
    });
    const processedData = maindata?.map((item) => {
      item?.HRMS_RBAC_MENU_MASTER?.forEach((menuItem) => {
        if (menuItem?.HRMS_RBAC_SUBMENU_MASTER) {
          menuItem.HRMS_RBAC_SUBMENU_MASTER =
            menuItem.HRMS_RBAC_SUBMENU_MASTER.filter(
              (subMenuItem) => subMenuItem?.submenu_master_name
            );

          const uniqueSubMenus = [];
          const seenIds = new Set();
          menuItem.HRMS_RBAC_SUBMENU_MASTER.forEach((subMenuItem) => {
            if (!seenIds.has(subMenuItem.submenu_master_id)) {
              seenIds.add(subMenuItem.submenu_master_id);
              uniqueSubMenus.push(subMenuItem);
            }
          });

          menuItem.HRMS_RBAC_SUBMENU_MASTER = uniqueSubMenus;
        }
      });

      return item;
    });

    const finalmaindata = processedData.filter((item) =>
      item?.HRMS_RBAC_MENU_MASTER?.some(
        (menuItem) => menuItem?.status === "ACTIVE"
      )
    );

    if (getData) {
      return res.status(200).send({
        code: 200,
        message: "Fetch data by ID Successfully",
        data: finalmaindata,
      });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.getroleMenuAccess = async (req, res) => {
  try {
    const { employee_id, role_master_id, entity_id } = req.query;
    let getData = await db.sequelize.query(
      `SELECT DISTINCT rma.role_module_master_id,
      rma.role_module_master_completed,
      rma.menu_master_id, 
      rma.submenu_master_id, 
      rma.menu_completed, 
      rma.submenu_completed,
      rma.role_master_id,  
      rma.employee_id, 
      rmm.role_module_master_id,
      rmm.role_module_master_name,
      rmm.module_master_link,
      rmm.module_master_icon,
      rmm.module_master_endIcon,
      sm.submenu_master_id,
      mm.menu_master_id,
      mm.menu_master_name,
      mm.menu_title,
      mm.menu_masters_icon,
      mm.menu_master_link,
      mm.menu_master_lastIcon,
      sm.submenu_masters_link,
      sm.submenu_masters_icon,
      sm.submenu_master_name, 
      rmm.mOrderBy,
      mm.sbOrderBy,
      sm.smOrderBy,
      rmm.status as master_status,
      mm.status as menu_status,
      sm.status as submenu_status
      FROM HRMS_RBAC_ROLE_MENU_ACCESS rma
      LEFT JOIN HRMS_RBAC_ROLE_MODULE_MASTER rmm ON rma.role_module_master_id = rmm.role_module_master_id
      LEFT JOIN HRMS_RBAC_MENU_MASTER mm ON rma.menu_master_id = mm.menu_master_id AND mm.status ='ACTIVE'
      LEFT JOIN HRMS_RBAC_SUBMENU_MASTER sm ON rma.submenu_master_id=sm.submenu_master_id AND sm.status ='ACTIVE'
      WHERE rma.employee_id =${employee_id} AND rma.role_master_id = ${role_master_id} AND rma.entity_id = ${entity_id} AND rmm.status ='ACTIVE'
      ORDER BY rmm.mOrderBy,mm.sbOrderBy,sm.smOrderBy;`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    let uniqueData = getData.map((item) => item.menu_master_id);
    uniqueData = [...new Set(uniqueData)];

    let uniqueDataInf = getData.map((index) => index.role_module_master_id);
    uniqueDataInf = [...new Set(uniqueDataInf)];
    let maindata = [];
    const Data = [];
    uniqueData?.forEach((element) => {
      let data = getData.filter(
        (obj) => obj?.menu_master_id == element && obj.menu_status == "ACTIVE"
      );

      for (let i of data) {
        if (i?.role_module_master_completed == 1) {
          i.role_module_master_completed = true;
        } else if (i?.role_module_master_completed == 0) {
          i.role_module_master_completed = false;
        }
        if (i?.menu_completed == 1) {
          i.menu_completed = true;
        } else if (i?.menu_completed == 0) {
          i.menu_completed = false;
        }
        if (i?.submenu_completed == 1) {
          i.submenu_completed = true;
        } else if (i?.submenu_completed == 0) {
          i.submenu_completed = false;
        }
      }

      let object = {
        role_menu_access_id: data[0]?.role_menu_access_id,
        employee_id: data[0]?.employee_id,
        role_module_master_id: data[0]?.role_module_master_id,
        role_module_master_name: data[0]?.role_module_master_name,
        module_master_link: data[0]?.module_master_link,
        module_master_icon: data[0]?.module_master_icon,
        module_master_endIcon: data[0]?.module_master_endIcon,
        role_module_master_completed: data[0]?.role_module_master_completed,
        menu_master_id: data[0]?.menu_master_id,
        menu_master_name: data[0]?.menu_master_name,
        menu_title: data[0]?.menu_title,
        menu_masters_icon: data[0]?.menu_masters_icon,
        menu_master_link: data[0]?.menu_master_link,
        menu_master_lastIcon: data[0]?.menu_master_lastIcon,
        menu_completed: data[0]?.menu_completed,
        status: data[0]?.status,
        HRMS_RBAC_SUBMENU_MASTER: data,
      };
      Data.push(object);
    });

    uniqueDataInf?.forEach((index) => {
      let data2 = Data.filter((obj) => obj.role_module_master_id == index);

      let parentObj = {
        role_module_master_id: data2[0]?.role_module_master_id,
        role_module_master_name: data2[0]?.role_module_master_name,
        module_master_link: data2[0]?.module_master_link,
        module_master_icon: data2[0]?.module_master_icon,
        module_master_endIcon: data2[0]?.module_master_endIcon,
        role_module_master_completed: data2[0]?.role_module_master_completed,
        menu_masters_icon: data2[0]?.menu_masters_icon,
        menu_master_link: data2[0]?.menu_master_link,
        menu_master_lastIcon: data2[0]?.menu_master_lastIcon,
        HRMS_RBAC_MENU_MASTER: data2,
      };
      maindata.push(parentObj);
    });
    let filterSuperModules = maindata?.filter(
      (e) => e?.role_module_master_completed === true
    );
    for (let i = 0; i < filterSuperModules?.length; i++) {
      let subSuperModule = filterSuperModules[i]?.HRMS_RBAC_MENU_MASTER;
      let filterSubSuperModule = subSuperModule.filter(
        (e) => e?.menu_completed === true
      );
      subSuperModule.length = 0;
      subSuperModule.push(...filterSubSuperModule);

      for (let j = 0; j < subSuperModule?.length; j++) {
        let subModule = subSuperModule[j]?.HRMS_RBAC_SUBMENU_MASTER;
        let filterSubModule = subModule.filter(
          (e) => e.submenu_completed === true
        );
        subModule.length = 0;
        subModule.push(...filterSubModule);
      }
    }
    // filterSuperModules?.map((item) => {
    //   item?.HRMS_RBAC_MENU_MASTER?.map((menuItem) => {
    //     menuItem?.HRMS_RBAC_SUBMENU_MASTER?.map((subMenuItem) => {
    //       if (!subMenuItem?.submenu_master_name) delete menuItem?.HRMS_RBAC_SUBMENU_MASTER;
    //     })
    //   })
    // })

    const entity_details = await db.entityMaster.findOne({
      where: { id: entity_id, status: "Active", isDeleted: false },
    });

    if (getData) {
      return res.status(200).send({
        code: 200,
        message: "Fetch data by ID Successfully",
        data: filterSuperModules,
        entity_details,
      });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.searchMasterFilter = async (req, res) => {
  try {
    // const roleMenuAccessId = parseInt(req.params.role_master_id);
    const { module_master_id, roleMenuAccessId } = req.body;
    let getData = await db.sequelize.query(
      `SELECT 
      rma.role_module_master_id,
      rma.role_module_master_completed,
      rma.menu_master_id, 
      rma.submenu_master_id, 
      rma.menu_completed, 
      rma.submenu_completed,
      rma.role_master_id, 
      rma.employee_id,  
      rmm.role_module_master_id,
      rmm.role_module_master_name,
      rmm.module_master_link,
      rmm.module_master_icon,
      rmm.module_master_endIcon,
      sm.submenu_master_id,
      mm.menu_master_id,
      mm.menu_master_name,
      mm.menu_title,
      mm.menu_masters_icon,
      mm.menu_master_link,
      mm.menu_master_lastIcon,
      sm.submenu_masters_link,
      sm.submenu_masters_icon,
      sm.submenu_master_name
      from HRMS_RBAC_SUBMENU_MASTER sm
      RIGHT JOIN HRMS_RBAC_MENU_MASTER mm ON sm.menu_master_id = mm.menu_master_id
      RIGHT JOIN HRMS_RBAC_ROLE_MODULE_MASTER rmm ON mm.role_module_master_id = rmm.role_module_master_id
      LEFT JOIN HRMS_RBAC_ROLE_MENU_ACCESS rma ON sm.submenu_master_id = rma.submenu_master_id
      and rma.employee_id =${roleMenuAccessId};`,
      {
        // replacements: {id: req.user.id},
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    let uniqueData = getData.map((item) => item.menu_master_id);
    uniqueData = [...new Set(uniqueData)];

    let uniqueDataInf = getData.map((index) => index.role_module_master_id);
    uniqueDataInf = [...new Set(uniqueDataInf)];

    let maindata = [];
    const Data = [];
    uniqueData.forEach((element) => {
      let data = getData.filter((obj) => obj.menu_master_id == element);

      for (let i of data) {
        if (i.role_module_master_completed == 1) {
          i.role_module_master_completed = true;
        } else if (i.role_module_master_completed == 0) {
          i.role_module_master_completed = false;
        }
        if (i.menu_completed == 1) {
          i.menu_completed = true;
        } else if (i.menu_completed == 0) {
          i.menu_completed = false;
        }
        if (i.submenu_completed == 1) {
          i.submenu_completed = true;
        } else if (i.submenu_completed == 0) {
          i.submenu_completed = false;
        }
      }

      let object = {
        role_menu_access_id: data[0].role_menu_access_id,
        employee_id: data[0].employee_id,
        role_module_master_id: data[0].role_module_master_id,
        role_module_master_name: data[0].role_module_master_name,
        module_master_link: data[0].module_master_link,
        module_master_icon: data[0].module_master_icon,
        module_master_endIcon: data[0].module_master_endIcon,
        role_module_master_completed: data[0].role_module_master_completed,
        menu_master_id: data[0].menu_master_id,
        menu_master_name: data[0].menu_master_name,
        menu_title: data[0].menu_title,
        menu_masters_icon: data[0].menu_masters_icon,
        menu_master_link: data[0].menu_master_link,
        menu_master_lastIcon: data[0].menu_master_lastIcon,
        menu_completed: data[0].menu_completed,
        status: data[0].status,
        HRMS_RBAC_SUBMENU_MASTER: data,
      };
      Data.push(object);
    });

    uniqueDataInf.forEach((index) => {
      let data2 = Data.filter((obj) => obj.role_module_master_id == index);

      let parentObj = {
        role_module_master_id: data2[0].role_module_master_id,
        role_module_master_name: data2[0].role_module_master_name,
        module_master_link: data2[0].module_master_link,
        module_master_icon: data2[0].module_master_icon,
        module_master_endIcon: data2[0].module_master_endIcon,
        role_module_master_completed: data2[0].role_module_master_completed,
        menu_masters_icon: data2[0].menu_masters_icon,
        menu_master_link: data2[0].menu_master_link,
        menu_master_lastIcon: data2[0].menu_master_lastIcon,
        HRMS_RBAC_MENU_MASTER: data2,
      };
      maindata.push(parentObj);
    });
    let filterSuperModules = maindata.filter(
      (e) => e.role_module_master_completed === true
    );
    for (let i = 0; i < filterSuperModules.length; i++) {
      let subSuperModule = filterSuperModules[i].HRMS_RBAC_MENU_MASTER;
      let filterSubSuperModule = subSuperModule.filter(
        (e) => e.menu_completed === true
      );

      subSuperModule.length = 0;
      subSuperModule.push(...filterSubSuperModule);

      for (let j = 0; j < subSuperModule.length; j++) {
        let subModule = subSuperModule[j].HRMS_RBAC_SUBMENU_MASTER;
        let filterSubModule = subModule.filter(
          (e) => e.submenu_completed === true
        );
        subModule.length = 0;
        subModule.push(...filterSubModule);
      }
    }

    const filterdata = filterSuperModules.filter(
      (item) => item.role_module_master_id == module_master_id
    );

    if (getData) {
      return res.status(200).send({
        code: 200,
        message: "Fetch data by ID Successfully",
        data: filterdata,
      });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

// /////////////// UPDATE roleMenuAccess ///////////////
// exports.editroleMenuAccess = async (req, res) => {
//   try {
//     let { employee_id, role_master_id, entity_id } = req.query;
//     let results = [];
//     let role_menuUpdateData;

//     let rolemenuaccessdata = await roleMenuAccessDetails.findAll({ where: { status: "ACTIVE" } });
//     for (let m = 0; m < req?.body?.length; m++) {
//       for (var sub = 0; sub < req?.body[m]?.HRMS_RBAC_MENU_MASTER?.length; sub++) {
//         if (req?.body[m]?.HRMS_RBAC_MENU_MASTER[sub]?.HRMS_RBAC_SUBMENU_MASTER?.length) {
//           for (var subchild = 0; subchild < req?.body[m]?.HRMS_RBAC_MENU_MASTER[sub]?.HRMS_RBAC_SUBMENU_MASTER?.length; subchild++) {
//             let Objrole2 = {
//               role_module_master_id: req.body[m].role_module_master_id,
//               role_module_master_name: req.body[m].role_module_master_name,
//               role_module_master_completed: req.body[m].role_module_master_completed,
//               menu_master_id: req.body[m].HRMS_RBAC_MENU_MASTER[sub].menu_master_id,
//               menu_master_name: req.body[m].HRMS_RBAC_MENU_MASTER[sub].menu_master_name,
//               submenu_master_id: req.body[m].HRMS_RBAC_MENU_MASTER[sub].HRMS_RBAC_SUBMENU_MASTER[subchild].submenu_master_id,
//               submenu_master_name: req.body[m].HRMS_RBAC_MENU_MASTER[sub].HRMS_RBAC_SUBMENU_MASTER[subchild].submenu_master_name,
//               employee_id: employee_id,
//               role_master_id: role_master_id,
//               entity_id: entity_id,
//               menu_completed: req.body[m].HRMS_RBAC_MENU_MASTER[sub].menu_completed,
//               submenu_completed: req.body[m].HRMS_RBAC_MENU_MASTER[sub].HRMS_RBAC_SUBMENU_MASTER[subchild].submenu_completed
//             }
//             let Objrole = {
//               role_module_master_completed: req.body[m].role_module_master_completed,
//               menu_completed: req.body[m].HRMS_RBAC_MENU_MASTER[sub].menu_completed,
//               submenu_completed: req.body[m].HRMS_RBAC_MENU_MASTER[sub].HRMS_RBAC_SUBMENU_MASTER[subchild].submenu_completed
//             };
//             let filterdata = rolemenuaccessdata.filter(item => item.role_module_master_id == Objrole2.role_module_master_id && item.menu_master_id == Objrole2.menu_master_id && item.submenu_master_id == Objrole2.submenu_master_id && item.employee_id == Objrole2.employee_id && item.role_master_id == Objrole2.role_master_id && item.entity_id == Objrole2.entity_id);

//             if (filterdata?.length > 0) {
//               role_menuUpdateData = await roleMenuAccessDetails.update(Objrole, {
//                 where: {
//                   menu_master_id: Objrole2.menu_master_id,
//                   submenu_master_id: Objrole2.submenu_master_id,
//                   employee_id: Objrole2.employee_id,
//                   role_master_id: Objrole2.role_master_id,
//                   entity_id: Objrole2.entity_id,
//                   role_module_master_id: Objrole2.role_module_master_id
//                 }
//               });
//               results.push(role_menuUpdateData);
//             } else {
//               await roleMenuAccessDetails.create(Objrole2);
//             }
//           }
//         }
//         else {
//           let Objrole2 = {
//             role_module_master_id: req?.body[m]?.role_module_master_id,
//             role_module_master_name: req?.body[m]?.role_module_master_name,
//             role_module_master_completed: req?.body[m]?.role_module_master_completed,
//             menu_master_id: req?.body[m]?.HRMS_RBAC_MENU_MASTER[sub]?.menu_master_id,
//             menu_master_name: req?.body[m]?.HRMS_RBAC_MENU_MASTER[sub]?.menu_master_name,
//             employee_id: employee_id,
//             role_master_id: role_master_id,
//             entity_id: entity_id,
//             menu_completed: req?.body[m]?.HRMS_RBAC_MENU_MASTER[sub]?.menu_completed,
//           }

//           let Objrole = {
//             role_module_master_completed: req?.body[m]?.role_module_master_completed,
//             menu_completed: req?.body[m]?.HRMS_RBAC_MENU_MASTER[sub]?.menu_completed,
//             submenu_completed: false
//           };
//           let filterdata = rolemenuaccessdata.filter(item => item?.role_module_master_id == Objrole2?.role_module_master_id && item?.menu_master_id == Objrole2?.menu_master_id && item?.employee_id == Objrole2?.employee_id && item?.role_master_id == Objrole2?.role_master_id && item?.entity_id == Objrole2?.entity_id);

//           if (filterdata?.length > 0) {
//             role_menuUpdateData = await roleMenuAccessDetails.update(Objrole, {
//               where: {
//                 menu_master_id: Objrole2?.menu_master_id,
//                 employee_id: Objrole2?.employee_id,
//                 role_master_id: Objrole2?.role_master_id,
//                 entity_id: Objrole2?.entity_id,
//                 role_module_master_id: Objrole2?.role_module_master_id
//               }
//             });
//             results.push(role_menuUpdateData);
//           } else {
//             await roleMenuAccessDetails.create(Objrole2);
//           }
//         }
//       }
//     }
//     return res.status(200).send({
//       code: 200,
//       message: "Role Updated Successfully",
//       result: role_menuUpdateData,
//     });
//   } catch (error) {
//     logger.error(`Error ${error.message}`, { error });
//     console.log(error);
//     return res.status(500).send({ code: 500, message: error.message || "Server Error" });
//   }
// };
exports.editroleMenuAccess = async (req, res) => {
  try {
    let { employee_ids, role_master_id, entity_id } = req.query;

    let employeeIdList = [];
    if (employee_ids) {
      employeeIdList = employee_ids.split(",").map((id) => parseInt(id, 10));
    }

    let results = [];
    let rolemenuaccessdata = await roleMenuAccessDetails.findAll({
      where: { status: "ACTIVE" },
    });

    // loop employees
    for (let empId of employeeIdList) {
      for (let m = 0; m < req?.body?.length; m++) {
        for (
          var sub = 0;
          sub < req?.body[m]?.HRMS_RBAC_MENU_MASTER?.length;
          sub++
        ) {
          if (
            req?.body[m]?.HRMS_RBAC_MENU_MASTER[sub]?.HRMS_RBAC_SUBMENU_MASTER
              ?.length
          ) {
            // submenu loop
            for (
              var subchild = 0;
              subchild <
              req?.body[m]?.HRMS_RBAC_MENU_MASTER[sub]?.HRMS_RBAC_SUBMENU_MASTER
                ?.length;
              subchild++
            ) {
              let Objrole2 = {
                role_module_master_id: req.body[m].role_module_master_id,
                role_module_master_name: req.body[m].role_module_master_name,
                role_module_master_completed:
                  req.body[m].role_module_master_completed,
                menu_master_id:
                  req.body[m].HRMS_RBAC_MENU_MASTER[sub].menu_master_id,
                menu_master_name:
                  req.body[m].HRMS_RBAC_MENU_MASTER[sub].menu_master_name,
                submenu_master_id:
                  req.body[m].HRMS_RBAC_MENU_MASTER[sub]
                    .HRMS_RBAC_SUBMENU_MASTER[subchild].submenu_master_id,
                submenu_master_name:
                  req.body[m].HRMS_RBAC_MENU_MASTER[sub]
                    .HRMS_RBAC_SUBMENU_MASTER[subchild].submenu_master_name,
                employee_id: empId, // 👈 here
                role_master_id: role_master_id,
                entity_id: entity_id,
                menu_completed:
                  req.body[m].HRMS_RBAC_MENU_MASTER[sub].menu_completed,
                submenu_completed:
                  req.body[m].HRMS_RBAC_MENU_MASTER[sub]
                    .HRMS_RBAC_SUBMENU_MASTER[subchild].submenu_completed,
              };

              let Objrole = {
                role_module_master_completed:
                  req.body[m].role_module_master_completed,
                menu_completed:
                  req.body[m].HRMS_RBAC_MENU_MASTER[sub].menu_completed,
                submenu_completed:
                  req.body[m].HRMS_RBAC_MENU_MASTER[sub]
                    .HRMS_RBAC_SUBMENU_MASTER[subchild].submenu_completed,
              };

              let filterdata = rolemenuaccessdata.filter(
                (item) =>
                  item.role_module_master_id ==
                    Objrole2.role_module_master_id &&
                  item.menu_master_id == Objrole2.menu_master_id &&
                  item.submenu_master_id == Objrole2.submenu_master_id &&
                  item.employee_id == Objrole2.employee_id &&
                  item.role_master_id == Objrole2.role_master_id &&
                  item.entity_id == Objrole2.entity_id
              );

              if (filterdata?.length > 0) {
                let role_menuUpdateData = await roleMenuAccessDetails.update(
                  Objrole,
                  {
                    where: {
                      menu_master_id: Objrole2.menu_master_id,
                      submenu_master_id: Objrole2.submenu_master_id,
                      employee_id: Objrole2.employee_id,
                      role_master_id: Objrole2.role_master_id,
                      entity_id: Objrole2.entity_id,
                      role_module_master_id: Objrole2.role_module_master_id,
                    },
                  }
                );
                results.push(role_menuUpdateData);
              } else {
                await roleMenuAccessDetails.create(Objrole2);
              }
            }
          } else {
            // no submenu
            let Objrole2 = {
              role_module_master_id: req?.body[m]?.role_module_master_id,
              role_module_master_name: req?.body[m]?.role_module_master_name,
              role_module_master_completed:
                req?.body[m]?.role_module_master_completed,
              menu_master_id:
                req?.body[m]?.HRMS_RBAC_MENU_MASTER[sub]?.menu_master_id,
              menu_master_name:
                req?.body[m]?.HRMS_RBAC_MENU_MASTER[sub]?.menu_master_name,
              employee_id: empId, // 👈 here
              role_master_id: role_master_id,
              entity_id: entity_id,
              menu_completed:
                req?.body[m]?.HRMS_RBAC_MENU_MASTER[sub]?.menu_completed,
            };

            let Objrole = {
              role_module_master_completed:
                req?.body[m]?.role_module_master_completed,
              menu_completed:
                req?.body[m]?.HRMS_RBAC_MENU_MASTER[sub]?.menu_completed,
              submenu_completed: false,
            };

            let filterdata = rolemenuaccessdata.filter(
              (item) =>
                item?.role_module_master_id ==
                  Objrole2?.role_module_master_id &&
                item?.menu_master_id == Objrole2?.menu_master_id &&
                item?.employee_id == Objrole2?.employee_id &&
                item?.role_master_id == Objrole2?.role_master_id &&
                item?.entity_id == Objrole2?.entity_id
            );

            if (filterdata?.length > 0) {
              let role_menuUpdateData = await roleMenuAccessDetails.update(
                Objrole,
                {
                  where: {
                    menu_master_id: Objrole2?.menu_master_id,
                    employee_id: Objrole2?.employee_id,
                    role_master_id: Objrole2?.role_master_id,
                    entity_id: Objrole2?.entity_id,
                    role_module_master_id: Objrole2?.role_module_master_id,
                  },
                }
              );
              results.push(role_menuUpdateData);
            } else {
              await roleMenuAccessDetails.create(Objrole2);
            }
          }
        }
      }
    } // end employee loop

    return res.status(200).send({
      code: 200,
      message: "Role Updated Successfully",
      result: results,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

// exports.crudFactionality = async (req, res) => {
//   try {
//     let { role_module_master_id, menu_master_id, submenu_master_id, forAll, forSingle, Write, Read, Delete } = req.body;
//     let { employee_id, role_master_id, entity_id } = req.query;

//     if (role_module_master_id && !menu_master_id && !submenu_master_id) {
//       const menuData = await menuMasterDetails.findAll({ where: { role_module_master_id: role_module_master_id } })

//       for (let i of menuData) {
//         let accessdata = await read_write_accessrDetails.findOne({
//           where: {
//             role_module_master_id: i.role_module_master_id,
//             menu_master_id: i.menu_master_id,
//             employee_id,
//             role_master_id, entity_id
//           }
//         })

//         const submenuData = await submenuMasterDetails.findAll({ where: { menu_master_id: i.menu_master_id } })

//         if (submenuData == '') {
//           if (accessdata) {
//             var updatedData = await read_write_accessrDetails.update({
//               forAll,
//               Write,
//               Read,
//               forSingle,
//               Delete
//             }, { where: { role_module_master_id: i.role_module_master_id, menu_master_id: i.menu_master_id, employee_id, role_master_id, entity_id } });
//           }
//           else if (accessdata == null) {

//             var updatedData = await read_write_accessrDetails.create({
//               role_module_master_id: role_module_master_id,
//               employee_id,
//               role_master_id, entity_id,
//               menu_master_id: i.menu_master_id,
//               forAll,
//               forSingle,
//               Write,
//               Read,
//               Delete,
//             })
//           }
//         } else {
//           for (let j of submenuData) {
//             if (accessdata) {
//               var updatedData = await read_write_accessrDetails.update({
//                 forAll,
//                 Write,
//                 Read,
//                 forSingle,
//                 Delete
//               }, { where: { role_module_master_id: i.role_module_master_id, menu_master_id: i.menu_master_id, employee_id, role_master_id, entity_id } });
//             }
//             else if (accessdata == null) {

//               var updatedData = await read_write_accessrDetails.create({
//                 role_module_master_id: role_module_master_id,
//                 employee_id,
//                 role_master_id, entity_id,
//                 menu_master_id: i.menu_master_id,
//                 submenu_master_id: j.submenu_master_id,
//                 forAll,
//                 forSingle,
//                 Write,
//                 Read,
//                 Delete,
//               })
//             }
//           }
//         }
//       }
//       return res.status(200).send({ code: 200, message: "Successfully Created Read &  Write...", data: updatedData });
//     }

//     else if (role_module_master_id && menu_master_id && !submenu_master_id) {
//       const menu_master_data = await menuMasterDetails.findAll({
//         where: {
//           menu_master_id: menu_master_id,
//         }
//       })

//       if (menu_master_data.length > 0) {
//         for (let i of menu_master_data) {
//           let accessdata = await read_write_accessrDetails.findOne({
//             where: {
//               menu_master_id: i.menu_master_id,
//               role_module_master_id: role_module_master_id,
//               employee_id, role_master_id, entity_id
//             }
//           })

//           if (accessdata) {
//             var updatedData = await read_write_accessrDetails.update({
//               forAll,
//               forSingle,
//               Delete,
//               Write,
//               Read,
//             }, { where: { role_module_master_id: accessdata.role_module_master_id, menu_master_id: accessdata.menu_master_id, employee_id, role_master_id, entity_id } });
//           }
//           else if (accessdata == null) {
//             var updatedData = await read_write_accessrDetails.create({
//               forAll,
//               forSingle,
//               Write,
//               Read,
//               Delete,
//               menu_master_id: i.menu_master_id,
//               submenu_master_id: i.submenu_master_id,
//               role_module_master_id: role_module_master_id,
//               employee_id, role_master_id, entity_id
//             })
//           }
//         }
//       }
//       return res.status(200).send({ code: 200, message: "Assigend task Successfully!", data: updatedData });
//     }

//     else if (role_module_master_id && menu_master_id && submenu_master_id) {
//       let new_accessdata = await read_write_accessrDetails.findOne({
//         where: {
//           role_module_master_id: role_module_master_id,
//           menu_master_id: menu_master_id,
//           submenu_master_id: submenu_master_id,
//           employee_id, role_master_id, entity_id
//         }
//       })

//       if (new_accessdata) {
//         var updatedData = await read_write_accessrDetails.update({
//           forAll,
//           Write,
//           Read,
//           forSingle,
//           Delete,
//         }, {
//           where: {
//             role_module_master_id: new_accessdata.role_module_master_id,
//             menu_master_id: new_accessdata.menu_master_id,
//             submenu_master_id: new_accessdata.submenu_master_id, employee_id, role_master_id, entity_id
//           }
//         });
//       }

//       else if (new_accessdata == null) {
//         var updatedData = await read_write_accessrDetails.create({
//           menu_master_id: menu_master_id,
//           submenu_master_id: submenu_master_id,
//           role_module_master_id: role_module_master_id,
//           employee_id, role_master_id, entity_id,
//           forAll,
//           forSingle,
//           Write,
//           Read,
//           Delete,
//         })
//       }
//     }
//     return res.status(200).send({ code: 200, message: "Successfully Created...", data: updatedData });
//   }
//   catch (error) {
//     logger.error(`Error ${error.message}`, { error });
//     console.log(error);
//     return res.status(500).send({ code: 500, message: error.message });
//   }
// }

exports.crudFactionality = async (req, res) => {
  try {
    let {
      role_module_master_id,
      menu_master_id,
      submenu_master_id,
      forAll,
      forSingle,
      Write,
      Read,
      Delete,
      employee_ids,
    } = req.body;
    let { role_master_id, entity_id } = req.query;

    let updatedData = [];

    // loop over employee_ids
    for (let empId of employee_ids) {
      //Only -- role_module_master_id
      if (role_module_master_id && !menu_master_id && !submenu_master_id) {
        const menuData = await menuMasterDetails.findAll({
          where: { role_module_master_id },
        });

        for (let i of menuData) {
          let accessdata = await read_write_accessrDetails.findOne({
            where: {
              role_module_master_id: i.role_module_master_id,
              menu_master_id: i.menu_master_id,
              employee_id: empId,
              role_master_id,
              entity_id,
            },
          });

          const submenuData = await submenuMasterDetails.findAll({
            where: { menu_master_id: i.menu_master_id },
          });

          if (submenuData.length === 0) {
            if (accessdata) {
              await read_write_accessrDetails.update(
                { forAll, Write, Read, forSingle, Delete },
                {
                  where: {
                    role_module_master_id: i.role_module_master_id,
                    menu_master_id: i.menu_master_id,
                    employee_id: empId,
                    role_master_id,
                    entity_id,
                  },
                }
              );
              let afterUpdate = await read_write_accessrDetails.findOne({
                where: {
                  role_module_master_id: i.role_module_master_id,
                  menu_master_id: i.menu_master_id,
                  employee_id: empId,
                  role_master_id,
                  entity_id,
                },
              });
              updatedData.push(afterUpdate);
            } else {
              let newRecord = await read_write_accessrDetails.create({
                role_module_master_id,
                employee_id: empId,
                role_master_id,
                entity_id,
                menu_master_id: i.menu_master_id,
                forAll,
                forSingle,
                Write,
                Read,
                Delete,
              });
              updatedData.push(newRecord);
            }
          } else {
            for (let j of submenuData) {
              if (accessdata) {
                await read_write_accessrDetails.update(
                  { forAll, Write, Read, forSingle, Delete },
                  {
                    where: {
                      role_module_master_id: i.role_module_master_id,
                      menu_master_id: i.menu_master_id,
                      employee_id: empId,
                      role_master_id,
                      entity_id,
                    },
                  }
                );
                let afterUpdate = await read_write_accessrDetails.findOne({
                  where: {
                    role_module_master_id: i.role_module_master_id,
                    menu_master_id: i.menu_master_id,
                    employee_id: empId,
                    role_master_id,
                    entity_id,
                  },
                });
                updatedData.push(afterUpdate);
              } else {
                let newRecord = await read_write_accessrDetails.create({
                  role_module_master_id,
                  employee_id: empId,
                  role_master_id,
                  entity_id,
                  menu_master_id: i.menu_master_id,
                  submenu_master_id: j.submenu_master_id,
                  forAll,
                  forSingle,
                  Write,
                  Read,
                  Delete,
                });
                updatedData.push(newRecord);
              }
            }
          }
        }
      }

      //role_module_master_id + menu_master_id
      else if (role_module_master_id && menu_master_id && !submenu_master_id) {
        const menu_master_data = await menuMasterDetails.findAll({
          where: { menu_master_id },
        });

        for (let i of menu_master_data) {
          let accessdata = await read_write_accessrDetails.findOne({
            where: {
              menu_master_id: i.menu_master_id,
              role_module_master_id,
              employee_id: empId,
              role_master_id,
              entity_id,
            },
          });

          if (accessdata) {
            await read_write_accessrDetails.update(
              { forAll, forSingle, Delete, Write, Read },
              {
                where: {
                  role_module_master_id,
                  menu_master_id: i.menu_master_id,
                  employee_id: empId,
                  role_master_id,
                  entity_id,
                },
              }
            );
            let afterUpdate = await read_write_accessrDetails.findOne({
              where: {
                role_module_master_id,
                menu_master_id: i.menu_master_id,
                employee_id: empId,
                role_master_id,
                entity_id,
              },
            });
            updatedData.push(afterUpdate);
          } else {
            let newRecord = await read_write_accessrDetails.create({
              forAll,
              forSingle,
              Write,
              Read,
              Delete,
              menu_master_id: i.menu_master_id,
              submenu_master_id: i.submenu_master_id,
              role_module_master_id,
              employee_id: empId,
              role_master_id,
              entity_id,
            });
            updatedData.push(newRecord);
          }
        }
      }

      // role_module_master_id + menu_master_id + submenu_master_id
      else if (role_module_master_id && menu_master_id && submenu_master_id) {
        let new_accessdata = await read_write_accessrDetails.findOne({
          where: {
            role_module_master_id,
            menu_master_id,
            submenu_master_id,
            employee_id: empId,
            role_master_id,
            entity_id,
          },
        });

        if (new_accessdata) {
          await read_write_accessrDetails.update(
            { forAll, Write, Read, forSingle, Delete },
            {
              where: {
                role_module_master_id,
                menu_master_id,
                submenu_master_id,
                employee_id: empId,
                role_master_id,
                entity_id,
              },
            }
          );
          let afterUpdate = await read_write_accessrDetails.findOne({
            where: {
              role_module_master_id,
              menu_master_id,
              submenu_master_id,
              employee_id: empId,
              role_master_id,
              entity_id,
            },
          });
          updatedData.push(afterUpdate);
        } else {
          let newRecord = await read_write_accessrDetails.create({
            menu_master_id,
            submenu_master_id,
            role_module_master_id,
            employee_id: empId,
            role_master_id,
            entity_id,
            forAll,
            forSingle,
            Write,
            Read,
            Delete,
          });
          updatedData.push(newRecord);
        }
      }
    }

    return res.status(200).send({
      code: 200,
      message: "Successfully Created Read & Write...",
      data: updatedData,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res.status(500).send({ code: 500, message: error.message });
  }
};

// exports.getRolewise = async (req, res) => {
//   try {
//     var { role_module_master_id, submenu_master_id, menu_master_id, employee_id, role_master_id, entity_id } = req.body
//     let data;

//     if (role_module_master_id && submenu_master_id && menu_master_id) {
//       data = await read_write_accessrDetails.findAll({
//         where: {
//           [Op.and]: [
//             { employee_id },
//             { role_master_id },
//             { entity_id },
//             { role_module_master_id: role_module_master_id },
//             { menu_master_id: menu_master_id },
//             { submenu_master_id: submenu_master_id }
//           ]
//         }
//       })
//     }
//     else if (role_module_master_id && menu_master_id) {
//       data = await read_write_accessrDetails.findAll({
//         where: {
//           [Op.and]: [
//             { employee_id },
//             { role_master_id },
//             { entity_id },
//             { role_module_master_id: role_module_master_id },
//             { menu_master_id: menu_master_id },
//           ]
//         }
//       })
//     }

//     else if (role_module_master_id) {
//       data = await read_write_accessrDetails.findAll({
//         where: {
//           [Op.and]: [
//             { employee_id },
//             { role_master_id },
//             { entity_id },
//             { role_module_master_id: role_module_master_id },
//           ]
//         }
//       })
//     }

//     if (data.length == 0 || data == null) {
//       return res.status(403).send({ code: 403, message: "Please Enter valid data " });
//     }

//     var obj = {
//       "employee_id": data[0].employee_id,
//       "role_master_id": data[0].role_master_id,
//       "entity_id": data[0].entity_id,
//       "role_module_master_id": data[0].role_module_master_id,
//       "menu_master_id": data[0].menu_master_id,
//       "submenu_master_id": data[0].submenu_master_id,
//       "options": {
//         "Write": data[0].Write,
//         "Read": data[0].Read,
//         "Delete": data[0].Delete
//       }
//     }
//     if (data) {
//       return res.status(200).send({ code: 200, message: "Assigend task Successfully!", data: obj });
//     } else {
//       return res.status(403).send({ code: 403, message: "Record Not Found" });
//     }
//   } catch (error) {
//     logger.error(`Error ${error.message}`, { error });
//     console.log(error);
//     return res.status(500).send({ code: 500, message: error.message });
//   }
// }
// controller.js

exports.getRolewise = async (req, res) => {
  try {
    console.log("getRolewise request body:", req.body);

    let {
      role_module_master_id,
      submenu_master_id,
      menu_master_id,
      employee_id,
      role_master_id,
      entity_id,
    } = req.body || {};

    // convert numeric strings to numbers when possible
    const normalize = (v) => {
      if (v === undefined || v === null) return undefined;
      if (typeof v === "number") return v;
      if (typeof v === "string" && v.trim() === "") return undefined;
      const n = Number(v);
      return Number.isNaN(n) ? v : n;
    };

    role_module_master_id = normalize(role_module_master_id);
    submenu_master_id = normalize(submenu_master_id);
    menu_master_id = normalize(menu_master_id);
    employee_id = normalize(employee_id);
    role_master_id = normalize(role_master_id);
    entity_id = normalize(entity_id);

    // required fields check — adjust if some are optional in your app
    const missing = [];
    if (!employee_id) missing.push("employee_id");
    if (!role_master_id) missing.push("role_master_id");
    if (!entity_id) missing.push("entity_id");
    if (missing.length) {
      return res.status(400).send({
        code: 400,
        message: `Missing required fields: ${missing.join(", ")}`,
      });
    }

    // build where only for provided fields
    const where = {};
    if (employee_id !== undefined) where.employee_id = employee_id;
    if (role_master_id !== undefined) where.role_master_id = role_master_id;
    if (entity_id !== undefined) where.entity_id = entity_id;
    if (role_module_master_id !== undefined)
      where.role_module_master_id = role_module_master_id;
    if (menu_master_id !== undefined) where.menu_master_id = menu_master_id;
    if (submenu_master_id !== undefined)
      where.submenu_master_id = submenu_master_id;

    console.log("Searching access record with where:", where);

    const record = await read_write_accessrDetails.findOne({ where });

    if (!record) {
      console.log("No record found for where:", where);
      return res.status(403).send({
        code: 403,
        message: "No access record found for supplied identifiers",
        where,
      });
    }

    const obj = {
      employee_id: record.employee_id,
      role_master_id: record.role_master_id,
      entity_id: record.entity_id,
      role_module_master_id: record.role_module_master_id,
      menu_master_id: record.menu_master_id,
      submenu_master_id: record.submenu_master_id,
      options: {
        Write: record.Write,
        Read: record.Read,
        Delete: record.Delete,
      },
    };

    return res
      .status(200)
      .send({ code: 200, message: "Assigned task Successfully!", data: obj });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res.status(500).send({ code: 500, message: error.message });
  }
};

////////////////////////////////////////////////////////////////////////////
exports.role_data = async (req, res) => {
  try {
    const role = req.body.role;
    if (role == "All") {
      const role_data = await roleMenuAccessDetails.findAll();
      return res
        .status(200)
        .send({ code: 200, message: "Data fetched ", data: role_data });
    } else if (role) {
      const role_data = await roleMenuAccessDetails.findAll({
        where: { menu_master_id: role },
      });
      return res
        .status(200)
        .send({ code: 200, message: "Data Fetched", data: role_data });
    } else {
      return res.status(404).send({ code: 404, message: "No role found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

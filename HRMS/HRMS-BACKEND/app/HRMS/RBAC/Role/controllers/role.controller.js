const db = require("../../../../models/index");
const roleDetails = db.role;
const Op = db.Sequelize.Op;


// exports.createRole= async (req, res)=>{
//     const {role_name, status}= req.body;
//     try{
//       if (!role_name) {
//         return res.status(400).send({
//           message: "Content can not be empty!"
//         });
//       }
//       //Name Exists
//       const role_exits= await Role.findOne({
//         where: {role_name: role_name}
//       })
//       if(role_exits){
//         return res.status(403).send({
//           message: "role_name Already Exists!"
//         })
//       }
//       const Data= await Role.create({
//         role_name,
//         status
//       })
//       return res.status(200).send({
//         message: "create successfully!", data: Data
//       })
//     }
//     catch(err){
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating the gradeData."
//       });
//     }
// }


// exports.getAllRole= async (req,res)=>{
//   try{
//     const Data= await Role.findAll({
//       where: {status : 'ACTIVE'}
//     })
//     if(Data){
//       res.status(200).send({message: "get all Role list", data: Data})
//     }
//   }catch(err){
//     console.log(err.message)
//     res.status(400).send({message: "error", error: err.message})
//   }
// }


//   exports.editRole = async (req, res) => {
//     const { role_name } = req.body;
//     const role_id = parseInt(req.params.id);
//     const roleDetails = await Role.update(req.body, { where: { id: parseInt(req.params.role_id) } });
//     if (!roleDetails) {
//       return res.status(200).send({ status: 404, message: "No data found" });
//     }
//     try {
//       res.status(200).send({ status: 200, message: "Role Data Update Successfully", roleDetails});
//     } catch (error) {
//       console.log(error)
//       return res.status(500).send({ code: 500, message: "Server Error" });
//   };
//   };


//   exports.getByIdRole =async (req, res) => {
//     const role_id = parseInt(req.params.role_id);
//     const status = "ACTIVE";
//     try {
//         const getAllData = await Role.findOne({where:{id:role_id,status:status}});
//         if (getAllData) {
//             return res.status(200).send({ code: 200, message: "Fetch All Data Successfully", data: getAllData });
//         } else {
//             return res.status(404).send({ message: "Record Not Found" });
//         };
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({ code: 500, message: "Server Error" });
//     };

// }

// exports.deleteRole = async (req, res) => {
//     try {
//         const role_id = req.params.role_id;
//         const dltData = await Role.findOne({ where: { id: role_id } });
//         if (dltData) {
//             const deleteData = await Role.update({ status: "INACTIVE" }, { where: { id: role_id } });
//             return res.status(200).send({ code: 200, message: "Role Deleted Successfully!", data: deleteData });
//         } else {
//             return res.status(403).send({ code: 403, message: "Records Not Found" });
//         }
//     } catch (error) {
//         console.log(error)
//         return res.status(500).send({ code: 500, message: "Server Error" });
//     };
// };
















/////////////// Create Role ///////////////

exports.createRole = async (req, res) => {
  try {
    const { role_name, status } = req.body
    const roleData = await roleDetails.findOne({ where: { role_name: role_name } });
    if (roleData) {
      return res.status(403).send({ code: 403, message: "Role is Already Exists!" });
    } else {
      const response = await roleDetails.create({
        role_name,
        status
      });
      return res.status(200).send({ code: 200, message: "Role Created Successfully!", data: response })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  };
};

/////////////// Edit Role ///////////////

exports.editRole = async (req, res) => {
  try {
    const roleId = req.params.id;
    const roleData = await roleDetails.findOne({ where: { id: roleId } });
    if (roleData) {
      const updateData = await roleDetails.update(req.body, { where: { id: roleId } });
      return res.status(200).send({ code: 200, message: "Role Updated Successfully", data: updateData });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    };
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  };
};

/////////////// Get All Role ///////////////

exports.getAllRole = async (req, res) => {
  try {
    const getAllData = await roleDetails.findAll({
      where: { status: 'ACTIVE' }
    })
    if (getAllData) {
      return res.status(200).send({ code: 200, message: "Fetch All Role Data Successfully", data: getAllData });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    };
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  };
};

/////////////// GetById Role ///////////////

exports.getByIdRole = async (req, res) => {
  try {
    const roleId = req.params.id;
    const getData = await roleDetails.findOne({ where: { id: roleId } });
    if (getData) {
      return res.status(200).send({ code: 200, message: "Fetch data Successfully", data: getData });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  };
};

/////////////// Delete Role ///////////////

exports.deleteRole = async (req, res) => {
  try {
    const roleId = req.params.id;
    const dltRole = await roleDetails.findOne({ where: { id: roleId } });
    if (dltRole) {
      const deleteData = await roleDetails.update({ status: "INACTIVE" }, { where: { id: roleId } });
      return res.status(200).send({ code: 200, message: "Role Data is Deleted Successfully!", data: deleteData });
    } else {
      return res.status(403).send({ code: 403, message: "Recorb Not Found" });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({ code: 500, message: "Server Error" });
  };
};
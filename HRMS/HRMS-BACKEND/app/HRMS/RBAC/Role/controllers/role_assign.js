
exports.createRole= async (req, res)=>{
    const {role_name, status}= req.body;
    try{
      if (!role_name) {
        return res.status(400).send({
          message: "Content can not be empty!"
        });
      }
      //Name Exists
      const role_exits= await Role.findOne({
        where: {role_name: role_name}
      })
      if(role_exits){
        return res.status(403).send({
          message: "role_name Already Exists!"
        })
      }
      const Data= await Role.create({
        role_name,
        status
      })
      return res.status(200).send({
        message: "create successfully!", data: Data
      })
    }
    catch(err){
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the gradeData."
      });
    }
}
const db = require('../../../../models/index');
const { Op } = require("sequelize");
const cityDetails = db.city;
const statesDetails = db.states;

exports.createcity = async (req, res) => {
    try {
        const { city_name, states_id } = req.body;
        const cityData = await cityDetails.findOne({ where: { city_name: city_name } });   
        if (cityData) {
            return res.status(403).send({ code: 403, message: "City Name is Already Exists!" });
        }            
        const response = await cityDetails.create({
            city_name, states_id
            });
            return res.status(200).send({ code: 200, message: "Created Successfully", data: response })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.getAllcity = async (req, res) => {
    try {
        const cityDetails = await db.sequelize.query( `SELECT M.states_id, M.states_name,MC.city_id,MC.city_name,MC.filter_status
        FROM MASTER_STATE M
        INNER JOIN MASTER_CITY AS MC ON MC.states_id = M.states_id WHERE MC.status = "ACTIVE" ORDER BY MC.city_id DESC` , { type: db.Sequelize.QueryTypes.SELECT });

     if (cityDetails && cityDetails.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetch All Data Successfully", data: cityDetails });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

exports.getcitybystateid = async (req, res) => {
    try {
        const id = req.params.states_id
        const getData = await cityDetails.findAll({
            where: {
                states_id: id
            }
        })
        return res.status(200).send({ code: 200, message: "These are states", data: getData})
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error"})
    }
}

exports.getByIdcity = async (req, res) => {
    try {
        try {
            const cityId = parseInt(req.params.city_id);
            const getData = await cityDetails.findOne({ where: { city_id: cityId, status: "ACTIVE" } });
            if (getData) {
                return res.status(200).send({ code: 200, message: "Fetch data by ID Successfully", data: getData });
            } else {
                return res.status(400).send({ code: 400, message: "Record Not Found" });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send({ code: 500, message: "Server Error" });
        };
        
    } catch (error) {
        console.log(error);
        
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.editcity = async (req, res) => {
    try {
        const city_Id = parseInt(req.params.city_id);
        const { city_name, states_id, status} = req.body;
        const getData = await cityDetails.findOne({ where: { city_id: city_Id} });   
       
        const response = await cityDetails.update({
                city_name,
                states_id,
                status
            } , { where: { city_id: parseInt(req.params.city_id) } });
            return res.status(200).send({ code: 200, message: "City Updated Successfully", data: response })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.deletecity = async (req, res) => {
    try {
        const cityId = parseInt(req.params.city_id);
        const dltcity = await cityDetails.findOne({ where: { city_id: cityId } });
        if (dltcity) {
            const deleteData = await cityDetails.update({ status: "INACTIVE" }, { where: { city_id: cityId } });
            return res.status(200).send({ code: 200, message: "City Data is Deleted Successfully!", data: deleteData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

// get city on the basis of state id

// exports.getcitybystateid = async (req, res) => {
//     try {
//         const stateid = req.params.id;
//         const getAllData = await cityDetails.findAll({
//             where: {  states_id: stateid , status: "ACTIVE" },
//             include: [{
//                 model: statesDetails,
//                 attributes: ["states_name", "states_id"]
//             }]
//         });
//         if (getAllData) {
//             var array = [];
//             for (var i = 0; i < getAllData.length; i++) {
//                 var getName = getAllData[i].state.states_name;
                
//                 var obj = {
//                     "city_id": getAllData[i].city_id,
//                     "city_name": getAllData[i].city_name,
//                     "states_id": getAllData[i].states_id,
//                     "status": getAllData[i].status,
//                     "states_name": getName
//                 }
//                 array.push(obj);
//             }
//             return res.status(200).send({ code: 200, message: "Fetch All Data Successfully", data: array });
//         } else {
//             return res.status(403).send({ code: 403, message: "Record Not Found" });
//         };
//     } catch (error) {
//         console.log(error);
        
//         return res.status(500).send({ code: 500, message: "Server Error" });
//     };
// };

exports.searchCity = async (req, res) => {
  try {
    const { searchText, limit } = req.query;

    let cities;
    // Common condition to exclude empty or null city_name
    const nonEmptyCondition = {
      city_name: {
        [Op.ne]: "", // Not empty string
        [Op.not]: null, // Not null
      },
    };

    if (!searchText || searchText.trim() === "") {
      // Return top 20 cities if searchText is empty or only whitespace
      cities = await db.city.findAll({
        where: nonEmptyCondition,
        limit: parseInt(limit),
        order: [["city_name", "ASC"]],
        include: [
          {
            model: db.states,
            attributes: ["states_id", "states_name", "status"],
            where: { status: "ACTIVE" },
          },
        ],
      });
    } else {
      // Search cities by name with partial match
      cities = await db.city.findAll({
        where: {
          [Op.and]: [
            nonEmptyCondition,
            {
              city_name: {
                [Op.like]: `%${searchText}%`,
              },
            },
          ],
        },
        limit: parseInt(limit),
        order: [["city_name", "ASC"]],
        include: [
          {
            model: db.states,
            attributes: ["states_id", "states_name", "status"],
            where: { status: "ACTIVE" },
          },
        ],
      });
    }

    res.json({ data: cities });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message:error.message || "Internal server error" });
  }
};
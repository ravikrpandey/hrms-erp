const { where } = require("sequelize");
const db = require("../../../../models/index");
const countryssDetails = db.countryss;
const stateDetails = db.states
const op = db.sequelize.op;

exports.createcountry = async (req, res) => {
    try {
        const { countryss_name, country_code ,phone_code} = req.body;
        const countryData = await countryssDetails.findOne({ where: { countryss_name: countryss_name } });
        if (countryData) {
            return res.status(403).send({ code: 403, message: "Country Name is Already Exists!" });
        }
        const response = await countryssDetails.create({
            countryss_name,
            country_code,
            phone_code
        });
        return res.status(200).send({ code: 200, message: "Created Successfully", data: response })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// UPDATE country ///////////////

exports.editcountry = async (req, res) => {
    try {
        console.log(req.body,"countrya");
        console.log(req.params,"countrya2");
        
        const countryssId = parseInt(req.params.countryss_id);
        const { countryss_name, status ,phone_code,country_code} = req.body;
        const countryssData = await countryssDetails.findOne({ where: { countryss_id: countryssId } });
        if (countryssData) {
            const response = await countryssDetails.update({
                countryss_name,
                phone_code,
                country_code,
                status
            }, { where: { countryss_id: countryssId } });
            return res.status(200).send({ code: 200, message: "Country Updated Successfully", data: response })
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.getAllcountry = async (req, res) => {
    try {
        const getAllData = await countryssDetails.findAll({
            where : {
                status : "ACTIVE"
            }
        })
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All Data Successfully", data: getAllData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.getAllActivecountry = async (req, res) => {
    try {
        const getAllData = await countryssDetails.findAll({ where: { status: "ACTIVE" } })
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All Data Successfully", data: getAllData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};
/////////////// GetById country ///////////////

exports.getByIdcountry = async (req, res) => {
    try {
        const countryId = parseInt(req.params.countryss_id);
        const getData = await countryssDetails.findOne({ where: { countryss_id: countryId, status: "ACTIVE" } });
        if (getData) {
            return res.status(200).send({ code: 200, message: "Fetch data by ID Successfully", data: getData });
        } else {
            return res.status(400).send({ code: 400, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Delete country ///////////////

exports.deletecountry = async (req, res) => {
    try {
        const countryId = parseInt(req.params.countryss_id);
        const dltcountry = await countryssDetails.findOne({ where: { countryss_id: countryId } });
        if (dltcountry) {
            const deleteData = await countryssDetails.update({ status: "INACTIVE" }, { where: { countryss_id: countryId } });
            return res.status(200).send({ code: 200, message: "Country Data is Deleted Successfully!", data: deleteData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.updateCountryStatus = async (req, res) => {
    try {
        const countryss_id = req.params.countryss_id;
        const { status } = req.body;
        
        const editData = await countryssDetails.findOne({ where: { countryss_id: countryss_id } });
        if (editData) {
            
            const updateData = await countryssDetails.update(
                {
                    status
                }, { where: { countryss_id: countryss_id } }
            );
            return res.status(200).send({ code: 200, message: "Status Updated Successfully", data: updateData });
        } else {
            return res.status(400).send({ code: 400, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};
const db = require("../../../models/index");

const PayrollTaxSlabModel = db.payroll_tax_slab;

/////////////// Create Complaint ///////////////

exports.createTaxslab = async (req, res) => {
    try {
        const { tax_slab_name, tax_slab_row, start_date, standard_deduction } = req.body;

            const response = await PayrollTaxSlabModel.create({
                standard_deduction,
                start_date,
                tax_slab_name,
                tax_slab_row
            });
            return res.status(200).send({ code: 200, message: "Tax Slab Created Successfully", data: response })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message||"Server Error" });
    };
};

/////////////// Edit Complaint ///////////////

exports.editTaxslab = async (req, res) => {
    try {
        const id = req.params.id;
        const taxslabData = await PayrollTaxSlabModel.findOne({ where: { id:id  } });
        if (taxslabData) {

                     const updateData = await PayrollTaxSlabModel.update(req.body, { where: {id:id } });
            return res.status(200).send({ code: 200, message: "Tax Slab Updated Successfully", data: updateData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Get By Id Complaint ///////////////

exports.getByIdTaxslab = async (req, res) => {
    try {
        const id = req.params.id;
        const getTaxslab = await PayrollTaxSlabModel.findOne({ where: { id:id } });
        if (getTaxslab) {
            return res.status(200).send({ code: 200, message: "Fetch Data Successfully", data: getTaxslab });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Gett All Complaint ///////////////

exports.getByIdAllTaxslab = async (req, res) => {
    try {
      

        const getAllData = await PayrollTaxSlabModel.findAll({
            order: [['id']],
        });

        if (getAllData.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetch All Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};




exports.getAllTaxslab = async (req, res) => {
    try {
     
        let query = `
           SELECT pts.id, pts.tax_slab_name, pts.tax_slab_row, pts.status, pts.standard_deduction, pts.start_date, pts.createdAt
            FROM PAYROLL_TAX_SLAB pts
            WHERE pts.isDeleted = 'false' 
        `;


        // Execute the query
        const [taxSlabList] = await db.sequelize.query(query);

        // Check if any tax slabs are found
        if (taxSlabList.length <= 0) {
            return res.status(400).send({ status: false, message: "No Tax Slabs found", data: taxSlabList });
        }

        return res.status(200).send({ status: true, message: "Tax Slabs listed successfully", data: taxSlabList });

    } catch (error) {
        // Handle errors and return a server error response
        return res.status(500).send({ status: false, message: error.message || 'Server Error' });
    }
};



/////////////// Delete Complaint ///////////////

exports.deleteTaxslab = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const taxslabData = await PayrollTaxSlabModel.findOne({ where: { id: id } });
        if (taxslabData) {
            await PayrollTaxSlabModel.update({ isDeleted: true }, { where: { id: id } });
            return res.status(200).send({ code: 200, message: "Data is Deleted Successfully!", });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};
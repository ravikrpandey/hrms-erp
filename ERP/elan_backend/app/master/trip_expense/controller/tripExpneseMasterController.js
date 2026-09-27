const { mod } = require("mathjs");
const db = require("../../../models/index");

module.exports.createTripExpenseMaster = async (req, res) => {
    try {
        const { expense_category_name } = req.body;
        
        const existingCategory = await db.trip_expense_master.findOne({
            where: { expense_category: expense_category_name }
          });
      
          if (existingCategory) {
            return res.status(400).send({ code: 400, message: "Expense Category Name Already Exists" });
          }
      
        const expenseCategory = await db.trip_expense_master.create({
            expense_category: expense_category_name
        }
        );
        return res.status(200).send({ code: 201, message: "Expense Created Successfully", data: expenseCategory })

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message })
    }
}

module.exports.getAllTripExpenseMaster = async (req, res) => {
    try {
        const expenseCategory = await db.trip_expense_master.findAll({
            where: { isDeleted: false }
        });

        return res.status(200).send({ code: 200, message: "Expense Fetch Successfully", data: expenseCategory });

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};

module.exports.getTripExpenseMasterById = async (req, res) => {
    const { id } = req.params;
    try {
        const expenseCategory = await db.trip_expense_master.findOne({
            where: { id: id, isDeleted: false },
        }
        );
        return res.status(200).send({ code: 200, message: "Expense Fetch Successfully ", data: expenseCategory });
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }

}


module.exports.updateTripExpenseMaster = async (req, res) => {
    try {
        const { id } = req.params;
        const { expense_category_name } = req.body;
        const expenseCategory = await db.trip_expense_master.update({
            expense_category: expense_category_name
        }, {
            where: { id: id }
        });
        return res.status(200).send({ code: 200, message: "Expense Updated Successfully ", data: expenseCategory });

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
}


module.exports.deleteTripExpenseMaster = async (req, res) => {
    try {
        const { id } = req.params;
        
        const expenseCategory = await db.trip_expense_master.update(
            { isDeleted: true },
            { where: { id: id } }
        );

        return res.status(200).send({ code: 200, message: "Expense Deleted Successfully", data: expenseCategory });
        
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
}

exports.TripExpenseStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const getData = await db.trip_expense_master.findOne({
            where: {
                id: id,
                isDeleted: false
            }
        });
        if (getData) {
            const updated = await db.trip_expense_master.update(
                { status },
                { where: { id: id } }
            );
            return res.status(200).send({
                code: 200,
                message: " Status Change Successfully!",
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};
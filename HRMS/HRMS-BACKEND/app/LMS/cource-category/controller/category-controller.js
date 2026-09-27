const db = require("../../../models/index");
// const stageDetails = db.stage;
const lms_course_category = db.lms_course_category
const op = db.sequelize.op;

exports.createCourseCategory = async (req, res) => {
    try {
        const { category_name } = req.body;
        const categorydata = await lms_course_category.findOne({ where: { category_name: category_name,isDeleted:false } });
        if (categorydata) {
            return res.status(201).send({ code: 201, message: "Category Name is Already Exists!" });
        }
        const response = await lms_course_category.create({
            category_name
        });
        return res.status(200).send({ code: 200, message: "Created Successfully", data: response })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.getAllCourseCategory = async (req, res) => {
    try {
        const getAllData = await lms_course_category.findAll({
            where: { 
                isDeleted: false,
            },
            attributes: ['category_id','category_name','status'],
            order: [['category_id', 'DESC']],
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

///////////// GetById Stage ///////////////

exports.getByIdCourseCategory = async (req, res) => {
    try {
        const category_id = parseInt(req.params.category_id);
        const getData = await lms_course_category.findOne({ where: { category_id: category_id } });
        if (getData) {
            return res.status(200).send({ code: 200, message: "Fetch data by ID Successfully", data: getData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);

        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Delete Stage ///////////////

exports.deleteCourseCategory = async (req, res) => {
    try {
        const category_id = parseInt(req.params.category_id);
        const dltStage = await lms_course_category.findOne({ where: { category_id: category_id } });
        if (dltStage) {
            const deleteData = await lms_course_category.update({ isDeleted: true }, { where: { category_id: category_id } });
            return res.status(200).send({ code: 200, message: "Data is Deleted Successfully!", data: deleteData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};


exports.editCourseCategory = async (req, res) => {
    try {
        const category_id = parseInt(req.params.category_id);
        const { category_name } = req.body;
        const dltStage = await lms_course_category.findOne({ where: { category_id: category_id } });
        if (dltStage) {
            const category_namee = await lms_course_category.findOne({ where: { category_name: category_name,isDeleted:false,category_id: { [db.Sequelize.Op.ne]: category_id } }});
            if (category_namee) {
                return res.status(409).send({ code: 409, message: "category Name is Already Exists!" });
            } else {
                const updateData = await lms_course_category.update(req.body, { where: { category_id: category_id } });
                return res.status(200).send({ code: 200, message: "Data is Update Successfully!", data: updateData });
            }
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.updateCourseCategoryStatus = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { status } = req.body;
        const editData = await lms_course_category.findOne({ where: { category_id: categoryId } });
        if (editData) {
            const updateData = await lms_course_category.update(
                {
                    status
                }, { where: { category_id: categoryId } }
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

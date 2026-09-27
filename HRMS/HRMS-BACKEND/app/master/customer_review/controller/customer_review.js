const db = require("../../../models/index");
// const stageDetails = db.stage;
const Review = db.customer_review;
const op = db.sequelize.op;

exports.createReview = async (req, res) => {
    try {
        const { review_name } = req.body;
        const reviewdata = await Review.findOne({ where: { review_name: review_name, isDeleted: false } });
        if (reviewdata) {
            return res.status(201).send({ code: 201, message: "Review Name is Already Exists!" });
        }
        const response = await Review.create({
            review_name
        });
        return res.status(200).send({ code: 200, message: "Created Successfully", data: response })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.getAllReview = async (req, res) => {
    try {
        const getAllData = await Review.findAll({
            where: {
                isDeleted: false,
            },
            attributes: ['review_id', 'review_name', 'status'],
            order: [['review_id', 'DESC']],
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

exports.getByIdReview = async (req, res) => {
    try {
        const review_id = parseInt(req.params.review_id);
        const getData = await Review.findOne({ where: { review_id: review_id } });
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

exports.deleteReview = async (req, res) => {
    try {
        const review_id = parseInt(req.params.review_id);
        const dltStage = await Review.findOne({ where: { review_id: review_id } });
        if (dltStage) {
            const deleteData = await Review.update({ isDeleted: true }, { where: { review_id: review_id } });
            return res.status(200).send({ code: 200, message: "Data is Deleted Successfully!", data: deleteData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};


exports.editReview = async (req, res) => {
    try {
        const review_id = parseInt(req.params.review_id);
        const { review_name } = req.body;
        const dltStage = await Review.findOne({ where: { review_id: review_id } });
        if (dltStage) {
            const review_namee = await Review.findOne({ where: { review_name: review_name, isDeleted: false, review_id: { [db.Sequelize.Op.ne]: review_id } } });
            if (review_namee) {
                return res.status(409).send({ code: 409, message: "review Name is Already Exists!" });
            } else {
                const updateData = await Review.update(req.body, { where: { review_id: review_id } });
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

exports.update_ReviewStatus = async (req, res) => {
    try {
        const reviewId = req.params.review_id;
        const { status } = req.body;
        const editData = await Review.findOne({ where: { review_id: reviewId } });
        if (editData) {
            const updateData = await Review.update(
                {
                    status
                }, { where: { review_id: reviewId } }
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

exports.getActiveStatus = async (req, res) => {
    try {
        const getAllData = await db.sequelize.query(
            `SELECT CR.review_id, CR.review_name, CR.status FROM CUSTOMER_REVIEW AS CR
            WHERE CR.status="ACTIVE" AND CR.isDeleted=0 ORDER BY CR.review_id ASC`,
            { type: db.sequelize.QueryTypes.SELECT }
        );
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
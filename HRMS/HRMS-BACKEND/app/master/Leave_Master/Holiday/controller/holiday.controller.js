const db = require("../../../../models/index");;
const holidayDetails = db.holidayDetail;
const parse = require('csv-parser');
const fs = require('fs');
const path = require("path");
const readXlsxFile = require("read-excel-file/node");
const moment = require('moment');
const { attribute } = require("@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js");

/////////////// Create Holiday ///////////////

exports.create_holiday = async (req, res) => {
    try {
        const { holiday_name, financial_year_id, entity_id, date } = req.body;

        const data = await holidayDetails.findOne({ where: { date, entity_id, financial_year_id, isDeleted: false } });

        if (data) {
            return res.status(403).send({ code: 500, message: "Holiday already exists" });
        }

        const response = await holidayDetails.create({
            holiday_name,
            financial_year_id,
            entity_id,
            date,
        });

        return res.status(200).send({ code: 200, message: "Holiday Created Successfully!", data: response });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

/////////////// Edit Holiday ///////////////
exports.edit_holiday = async (req, res) => {
    try {
        const holidayId = req.params.id;
        const { holiday_name, financial_year_id, entity_id, date } = req.body;
        const editData = await holidayDetails.findOne({ where: { id: holidayId } });
        if (editData) {
            const updateData = await holidayDetails.update({
                holiday_name, financial_year_id, entity_id, date
            },
                { where: { id: holidayId } });
            return res.status(200).send({ code: 200, message: "Holiday Updated SuccessFully", data: updateData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.updateHolidayStatus = async (req, res) => {
    try {
        const { id, status } = req.params;

        const Data = await holidayDetails.findOne({
            where: {
                id: id
            }
        })
        if (Data) {
            const updateData = await holidayDetails.update({
                status: status
            },
                {
                    where: {
                        id: id
                    }
                })
            return res.status(200).send({ code: 200, message: "holiday staus updated succesfully", data: updateData })
        } else {
            return res.status(404).send({ code: 404, message: "ID not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.get_All_holiday = async (req, res) => {
    try {
        const { entity_id } = req.query;

        const [getAllData] = await db.sequelize.query(
            `SELECT
                HD.*,
                FY.financial_year,
                EM.entity_name
            FROM MASTER_HOLIDAY AS HD
            INNER JOIN MASTER_FINANCIAL_YEAR AS FY ON FY.id = HD.financial_year_id
            INNER JOIN ENTITY_MASTER AS EM ON EM.id = HD.entity_id
            WHERE HD.isDeleted = false AND HD.entity_id=${entity_id}`
        );
        const promises = getAllData.map(async (holiday) => {
            if (holiday.entity_id) {
                const entity_detail = await db.entityMaster.findOne({
                    where: { id: holiday.entity_id }
                });
                if (entity_detail) {
                    holiday.company_branch = entity_detail.company_branch;
                }
            }
            return holiday;
        });

        const holidaysWithData = await Promise.all(promises);

        if (holidaysWithData.length > 0) {
            return res.status(200).send({
                code: 200,
                message: "Fetch All Holiday Data Successfully",
                data: holidaysWithData
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

/////////////// Get ById Holiday ///////////////
exports.get_ById_holiday = async (req, res) => {
    try {
        const holidayId = req.params.id;
        const getData = await holidayDetails.findOne({ where: { id: holidayId } });

        if (!getData) {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }

        if (getData.date) {
            getData.dataValues.date = moment(getData.date).format('DD/MM/YYYY');
        }

        const entity = await db.entityMaster.findOne({
            where: { id: getData.entity_id },
            attributes: ['entity_name']
        })

        if (entity) {
            getData.dataValues.entity_name = entity.entity_name;
        }

        return res.status(200).send({
            code: 200, message: "Fetch Holiday Data Successfully",
            data: getData
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

/////////////// Delete Holiday ///////////////
exports.delete_holiday = async (req, res) => {
    try {
        const holidayId = req.params.id;
        const getData = await holidayDetails.findOne({ where: { id: holidayId } });
        if (getData) {
            const updated = await holidayDetails.update({ isDeleted: true }, { where: { id: holidayId } });
            return res.status(200).send({ code: 200, message: "Holiday Data is Deleted Successfully!", data: updated });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Upload Csv Holiday ///////////////
exports.upload_Holiday_By_file = async (req, res) => {
    try {
        const user = await holidayDetails.findAll();
        if (!user) {
            throw new BadRequestError("user not found");
        }
        if (req.file == undefined) {
            return res.status(400).send("Please Upload Valid File!");
        }
        if (req.file.mimetype == "text/csv") {
            let csvData = []
            let filePath = path.join(__dirname, '../../../../holiday_csv/' + req.file.filename);
            fs.createReadStream(filePath)
                .pipe(parse({ delimiter: ",", from_line: 2 }))
                .on("error", (error) => {
                    throw error.message;
                })
                .on("data", (row) => {
                    csvData.push(row);
                })
                .on("end", async () => {
                    for (let i = 0; i < csvData.length; i++) {
                        var holiday_name = csvData[i].holiday_name;
                        var holiday_from = csvData[i].holiday_from;
                        var holiday_to = csvData[i].holiday_to;
                        var total_leave = csvData[i].total_leave;
                        var holiday_status = csvData[i].holiday_status;

                        const holidayName = await holidayDetails.findOne({ where: { holiday_name: holiday_name } });
                        if (holidayName) {
                            return res.status(400).send({ code: 400, message: "Holiday Name Already Exists!" })
                        } else {
                            const Data = await holidayDetails.create({
                                holiday_name: holiday_name,
                                holiday_from: holiday_from,
                                holiday_to: holiday_to,
                                total_leave: total_leave,
                                holiday_status: holiday_status
                            })
                            console.log(Data, "data")
                        }
                    }
                    return res.status(200).send({ code: 200, message: "File Uploded Successfully!" });
                });
        } else if (req.file.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            if (req.file == undefined) {
                return res.status(400).send("Please upload an excel file!");
            }
            let filePath = path.join(__dirname, '../../../../holiday_csv/' + req.file.filename);

            readXlsxFile(filePath).then((rows) => {
                rows.shift();
                let excels = [];
                rows.forEach((row) => {
                    let tutorial = {
                        holiday_name: row[0],
                        holiday_from: row[1],
                        holiday_to: row[2],
                        total_leave: row[3],
                        holiday_status: row[4]
                    };
                    excels.push(tutorial);
                });
                holidayDetails.bulkCreate(excels)
                return res.status(201).send({ code: 201, message: "File Uploded Successfully!" });
            });
        } else {
            console.log("please choose valide files CSV or Excel")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

/////////////// Download Document Holiday ///////////////
exports.download_Document_Holiday = (req, res) => {
    const fileName = req.params.fileName;
    let filePath = path.join(__dirname, '../../../../holiday_csv/');
    res.download(filePath + fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
};
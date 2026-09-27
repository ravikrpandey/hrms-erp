const db = require("../../../../models/index");
const holidayDetails = db.holidayDetail;
const parse = require("csv-parser");
const fs = require("fs");
const path = require("path");
const readXlsxFile = require("read-excel-file/node");
const moment = require("moment");
const { Op, where } = require("sequelize");

class HolidayController {
  /////////////// Create Holiday ///////////////

  async create_holiday(req, res) {
    try {
      const { holiday_name, financial_year_id, entity_id, date, catIds } =
        req.body;
      const response = await db.holidayDetail.create({
        holiday_name,
        financial_year_id,
        entity_id,
        date,
      });
      if (Array.isArray(catIds) && catIds.length > 0) {
        const holidayId = response.id;
        const catIdsArray = catIds.map((catId) => {
          return {
            holiday_id: holidayId,
            category_id: catId,
          };
        });
        await db.holidayWithCategory.bulkCreate(catIdsArray);
      }
      return res.status(200).send({
        code: 200,
        message: "Holiday Created Successfully!",
        data: response,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ code: 500, message: "Server Error" });
    }
  }

  /////////////// Edit Holiday ///////////////

  async edit_holiday(req, res) {
    try {
      const { id } = req.params;
      const { holiday_name, financial_year_id, entity_id, date, catIds } =
        req.body;

      // 1. Update the main holiday record
      const [updated] = await db.holidayDetail.update(
        { holiday_name, financial_year_id, entity_id, date },
        { where: { id } }
      );

      if (!updated) {
        return res
          .status(404)
          .send({ code: 404, message: "Holiday not found" });
      }

      // 2. Delete existing category links
      await db.holidayWithCategory.destroy({
        where: { holiday_id: id },
      });

      // 3. Add new category links
      if (Array.isArray(catIds) && catIds.length > 0) {
        const catIdsArray = catIds.map((catId) => ({
          holiday_id: id,
          category_id: catId,
        }));

        await db.holidayWithCategory.bulkCreate(catIdsArray);
      }

      // 4. Fetch updated holiday
      const updatedHoliday = await db.holidayDetail.findByPk(id);

      return res.status(200).send({
        code: 200,
        message: "Holiday Updated Successfully!",
        data: updatedHoliday,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ code: 500, message: "Server Error" });
    }
  }

  async updateHolidayStatus(req, res) {
    try {
      const { id, status } = req.params;

      const Data = await holidayDetails.findOne({
        where: {
          id: id,
        },
      });
      if (Data) {
        const updateData = await holidayDetails.update(
          {
            status: status,
          },
          {
            where: {
              id: id,
            },
          }
        );
        return res.status(200).send({
          code: 200,
          message: "holiday staus updated succesfully",
          data: updateData,
        });
      } else {
        return res.status(404).send({ code: 404, message: "ID not found" });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ code: 500, message: error.message || "Server Error" });
    }
  }

  /////////////// Get All Holiday ///////////////

  async get_All_holiday(req, res) {
    try {
      const { financial_id, entity_id } = req.query;
      const getAllData = await db.holidayDetail.findAll({
        where: { isDeleted: false, financial_year_id: financial_id, entity_id },
        include: [
          {
            model: db.holidayWithCategory,
            attributes: ["id"],
            include: [
              {
                model: db.holidayCategory,
                attributes: ["id", "name"],
              },
            ],
          },
        ],
        order: [["date", "DESC"]],
      });
      if (getAllData.length > 0) {
        return res.status(200).send({
          code: 200,
          message: "Fetch All Holiday Data Successfully",
          data: getAllData,
        });
      } else {
        return res.status(404).send({ code: 404, message: "Record Not Found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send({ code: 500, message: "Server Error" });
    }
  }

  /////////////// Get ById Holiday ///////////////

  async get_ById_holiday(req, res) {
    try {
      const holidayId = req.params.id;
      const getData = await holidayDetails.findOne({
        where: { id: holidayId },
        include: [
          {
            model: db.holidayWithCategory,
            attributes: ["id", "category_id"],
            include: [
              {
                model: db.holidayCategory,
                attributes: ["id", "name"],
              },
            ],
          },
        ],
      });

      return res.status(200).send({
        code: 200,
        message: "Fetch Holiday Data Successfully",
        data: getData,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ code: 500, message: "Server Error" });
    }
  }

  /////////////// Delete Holiday ///////////////

  async delete_holiday(req, res) {
    try {
      const holidayId = req.params.id;
      const getData = await holidayDetails.findOne({
        where: { id: holidayId },
      });
      if (getData) {
        const updated = await holidayDetails.update(
          { isDeleted: true },
          { where: { id: holidayId } }
        );
        return res.status(200).send({
          code: 200,
          message: "Holiday Data is Deleted Successfully!",
          data: updated,
        });
      } else {
        return res.status(404).send({ code: 404, message: "Record Not Found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ code: 500, message: "Server Error" });
    }
  }

  /////////////// Upload Csv Holiday ///////////////

  async upload_Holiday_By_file(req, res) {
    try {
      const user = await holidayDetails.findAll();
      if (!user) {
        throw new BadRequestError("user not found");
      }
      if (req.file == undefined) {
        return res.status(400).send("Please Upload Valid File!");
      }
      if (req.file.mimetype == "text/csv") {
        let csvData = [];
        let filePath = path.join(
          __dirname,
          "../../../../holiday_csv/" + req.file.filename
        );
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
              var resion = csvData[i].resion;
              var holiday_status = csvData[i].holiday_status;

              const holidayName = await holidayDetails.findOne({
                where: { holiday_name: holiday_name },
              });
              if (holidayName) {
                return res
                  .status(400)
                  .send({ code: 400, message: "Holiday Name Already Exists!" });
              } else {
                const Data = await holidayDetails.create({
                  holiday_name: holiday_name,
                  holiday_from: holiday_from,
                  holiday_to: holiday_to,
                  total_leave: total_leave,
                  resion: resion,
                  holiday_status: holiday_status,
                });
                console.log(Data, "data");
              }
            }
            return res
              .status(200)
              .send({ code: 200, message: "File Uploded Successfully!" });
          });
      } else if (
        req.file.mimetype ==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        if (req.file == undefined) {
          return res.status(400).send("Please upload an excel file!");
        }
        let filePath = path.join(
          __dirname,
          "../../../../holiday_csv/" + req.file.filename
        );

        readXlsxFile(filePath).then((rows) => {
          rows.shift();
          let excels = [];
          rows.forEach((row) => {
            let tutorial = {
              holiday_name: row[0],
              holiday_from: row[1],
              holiday_to: row[2],
              total_leave: row[3],
              resion: row[4],
              holiday_status: row[5],
            };
            excels.push(tutorial);
          });
          holidayDetails.bulkCreate(excels);
          return res
            .status(201)
            .send({ code: 201, message: "File Uploded Successfully!" });
        });
      } else {
        console.log("please choose valide files CSV or Excel");
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ code: 500, message: "Server Error" });
    }
  }

  /////////////// Download Document Holiday ///////////////

  async download_Document_Holiday(req, res) {
    const fileName = req.params.fileName;
    let filePath = path.join(__dirname, "../../../../holiday_csv/");
    res.download(filePath + fileName, (err) => {
      if (err) {
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
    });
  }

  async getAllUpcomingHolidays(req, res) {
    try {
      const { financial_id, entity_id } = req.query;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const getData = await db.holidayDetail.findAll({
        where: {
          isDeleted: false,
          financial_year_id: financial_id,
          entity_id,
          date: {
            [Op.gte]: today,
          },
        },
        include: [
          {
            model: db.holidayWithCategory,
            where: { category_id: req.user.holiday_category_id },
            required: true,
          },
        ],
      });

      if (getData.length === 0) {
        return res
          .status(404)
          .send({ code: 404, message: "No upcoming holidays found" });
      }
      const formattedData = getData.map((holiday) => {
        const formattedDate = moment.utc(holiday.date).format("DD MMM, dddd");
        return {
          ...holiday.toJSON(),
          formattedDate: formattedDate,
        };
      });
      return res.status(200).send({
        code: 200,
        message: "Upcoming Holidays fetched successfully",
        data: formattedData,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ code: 500, message: "Server Error" });
    }
  }

  async getHolidayFromDate(req, res) {
    try {
      const { financial_id, entity_id, fromDate, user_id } = req.query;
      const today = new Date(fromDate);
      today.setHours(0, 0, 0, 0);
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 30);

      const getData = await db.holidayDetail.findAll({
        where: {
          isDeleted: false,
          financial_year_id: financial_id,
          entity_id,
          date: {
            [Op.gte]: today,
            [Op.lte]: endDate
          },
        },
        attributes: ['holiday_name', 'id', 'date']
      });

      if (getData.length === 0) {
        return res
          .status(404)
          .send({ code: 404, message: "No upcoming holidays found" });
      }
      const formattedData = getData.map((holiday) => {
        const formattedDate = moment.utc(holiday.date).format("DD MMM, dddd");
        return {
          ...holiday.toJSON(),
          formattedDate: formattedDate,
        };
      });
      return res.status(200).send({
        code: 200,
        message: "Upcoming Holidays fetched successfully",
        data: formattedData,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ code: 500, message: "Server Error" });
    }
  }

  //   Holiday Category
  // Create a holiday category
  async createHolidayCategory(req, res) {
    try {
      const data = await db.holidayCategory.create(req.body);
      return res.status(201).send({
        code: 201,
        message: "Holiday Category created successfully",
        data,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ code: 500, message: "Server Error" });
    }
  }

  // Get all holiday categories
  async getAllHolidayCategory(req, res) {
    try {
      const data = await db.holidayCategory.findAll({
        order: [["id", "DESC"]],
      });
      return res.status(200).send({
        code: 200,
        message: "Holiday Categories fetched successfully",
        data,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ code: 500, message: "Server Error" });
    }
  }

  // Get a holiday category by ID
  async getHolidayCategoryById(req, res) {
    try {
      const { id } = req.params;
      const data = await db.holidayCategory.findByPk(id);

      if (!data) {
        return res.status(404).send({ code: 404, message: "Not Found" });
      }

      return res.status(200).send({
        code: 200,
        message: "Holiday Category fetched successfully",
        data,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ code: 500, message: "Server Error" });
    }
  }

  // Update a holiday category by ID
  async updateHolidayCategory(req, res) {
    try {
      const { id } = req.params;
      const [updated] = await db.holidayCategory.update(req.body, {
        where: { id },
      });

      if (!updated) {
        return res.status(404).send({ code: 404, message: "Not Found" });
      }

      const updatedData = await db.holidayCategory.findByPk(id);

      return res.status(200).send({
        code: 200,
        message: "Holiday Category updated successfully",
        data: updatedData,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ code: 500, message: "Server Error" });
    }
  }

  // Delete a holiday category by ID
  async deleteHolidayCategory(req, res) {
    try {
      const { id } = req.params;
      const deleted = await db.holidayCategory.destroy({
        where: { id },
      });

      if (!deleted) {
        return res.status(404).send({ code: 404, message: "Not Found" });
      }

      return res.status(200).send({
        code: 200,
        message: "Holiday Category deleted successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ code: 500, message: "Server Error" });
    }
  }
}

module.exports = new HolidayController();

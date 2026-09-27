
const db = require("../../../models/index");
let fs = require("fs");
const XLSX = require("xlsx");
const ExcelJS = require('exceljs');
const { reset } = require("nodemon");
const logger = require('../../../../logger/index');

exports.create_forcast_revenue = async (req, res) => {
    try {
        const { financial_year_id, forcast_month, entity_id, seal_type, filter_fy} = req.body;
        const parsedSealType = JSON.parse(JSON.stringify(seal_type));

        let isExist = await db.forcast_revenue.findOne({
            where: {
                forcast_month: forcast_month,
                entity_id: entity_id,
                filter_fy:filter_fy,
                financial_year_id: financial_year_id,
                isDeleted: false
            }
        });

        if (isExist) {
            return res.status(404).send({ code: 404, message: "Forecast Revenue Month Already Exists" });
        }

        let saveForcastData = await db.forcast_revenue.create({
            financial_year_id: financial_year_id,
            entity_id: entity_id,
            filter_fy:filter_fy,
            forcast_month: forcast_month
        });

        if (saveForcastData) {
            parsedSealType.forEach(seal => seal.forcast_revenue_id = saveForcastData.id);
            await db.forcast_revenue_sealList.bulkCreate(parsedSealType);
        }


        return res.status(200).send({ code: 200, message: "Forecast Revenue Month Created Successfully", data: saveForcastData });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};



exports.getAll_active_forcast_revenue = async (req, res) => {
    try {
        let { entity_id, fid, filter_fy } = req.query;
        entity_id = entity_id ? parseInt(entity_id) : null;
        fid = fid ? parseInt(fid) : null;
        filter_fy=filter_fy? parseInt(filter_fy) : null;

        const sqlQuery = `
            SELECT 
                BIFR.id as forcast_revenue_id,
                BIFR.forcast_month,
                BIFR.entity_id, 
                BIFR.financial_year_id,
                BIFRS.seal_volume,
                BIFRS.seal_amount,
                BIFRS.sealType_id
            FROM 
                BUSINESS_INTELLIGENCE_FORCAST_REVENUE BIFR
            INNER JOIN 
                BUSINESS_INTELLIGENCE_FORCAST_REVENUE_SEAL BIFRS 
            ON 
                BIFRS.forcast_revenue_id = BIFR.id
            INNER JOIN 
                ENTITY_MASTER EM 
            ON 
                EM.id = BIFR.entity_id
            INNER JOIN 
                MASTER_FINANCIAL_YEAR MFY 
            ON 
                MFY.id = BIFR.financial_year_id
            INNER JOIN 
                MASTER_SEAL MS 
            ON 
                MS.id = BIFRS.sealType_id
            WHERE 
                BIFR.isDeleted = false 
                AND BIFR.status = 'ACTIVE'
                ${entity_id ? `AND BIFR.entity_id = :entity_id` : ''}
                ${fid ? `AND BIFR.financial_year_id = :fid` : ''}
                ${filter_fy ? `AND BIFR.filter_fy = :filter_fy` : ''}
            ORDER BY 
                BIFR.forcast_month ASC;
        `;

        const replacements = {};
        if (entity_id) replacements.entity_id = entity_id;
        if (fid) replacements.fid = fid;
        if (filter_fy) replacements.filter_fy = filter_fy;

        const data = await db.sequelize.query(sqlQuery, {
            replacements,
            type: db.sequelize.QueryTypes.SELECT
        });

        if (data.length > 0) {
            const result = data.reduce((acc, curr) => {
                let forecast = acc.find(f => f.forcast_month === curr.forcast_month && f.entity_id === curr.entity_id && f.financial_year_id === curr.financial_year_id);
                if (!forecast) {
                    forecast = {
                        id: curr.forcast_revenue_id,
                        forcast_month: curr.forcast_month,
                        entity_id: curr.entity_id,
                        financial_year_id: curr.financial_year_id,
                        total_Amount: 0,
                        seal_type: []
                    };
                    acc.push(forecast);
                }

                forecast.total_Amount += parseFloat(curr.seal_amount);
                forecast.seal_type.push({
                    seal_volume: parseFloat(curr.seal_volume),
                    seal_amount: parseFloat(curr.seal_amount),
                    sealType_id: curr.sealType_id
                });
                return acc;
            }, []);

            return res.status(200).send({ code: 200, message: "Fetched Successfully", data: result });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.getbyId_forcast_revenue = async (req, res) => {
    try {
        let id = req.params.id;

        const sqlQuery = `
            SELECT 
                BIFR.id as forcast_revenue_id,
                BIFR.forcast_month,
                BIFR.entity_id, 
                BIFR.financial_year_id,
                BIFRS.seal_volume,
                BIFRS.seal_amount,
                BIFRS.sealType_id,
                MS.seal_type,
                EM.entity_name
            FROM 
                BUSINESS_INTELLIGENCE_FORCAST_REVENUE BIFR
            INNER JOIN 
                BUSINESS_INTELLIGENCE_FORCAST_REVENUE_SEAL BIFRS 
            ON 
                BIFRS.forcast_revenue_id = BIFR.id
            INNER JOIN 
                ENTITY_MASTER EM 
            ON 
                EM.id = BIFR.entity_id
            INNER JOIN 
                MASTER_FINANCIAL_YEAR MFY 
            ON 
                MFY.id = BIFR.financial_year_id
            INNER JOIN 
                MASTER_SEAL MS 
            ON 
                MS.id = BIFRS.sealType_id
            WHERE 
                BIFR.isDeleted = false 
                AND BIFR.status = 'ACTIVE'
                AND BIFR.id = :id
            ORDER BY 
                BIFR.forcast_month ASC;
        `;

        const [data] = await db.sequelize.query(sqlQuery, {
            replacements: { id: id }
        });

        if (data.length > 0) {
            const result = data.reduce((acc, curr) => {
                let forecast = acc.find(f => f.forcast_month === curr.forcast_month && f.entity_id === curr.entity_id && f.financial_year_id === curr.financial_year_id);
                if (!forecast) {
                    forecast = {
                        forcast_month: curr.forcast_month,
                        entity_id: curr.entity_id,
                        financial_year_id: curr.financial_year_id,
                        total_Amount: 0,
                        seal_type: []
                    };
                    acc.push(forecast);
                }
                forecast.total_Amount += parseFloat(curr.seal_amount);
                forecast.seal_type.push({
                    seal_volume: parseFloat(curr.seal_volume),
                    seal_amount: parseFloat(curr.seal_amount),
                    sealType_id: curr.sealType_id,
                    seal_type: curr.seal_type
                });
                return acc;
            }, []);

            return res.status(200).send({ code: 200, message: "Fetched Successfully", data: result });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.update_forcast_revenue = async (req, res) => {
    try {
        const { id } = req.params;
        const { financial_year_id, forcast_month, entity_id, seal_type, filter_fy } = req.body;
        const parsedSealType = JSON.parse(JSON.stringify(seal_type));

        let existingForcastData = await db.forcast_revenue.findOne({
            where: {
                id: id,
                isDeleted: false
            }
        });

        if (!existingForcastData) {
            return res.status(404).send({ code: 404, message: "Forecast Revenue Not Found" });
        }

        let isExist = await db.forcast_revenue.findOne({
            where: {
                forcast_month: forcast_month,
                entity_id: entity_id,
                filter_fy:filter_fy,
                financial_year_id: financial_year_id,
                isDeleted: false,
                id: { [db.Sequelize.Op.ne]: id }
            }
        });

        if (isExist) {
            return res.status(404).send({ code: 404, message: "Forecast Revenue Month Already Exists" });
        }


        await db.forcast_revenue.update({
            financial_year_id: financial_year_id,
            forcast_month: forcast_month
        }, {
            where: { id: id }
        });

        await db.forcast_revenue_sealList.destroy({
            where: { forcast_revenue_id: id }
        });

        parsedSealType.forEach(seal => seal.forcast_revenue_id = id);
        await db.forcast_revenue_sealList.bulkCreate(parsedSealType);

        return res.status(200).send({ code: 200, message: "Forecast Revenue Month Updated Successfully" });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.delete_forcast_revenue = async (req, res) => {
    try {
        const { id } = req.params;

        let forecastRevenue = await db.forcast_revenue.findOne({
            where: {
                id: id,
                isDeleted: false
            }
        });

        if (!forecastRevenue) {
            return res.status(404).send({ code: 404, message: "Forecast Revenue not found or already deleted" });
        }

        await db.forcast_revenue.update(
            { isDeleted: true },
            { where: { id: id } }
        );

        await db.forcast_revenue_sealList.update(
            { isDeleted: true },
            { where: { forcast_revenue_id: id } }
        );

        return res.status(200).send({ code: 200, message: "Forecast Revenue and associated seals deleted successfully" });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};




exports.download_forcast_revenue_format = async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const forecastWorksheet = workbook.addWorksheet("forecast_revenue");
        const dropdownWorksheet = workbook.addWorksheet("data");

        forecastWorksheet.columns = [
            { header: "Month_Name", key: "month_name", width: 15 },
            { header: "Seal_Type", key: "seal_type", width: 20 },
            { header: "Volume", key: "volume", width: 20 },
            { header: "Amount", key: "amount", width: 15 }
        ];

        forecastWorksheet.views = [{ state: 'frozen', ySplit: 1 }];

        let sealData = await db.sealType.findAll({ where: { isDeleted: false, status: "ACTIVE" } });
        const sealList = sealData.map(seal => seal.seal_type);
        const sealTypeData = sealList;
        const months = ["Select Mon", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        dropdownWorksheet.addRow(['Month_Name', 'Seal_Type']);
        for (let i = 0; i < Math.max(months.length, sealTypeData.length); i++) {
            dropdownWorksheet.addRow([
                months[i] || '',
                sealTypeData[i] || ''
            ]);
        }

        for (let i = 2; i <= 100; i++) {
            forecastWorksheet.addRow({
                month_name: "",
                seal_type: "",
                volume: "",
                amount: ""
            });
        }

        forecastWorksheet.getColumn('month_name').eachCell({ includeEmpty: true }, (cell, rowNumber) => {
            if (rowNumber > 1) {
                cell.dataValidation = {
                    type: 'list',
                    allowBlank: true,
                    formula1: `=data!$A$2:$A$${months.length + 1}`,
                    showErrorMessage: true,
                    errorTitle: 'Invalid selection',
                    error: 'Please select a valid month from the dropdown.'
                };
            }
        });

        forecastWorksheet.getColumn('seal_type').eachCell({ includeEmpty: true }, (cell, rowNumber) => {
            if (rowNumber > 1) {
                cell.dataValidation = {
                    type: 'list',
                    allowBlank: true,
                    formula1: `=data!$B$2:$B$${sealTypeData.length + 1}`,
                    showErrorMessage: true,
                    errorTitle: 'Invalid selection',
                    error: 'Please select a valid seal type from the dropdown.'
                };
            }
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=forecastRevenueFormat.xlsx"
        );

        await workbook.xlsx.write(res);
        res.status(200).end();
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};



exports.bulkCreate_forcast_revenue = async (req, res) => {
    try {
        let { entity_id, fid, filter_fy } = req.body;
        let financial_year_id = parseInt(fid);
        entity_id = parseInt(entity_id);
        filter_fy = parseInt(filter_fy);
        const file = req.files[0];
        if(!file){
            return res.status(400).send({code:400, message: "File not selected!"})
        }
        const xlFile = XLSX.readFile(file.path);
        const sheet = xlFile.Sheets[xlFile.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const expectedHeaders = ['Month_Name', 'Seal_Type', 'Volume', 'Amount'];

        const headers = jsonData[0].map(header => header.trim().toLowerCase());

        for (let i = 0; i < expectedHeaders.length; i++) {
            if (!headers.includes(expectedHeaders[i].toLowerCase())) {
                return res.status(400).send({ 
                    message: `Invalid header: Expected "${expectedHeaders[i]}", but not found in Excel sheet.`
                });
            }
        }

        jsonData.shift();

        const jsonDataObj = jsonData.map(row => {
            let obj = {};
            for (let i = 0; i < expectedHeaders.length; i++) {
                obj[expectedHeaders[i]] = row[i];
            }
            return obj;
        });

        function isObjectEmpty(obj) {
            return Object.values(obj).every(value => value === "");
        }

        const filteredData = jsonDataObj.filter(item => !isObjectEmpty(item));

        const groupedData = {};
        let skipSeal = 0;
        let createdSeal = 0;

        for (const item of filteredData) {
            const { Month_Name: forcast_month, Seal_Type: seal_type, Volume: seal_volume, Amount: seal_amount } = item;

            if (!seal_volume && !seal_amount) {
                skipSeal += 1;
                continue;
            }

            let isExist = await db.forcast_revenue.findOne({
                where: {
                    forcast_month: forcast_month,
                    entity_id: entity_id,
                    filter_fy:filter_fy,
                    financial_year_id: financial_year_id,
                    isDeleted: false
                }
            });

            if (isExist) {
                const existingSeals = await db.forcast_revenue_sealList.findAll({
                    where: {
                        forcast_revenue_id: isExist.id,
                        sealType_id: await getSealTypeId(seal_type) 
                    }
                });

                if (existingSeals.length > 0) {
                    skipSeal += 1;
                    continue;
                }
            }

            if (!groupedData[forcast_month]) {
                groupedData[forcast_month] = {
                    forcast_month,
                    financial_year_id: financial_year_id,
                    entity_id: entity_id,
                    filter_fy:filter_fy,
                    Seal_Type: []
                };
            }

            const isDuplicate = groupedData[forcast_month].Seal_Type.some(seal => seal.seal_type === seal_type);
            if (!isDuplicate) {
                groupedData[forcast_month].Seal_Type.push({ seal_type, seal_volume, seal_amount });
            }
        }

        const result = Object.values(groupedData);

        const saveData = [];

        for (const item of result) {
            let isExist = await db.forcast_revenue.findOne({
                where: {
                    forcast_month: item.forcast_month,
                    entity_id: entity_id,
                    filter_fy:filter_fy,
                    financial_year_id: financial_year_id,
                    isDeleted: false
                }
            });

            if (!isExist) {
                let saveForcastData = await db.forcast_revenue.create({
                    financial_year_id: item.financial_year_id,
                    entity_id: item.entity_id,
                    filter_fy:filter_fy,
                    forcast_month: item.forcast_month
                });

                if (saveForcastData) {
                    for (const seal of item.Seal_Type) {
                        let existSeal = await db.sealType.findOne({
                            where: {
                                seal_type: seal.seal_type,
                                isDeleted: false,
                                status: "ACTIVE"
                            }
                        });

                        if (existSeal) {
                            await db.forcast_revenue_sealList.create({
                                forcast_revenue_id: saveForcastData.id,
                                sealType_id: existSeal.id,
                                seal_volume: seal.seal_volume,
                                seal_amount: seal.seal_amount
                            });
                            createdSeal += 1;
                        } else {
                            skipSeal += 1;
                        }
                    }

                    saveData.push(saveForcastData);
                }
            } else {
                const existingSeals = await db.forcast_revenue_sealList.findAll({
                    where: {
                        forcast_revenue_id: isExist.id
                    }
                });

                const existingSealTypes = existingSeals.map(seal => seal.sealType_id);

                for (const seal of item.Seal_Type) {
                    let existSeal = await db.sealType.findOne({
                        where: {
                            seal_type: seal.seal_type,
                            isDeleted: false,
                            status: "ACTIVE"
                        }
                    });

                    if (existSeal && !existingSealTypes.includes(existSeal.id)) {
                        await db.forcast_revenue_sealList.create({
                            forcast_revenue_id: isExist.id,
                            sealType_id: existSeal.id,
                            seal_volume: seal.seal_volume,
                            seal_amount: seal.seal_amount
                        });
                        createdSeal += 1;
                    } else {
                        skipSeal += 1;
                    }
                }
            }
        }

        fs.unlinkSync(file.path); 

        return res.status(201).send({ 
            code: 201, 
            message: `Forecast Revenue ${createdSeal} seals created, ${skipSeal} seals skipped because they already exist or have empty Volume and Amount.`,
            data: saveData 
        });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error.message);
        return res.status(500).send({ message: error.message });
    }
};

async function getSealTypeId(seal_type) {
    const seal = await db.sealType.findOne({
        where: {
            seal_type: seal_type,
            isDeleted: false,
            status: "ACTIVE"
        }
    });
    return seal ? seal.id : null;
}













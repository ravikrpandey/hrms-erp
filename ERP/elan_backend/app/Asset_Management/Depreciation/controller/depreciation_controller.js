
const db = require("../../../models/index");
let fs = require("fs");
const XLSX = require("xlsx");
const ExcelJS = require('exceljs');
const { resStatus } = require("../../../master/reason/controller/reasonController");
const logger = require('../../../../logger/index');



exports.create_asset_depreciation = async (req, res) => {
    try {
        const { financial_year_id, depreciation_amount,  depreciation_month, depreciation_type, entity_id, filter_fy } = req.body;

        let isExist = await db.asset_depreciation.findOne({
            where: {
                depreciation_month: depreciation_month,
                depreciation_type: depreciation_type,
                entity_id: entity_id,
                filter_fy:filter_fy,
                financial_year_id: financial_year_id,
                isDeleted: false
            }
        });

        if (isExist) {
            return res.status(404).send({ code: 404, message: "Asset Management Already Exists" });
        }

        let saveForcastData = await db.asset_depreciation.create({
            financial_year_id: financial_year_id,
            entity_id: entity_id,
            filter_fy:filter_fy,
            depreciation_month: depreciation_month,
            depreciation_amount: depreciation_amount,
            depreciation_type: depreciation_type,
        });

        return res.status(200).send({ code: 200, message: "Asset Depreciation Created Successfully", data: saveForcastData });

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.getAll_asset_depreciation = async (req, res) => {
    try {
        let { entity_id , filter_fy} = req.query;
        entity_id = entity_id ? parseInt(entity_id) : null;
        filter_fy = filter_fy ? parseInt(filter_fy) : null;

        const sqlQuery = `
            SELECT 
                ASD.id as depreciation_id,
                ASD.depreciation_amount,
                ASD.status, 
                ASD.financial_year_id,
                MFY.financial_year,
                ASD.filter_fy,
                ASD.depreciation_month,
                ASD.depreciation_type,
                ASD.entity_id
            FROM 
                ASSET_MANAGEMENT_DEPRECIATION ASD
            INNER JOIN 
                ENTITY_MASTER EM 
            ON 
                EM.id = ASD.entity_id
            INNER JOIN 
                MASTER_FINANCIAL_YEAR MFY 
            ON 
                MFY.id = ASD.financial_year_id
            WHERE 
                ASD.isDeleted = false 
                AND ASD.status = 'ACTIVE'
                ${entity_id !== null ? 'AND ASD.entity_id = :entity_id' : ''}
                ${filter_fy !== null ? 'AND ASD.filter_fy = :filter_fy' : ''}
            ORDER BY 
               MFY.financial_year ASC;
        `;

        const replacements = {};
        if (entity_id) replacements.entity_id = entity_id;
        if (filter_fy) replacements.filter_fy = filter_fy;
        
        const data = await db.sequelize.query(sqlQuery, {
            replacements,
            type: db.sequelize.QueryTypes.SELECT
        });

        if (data.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetched Successfully", data: data });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found", data: data });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.getById_asset_depreciation = async (req, res) => {
    try {
        const { id } = req.params;
        let { entity_id } = req.query;
        entity_id = entity_id ? parseInt(entity_id) : null;

        const sqlQuery = `
            SELECT 
                ASD.id as depreciation_id,
                ASD.depreciation_amount,
                ASD.status, 
                ASD.financial_year_id,
                MFY.financial_year,
                ASD.depreciation_month,
                ASD.depreciation_type,
                ASD.entity_id
            FROM 
                ASSET_MANAGEMENT_DEPRECIATION ASD
            INNER JOIN 
                ENTITY_MASTER EM 
            ON 
                EM.id = ASD.entity_id
            INNER JOIN 
                MASTER_FINANCIAL_YEAR MFY 
            ON 
                MFY.id = ASD.financial_year_id
            WHERE 
                ASD.isDeleted = false 
                AND ASD.status = 'ACTIVE'
                AND ASD.id = :id
                ${entity_id !== null ? 'AND ASD.entity_id = :entity_id' : ''}
            ORDER BY 
                ASD.createdAt ASC;
        `;

        const replacements = { id, entity_id };

        const [data] = await db.sequelize.query(sqlQuery, {
            replacements,
            type: db.sequelize.QueryTypes.SELECT
        });

        if (data) {
            return res.status(200).send({ code: 200, message: "Fetched Successfully", data: data });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found", data: {} });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.update_asset_depreciation = async (req, res) => {
    try {
        const { id } = req.params;
        const { financial_year_id, depreciation_amount, depreciation_month, depreciation_type, entity_id, filter_fy } = req.body;

        let assetDepreciation = await db.asset_depreciation.findOne({
            where: {
                id: id,
                entity_id: entity_id,
                isDeleted: false
            }
        });

        if (!assetDepreciation) {
            return res.status(404).send({ code: 404, message: "Asset Depreciation Not Found" });
        }

        let isExist = await db.asset_depreciation.findOne({
            where: {
                depreciation_amount: depreciation_amount,
                depreciation_month: depreciation_month,
                depreciation_type: depreciation_type,
                entity_id: entity_id,
                filter_fy:filter_fy,
                financial_year_id: financial_year_id,
                isDeleted: false,
                id: { [db.Sequelize.Op.ne]: id }
            }
        });

        if (isExist) {
            return res.status(409).send({ code: 409, message: "Asset Depreciation Already Exists" });
        }

        let updateData = await db.asset_depreciation.update({
            financial_year_id: financial_year_id,
            depreciation_amount: depreciation_amount,
            depreciation_month: depreciation_month,
            depreciation_type: depreciation_type,
        }, { where: { id: id } });

        return res.status(200).send({ code: 200, message: "Asset Depreciation Updated Successfully", data: updateData });

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.delete_asset_depreciation = async (req, res) => {
    try {
        const { id } = req.params;

        let assetDepreciation = await db.asset_depreciation.findOne({
            where: {
                id: id,
                isDeleted: false
            }
        });

        if (!assetDepreciation) {
            return res.status(404).send({ code: 404, message: "Asset Depreciation not found or already deleted" });
        }

        await db.asset_depreciation.update(
            { isDeleted: true },
            { where: { id: id } }
        );

        return res.status(200).send({ code: 200, message: "Asset Depreciation deleted successfully" });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};




exports.download_asset_depreciation_format = async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const depreciationWorksheet = workbook.addWorksheet("Asset_Depreciation");
        const dropdownWorksheet = workbook.addWorksheet("data");

        depreciationWorksheet.columns = [
            { header: "Financial_Year", key: "financial_year", width: 20 },
            { header: "Month_Name", key: "month_name", width: 15 },
            { header: "Depreciation_Type", key: "depreciation_type", width: 20 },
            { header: "Amount", key: "amount", width: 15 }
        ];

        depreciationWorksheet.views = [{ state: 'frozen', ySplit: 1 }];

        // Fetch financial years from the database
        let fydata = await db.financial_year.findAll({ where: { isDeleted: false, status: "ACTIVE" } });
        const financialYears = fydata.map(fy => fy.financial_year);

        const months = ["Select Mon", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const depreciationTypes = ["Select Type", "Forecast", "Actual"];

        console.log('Financial Years:', financialYears);
        console.log('Months:', months);
        console.log('Depreciation Types:', depreciationTypes);

        dropdownWorksheet.addRow(['Financial_Years', 'Months', 'Depreciation_Types']);
        for (let i = 0; i < Math.max(financialYears.length, months.length, depreciationTypes.length); i++) {
            dropdownWorksheet.addRow([
                financialYears[i] || '',
                months[i] || '',
                depreciationTypes[i] || ''
            ]);
        }

        for (let i = 2; i <= 100; i++) {
            depreciationWorksheet.addRow({
                financial_year: "",
                month_name: "",
                depreciation_type: "",
                amount: ""
            });
        }

        depreciationWorksheet.getColumn('financial_year').eachCell({ includeEmpty: true }, (cell, rowNumber) => {
            if (rowNumber > 1) {
                cell.dataValidation = {
                    type: 'list',
                    allowBlank: true,
                    formula1: `=data!$A$2:$A$${financialYears.length + 1}`,
                    showErrorMessage: true,
                    errorTitle: 'Invalid selection',
                    error: 'Please select a valid financial year from the dropdown.'
                };
            }
        });

        depreciationWorksheet.getColumn('month_name').eachCell({ includeEmpty: true }, (cell, rowNumber) => {
            if (rowNumber > 1) {
                cell.dataValidation = {
                    type: 'list',
                    allowBlank: true,
                    formula1: `=data!$B$2:$B$${months.length + 1}`,
                    showErrorMessage: true,
                    errorTitle: 'Invalid selection',
                    error: 'Please select a valid month from the dropdown.'
                };
            }
        });

        depreciationWorksheet.getColumn('depreciation_type').eachCell({ includeEmpty: true }, (cell, rowNumber) => {
            if (rowNumber > 1) {
                cell.dataValidation = {
                    type: 'list',
                    allowBlank: true,
                    formula1: `=data!$C$2:$C$${depreciationTypes.length + 1}`,
                    showErrorMessage: true,
                    errorTitle: 'Invalid selection',
                    error: 'Please select a valid depreciation type from the dropdown.'
                };
            }
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=assetDepreciationFormat.xlsx"
        );

        await workbook.xlsx.write(res);
        res.status(200).end();
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};



exports.bulkCreate_asset_depreciation = async (req, res) => {
    try {
        const { entity_id ,filter_fy } = req.body;
        const file = req.files[0];
        if (!file) {
            return res.status(400).send({ code: 400, message: "File not selected!" });
        }
        const xlFile = XLSX.readFile(file.path);
        const sheet = xlFile.Sheets[xlFile.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const expectedHeaders = ['Financial_Year', 'Month_Name', 'Depreciation_Type', 'Amount'];

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

        const fieldMappings = {
            "Financial_Year": "financial_year",
            "Month_Name": "depreciation_month",
            "Depreciation_Type": "depreciation_type",
            "Amount": "depreciation_amount",
        };

        const data = jsonDataObj.map((item, index) => {
            const mappedItem = {};
            Object.entries(item).forEach(([key, value]) => {
                const mapping = fieldMappings[key];
                if (mapping) {
                    mappedItem[mapping] = typeof value === 'string' ? value.trim() : value;
                } else {
                    console.warn(`Ignoring column ${key} at row ${index + 1}`);
                }
            });
            return mappedItem;
        }).filter(item => item.depreciation_month && item.depreciation_type && item.depreciation_amount);

        for (const item of data) {
            const financialYear = await db.financial_year.findOne({ where: { financial_year: item.financial_year, isDeleted: false, status: "ACTIVE" } });
            if (financialYear) {
                item.financial_year_id = financialYear.id;
            } else {
                throw new Error(`Financial Year not found for ${item.financial_year}`);
            }
        }

        data.forEach(item => {
            item.entity_id = entity_id;
            item.filter_fy = filter_fy;
            for (const key in item) {
                if (typeof item[key] === 'string') {
                    item[key] = item[key].trim();
                }
            }
        });

        for (const [index, item] of data.entries()) {
            if (isNaN(parseFloat(item.depreciation_amount))) {
                throw new Error(`Invalid depreciation amount at row ${index + 1}, column Amount`);
            }
        }

        const currentYear = new Date().getFullYear();
        const saveData = [];
        let skipCount = 0;

        for (const item of data) {
            if (item.financial_year == currentYear && item.depreciation_type === "Forecast") {
                skipCount++;
                continue;
            }

            const existingRecord = await db.asset_depreciation.findOne({
                where: {
                    financial_year_id: item.financial_year_id,
                    entity_id: item.entity_id,
                    filter_fy: item.filter_fy,
                    depreciation_month: item.depreciation_month,
                    depreciation_type: item.depreciation_type,
                    isDeleted: false,
                    status: "ACTIVE"
                }
            });

            if (existingRecord) {
                skipCount++;
            } else {
                const saveResponse = await db.asset_depreciation.create(item);
                saveData.push(saveResponse);
            }
        }

        fs.unlinkSync(file.path);

        return res.status(201).send({
            code: 201,
            message: `Depreciation Data ${saveData.length} created, ${skipCount} skipped because they already exist or have empty Amount.`,
            data: saveData
        });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error.message);
        return res.status(500).send({ message: error.message });
    }
};


exports.getCalculationMethods = async(req,res) =>{
    try{
        const data = await db.calculationMethod.findAll({});

        return res.status(201).send({
            code: 201,
            message: "Data fetched successfully",
            data: data
        });
     } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}


exports.createDepreciationCalculations = async (req, res) => {
    try {
        const { entity_id,calculation_id, asset_id, salvage_value, frequency, use_full_life } = req.body;

        if (!calculation_id || !asset_id || !frequency || !use_full_life) {
            return res.status(400).send({ message: "All fields are required." });
        }

        const data = await db.depreciationCalculation.create({
            asset_id,
            entity_id,
            calculation_id,
            salvage_value,
            frequency,
            use_full_life
        });

        return res.status(201).send({ message: "Depreciation calculation created successfully.", data });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};


exports.getCreateDepreciationCalculationsById = async (req, res) => {
    try {
        const { asset_id} = req.params;

     const data = await db.depreciationCalculation.findAll({
           where:{
            asset_id:asset_id
           }
        });

        return res.status(201).send({ message: "Depreciation calculation details fetched successfully.", data });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};


exports.getAllCreateDepreciationCalculations = async (req, res) => {
    try {
      

     const data = await db.depreciationCalculation.findAll({
        
        });

        return res.status(201).send({ message: "Depreciation calculation details fetched successfully.", data });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};


exports.updateDepreciationCalculations = async (req, res) => {
    try {
        const { id } = req.params;
        const { calculation_id, asset_id, salvage_value, frequency, use_full_life } = req.body;

        if (!calculation_id || !asset_id || !frequency || !use_full_life) {
            return res.status(400).send({ message: "All fields are required." });
        }

      
        const existingCalculation = await db.depreciationCalculation.findByPk(id);
        if (!existingCalculation) {
            return res.status(404).send({ message: "Depreciation calculation not found." });
        }
        const updatedCalculation = await existingCalculation.update({
            asset_id,
            calculation_id,
            salvage_value,
            frequency,
            use_full_life
        });

        return res.status(200).send({ message: "Depreciation calculation updated successfully.", data: updatedCalculation });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

exports.deleteDepreciationCalculation = async (req, res) => {
    try {
        const { id } = req.params; 

        const existingCalculation = await db.depreciationCalculation.findByPk(id);
        if (!existingCalculation) {
            return res.status(404).send({ message: "Depreciation calculation not found." });
        }

        await db.depreciationCalculation.update(
            { isDeleted: true }, 
            { where: { id } }   
        );

        return res.status(200).send({ message: "Depreciation calculation soft deleted successfully." });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};









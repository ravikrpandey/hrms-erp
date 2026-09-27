const axios = require("axios");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const { signupFromExcelData } = require("../../app/HRMS/Employee_Master/controllers/auth.controller");
const db = require("../../app/models/index");

class DataUploaderController {
    constructor() { }

    async uploadEmployeeFromExcel(req, res) {
        try {
            // Check if file was uploaded
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    message: "No file uploaded. Please upload an Excel file."
                });
            }

            // Get the uploaded file (assuming first file is the Excel file)
            const uploadedFile = req.files[0];

            // Validate file extension
            const fileExtension = path.extname(uploadedFile.originalname).toLowerCase();
            if (!['.xlsx', '.xls', '.xlsm'].includes(fileExtension)) {
                return res.status(400).json({
                    message: "Invalid file type. Please upload an Excel file (.xlsx, .xls, or .xlsm)"
                });
            }

            // Read the Excel file with cellDates option to properly handle date values
            const workbook = XLSX.readFile(uploadedFile.path, {
                cellDates: true, // Convert Excel date serial numbers to JS Date objects
                cellNF: false,
                cellText: false
            });

            // Get sheet names
            const sheetNames = workbook.SheetNames;

            if (sheetNames.length === 0) {
                return res.status(400).json({
                    message: "The Excel file contains no sheets."
                });
            }

            // Get the requested sheet name from query params or use the first sheet
            const requestedSheetName = req.query.sheetName || req.body.sheetName;
            let sheetName;

            if (requestedSheetName && sheetNames.includes(requestedSheetName)) {
                sheetName = requestedSheetName;
            } else {
                sheetName = sheetNames[0]; // Default to first sheet
            }

            // Get the worksheet
            const worksheet = workbook.Sheets[sheetName];

            // Helper function to format dates
            // const formatDate = (value) => {
            //     if (value instanceof Date && !isNaN(value)) {
            //         // Format as YYYY-MM-DD
            //         const year = value.getFullYear();
            //         const month = String(value.getMonth() + 1).padStart(2, '0');
            //         const day = String(value.getDate()).padStart(2, '0');
            //         return `${year}-${month}-${day}`;
            //     }
            //     return value;
            // };
            // Convert to array of objects (with headers as keys)
            let jsonDataWithHeaders = XLSX.utils.sheet_to_json(worksheet, {
                defval: "",
                blankrows: false,
                raw: false,
                dateNF: 'yyyy-mm-dd'
            });
            // row header name is in lowercase
            jsonDataWithHeaders = jsonDataWithHeaders.map((row) => {
                const processedRow = {};
                for (let key in row) {
                    processedRow[key.toLowerCase()] = row[key];
                }
                return processedRow;
            });

            let payloadList = [];
            let errors = [];
            let createdRecords = {
                entities: [],
                branches: [],
                departments: [],
                designations: [],
                employmentTypes: [],
                roles: [],
                holidayCategories: [],
                shifts: [],
                grades: []
            };

            // Use for...of instead of forEach to properly handle async/await
            for (let index = 0; index < jsonDataWithHeaders.length; index++) {
                const row = jsonDataWithHeaders[index];
                const rowNumber = index + 2; // +2 because index starts at 0 and Excel has header row

                try {
                    if (req.query.type != "RM") {
                        // Find or create entity
                        const entityName = row.entity?.split("(")[0].trim();
                        const [entity, entityCreated] = await db.entityMaster.findOrCreate({
                            where: { entity_name: entityName },
                            defaults: {
                                entity_name: entityName,
                                // Add other required fields with default values if needed
                            }
                        });
                        if (entityCreated) {
                            createdRecords.entities.push(entityName);
                        }

                        // Find or create branch/location
                        const [location, locationCreated] = await db.tbl_branch.findOrCreate({
                            where: { branch_name: row.branch },
                            defaults: {
                                branch_name: row.branch,
                                // Add other required fields with default values if needed
                            }
                        });
                        if (locationCreated) {
                            createdRecords.branches.push(row.branch);
                        }

                        // Find or create department
                        const [department, departmentCreated] = await db.department.findOrCreate({
                            where: { department_name: row.department },
                            defaults: {
                                department_name: row.department,
                                entity_id: entity.id,
                                // Add other required fields with default values if needed
                            }
                        });
                        if (departmentCreated) {
                            createdRecords.departments.push(row.department);
                        }

                        // Find or create designation
                        const [designation, designationCreated] = await db.designation.findOrCreate({
                            where: { designation_name: row.designation },
                            defaults: {
                                designation_name: row.designation,
                                // Add other required fields with default values if needed
                            }
                        });
                        if (designationCreated) {
                            createdRecords.designations.push(row.designation);
                        }

                        // Find or create employment type
                        const [employmentType, employmentTypeCreated] = await db.employmenttype.findOrCreate({
                            where: { emptype_name: row.employee_type },
                            defaults: {
                                emptype_name: row.employee_type,
                                // Add other required fields with default values if needed
                            }
                        });
                        if (employmentTypeCreated) {
                            createdRecords.employmentTypes.push(row.employee_type);
                        }

                        // Find or create role
                        const [roleMaster, roleCreated] = await db.role_master.findOrCreate({
                            where: { role_master_name: row.assign_role },
                            defaults: {
                                role_master_name: row.assign_role,
                                // Add other required fields with default values if needed
                            }
                        });
                        if (roleCreated) {
                            createdRecords.roles.push(row.assign_role);
                        }

                        // Find or create holiday category
                        const [holidayCategory, holidayCategoryCreated] = await db.holidayCategory.findOrCreate({
                            where: { name: row.holiday_category },
                            defaults: {
                                name: row.holiday_category,
                                // Add other required fields with default values if needed
                            }
                        });
                        if (holidayCategoryCreated) {
                            createdRecords.holidayCategories.push(row.holiday_category);
                        }

                        // Find or create shift
                        const [shift, shiftCreated] = await db.shift.findOrCreate({
                            where: { shift_name: row.select_shift },
                            defaults: {
                                shift_name: row.select_shift,
                                // Add other required fields with default values if needed
                            }
                        });
                        if (shiftCreated) {
                            createdRecords.shifts.push(row.select_shift);
                        }

                        // Find or create grade
                        const [grade, gradeCreated] = await db.TravelType.findOrCreate({
                            where: { name: row.grade, type: 'grade' },
                            defaults: {
                                name: row.grade,
                                type: 'grade'
                            }
                        });
                        if (gradeCreated) {
                            createdRecords.grades.push(row.grade);
                        }

                        let payload = {
                            title: row.title,
                            employee_code: row.employee_code,
                            first_name: row.first_name,
                            middle_name: row.middle_name,
                            last_name: row.last_name,
                            contact_number: row.contact_number,
                            country_code: '+91',
                            employee_official_email: row.official_email_id,
                            gender: row.gender?.toLowerCase(),
                            date_of_birth: row.date_of_birth,
                            emp_personal_email: row.personal_email_id || null,
                            primary_entity_id: entity.id,
                            location_id: location.id,
                            department_id: department.dept_id,
                            designation_id: designation.designation_id,
                            emplyoment_type_id: employmentType.emptype_id,
                            role_master_id: roleMaster.role_master_id,
                            holiday_category_id: holidayCategory.id,
                            shift_id: shift.id,
                            grade_id: grade.id,
                            // reporting_manager_id: row.reporting_manager_id,
                            // entityList: row.entityList,
                        };

                        const { data } = await signupFromExcelData(payload);
                        payloadList.push(data);
                    } else {
                        // Update reporting manager in db.user according to find user by employee_code
                        const user = await db.user.findOne({ where: { employee_code: row.employee_code, isDeleted: false } });
                        if (user) {
                            const reportingManager = await db.user.findOne({ where: { employee_code: row.reporting_manager_emp_id, isDeleted: false }, attributes: ['employee_id'] });
                            user.reporting_manager_id = reportingManager.employee_id;
                            await user.save();
                            payloadList.push(user);
                        }
                    }
                } catch (rowError) {
                    errors.push({ row: rowNumber, message: rowError.message });
                }
            }


            // Post-process to ensure dates are properly formatted
            // jsonDataWithHeaders = jsonDataWithHeaders.map(row => {
            //     const processedRow = {};
            //     for (let key in row) {
            //         processedRow[key] = formatDate(row[key]);
            //     }
            //     return processedRow;
            // });

            // Optional: Clean up uploaded file if you don't need to keep it
            fs.unlinkSync(uploadedFile.path);

            // Count total created records
            const totalCreated = Object.values(createdRecords).reduce((sum, arr) => sum + arr.length, 0);

            // Return the extracted data
            res.status(200).json({
                message: errors.length > 0
                    ? `Excel file processed with ${errors.length} validation error(s)`
                    : totalCreated > 0
                        ? `Excel file processed successfully. ${totalCreated} new record(s) created automatically.`
                        : "Excel file processed successfully",
                sheetName: sheetName,
                availableSheets: sheetNames,
                totalRows: jsonDataWithHeaders.length,
                successfulRows: payloadList.length,
                failedRows: errors.length,
                payloadList,
                errors: errors.length > 0 ? errors : undefined,
                createdRecords: totalCreated > 0 ? createdRecords : undefined,
                data: jsonDataWithHeaders,
            });

        } catch (error) {
            console.error("Error processing Excel file:", error);
            res.status(500).json({
                message: "Error processing Excel file: " + error.message
            });
        }
    }
}

module.exports = new DataUploaderController();
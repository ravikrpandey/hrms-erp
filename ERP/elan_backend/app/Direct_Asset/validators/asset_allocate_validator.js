const { body, param } = require('express-validator');

exports.validateAssetAllocation = [
    param('assign_by')
        .notEmpty().withMessage('Assign by is required')
        .isNumeric().withMessage('Assign by must be a number'),

    param('grn_item_status_id')
        .notEmpty().withMessage('Grn item_status id is required')
        .isNumeric().withMessage('Grn item status id must be a number'),

    body('allocation_type')
        .notEmpty().withMessage('Allocation type is required'),

    body('department_id')
    .if((value, { req }) => req.body.allocation_type === 'allocated to employee')
    .notEmpty().withMessage('Department is required').bail()
    .isNumeric().withMessage('Department must be a number'),

    body('employee_id')
    .if((value, { req }) => req.body.allocation_type === 'allocated to employee')
    .notEmpty().withMessage('Employee is required').bail()
    .isNumeric().withMessage('Employee must be a number'),

    body('branch_id')
    .if((value, { req }) => req.body.allocation_type === 'transfer to other location')
    .notEmpty().withMessage('Branch is required').bail()
    .isNumeric().withMessage('Branch must be a number'),

    body('remarks').trim().notEmpty().withMessage('Remarks is required')
];

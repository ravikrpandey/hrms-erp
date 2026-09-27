exports.checkEntityAndBranch = (req, res, next) => {
    const { entityType, branchId, empId, tab_status } = req.query;

    if (!entityType || !branchId || !empId || !tab_status) {
        return res.status(400).send({ status: false, message: 'Entity, branchId and empId are required.' });
    }

    req.body.entity_type = entityType;
    req.body.branchId = branchId;
    req.body.empId = empId;
    req.body.tab_status = tab_status

    next();
};

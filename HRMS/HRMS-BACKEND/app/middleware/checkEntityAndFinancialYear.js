
exports.checkEntityAndFinancialYear = (req, res, next) => {
    const { entityType, financialYear } = req.query;

    if (!entityType || !financialYear) {
        return res.status(400).send({ status: false, message: 'Entity and Financial Year are required.' });
    }

    req.body.entity_type = entityType;
    req.body.financial_year = financialYear;

    next();
};




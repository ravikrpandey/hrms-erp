const sourcecontroller = require("../controller/sourcecontroller");

module.exports = app => {
    app.get("/api/v1/getAllSource/:entity_id/:financial_year_id",sourcecontroller.getAllSource);
}
const item_cost_category = require('../controller/itemCostCategoryController')

module.exports= app =>{
    app.post("/api/v1/item_cost_category", item_cost_category.createItemcostCategory);
    app.get("/api/v1/getAllItemcostCategory", item_cost_category.getAllItemcostCategory);
}
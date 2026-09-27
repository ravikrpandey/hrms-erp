const BasketController = require('../controller/basketController');

module.exports = app => {
    app.post("/api/v1/create_basket", BasketController.create_basket);
    app.get("/api/v1/getall_basket/:entity_id", BasketController.getAllBasket);
    app.get("/api/v1/get_basket_ById/:id", BasketController.get_basket_by_id);
    app.put("/api/v1/update_basket_ById/:id", BasketController.update_basket_by_id);
    app.delete("/api/v1/delete_basket_ById/:id",BasketController.delete_Basket_by_id);
   
}
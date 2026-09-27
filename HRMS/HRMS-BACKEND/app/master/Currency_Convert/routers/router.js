const Currency_Controller=require("../controllers/controller")

module.exports = app => {

    app.post('/api/v1/Create_Currency',Currency_Controller.create_Currency);
    app.get('/api/v1/getAll_Currency',Currency_Controller.getAll_Currency)
    app.get('/api/v1/getbyAll_Currency/:id',Currency_Controller.getByIdAll_Currency)
    app.delete('/api/v1/delete_Currency/:id',Currency_Controller.delete_Currency)
    app.get('/api/v1/getall_currency_payroll',Currency_Controller.getall_currency_payroll)
}
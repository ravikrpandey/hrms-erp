const Branchmater = require('../controllers/PerposalTypeController');

module.exports = app => {
    app.post("/api/v1/create_perposal_type", Branchmater.create_perposal_type);
    app.get("/api/v1/getperposal_type", Branchmater.getperposal_type);
    app.get("/api/v1/perposal_typeById/:id", Branchmater.perposal_typeById);
    app.put("/api/v1/update_perposal_type/:id", Branchmater.update_perposal_type);
    app.delete("/api/v1/delete_perposal_type/:id", Branchmater.delete_perposal_type);
    app.put("/api/v1/perposal_typeStatus/:id", Branchmater.perposal_typeStatus);
    app.get("/api/v1/getperposal_typeActive", Branchmater.getperposal_typeActive);
   
}
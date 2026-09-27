const shift_Allocation = require("../controllers/shift_Allocation_controller");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = (app) => {
    app.get('/api/v1/get_department_data_shift_Allocation/:entity_id', shift_Allocation.departMentSelected)
    app.get("/api/v1/getshiftMaster/:entity_id", shift_Allocation.getAllShiftBasedOnEntity);
    app.post("/api/v1/created_Data_shift_Allocation", shift_Allocation.create_Shift_Allocation)
    app.get("/api/v1/getshiftAllocationListData/:entity_id", shift_Allocation.getshiftAllocationListData)
    app.put("/api/v1/statusUpateShiftAllocation/:dept_id", shift_Allocation.statusUpdate);
    app.delete("/api/v1/deleteshiftAllocated/:dept_id", shift_Allocation.deleteShiftAllocationRecord);
    app.get("/api/v1/get_single_shiftAllocatedata", shift_Allocation.getSingleShiftAllocateddata);
    app.put("/api/v1/update_shift_Allocation_Data/:id", shift_Allocation.update_Shift_Allocation);

    app.post('/api/v1/exportToExcel', upload.single("file"), shift_Allocation.upload_excel_data)
};

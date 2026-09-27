const db = require("../models/index");
const documentMasterDetails = db.documentMaster;
const op = db.sequelize.op;
const path = require('path');
// const {s3Upload} = require("../aws")
const s3 = require("../config/s3config")
const fs = require('fs')
const CsvParser = require("json2csv").Parser;
const baseUrl = "https://emerp.elitetraveltech.in/";
// const baseUrl = "https://emerp.elitetraveltech.in/";
// const baseUrl = "http://localhost:5000/"
let i = 1;
i++
let Version = `v.0.0.${i++}`;

exports.createDocumentMaster = async (req, res) => {
    try {
        var datafile = req.files;
        let docstore = []
        let catarr = [];
        let file_name = [];
        const { folder_name, file_category, author, version, file_description, employee_id } = req.body;
        for (let j = 0; j < datafile.length; j++) {
            let employee_photo;
            datafile == undefined ? "" : (employee_photo = datafile[j].path);
            datafile == undefined ? "" : (file_names = datafile[j].originalname);
            file_name.push(file_names)
            if (employee_photo != undefined) {
                fs.renameSync(datafile[j].path, employee_photo);
                docstore.push(baseUrl + employee_photo)
                var cat = path.extname(datafile[j].filename);
                catarr.push(cat)
            }
        };


        response = await documentMasterDetails.create({
            folder_name,
            employee_photo: docstore,
            file_name: file_name,
            file_category: catarr,
            author,
            version: `v.0.0.1`,
            file_description,
            employee_id
        });
        return res.status(200).send({ code: 200, message: "Created Successfully!", data: response })

    } catch (error) {
        console.log(error, "@@@22");
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};



exports.addUpdateDocumentMaster = async (req, res) => {
    try {
        const document_master_id = parseInt(req.params.document_master_id);
        var datafile = req.files;
        let docstore = []
        let catarr = [];
        let file_name = [];
        const { folder_name, file_category, author, version, file_description, employee_id } = req.body;
        // mulitple data file store
        for (let j = 0; j < datafile.length; j++) {
            let employee_photo;
            datafile == undefined ? "" : (employee_photo = datafile[j].path);
            datafile == undefined ? "" : (file_names = datafile[j].originalname);
            file_name.push(file_names)
            if (employee_photo != undefined) {
                fs.renameSync(datafile[j].path, employee_photo);
                docstore.push(employee_photo)
                var cat = path.extname(datafile[j].filename);
                catarr.push(cat)
            }
        };

        // const documentMasterData = await documentMasterDetails.findOne({ where: { folder_name: folder_name } });
        // if (documentMasterData ) {
        //     return res.status(403).send({ code: 403, message: "Folder Name is Already Exists!" });
        // }   
        const editaddData = await documentMasterDetails.findOne({ where: { document_master_id: document_master_id } });
        if (editaddData) {
            i++
            console.log(i);
            const addupdateData = await documentMasterDetails.update({
                folder_name,
                employee_photo: baseUrl + docstore,
                file_name: file_name,
                file_category: catarr,
                author,
                version: `v.0.0.${i}`,
                file_description,
                employee_id
            }, { where: { document_master_id: parseInt(req.params.document_master_id) } }
            );
            return res.status(200).send({ code: 200, message: "Updated Successfully", data: addupdateData });
        } else {
            return res.status(400).send({ code: 400, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};


exports.updateDocumentMaster = async (req, res) => {
    try {
        const document_master_id = parseInt(req.params.document_master_id);
        const { folder_name, file_category, author, version, file_description, employee_id } = req.body;
        let employee_photo;
        req.file == undefined ? "" : (employee_photo = req.file.path);
        let file_name;
        req.file == undefined ? "" : (file_name = req.file.originalname);
        if (employee_photo != undefined) {
            fs.renameSync(req.file.path, employee_photo);
            var cat = path.extname(req.file.filename);
        }

        const editData = await documentMasterDetails.findOne({ where: { document_master_id: document_master_id } });
        if (editData) {
            i++
            const updateData = await documentMasterDetails.update(
                {
                    folder_name,
                    employee_photo: baseUrl + employee_photo,
                    file_name,
                    version: `v.0.0.${i}`,
                    file_category: cat,
                    author,
                    file_description,
                    employee_id
                }, { where: { document_master_id: parseInt(req.params.document_master_id) } }
            );
            return res.status(200).send({ code: 200, message: "Updated Successfully", data: updateData });
        } else {
            return res.status(400).send({ code: 400, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.viewsAllDocumentMaster = async (req, res) => {
    try {
        const getAllData = await documentMasterDetails.findAll({
            where: { status: "ACTIVE"},
        });
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All Data Successfully", result: getAllData });
        } else {
            return res.status(400).send({ code: 400, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.viewsByIdDocumentMaster = async (req, res) => {
    const DocumentMasterId = parseInt(req.params.document_master_id);
    try {
        const document_master_id = parseInt(req.params.document_master_id);
        const getData = await documentMasterDetails.findOne({ where: { document_master_id: document_master_id, status: "ACTIVE" } });
        if (getData) {
            return res.status(200).send({ code: 200, message: "Fetch Data Successfully", data: getData })
        } else {
            return res.status(400).send({ code: 400, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, mesasge: "Server Error" });
    };
};

exports.statusDocumentMaster = async (req, res) => {
    try {
        const document_master_id = req.params.document_master_id;
        const { status } = req.body;
        const editData = await documentMasterDetails.findOne({ where: { document_master_id: document_master_id } });
        if (editData) {
            const updateData = await documentMasterDetails.update(
                {
                    status
                }, { where: { document_master_id: document_master_id } }
            );
            return res.status(200).send({ code: 200, message: "Updated Successfully", data: updateData });
        } else {
            return res.status(400).send({ code: 400, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
}

// exports.downloadDocumentMaster = async (req, res) => {
//     try {
//         const document_master_id = parseInt(req.params.document_master_id);
//         documentMasterDetails.findAll({ where: { document_master_id: document_master_id } }).then((objs) => {
//             let download = [];
//             objs.forEach((obj) => {
//                 const { employee_photo } = obj;
//                 download.push({ employee_photo});
//             });

//         const csvData = employee_photo.parse(download);

//             res.setHeader("Content-Type", "text/csv");
//             res.setHeader("Content-Disposition", "attachment; filename=download.csv");

//             res.status(200).end(csvData);
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({ code: 500, message: "Server Error" });
//     }
// };

// exports.downloadDocumentMaster =(req, res) => {
//     const fileName = req.params.name;
//     const location = path.join(__dirname, '../documents/')

// res.download(location + fileName, fileName, (err) => {
//   if (err) {
//     res.status(500).send({
//       message: "Could not download the file. " + err,
//     });
//   }
//     });
// };
exports.downloadDocumentMaster = (req, res) => {
    const fileName = req.params.fileName;
    // const directoryPath = __basedir + "/documents/";

    res.download("documents/" + fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
};

exports.edit_Document_Master = async (req, res) => {
    try {
        const indexId = req.body
        const DocumentMasterId = parseInt(req.params.document_master_id);
        const editDocumentMaster = await documentMasterDetails.findOne({ where: { document_master_id: DocumentMasterId } });
        i = 1;
        i++;
        let Version = `v.0.0.${i}`;
        for (var i = 0; i < editDocumentMaster.employee_photo.length; i++) {
            if (i == req.body.indexId) {
                var allImage = editDocumentMaster.employee_photo
                var fileName=editDocumentMaster.file_name
                var fileCategory=editDocumentMaster.file_category
                allImage.map((num, index)=>{
                    if(i == index){
                        allImage[index]= baseUrl + req.files[0].path;
                        fileName[index]= req.files[0].originalname;
                        fileCategory[index]= path.extname(req.files[0].filename);
                    }
                })
            }
        } 

        editDocumentMaster.version = Version;
        if (editDocumentMaster) {

            const editData = await documentMasterDetails.update({
                document_master_id: editDocumentMaster.document_master_id,
                folder_name: req.body.folder_name,
                employee_photo: editDocumentMaster.employee_photo,
                file_description: req.body.file_description,
                employee_id: editDocumentMaster.employee_id,
                version: editDocumentMaster.version,
                author: editDocumentMaster.author,
                file_category: editDocumentMaster.file_category,
                file_name: editDocumentMaster.file_name,
            }, { where: { document_master_id: DocumentMasterId } });
            return res.status(200).send({ code: 200, message: "File Data is Updated Successfully!", data: editDocumentMaster });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};
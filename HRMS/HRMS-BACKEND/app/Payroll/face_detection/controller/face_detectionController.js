const db = require("../../../models/index");
const { Op } = require('sequelize');


exports.searchPatientByPhoto = async (req, res) => {
    try {
        const entity_id = req.headers["x-entity-id"];

        if (!entity_id) {
            return res.status(400).json({ success: false, message: "x-entity-id header is required" });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Photo is required" });
        }

        const uploadedPhotoPath = req.file.path;

        // Fetch all patients who have a stored face descriptor
        const patients = await db.patient.findAll({
            where: {
                entity_id,
                is_deleted: false,
                face_descriptor: { [Op.ne]: null }  // ← only patients with descriptors
            },
            include: [
                {
                    model: db.patient_emergency,
                    as: "contacts",
                    attributes: ["phone", "email", "is_primary"]
                }
            ]
        });

        const plainPatients = patients.map(p => {
            const patient = p.toJSON();
            const primaryContact = patient.contacts?.find(c => c.is_primary);
            return {
                ...patient,
                primary_phone: primaryContact?.phone || null,
                primary_email: primaryContact?.email || null,
                full_name: `${patient.first_name} ${patient.last_name}`
            };
        });

        // Real face matching
        const matchedPatients = await findMatchingPatients(uploadedPhotoPath, plainPatients);

        // Clean up uploaded file
        fs.unlinkSync(uploadedPhotoPath);

        if (!matchedPatients.length) {
            return res.status(200).json({
                success: true,
                message: "No matching patient found",
                count: 0,
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Matching patients fetched",
            count: matchedPatients.length,
            data: matchedPatients
        });

    } catch (error) {
        console.error("Photo Search Error:", error);
        
        return res.status(500).json({
            success: false,
            message: error.message || "Photo search failed"
        });
    }
};
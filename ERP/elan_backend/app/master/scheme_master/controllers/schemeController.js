
const db = require("../../../models/index");
const logger = require('../../../../logger/index');
const { isDate } = require("moment");
const { Op } = require('sequelize');


// exports.create_scheme = async (req, res) => {
//     try {
//         const { scheme_name, start_date, end_date, description, selected_item, promo_item, documents,  } = req.body;

//         const isExist = await db.scheme_master.findOne({ where: { scheme_name, isDeleted: false } });
//         if (isExist) {
//             return res.status(400).send({ code: 400, message: "Scheme Name Already Exist!" });
//         }


//         const today = new Date();
//         const startDate = new Date(start_date);
//         const endDate = new Date(end_date);

//         let status = 'INACTIVE';
//         if (today >= startDate && today <= endDate) {
//             status = 'ACTIVE';
//         }

//         const response = await db.scheme_master.create({
//             scheme_name,
//             description,
//             start_date,
//             end_date,
//             status,
//             documents,
//         });

//         const scheme_mst_id = response.id;

//         const selectedItemsData = selected_item.map(item => ({
//             scheme_mst_id,
//             selected_item_id: item.selected_item_id,
//             selected_qty: item.selected_qty,
//             selected_category_id: item.selected_category_id,
//             selected_subcat_id: item.selected_subcat_id,
//         }));

//         await db.scheme_master_selected_item.bulkCreate(selectedItemsData);

//         const promoItemsData = promo_item.map(item => ({
//             scheme_mst_id,
//             promo_item_id: item.promo_item_id,
//             promo_qty: item.promo_qty,
//             promo_category_id: item.promo_category_id,
//             promo_subcat_id: item.promo_subcat_id,
//         }));

//         await db.scheme_master_promo_item.bulkCreate(promoItemsData);

//         return res.status(200).send({
//             code: 200,
//             message: "Scheme Created Successfully",
//             data: response
//         });

//     } catch (error) {
//         logger.error(`Error ${error.message}`, { error });
//         console.error(error);
//         return res.status(500).send({ code: 500, message: error.message || "Server Error" });
//     }
// };

exports.create_scheme = async (req, res) => {
    try {
        const { scheme_name, start_date, end_date, description, selected_item, promo_item, documents, no_of_select_item, scheme_type, number_of_qty, price_scheme } = req.body;

        const isExist = await db.scheme_master.findOne({ where: { scheme_name, isDeleted: false } });
        if (isExist) {
            return res.status(400).send({ code: 400, message: "Scheme Name Already Exist!" });
        }

        const today = new Date();
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        let status = 'INACTIVE';
        if (today >= startDate && today <= endDate) {
            status = 'ACTIVE';
        }

        const response = await db.scheme_master.create({
            scheme_name,
            description,
            start_date,
            end_date,
            status,
            documents,
            scheme_type,
            no_of_select_item,
        
        });

        const scheme_mst_id = response.id;

        if (scheme_type == "qty") {
            await db.scheme_master_selected_item.create({
                scheme_mst_id,
                number_of_qty
            })
        } 
          if (scheme_type == "price") {
            await db.scheme_master_selected_item.create({
                scheme_mst_id,
                price_scheme,
            })
        } 
        if (scheme_type === "item") {
            const selectedItemsData = selected_item.map(item => ({
                scheme_mst_id,
                selected_item_id: item.selected_item_id,
                selected_qty: item.selected_qty,
                selected_category_id: item.selected_category_id,
                selected_subcat_id: item.selected_subcat_id,
                number_of_qty: number_of_qty,
                price_scheme:price_scheme,
            }));

            await db.scheme_master_selected_item.bulkCreate(selectedItemsData);
        }

        const promoItemsData = promo_item.map(item => ({
            scheme_mst_id,
            promo_item_id: item.promo_item_id,
            promo_qty: item.promo_qty,
            promo_category_id: item.promo_category_id,
            promo_subcat_id: item.promo_subcat_id,
            price_amount_promo:item.price_amount_promo
        }));

        await db.scheme_master_promo_item.bulkCreate(promoItemsData);

        return res.status(200).send({
            code: 200,
            message: "Scheme Created Successfully",
            data: response
        });

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.getAll_scheme = async (req, res) => {
    try {
        const sqlQuery = `
            SELECT 
                MS.id,
                MS.scheme_name,
                MS.description,
                MS.start_date,
                MS.status,
                MS.documents,
                MS.no_of_select_item,
                MS.end_date,

                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'selected_item_id', MSI.selected_item_id,
                            'selected_qty', MSI.selected_qty
                        )
                    )
                    FROM MASTER_SCHEME_SELECTED_ITEM MSI
                    WHERE MSI.scheme_mst_id = MS.id AND MSI.isDeleted = false
                ) AS selected_item,

                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'promo_item_id', MPI.promo_item_id,
                            'promo_qty', MPI.promo_qty
                        )
                    )
                    FROM MASTER_SCHEME_PROMO_ITEM MPI
                    WHERE MPI.scheme_mst_id = MS.id AND MPI.isDeleted = false
                ) AS promo_item

            FROM MASTER_SCHEME MS
            WHERE MS.isDeleted = false
            ORDER BY MS.id ASC;
        `;

        const data = await db.sequelize.query(sqlQuery, {
            type: db.Sequelize.QueryTypes.SELECT
        });

        const formattedData = data.map(row => ({
            ...row,
            selected_item: typeof row.selected_item === 'string' ? JSON.parse(row.selected_item) : row.selected_item || [],
            promo_item: typeof row.promo_item === 'string' ? JSON.parse(row.promo_item) : row.promo_item || []
        }));

        return res.status(200).send({ code: 200, message: "Fetched Successfully", data: formattedData });

    } catch (error) {
        logger.error(`Error: ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};




exports.getAll_active_scheme = async (req, res) => {
    try {
        const sqlQuery = `
            SELECT 
                MS.id,
                MS.scheme_name,
                MS.description,
                MS.start_date,
                MS.documents,
                MS.status,
                MS.no_of_select_item,
                MS.end_date,

                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'selected_item_id', MSI.selected_item_id,
                            'selected_qty', MSI.selected_qty
                        )
                    )
                    FROM MASTER_SCHEME_SELECTED_ITEM MSI
                    WHERE MSI.scheme_mst_id = MS.id AND MSI.isDeleted = false
                ) AS selected_item,

                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'promo_item_id', MPI.promo_item_id,
                            'promo_qty', MPI.promo_qty
                        )
                    )
                    FROM MASTER_SCHEME_PROMO_ITEM MPI
                    WHERE MPI.scheme_mst_id = MS.id AND MPI.isDeleted = false
                ) AS promo_item

            FROM MASTER_SCHEME MS
            WHERE MS.isDeleted = false
            AND MS.status = 'ACTIVE'
            ORDER BY MS.id ASC;
        `;

        const data = await db.sequelize.query(sqlQuery, {
            type: db.Sequelize.QueryTypes.SELECT
        });

        const formattedData = data.map(row => ({
            ...row,
            selected_item: typeof row.selected_item === 'string' ? JSON.parse(row.selected_item) : row.selected_item || [],
            promo_item: typeof row.promo_item === 'string' ? JSON.parse(row.promo_item) : row.promo_item || []
        }));

        return res.status(200).send({ code: 200, message: "Fetched Successfully", data: formattedData });

    } catch (error) {
        logger.error(`Error: ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};




exports.getById_scheme = async (req, res) => {
    try {
        const { id } = req.params;

        const sqlQuery = `
            SELECT 
                MS.id,
                MS.scheme_name,
                MS.description,
                MS.start_date,
                MS.documents,
                MS.status,
                MS.no_of_select_item,
                MS.scheme_type,
                MS.end_date,

                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'selected_item_id', MSI.selected_item_id,
                            'selected_item_name', mi.item_name,
                            'selected_item_code', mi.item_code,
                            'selected_item_description', mi.description,
                            'selected_qty', MSI.selected_qty,
                            'selected_category_id', MSI.selected_category_id,
                            'selected_asset_category_name', ma.asset_category_name,
                            'selected_subcat_id', MSI.selected_subcat_id,
                            'selected_subcat_name', msc.sub_category_name, 
                            'selected_item_code', mi.item_code,
                            'selected_item_description', mi.description,
                            'selected_number_of_qty', MSI.number_of_qty,
                            'selected_price_scheme', MSI.price_scheme,
                            'warranty', mi.warranty_period
                        )
                    )
                    FROM MASTER_SCHEME_SELECTED_ITEM MSI
                    LEFT JOIN MASTER_ITEM AS mi ON mi.id = MSI.selected_item_id
                    LEFT JOIN MASTER_ASSET AS ma ON ma.id = MSI.selected_category_id
                    LEFT JOIN MASTER_SUB_CATEGORY AS msc ON msc.id = MSI.selected_subcat_id
                    WHERE MSI.scheme_mst_id = MS.id AND MSI.isDeleted = false
                ) AS selected_item,

                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'promo_item_id', MPI.promo_item_id,
                            'promo_item_name', mi.item_name,
                            'promo_item_code', mi.item_code,
                            'promo_item_description', mi.description,
                            'promo_qty', MPI.promo_qty,
                            'promo_category_id', MPI.promo_category_id,
                            'promo_asset_category_name', ma.asset_category_name,
                            'promo_subcat_id', MPI.promo_subcat_id,
                            'promo_subcat_name', msc.sub_category_name,
                            'promo_item_code', mi.item_code,
                            'promo_item_description', mi.description,
                            'promo_item_price_amount_promo', MPI.price_amount_promo,
                            'promo_item_uom_name', MU.uom_name,
                            'promo_item_hsn_sac_code_id', mi.hsn_code_id,
                            'promo_item_igst', grm.value,
                            'promo_item_hsn_sac_code', HSN.hsn_sac_code,
                            'warranty', mi.warranty_period,
                            'discount_1', null,
                            'discount_2', null,
                            'discount_3', null
                        )
                    )
                    FROM MASTER_SCHEME_PROMO_ITEM MPI
                    LEFT JOIN MASTER_ITEM AS mi ON mi.id = MPI.promo_item_id
                    LEFT JOIN MASTER_ASSET AS ma ON ma.id = MPI.promo_category_id
                    LEFT JOIN MASTER_SUB_CATEGORY AS msc ON msc.id = MPI.promo_subcat_id
                    LEFT JOIN MASTER_UOM AS MU ON MU.uom_id = mi.uom_id
                    LEFT JOIN MASTER_HSN_SAC_CODE AS HSN ON HSN.id = mi.hsn_code_id
                    LEFT JOIN GST_RATE_MASTER AS grm ON grm.id = HSN.gst_rate_id
                    WHERE MPI.scheme_mst_id = MS.id AND MPI.isDeleted = false
                ) AS promo_item

            FROM MASTER_SCHEME MS
            WHERE MS.isDeleted = false AND MS.id = :id
            LIMIT 1;
        `;

        const data = await db.sequelize.query(sqlQuery, {
            replacements: { id },
            type: db.Sequelize.QueryTypes.SELECT
        });

        if (data.length > 0) {
            const scheme = data[0];

            const formatted = {
                ...scheme,
                selected_item: typeof scheme.selected_item === 'string' ? JSON.parse(scheme.selected_item) : (scheme.selected_item || []),
                promo_item: typeof scheme.promo_item === 'string' ? JSON.parse(scheme.promo_item) : (scheme.promo_item || [])
            };

            console.log(formatted)

            return res.status(200).send({ code: 200, message: "Fetched Successfully", data: formatted });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }

    } catch (error) {
        logger.error(`Error: ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};



exports.update_scheme = async (req, res) => {
    try {
        const { id } = req.params;
        const { scheme_name, description, status, start_date, end_date, selected_item, promo_item, documents, no_of_select_item, scheme_type, number_of_qty, price_scheme } = req.body;

        const existingScheme = await db.scheme_master.findOne({ where: { id, isDeleted: false } });
        if (!existingScheme) {
            return res.status(404).send({ code: 404, message: "Scheme not found!" });
        }

        if (scheme_name || description) {
            const duplicate = await db.scheme_master.findOne({
                where: {
                    scheme_name,
                    description,
                    isDeleted: false,
                    id: { [db.Sequelize.Op.ne]: id }
                }
            });

            if (duplicate) {
                return res.status(400).send({ code: 400, message: "Scheme with same name and description already exists!" });
            }
        }

        const updatedStartDate = start_date ? new Date(start_date) : new Date(existingScheme.start_date);
        const updatedEndDate = end_date ? new Date(end_date) : new Date(existingScheme.end_date);

        let updatedStatus = status;
        if (updatedStatus === undefined) {
            const today = new Date();
            if (today >= updatedStartDate && today <= updatedEndDate) {
                updatedStatus = 'ACTIVE';
            } else {
                updatedStatus = 'INACTIVE';
            }
        }


        await db.scheme_master.update(
            {
                scheme_name: scheme_name ?? existingScheme.scheme_name,
                description: description ?? existingScheme.description,
                start_date: start_date ?? existingScheme.start_date,
                end_date: end_date ?? existingScheme.end_date,
                status: updatedStatus,
                documents: documents ?? existingScheme.documents,
                no_of_select_item: no_of_select_item ?? existingScheme.no_of_select_item,
                scheme_type: scheme_type ?? existingScheme.scheme_type,
                
            },
            { where: { id } }
        );
         if (scheme_type === "price") {
            await db.scheme_master_selected_item.destroy({ where: { scheme_mst_id: id } });
            await db.scheme_master_selected_item.create({
                scheme_mst_id: id,
                price_scheme: price_scheme,
            })
        }
        if (scheme_type === "qty") {
            await db.scheme_master_selected_item.destroy({ where: { scheme_mst_id: id } });
            await db.scheme_master_selected_item.create({
                scheme_mst_id: id,
                number_of_qty: number_of_qty,
            })
        }
        if (scheme_type === "item") {
            if (Array.isArray(selected_item)) {
                await db.scheme_master_selected_item.destroy({ where: { scheme_mst_id: id } });

                if (selected_item.length > 0) {
                    const selectedItemsData = selected_item.map(item => ({
                        scheme_mst_id: id,
                        selected_item_id: item.selected_item_id,
                        selected_qty: item.selected_qty,
                        selected_category_id: item.selected_category_id,
                        selected_subcat_id: item.selected_subcat_id,
                       
                    }));

                    await db.scheme_master_selected_item.bulkCreate(selectedItemsData);
                }
            }
        }
        if (Array.isArray(promo_item)) {
            await db.scheme_master_promo_item.destroy({ where: { scheme_mst_id: id } });

            if (promo_item.length > 0) {
                const promoItemsData = promo_item.map(item => ({
                    scheme_mst_id: id,
                    promo_item_id: item.promo_item_id,
                    promo_qty: item.promo_qty,
                    promo_category_id: item.promo_category_id,
                    promo_subcat_id: item.promo_subcat_id,
                     price_amount_promo: item.price_amount_promo,
                }));

                await db.scheme_master_promo_item.bulkCreate(promoItemsData);
            }
        }

        return res.status(200).send({ code: 200, message: "Scheme updated successfully!" });

    } catch (error) {
        logger.error(`Error: ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.delete_scheme = async (req, res) => {
    try {
        const { id } = req.params;

        const isExist = await db.scheme_master.findOne({ where: { id } });

        if (!isExist) {
            return res.status(404).send({ code: 404, message: "Scheme ID not found" });
        }

        if (isExist.isDeleted === true) {
            return res.status(400).send({ code: 400, message: "Scheme already deleted" });
        }

        await db.scheme_master.update({ isDeleted: true }, { where: { id } });

        await db.scheme_master_selected_item.update(
            { isDeleted: true },
            { where: { scheme_mst_id: id } }
        );

        await db.scheme_master_promo_item.update(
            { isDeleted: true },
            { where: { scheme_mst_id: id } }
        );

        return res.status(200).send({ code: 200, message: "Scheme and related items deleted successfully" });

    } catch (error) {
        logger.error(`Error: ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};


exports.update_scheme_status = async (req, res) => {
    try {
        const { id } = req.params;
        const { start_date, end_date } = req.body;
        let { status } = req.body;

        const existingScheme = await db.scheme_master.findOne({ where: { id, isDeleted: false } });

        if (!existingScheme) {
            return res.status(404).send({ code: 404, message: "Scheme not found!" });
        }

        const updatedStartDate = start_date ? new Date(start_date) : new Date(existingScheme.start_date);
        const updatedEndDate = end_date ? new Date(end_date) : new Date(existingScheme.end_date);

        if (status === undefined) {
            const today = new Date();
            if (today >= updatedStartDate && today <= updatedEndDate) {
                status = 'ACTIVE';
            } else {
                status = 'INACTIVE';
            }
        }

        await db.scheme_master.update(
            {
                status,
                start_date: start_date || existingScheme.start_date,
                end_date: end_date || existingScheme.end_date
            },
            { where: { id } }
        );

        return res.status(200).send({
            code: 200,
            message: "Scheme status (and dates, if provided) updated successfully!",
            data: { id, status }
        });

    } catch (error) {
        logger.error(`Error: ${error.message}`, { error });
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


// module.exports.add_promo_item = async (req, res) => {   
//     try {
//         const { createLeadDetails, quotation_id, scheme_id, apply_scheme_id } = req.body;

//         if(!scheme_id) {
//             return res.status(400).send({code:400, message: "Scheme not selected!" })
//         }

//         for (let i = 0; i < apply_scheme_id.length; i++) {
//             let rawId = apply_scheme_id[i];
//             let id = Number(rawId);

//             if (isNaN(id)) continue;

//             try {
//                 await db.createLeadDetails.update(
//                     { apply_scheme: 1, scheme_id: scheme_id },
//                     { where: { id } }
//                 );
//             } catch (err) {
//                 console.error(`Failed to update apply_scheme for ID ${id}:`, err.message);
//             }
//         }

//         if (Array.isArray(createLeadDetails) && createLeadDetails.length > 0) {
//             const createdProducts = [];

//             for (let item of createLeadDetails) {
//                 let newProduct = await db.createLeadDetails.create({
//                     product_category_id: item.product_category_id,
//                     product_id: item.product_master_id,
//                     pro_sub_cat_id: item.product_sub_category_id,
//                     create_lead_id: quotation_id,
//                     apply_scheme: 1,
//                     promo_item: item.promo_item,
//                     new_item: item.new_item,
//                     scheme_id: scheme_id
//                 });

//                 createdProducts.push(newProduct);
//             }

//             return res.status(200).send({
//                 code: 200,
//                 message: "Promo scheme add successfully",
//                 data: createdProducts
//             });
//         } else {
//             return res.status(400).send({
//                 code: 400,
//                 message: "No lead details provided"
//             });
//         }

//     } catch (error) {
//         console.error("Error in add_promo_item:", error);
//         return res.status(500).send({
//             code: 500,
//             message: error.message
//         });
//     }
// };

// module.exports.add_promo_item = async (req, res) => {
//     try {
//         const { createLeadDetails, quotation_id, customer_id, scheme_id, apply_scheme_id, customer_type } = req.body;

//         if (!scheme_id) {
//             return res.status(400).send({ code: 400, message: "Scheme not selected!" });
//         }

//         if (!["NEW", "EXISTING"].includes(customer_type)) {
//             return res.status(400).send({ code: 400, message: "Invalid customer type!" });
//         }

//         const createdProducts = [];
//         const validIds = apply_scheme_id.map(id => Number(id)).filter(id => !isNaN(id));

//         if (validIds.length > 0) {
//             const updateData = { apply_scheme: 1, scheme_id };

//             const updateModel = customer_type === "NEW" ? db.createLeadDetails : db.customer_item_list;

//             await updateModel.update(updateData, { where: { id: validIds } });
//         }

//         if (Array.isArray(createLeadDetails) && createLeadDetails.length > 0) {
//             for (let item of createLeadDetails) {
//                 const newItemData = {
//                     product_category_id: item.product_category_id,
//                     product_id: item.product_master_id,
//                     pro_sub_cat_id: item.product_sub_category_id,
//                     apply_scheme: 1,
//                     promo_item: item.promo_item,
//                     new_item: item.new_item,
//                     scheme_id
//                 };

//                 if (customer_type === "NEW") {
//                     newItemData.create_lead_id = quotation_id;
//                 } else if (customer_type === "EXISTING") {
//                     newItemData.customer_id = customer_id;
//                     newItemData.order_qty = item.order_qty;
//                     newItemData.gst = item.gst; 
//                     newItemData.discount = item.discount;
//                 }

//                 const newProduct = await db.createLeadDetails.create(newItemData);
//                 createdProducts.push(newProduct);
//             }
//         }

//         return res.status(200).send({
//             code: 200,
//             message: "Promo scheme added successfully",
//             data: createdProducts
//         });

//     } catch (error) {
//         console.error("Error in add_promo_item:", error);
//         return res.status(500).send({
//             code: 500,
//             message: error.message
//         });
//     }
// };


// module.exports.remove_promo_item = async (req, res) => {
//     try {
//         let { quotation_id, scheme_id } = req.body;

//         let isExistPromo = await db.createLeadDetails.findOne({
//             where: { id: quotation_id, scheme_id: scheme_id, apply_scheme: true }
//         })

//         if (isExistPromo) {
//             await db.createLeadDetails.destroy({
//                 where: {
//                     apply_scheme: 1,
//                     new_item: 1,
//                     create_lead_id: quotation_id
//                 }
//             });


//             await db.createLeadDetails.update(
//                 { apply_scheme: 0, scheme_id: null },
//                 { where: { create_lead_id: quotation_id } }
//             )
//         }
//         else {
//             return res.status(404).send({ code: 404, message: "Promo scheme not found!" })
//         }
//         return res.status(200).send({ code: 200, message: 'Promo scheme remove successfully.' })



//     } catch (error) {
//         console.error("Error in add_promo_item:", error);
//         return res.status(500).send({
//             code: 500,
//             message: error.message
//         });
//     }
// };



// module.exports.add_promo_item = async (req, res) => {
//     try {
//         let { createLeadDetails, quotation_id, customer_id, scheme_id, proposal_no,  apply_scheme_id, customer_type } = req.body;
//         let createdProducts = [];

//         if (!scheme_id) {
//             return res.status(400).send({ code: 400, message: "Scheme not selected!" })
//         }

//         if (quotation_id && customer_type == "NEW") {
//             for (let i = 0; i < apply_scheme_id.length; i++) {
//                 let rawId = apply_scheme_id[i];
//                 let id = Number(rawId);

//                 if (isNaN(id)) continue;

//                 try {
//                     await db.createLeadDetails.update(
//                         { apply_scheme: 1, scheme_id: scheme_id },
//                         { where: { id } }
//                     );
//                 } catch (err) {
//                     console.error(`Failed to update apply_scheme for ID ${id}:, err.message`);
//                 }
//             }

//             // if (Array.isArray(createLeadDetails) && createLeadDetails.length > 0) {
//             //     createdProducts = [];

//             //     for (let item of createLeadDetails) {
//             //         let newProduct = await db.createLeadDetails.create({
//             //             product_category_id: item.product_category_id,
//             //             product_id: item.product_master_id,
//             //             pro_sub_cat_id: item.product_sub_category_id,
//             //             create_lead_id: quotation_id,
//             //             apply_scheme: 1,
//             //             promo_order_qty: item.promo_order_qty,
//             //             promo_item: item.promo_item,
//             //             new_item: item.new_item,
//             //             scheme_id: scheme_id,
//             //             proposal_no: proposal_no,
//             //         });

//             //         createdProducts.push(newProduct);
//             //     }
//             // }


//             if (Array.isArray(createLeadDetails) && createLeadDetails.length > 0) {
//                 createdProducts = [];

//                 for (let item of createLeadDetails) {
//                     if (item.id === null  || !item.id) {
//                         let newProduct = await db.createLeadDetails.create({
//                             product_category_id: item.product_category_id,
//                             product_id: item.product_master_id,
//                             pro_sub_cat_id: item.product_sub_category_id,
//                             create_lead_id: quotation_id,
//                             apply_scheme: 1,
//                             promo_order_qty: item.promo_order_qty,
//                             promo_item: item.promo_item,
//                             new_item: item.new_item,
//                             scheme_id: scheme_id,
//                             proposal_no: proposal_no,
//                         });

//                         createdProducts.push(newProduct);
//                     } else {
//                         let updatedProduct = await db.createLeadDetails.update(
//                             {
//                                 product_category_id: item.product_category_id,
//                                 product_id: item.product_master_id,
//                                 pro_sub_cat_id: item.product_sub_category_id,
//                                 create_lead_id: quotation_id,
//                                 qty: item.qty,
//                                 apply_scheme: 1,
//                                 promo_order_qty: item.promo_order_qty,
//                                 promo_item: item.promo_item,
//                                 new_item: item.new_item,
//                                 scheme_id: scheme_id,
//                                 proposal_no: proposal_no,
//                             },
//                             {where: { id: item.id }},  
//                         );

//                         createdProducts.push(updatedProduct);
//                     }
//                 }
//             }


//         }
//         if (customer_id && customer_type == "EXISTING") {
//             if (!scheme_id) {
//                 return res.status(400).send({ code: 400, message: "Scheme not selected!" })
//             }

//             for (let i = 0; i < apply_scheme_id.length; i++) {
//                 let rawId = apply_scheme_id[i];
//                 let id = Number(rawId);

//                 if (isNaN(id)) continue;

//                 try {
//                     await db.customer_item_list.update(
//                         { apply_scheme: 1, scheme_id: scheme_id },
//                         { where: { id } }
//                     );
//                 } catch (err) {
//                     console.error(`Failed to update apply_scheme for ID ${id}:, err.message`);
//                 }
//             }

//             // if (Array.isArray(createLeadDetails) && createLeadDetails.length > 0) {
//             //     createdProducts = [];

//             //     for (let item of createLeadDetails) {
//             //         let newProduct = await db.customer_item_list.create({
//             //             product_category_id: item.product_category_id,
//             //             product_id: item.product_master_id,
//             //             pro_sub_cat_id: item.product_sub_category_id,
//             //             order_qty: item.order_qty,
//             //             promo_order_qty: item.promo_order_qty,
//             //             gst: item.gst,
//             //             discount: item.discount,
//             //             customer_id: customer_id,
//             //             apply_scheme: 1,
//             //             promo_item: item.promo_item,
//             //             new_item: item.new_item,
//             //             scheme_id: scheme_id,
//             //             proposal_no:proposal_no,
//             //         });

//             //         createdProducts.push(newProduct);
//             //     }
//             // }

//             if (Array.isArray(createLeadDetails) && createLeadDetails.length > 0) {
//                 createdProducts = [];

//                 for (let item of createLeadDetails) {
//                     if (item.id === null) {
//                         // Create a new product if proposal_item_id is null
//                         let newProduct = await db.customer_item_list.create({
//                             product_category_id: item.product_category_id,
//                             product_id: item.product_master_id,
//                             pro_sub_cat_id: item.product_sub_category_id,
//                             order_qty: item.order_qty,
//                             promo_order_qty: item.promo_order_qty,
//                             gst: item.gst,
//                             discount: item.discount,
//                             customer_id: customer_id,
//                             apply_scheme: 1,
//                             promo_item: item.promo_item,
//                             new_item: item.new_item,
//                             scheme_id: scheme_id,
//                             proposal_no: proposal_no,
//                         });

//                         createdProducts.push(newProduct);
//                     } else {
//                         // Update existing product if proposal_item_id is not null
//                         let updatedProduct = await db.customer_item_list.update({

//                                 product_category_id: item.product_category_id,
//                                 product_id: item.product_master_id,
//                                 pro_sub_cat_id: item.product_sub_category_id,
//                                 order_qty: item.order_qty,
//                                 promo_order_qty: item.promo_order_qty,
//                                 gst: item.gst,
//                                 discount: item.discount,
//                                 customer_id: customer_id,
//                                 apply_scheme: 1,
//                                 promo_item: item.promo_item,
//                                 new_item: item.new_item,
//                                 scheme_id: scheme_id,
//                                 proposal_no: proposal_no,

//                          } , {where: { id: item.proposal_item_id }},  // Use proposal_item_id to find the record
//                         );

//                         createdProducts.push(updatedProduct);
//                     }
//                 }
//             }

//         }


//         return res.status(200).send({
//             code: 200,
//             message: "Promo scheme add successfully",
//             data: createdProducts
//         });

//     } catch (error) {
//         console.error("Error in add_promo_item:", error);
//         return res.status(500).send({
//             code: 500,
//             message: error.message
//         });
//     }
// };



module.exports.add_promo_item = async (req, res) => {
    try {
        let { createLeadDetails, quotation_id, customer_id, scheme_id, proposal_no, apply_scheme_id, customer_type } = req.body;
        let createdProducts = [];

        if (!scheme_id) {
            return res.status(400).send({ code: 400, message: "Scheme not selected!" })
        }

        if (quotation_id && customer_type == "NEW") {
            for (let i = 0; i < apply_scheme_id.length; i++) {
                let rawId = apply_scheme_id[i];
                let id = Number(rawId);

                if (isNaN(id)) continue;

                try {
                    await db.createLeadDetails.update(
                        { apply_scheme: 1, scheme_id: scheme_id },
                        { where: { id } }
                    );
                } catch (err) {
                    console.error(`Failed to update apply_scheme for ID ${id}:, err.message`);
                }
            }

            if (Array.isArray(createLeadDetails) && createLeadDetails.length > 0) {
                createdProducts = [];

                for (let item of createLeadDetails) {
                    if (item.id === null || !item.id) {
                        // Create a new product if id is null
                        let newProduct = await db.createLeadDetails.create({
                            product_category_id: item.product_category_id,
                            product_id: item.product_master_id,
                            pro_sub_cat_id: item.product_sub_category_id,
                            create_lead_id: quotation_id,
                            apply_scheme: item.apply_scheme,
                            promo_order_qty: item.promo_item ? item.promo_order_qty : item.qty,
                            promo_item: item.promo_item,
                            new_item: item.new_item,
                            scheme_id: scheme_id,
                            proposal_no: proposal_no,
                        });

                        createdProducts.push(newProduct);
                    } else {
                        // Soft delete the old item
                        let updatedProductdel = await db.createLeadDetails.update(
                            {
                                apply_scheme: 0,   // Soft delete (mark as deleted)
                            },
                            { where: { id: item.id } }
                        );
                        // Soft delete the old item
                        let updatedProduct = await db.createLeadDetails.update(
                            {
                                isDeleted: true,  // Soft delete (mark as deleted)
                            },
                            { where: { id: item.id } }
                        );

                        if (updatedProduct[0] === 1) {
                            // Create a new record with the same data and new ID
                            let newProduct = await db.createLeadDetails.create({
                                product_category_id: item.product_category_id,
                                product_id: item.product_master_id,
                                pro_sub_cat_id: item.product_sub_category_id,
                                create_lead_id: quotation_id,
                                promo_order_qty: item.promo_item ? item.promo_order_qty : item.qty,
                                apply_scheme: item.apply_scheme,
                                promo_item: item.promo_item,
                                new_item: item.new_item,
                                scheme_id: scheme_id,
                                proposal_no: proposal_no,
                            });

                            createdProducts.push(newProduct);
                        }
                    }
                }
            }

        }

        if (customer_id && customer_type == "EXISTING") {
            if (!scheme_id) {
                return res.status(400).send({ code: 400, message: "Scheme not selected!" })
            }

            for (let i = 0; i < apply_scheme_id.length; i++) {
                let rawId = apply_scheme_id[i];
                let id = Number(rawId);

                if (isNaN(id)) continue;

                try {
                    await db.customer_item_list.update(
                        { apply_scheme: 1, scheme_id: scheme_id },
                        { where: { id } }
                    );
                } catch (err) {
                    console.error(`Failed to update apply_scheme for ID ${id}:, err.message`);
                }
            }

            if (Array.isArray(createLeadDetails) && createLeadDetails.length > 0) {
                createdProducts = [];

                for (let item of createLeadDetails) {
                    if (item.id === null || !item.id) {
                        // Create a new product if id is null
                        let newProduct = await db.customer_item_list.create({
                            product_category_id: item.product_category_id,
                            product_id: item.product_master_id,
                            pro_sub_cat_id: item.product_sub_category_id,
                            order_qty: item.qty,
                            promo_order_qty: item.promo_order_qty,
                            gst: item.gst,
                            discount: item.discount,
                            customer_id: customer_id,
                            apply_scheme: item.apply_scheme,
                            promo_item: item.promo_item,
                            new_item: item.new_item,
                            scheme_id: scheme_id,
                            proposal_no: proposal_no,
                        });

                        createdProducts.push(newProduct);
                    } else {

                        // Soft delete the old item
                        let updatedProductdel = await db.customer_item_list.update(
                            {
                                apply_scheme: 0,  // Soft delete (mark as deleted)
                            },
                            { where: { id: item.id } }
                        );
                        // Soft delete the old item
                        let updatedProduct = await db.customer_item_list.update(
                            {
                                isDeleted: true,  // Soft delete (mark as deleted)
                            },
                            { where: { id: item.id } }
                        );

                        if (updatedProduct[0] === 1) {
                            // Create a new record with the same data and new ID
                            let newProduct = await db.customer_item_list.create({
                                product_category_id: item.product_category_id,
                                product_id: item.product_master_id,
                                pro_sub_cat_id: item.product_sub_category_id,
                                order_qty: item.qty,
                                promo_order_qty: item.promo_order_qty,
                                gst: item.gst,
                                discount: item.discount,
                                customer_id: customer_id,
                                apply_scheme: item.apply_scheme,
                                promo_item: item.promo_item,
                                new_item: item.new_item,
                                scheme_id: scheme_id,
                                proposal_no: proposal_no,
                            });

                            createdProducts.push(newProduct);
                        }
                    }
                }
            }
        }

        return res.status(200).send({
            code: 200,
            message: "Promo scheme added successfully",
            data: createdProducts
        });

    } catch (error) {
        console.error("Error in add_promo_item:", error);
        return res.status(500).send({
            code: 500,
            message: error.message
        });
    }
};



module.exports.remove_promo_item = async (req, res) => {
    try {
        const { quotation_id, customer_id, scheme_id, proposal_id , version_id, action_type} = req.body;

        if (!scheme_id) {
            return res.status(400).send({ code: 400, message: "Scheme ID is required!" });
        }

        const whereCondition = {
            scheme_id,
            apply_scheme: true
        };

        if (quotation_id) {
            whereCondition.create_lead_id = quotation_id;
        } else if (customer_id) {
            whereCondition.customer_id = customer_id;
        } else if (proposal_id) {
            whereCondition.proposal_id = proposal_id;
            whereCondition.version_id = version_id;
        }

        if (quotation_id) {

            // Fetch all items
            let itemNo = await db.createLeadDetails.findAll({
                where: { create_lead_id: quotation_id, isDeleted: false, apply_scheme: 1 }
            });

            if (itemNo.length) {
                for (let item of itemNo) {
                    if (item.id) {
                        await db.proposal_branding_scheme.destroy({
                            where: { proposal_item_id: item.id }
                        });

                        const schemeTypes = await db.proposal_scheme_type.findAll({
                            where: { proposal_item_id: item.id }
                        });

                        for (let schemeType of schemeTypes) {
                            if (schemeType.id) {
                                await db.proposal_scheme_data.destroy({
                                    where: { proposal_scheme_type_id: schemeType.id }
                                });

                                await db.proposal_scheme_type.destroy({
                                    where: { id: schemeType.id }
                                });
                            }
                        }
                    }
                }
            }


            let isExistPromo = await db.createLeadDetails.findOne({ where: whereCondition });
            if (!isExistPromo) return res.status(404).send({ code: 404, message: "Promo scheme not found!" });
        }
        if (customer_id) {

            // Fetch all items
            let itemNo = await db.customer_item_list.findAll({
                where: { customer_id: customer_id, isDeleted: false, apply_scheme: 1 }
            });

            if (itemNo.length) {
                for (let item of itemNo) {
                    if (item.id) {
                        await db.proposal_branding_scheme.destroy({
                            where: { customer_item_id: item.id }
                        });

                        const schemeTypes = await db.proposal_scheme_type.findAll({
                            where: { customer_item_id: item.id }
                        });

                        for (let schemeType of schemeTypes) {
                            if (schemeType.id) {
                                await db.proposal_scheme_data.destroy({
                                    where: { proposal_scheme_type_id: schemeType.id }
                                });

                                await db.proposal_scheme_type.destroy({
                                    where: { id: schemeType.id }
                                });
                            }
                        }
                    }
                }
            }



            let isExistPromo = await db.customer_item_list.findOne({ where: whereCondition });
            if (!isExistPromo) return res.status(404).send({ code: 404, message: "Promo scheme not found!" });

        }

        if (proposal_id) {

        
    // if promo item available ---
  const items = await db.proposalList.findOne({ where: { proposal_id, version_status: "safe", promo_item: true, apply_scheme: true, version_id, isDeleted: false } });

if (items) {
    await db.proposalList.update({ isDeleted: true, action_type: false }, { where: { proposal_id, version_status: "safe", promo_item: true, apply_scheme: true, version_id } });
    await db.proposalList.update({ scheme_id: null, action_type: false }, { where: { proposal_id, version_status: "draft", promo_item: false, version_id}})
    return res.status(200).send({ code: 200, message: "Promo items removed successfully" });
}
    

            // Fetch all items
            let itemNo = await db.proposalList.findAll({
                where: { proposal_id: proposal_id, apply_scheme: 1, version_id: version_id }
            });

            if (itemNo.length) {
                for (let item of itemNo) {
                    if (item.id) {
                        await db.proposal_branding.destroy({
                            where: { proposal_item_id: item.id, version_id: version_id }
                        });

                        const schemeTypes = await db.proposal_customisation_type.findAll({
                            where: { proposal_item_id: item.id, version_id: version_id }
                        });

                        for (let schemeType of schemeTypes) {
                            if (schemeType.id) {
                                await db.proposal_customisation_data.destroy({
                                    where: { proposal_customisation_id: schemeType.id }
                                });

                                await db.proposal_customisation_type.destroy({
                                    where: { id: schemeType.id }
                                });
                            }
                        }
                    }
                }
            }



            let isExistPromo = await db.proposalList.findOne({ where: whereCondition });
            if (!isExistPromo) return res.status(404).send({ code: 404, message: "Promo scheme not found!" });

        }



        const deleteCondition = {
            apply_scheme: 1
        };

        if (quotation_id) {
            deleteCondition.create_lead_id = quotation_id;

            await db.createLeadDetails.destroy({ where: deleteCondition });
            await db.createLeadDetails.update({ isDeleted: false }, { where: { create_lead_id: quotation_id } })

        } else if (customer_id) {
            deleteCondition.customer_id = customer_id;
            await db.customer_item_list.destroy({ where: deleteCondition });
            await db.customer_item_list.update({ isDeleted: false }, { where: { customer_id: customer_id } })
        }


        else if (proposal_id) {

            await db.proposalList.destroy({ where: { proposal_id: proposal_id, apply_scheme: 1, version_id: version_id} })
            // await db.proposalList.destroy({ where: { proposal_id: proposal_id, version_id: version_id,  scheme_id: { [Op.ne]: null },apply_scheme :0, isDeleted : {[Op.ne] : 1}}  })

            await db.proposalList.update({apply_scheme: 0, scheme_id: null, isDeleted:0  }, { where: {  proposal_id: proposal_id, version_id: version_id } })
        }
        const updateCondition = {
            apply_scheme: 0,
            scheme_id: null
        };

        if (quotation_id) {
            await db.createLeadDetails.update(updateCondition, { where: { create_lead_id: quotation_id } });
        } else if (customer_id) {
            await db.customer_item_list.update(updateCondition, { where: { customer_id: customer_id} });
        }

        return res.status(200).send({ code: 200, message: "Promo scheme removed successfully." });

    } catch (error) {
        console.error("Error in remove_promo_item:", error);
        return res.status(500).send({
            code: 500,
            message: error.message
        });
    }
};



// module.exports.add_proposal_promo_item = async (req, res) => {
//     try {
//         let { createLeadDetails, scheme_id, proposal_no, apply_scheme_id, proposal_id, action_type, version_id } = req.body;
//         let createdProducts = [];

//         if (!scheme_id) {
//             return res.status(400).send({ code: 400, message: "Scheme not selected!" })
//         }
//         if (apply_scheme_id.length > 0) {
//             for (let i = 0; i < apply_scheme_id.length; i++) {
//                 let rawId = apply_scheme_id[i];
//                 let id = Number(rawId);

//                 if (isNaN(id)) continue;

//                 try {
//                     await db.proposalList.update(
//                         { apply_scheme: 1, scheme_id: scheme_id },
//                         { where: { id } }
//                     );
//                 } catch (err) {
//                     console.error(`Failed to update apply_scheme for ID ${id}:, err.message`);
//                 }
//             }
//         }
//         if (Array.isArray(createLeadDetails) && createLeadDetails.length > 0) {
//             createdProducts = [];

//             for (let item of createLeadDetails) {
//                 if (item.id === null || !item.id) {
//                     // Create a new product if id is null
//                     let newProduct = await db.proposalList.create({
//                         product_category_id: item.product_category_id,
//                         product_master_id: item.product_master_id,
//                         qty: item.qty ? item.qty : item.promo_order_qty,
//                         pro_sub_cat_id: item.product_sub_category_id,
//                         proposal_id: proposal_id,
//                         apply_scheme: item.apply_scheme,
//                         promo_order_qty: item.promo_order_qty ? item.promo_order_qty : item.qty,
//                         promo_item: item.promo_item,
//                         new_item: item.new_item,
//                         scheme_id: scheme_id,
//                         proposal_no: proposal_no,
//                         action_type: action_type,
//                         version_id:version_id,
//                     });

//                     createdProducts.push(newProduct);
//                 } else {
//                     // Soft delete the old item
//                     let updatedProductdel = await db.proposalList.update(
//                         {
//                             apply_scheme: 0,   // Soft delete (mark as deleted)
//                         },
//                         { where: { id: item.id } }
//                     );
//                     // Soft delete the old item
//                     let updatedProduct = await db.proposalList.update(
//                         {
//                             isDeleted: true,  // Soft delete (mark as deleted)
//                         },
//                         { where: { id: item.id } }
//                     );

//                     if (updatedProduct[0] === 1) {
//                         // Create a new record with the same data and new ID
//                         let newProduct = await db.proposalList.create({
//                             product_category_id: item.product_category_id,
//                             product_master_id: item.product_master_id,
//                             pro_sub_cat_id: item.product_sub_category_id,
//                             proposal_id: proposal_id,
//                             qty: item.qty ? item.qty : item.promo_order_qty,
//                             promo_order_qty: item.promo_order_qty ? item.promo_order_qty : item.qty,
//                             apply_scheme: item.apply_scheme,
//                             promo_item: item.promo_item,
//                             new_item: item.new_item,
//                             scheme_id: scheme_id,
//                             proposal_no: proposal_no,
//                             action_type: action_type,
//                             version_id:version_id,
//                         });

//                         createdProducts.push(newProduct);
//                     }
//                 }
//             }
//         }

//         return res.status(200).send({
//             code: 200,
//             message: "Promo scheme added successfully",
//             data: createdProducts
//         });

//     } catch (error) {
//         console.error("Error in add_promo_item:", error);
//         return res.status(500).send({
//             code: 500,
//             message: error.message
//         });
//     }
// };


module.exports.add_proposal_promo_item = async (req, res) => {
    try {
        let { createLeadDetails, scheme_id, proposal_no, apply_scheme_id, proposal_id, action_type, version_id } = req.body;
        let createdProducts = [];

        if (!scheme_id) {
            return res.status(400).send({ code: 400, message: "Scheme not selected!" });
        }

        // Update apply_scheme for given IDs
        if (Array.isArray(apply_scheme_id) && apply_scheme_id.length > 0) {
            for (let rawId of apply_scheme_id) {
                let id = Number(rawId);
                if (isNaN(id)) continue;

                try {
                    await db.proposalList.update(
                        { apply_scheme: 1, scheme_id: scheme_id },
                        { where: { id } }
                    );
                } catch (err) {
                    console.error(`Failed to update apply_scheme for ID ${id}:`, err.message);
                }
            }
        }

        // Handle lead details
        if (Array.isArray(createLeadDetails) && createLeadDetails.length > 0) {
            for (let item of createLeadDetails) {
                if (!item.id) {
                    // Create a new product
                    let newProduct = await db.proposalList.create({
                        product_category_id: item.product_category_id,
                        product_master_id: item.product_master_id,
                        qty: item.qty ? item.qty : item.promo_order_qty,
                        pro_sub_cat_id: item.product_sub_category_id,
                        proposal_id: proposal_id,
                        apply_scheme: item.apply_scheme,
                        promo_order_qty: item.promo_order_qty ? item.promo_order_qty : item.qty,
                        promo_item: item.promo_item,
                        new_item: item.new_item,
                        scheme_id: scheme_id,
                        proposal_no: proposal_no,
                        action_type: action_type,
                        version_id: version_id,
                    });
                    createdProducts.push(newProduct);
                } else {
                    if (item.apply_scheme === false || item.apply_scheme === 0) {
                        // Just update the existing record
                        await db.proposalList.update(
                            {
                                product_category_id: item.product_category_id,
                                product_master_id: item.product_master_id,
                                qty: item.qty ? item.qty : item.promo_order_qty,
                                pro_sub_cat_id: item.product_sub_category_id,
                                promo_order_qty: item.promo_order_qty ? item.promo_order_qty : item.qty,
                                promo_item: item.promo_item,
                                new_item: item.new_item,
                                scheme_id: scheme_id,
                                proposal_no: proposal_no,
                                apply_scheme: item.apply_scheme,
                                action_type: action_type,
                                version_id: version_id
                            },
                            { where: { id: item.id } }
                        );
                    } else {
                        // Soft delete and create new if apply_scheme is true
                        await db.proposalList.update(
                            {
                                apply_scheme: 0,
                                isDeleted: true
                            },
                            { where: { id: item.id } }
                        );

                        let newProduct = await db.proposalList.create({
                            product_category_id: item.product_category_id,
                            product_master_id: item.product_master_id,
                            pro_sub_cat_id: item.product_sub_category_id,
                            proposal_id: proposal_id,
                            qty: item.qty ? item.qty : item.promo_order_qty,
                            promo_order_qty: item.promo_order_qty ? item.promo_order_qty : item.qty,
                            apply_scheme: item.apply_scheme,
                            promo_item: item.promo_item,
                            new_item: item.new_item,
                            scheme_id: scheme_id,
                            proposal_no: proposal_no,
                            action_type: action_type,
                            version_id: version_id
                        });
                        createdProducts.push(newProduct);
                    }
                }
            }
        }

        return res.status(200).send({
            code: 200,
            message: "Promo scheme added successfully",
            data: createdProducts
        });

    } catch (error) {
        console.error("Error in add_promo_item:", error);
        return res.status(500).send({
            code: 500,
            message: error.message
        });
    }
};

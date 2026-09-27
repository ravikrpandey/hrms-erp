const db = require("../../../models/index");
const productDetails = db.product_master;
const product__variant_Details = db.product__variant_master


exports.create_product = async (req, res) => {
    try {
        const { product_name, uom_id, variant_name, product_description, mvp, price_per_unit, average_production_cost, product_specification, maximum_discount } = req.body;

        let productDetailsInstance = await productDetails.findOne({
            where: {
                product_name,
                isDeleted: false
            }
        });


        if ((mvp || price_per_unit ||
            average_production_cost) < 0) {
            return res.status(400).send({ code: 400, message: "Value should be positive." })
        }

        if (productDetailsInstance) {
            let productVariantInstance = await product__variant_Details.findOne({
                where: {
                    variant_name,
                    product_master_id: productDetailsInstance.id,
                    isDeleted: false
                },
                attributes: ["variant_name", "product_master_id"]
            });

            if (productVariantInstance) {
                return res.status(403).send({ code: 403, message: "Product and Variant Details Already Exist" });
            } else {
                const product_variant_codes = btoa(Math.random()).slice(0, 10).toUpperCase();
                const product_variant = await product__variant_Details.create({
                    uom_id,
                    product_variant_code: product_variant_codes,
                    variant_name,
                    product_description,
                    mvp,
                    price_per_unit,
                    average_production_cost,
                    product_specification,
                    maximum_discount,
                    product_master_id: productDetailsInstance.id
                });
                return res.status(200).send({ code: 200, message: "Product Variant Created Successfully!", product_variant });
            }
        } else {
            const product_code = btoa(Math.random()).slice(0, 10).toUpperCase();
            const response = await productDetails.create({
                product_name,
                product_code
            });
            const product_variant_codes = btoa(Math.random()).slice(0, 10).toUpperCase();
            const product_variant = await product__variant_Details.create({
                uom_id,
                product_variant_code: product_variant_codes,
                variant_name,
                product_description,
                mvp,
                price_per_unit,
                average_production_cost,
                product_specification,
                maximum_discount,
                product_master_id: response.id
            });

            return res.status(200).send({ code: 200, message: "Product Details and Variant Created Successfully!", data: response, product_variant });
        }

    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.getAllproduct = async (req, res) => {
    try {
        const { id } = req.params;
        let getAllData;
        if (id) {
            getAllData = await product__variant_Details.findOne({
                where: { id: id, isDeleted: false, status: "ACTIVE" },
                include: [
                    {
                        model: productDetails,

                    },
                    {
                        model: db.uom,
                        attributes: ["uom_name"],
                    },
                    // where: { isDeleted: false }
                ]
            });
            return res.status(200).send({
                code: 200,
                message: `Get product Details Data  Successfully`,
                data: getAllData,
            });
        } else {
            getAllData = await productDetails.findAll({
                include: [
                    {
                        model: product__variant_Details,
                        include:
                        {
                            model: db.uom,
                            attributes: ["uom_name"],
                        },
                        where: { isDeleted: false, status: "ACTIVE" }

                    },

                ],
                order: [['id', 'DESC']],
                where: { isDeleted: false },
            });
            return res.status(200).send({
                code: 200,
                message: "Get all product Deatils Data Successfully",
                data: getAllData,
            });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({
            code: 500,
            message: error.message || "Internal Server Error",
        });
    }
};


exports.update_product = async (req, res) => {
    try {
        const variant_id = req.params.id;
        if (variant_id) {
            const { product_name, uom_id, variant_name, product_description, mvp, price_per_unit,
                average_production_cost, product_specification, maximum_discount } = req.body;

            if ((mvp || price_per_unit ||
                average_production_cost) < 0) {
                return res.status(400).send({ code: 400, message: "Value should be positive." })
            }

            const varient_details = await product__variant_Details.findOne({
                where: { id: variant_id, isDeleted: false },
            });

            const existingVariantName = await product__variant_Details.findOne({
                where: { variant_name: variant_name, isDeleted: false },
            });

           
            if (existingVariantName) {
                const update_variant_detail = await product__variant_Details.update({
                    product_description,
                    uom_id,
                    mvp,
                    price_per_unit,
                    average_production_cost,
                    product_specification,
                    maximum_discount
                }, {
                    where: { id: variant_id, isDeleted: false }
                });
                return res.status(200).send({
                    code: 200,
                    message: "variant details updated successfully!",
                });
            } else {
                await productDetails.update({ product_name }, {
                    where: { id: varient_details.product_master_id, status: "ACTIVE" }
                });


                const update_variant = await product__variant_Details.update({
                    variant_name,
                    product_description,
                    uom_id,
                    mvp,
                    price_per_unit,
                    average_production_cost,
                    product_specification,
                    maximum_discount
                }, {
                    where: { id: variant_id, isDeleted: false }
                });
                return res.status(200).send({
                    code: 200,
                    message: "Product details updated successfully!", data: update_variant
                });
            }
        } else {
            return res.status(400).send({
                code: 400,
                message: "Invalid variant ID provided.",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.delete_product = async (req, res) => {
    try {
        const id = req.params.id
        const getAllData = await product__variant_Details.findOne({ where: { id: id } });
        if (getAllData) {
            await product__variant_Details.update({ isDeleted: true }, { where: { id: id } });
            return res.status(200).send({ code: 200, message: "product Details is Deleted Successfully!" });
        } else {
            return res.status(404).send({ code: 403, message: "id not found" });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: "Internal Server Error" });
    }
};

exports.productStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        if (status === undefined) {
            return res.status(400).send({
                code: 400,
                message: "Bad Request: 'status' property is missing in the request body",
            });
        }
        console.log(status);
        const getData = await product__variant_Details.findOne({
            where: {
                id: id,
                isDeleted: false,
            },
        });
        if (getData) {
            await product__variant_Details.update(
                {
                    status,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );
            return res.status(200).send({
                code: 200,
                message: "Product Status Change Successfully!",
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.get_variants_by_product_id = async (req, res) => {
    try {
        const productId = req.params.productId;

        if (!productId) {
            return res.status(400).send({
                code: 400,
                message: "Product ID is required.",
            });
        }

        const productDetailsInstance = await productDetails.findOne({
            where: {
                id: productId,
                status: "ACTIVE",
            },
        });

        if (!productDetailsInstance) {
            return res.status(404).send({
                code: 404,
                message: "Product not found with the provided ID.",
            });
        }
        const variantsList = await product__variant_Details.findAll({
            where: {
                product_master_id: productId,
                isDeleted: false,
            },
        });

        return res.status(200).send({
            code: 200,
            message: "Variants list retrieved successfully.",
            product_code: productDetailsInstance.product_code,
            data: variantsList,
            
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error",
        });
    }
};

exports.getProductDetailsByVariantId = async (req, res) => {
    try {
        const variantId = req.params.variantId;

        if (!variantId) {
            return res.status(400).send({
                code: 400,
                message: "Variant ID is required.",
            });
        }

        const variantDetailsInstance = await product__variant_Details.findOne({
            where: {
                id: variantId,
                isDeleted: false,
            },
            include: [
                {
                    model: productDetails,
                    where: {
                        status: "ACTIVE",
                    },
                },
            ],
        });

        if (!variantDetailsInstance) {
            return res.status(404).send({
                code: 404,
                message: "Variant not found with the provided ID.",
            });
        }

        return res.status(200).send({
            code: 200,
            message: "Get product Details Data Successfully",
            data: {
                product_variant_masters: variantDetailsInstance,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error",
        });
    }
};

exports.get_active_variants_by_product_id = async (req, res) => {
    try {
        const productId = req.params.productId;

        if (!productId) {
            return res.status(400).send({
                code: 400,
                message: "Product ID is required.",
            });
        }

        const productDetailsInstance = await productDetails.findOne({
            where: {
                id: productId,
                status: "ACTIVE",
            },
        });

        if (!productDetailsInstance) {
            return res.status(404).send({
                code: 404,
                message: "Product not found with the provided ID.",
            });
        }
        const variantsList = await product__variant_Details.findAll({
            where: {
                product_master_id: productId,
                isDeleted: false,
                status: 'ACTIVE'
            },
        });

        return res.status(200).send({
            code: 200,
            message: "Variants list retrieved successfully.",
            data: variantsList,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error",
        });
    }
};


exports.getAllRepeatProduct = async (req, res) => {
    try {
        const productions = await product__variant_Details.findAll({
            where: { isDeleted: false },
            attributes: ["id", "uom_id", "variant_name", "mvp", "price_per_unit", "average_production_cost", "product_specification", "maximum_discount", "product_description", "status", "product_master_id", "product_variant_code"],
            include: [
                {
                    model: productDetails,
                    attributes: ['product_name', "product_code"],
                },
                {
                    model: db.uom,
                    attributes: ['uom_name'],
                }
            ],
            order: [['id', 'DESC']],
            raw: true,
            nest: true,
        });

        if (productions && productions.length > 0) {
            return res.status(200).send({ code: 200, message: "Get All Item data successfully", data: productions });
        } else {
            return res.status(404).send({ code: 404, message: "Data Not found",data: productions });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};







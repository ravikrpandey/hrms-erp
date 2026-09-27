module.exports = (sequelize, Sequelize) => {
    const proposal_performa_invoice = sequelize.define("PROPOSAL_PERFORMA_INVOICE", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        pi_number: {
            type: Sequelize.STRING,
        },

        approvel_status: {
            type: Sequelize.ENUM("APPROVED", "PENDING", "REJECTED"),
            defaultValue: "PENDING"
        },
        customer_status: {
            type: Sequelize.ENUM("APPROVED", "PENDING", "REJECTED"),
            defaultValue: "PENDING"
        },


        paymentTC: {
            type: Sequelize.TEXT
        },

        document: {
            type: Sequelize.STRING
        },

        reason_remarks: {
            type: Sequelize.STRING
        },

        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        quotation_type: {
            type: Sequelize.ENUM("direct", "in direct"),
            defaultValue: "in direct"
        },

        expiry_date: {
            type: Sequelize.DATEONLY,
        },

        remark: {
            type: Sequelize.TEXT
        },
        email_status: {
            type: Sequelize.ENUM("PENDING", "ACCEPTED", "REJECTED"),
            defaultValue: "PENDING"
        },
        is_addpo: {
            type: Sequelize.ENUM("With_PO", "Without_PO"),

        },
        so_status: {
            type: Sequelize.ENUM("DRAFT", "PENDING", "APPROVED", "REJECTED"),

        },
        back_office_rejected: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,

        },
        dealer: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        proposal_version_status: {
            type: Sequelize.ENUM("APPROVED", "PENDING", "REJECTED"),
            defaultValue: "PENDING"
        },
        version_rejected_remark: {
            type: Sequelize.TEXT
        },
    },
        {
            freezeTableName: true
        });
    return proposal_performa_invoice
}
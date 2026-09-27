const db = require('../../../models/index')

const TaxMaster = db.TaxCessRate;
const TaxSurcharge = db.TaxSurcharge;




exports.createTaxMaster = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { id, cess_rate, status, surchargeRows } = req.body; 

    let taxMaster;

    if (id) {
 
      taxMaster = await TaxMaster.findByPk(id, { transaction: t });
      if (!taxMaster) {
        await t.rollback();
        return res.status(404).send({ code: 404, message: "Tax master not found" });
      }

      await taxMaster.update({ cess_rate, status }, { transaction: t });

      await TaxSurcharge.destroy({ where: { tax_master_id: id }, transaction: t });
    } else {
      taxMaster = await TaxMaster.create({ cess_rate, status }, { transaction: t });
    }
    if (Array.isArray(surchargeRows) && surchargeRows.length > 0) {
      const surchargePayload = surchargeRows.map((s) => ({
        tax_master_id: taxMaster.id,
        threshold: s.threshold,
        rate: s.rate,
        remarks: s.remarks,
      }));

      await TaxSurcharge.bulkCreate(surchargePayload, { transaction: t });
    }

    await t.commit();

    const response = await TaxMaster.findOne({
      where: { id: taxMaster.id },
      include: [{ model: TaxSurcharge }],
    });
    console.log(response)

    return res.status(id ? 200 : 201).send({
      code: id ? 200 : 201,
      message: id ? "Tax master updated successfully" : "Tax master created successfully",
      data: response,
    });
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }
    return res.status(500).send({ code: 500, message: error.message });
  }
};


exports.getAllTaxMasters = async (req, res) => {
  try {
    const taxMasters = await TaxMaster.findAll({
      include: [
        {
          model: TaxSurcharge,
        },
      ],
      order: [[TaxSurcharge, 'id', 'ASC']],
    });

    return res.status(200).send({
      code: 200,
      message: "All tax masters fetched successfully",
      data: taxMasters,
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};
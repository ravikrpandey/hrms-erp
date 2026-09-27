const { where } = require('sequelize')
const db = require('../../models/index')



module.exports.getAllCraProviderList = async (req, res) => {
  try {
    const data = await db.craProvider.findAll({
      where: { isDeleted: false }
    });

    if (!data || data.length === 0) {
      return res.status(404).send({ message: "No data found!" });
    }
    return res.status(200).send({message: "All data fetched successfully!",data});
  } catch (err) {
    return res.status(500).send({
      message: err.message || "Internal server error!"
    });
  }
};

exports.createOrUpdateNpsScheme = async (req, res) => {
  try {
    const {
      id,
      schemeName,
      description,
      employeeContribution,
      employerContribution,
      craProvider,
      IsMinimum,
      minimumAmount,
      Iscapping,
      cappingAmount,
      employerContributionInCtc,
      status
    } = req.body;

    if (!schemeName || employeeContribution == null || employerContribution == null || !craProvider) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    let scheme;

    if (id) {
      scheme = await db.NpsScheme.findOne({ where: { id, isDeleted: false } });
      if (!scheme) {
        return res.status(404).send({ message: "NPS Scheme not found!" });
      }

      await scheme.update({
        schemeName,
        description,
        employeeContribution,
        employerContribution,
        craProvider_id: craProvider,
        IsMinimum,
        minimumAmount,
        Iscapping,
        cappingAmount,
        employerContributionInCtc,
        status
      });

      return res.status(200).send({
        message: "NPS Scheme updated successfully!",
        data: scheme
      });

    } else {
    
      scheme = await db.NpsScheme.findOne({ where: { schemeName, isDeleted: false } });

      if (scheme) {
        await scheme.destroy();
      }

      const newScheme = await db.NpsScheme.create({
        schemeName,
        description,
        employeeContribution,
        employerContribution,
        craProvider_id: craProvider,
        IsMinimum,
        minimumAmount,
        Iscapping,
        cappingAmount,
        employerContributionInCtc,
        status
      });

      return res.status(201).send({
        message: "NPS Scheme created successfully!",
        data: newScheme
      });
    }

  } catch (err) {
    return res.status(500).send({
      message: err.message || "Internal server error!"
    });
  }
};



module.exports.getAllNps = async (req, res) => {

  try {
    const data = await db.NpsScheme.findAll({
      where: { isDeleted: false } 
    });

    if (!data) {
      return res.status(404).send({ message: "NPS Scheme not found!" });
    }

    return res.status(200).send({
      message: "NPS Scheme fetched successfully!",
      data:data
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message || "Internal server error!"
    });
  }
};

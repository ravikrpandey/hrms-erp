module.exports = (sequelize, Sequelize) => {
  const vendorContactPerson = sequelize.define(
    "VENDOR_CONTACT_PERSON",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
     
      title: {
         type: Sequelize.ENUM("Mr", "Mrs", 'Miss',),
        defaultValue: "Mr",
      },
      contact_person_name: {
        type: Sequelize.STRING
      },
      
      mobile: {
        type: Sequelize.STRING
      },    
      email_id: {
        type: Sequelize.STRING
      },    
      designation: {
        type: Sequelize.STRING
      },    
      department: {
        type: Sequelize.STRING
      },    
      
      
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE", 'BLACKLISTED',),
        defaultValue: "ACTIVE",
      },
      is_Deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_primary_contact: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    },

    {
      freezeTableName: true,
    }
  );
  return vendorContactPerson;
};
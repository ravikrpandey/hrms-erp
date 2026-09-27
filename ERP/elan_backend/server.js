const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
var bodyParser = require("body-parser");
var cron = require("node-cron");
const config = require("./app/config/auth.config");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const Routes = require("./src/routes/routes.js");
const xlsx = require("xlsx");
const axios = require("axios");
const { Op } = require("sequelize");
// require("./app/CRM/utils/mail/mailWorker.js");

const {
  autoPostFinancialAccountJournal,
} = require("./app/Finance_And_Accounting/journal/controller/journal_auto_repeat_controller.js");

const verifyAuthToken = require("./app/middleware/AuthVerifyToken.js");

global.migrationRan = false;

global.__basedir = __dirname;
dotenv.config();
const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.set("trust proxy", true);

const corsOpts = {
  origin: "*",
  methods: ["GET", "PATCH", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOpts));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));

const schedule = require("node-schedule");

schedule.scheduleJob("0 0   *", async function () {
  await autoPostFinancialAccountJournal({ status: () => {}, send: () => {} });
});
app.use("/uploads", express.static("uploaded_files"));

// Calling Auth Token on All routes
app.use(verifyAuthToken);

app.use(async (req, res, next) => {
  const session_id = req.user?.session_id;
  const user_id = req.user?.employee_id || null;

  res.on("finish", async () => {
    const page_url = req.query.page_url;
    const page_name = req.query.page_name;

    if (!user_id || !session_id || !page_url) return;

    const FIVE_MIN = 5 * 60 * 1000;
    const now = new Date();

    // Check last 2 seconds entry for stop duplicate entry
    const twoSecondsAgo = new Date(now.getTime() - 2000);

    const recentSameEntry = await db.user_activity_logs.findOne({
      where: {
        user_id,
        session_id,
        page_url,
        createdAt: { [db.Sequelize.Op.gt]: twoSecondsAgo },
      },
      order: [["createdAt", "DESC"]],
    });

    if (recentSameEntry) {
      console.log("Same page duplicate stopped (2 sec rule)");
      return;
    }

    // 1 Get last log entry any page
    const lastEntryAnyPage = await db.user_activity_logs.findOne({
      where: { user_id, session_id },
      order: [["createdAt", "DESC"]],
    });

    // 2 If exists and page changed → close previous page time
    if (lastEntryAnyPage && lastEntryAnyPage.page_url !== page_url) {
      const entryTime = new Date(lastEntryAnyPage.createdAt);
      const diffSec = Math.floor((now - entryTime) / 1000);

      await lastEntryAnyPage.update({
        updatedAt: now,
        total_time_seconds: diffSec,
      });
    }

    // 3 Check same page within 5 mins
    const lastSamePage = await db.user_activity_logs.findOne({
      where: { user_id, session_id, page_url },
      order: [["createdAt", "DESC"]],
    });

    if (lastSamePage) {
      const lastTime = new Date(lastSamePage.createdAt);

      if (now - lastTime < FIVE_MIN) {
        console.log("5 minute rule – No Entry");
        return;
      }
    }

    // 4 Create new entry
    await db.user_activity_logs.create({
      user_id,
      session_id,
      page_url,
      page_name,
    });

    console.log("✔ New Page Entry Created");
  });

  next();
});

const db = require("./app/models");

/* =====================================================
--------------------: Table SYCN :----------------------
===================================================== */
// db.otpVerificationEntity.sync({ alter: true });
// db.PROCUREMENT_PURCHASE_VENDOR_QUOTATION.sync({ alter: true });
// db.PROCUREMENT_PURCHASE_VENDOR_NEGOTIATION.sync({ alter: true });
// db.vehiclePlanningMst.sync({ alter: true });

// db.transportVoucher.sync({ alter: true });

// db.transportVoucher.sync({ alter: true });
// db.salesInvoiceData.sync({alter:true});
// db.paymentProgramList.sync({alter:true});
// db.adjustmentJournal.sync({alter:true});


const workbook = xlsx.readFile("price-list-master1.xlsx");
const sheet1 = xlsx.utils.sheet_to_json(workbook.Sheets["Sheet1"]);

async function uploadData() {
  const chunkSize = 1000;

  /** ----------------------
   * STEP 1: Unique Customers & Items
   ---------------------- */
  const uniqueCustomersData = [
    ...new Map(
      sheet1.map((r) => [
        `${r.Customer_Name}--${r.Customer_Type}`, // unique key
        { name: r.Customer_Name, type: r.Customer_Type },
      ]),
    ).values(),
  ];

  const uniqueCustomers = [...new Set(uniqueCustomersData.map((r) => r.name))];
  const uniqueItemsData = [
    ...new Map(
      sheet1.map((r) => [
        r.Item_Name, // unique key
        r,
      ]),
    ).values(),
  ];
  const uniqueItems = [...new Set(uniqueItemsData.map((r) => r.Item_Name))];
  /** ----------------------
   * STEP 2: Fetch existing Customers & Items
   ---------------------- */
  // const existingCustomers = await db.customerProfile.findAll({
  //   where: { company_name: uniqueCustomers },
  //   attributes: ["id", "company_name", "customer_type_id"],
  // });
  const existingCustomers = await db.sequelize.query(
    `
    SELECT cpm.id, cpm.company_name, cpm.customer_type_id, mct.customer_type_name
    FROM CUSTOMER_PROFILE_MST cpm
    INNER JOIN MASTER_CUSTOMER_TYPE mct ON mct.id = cpm.customer_type_id
    WHERE cpm.company_name IN (:customers)
  `,
    {
      replacements: { customers: uniqueCustomers },
      type: db.Sequelize.QueryTypes.SELECT,
    },
  );

  const customerMap = {};
  existingCustomers.forEach((c) => {
    customerMap[c.company_name] = c;
  });

  let newCustomers = [];
  for (const row of uniqueCustomersData) {
    const name = row.name?.trim();
    const newTypeName = row.type?.trim();

    const existing = customerMap[name];

    if (existing) {
      // TYPE MISMATCH? Update needed
      if (existing.customer_type_name !== newTypeName) {
        // 1️⃣ Get new customer type ID
        const [typeRow] = await db.sequelize.query(
          `
          SELECT id FROM MASTER_CUSTOMER_TYPE
          WHERE customer_type_name = :typeName
          LIMIT 1
        `,
          {
            replacements: { typeName: newTypeName },
            type: db.Sequelize.QueryTypes.SELECT,
          },
        );

        if (typeRow) {
          // 2️⃣ Update customer profile with new type id
          await db.sequelize.query(
            `
            UPDATE CUSTOMER_PROFILE_MST
            SET customer_type_id = :newTypeId
            WHERE id = :customerId
          `,
            {
              replacements: {
                newTypeId: typeRow.id,
                customerId: existing.id,
              },
            },
          );

          console.log(
            `Updated customer type for ${existing.company_name} -> ${newTypeName}`,
          );
        }
      }
    } else {
      /** ----------------------
       * STEP 3: Insert missing Customers
       ---------------------- */
      const [typeRow] = await db.sequelize.query(
        `
          SELECT id FROM MASTER_CUSTOMER_TYPE
          WHERE customer_type_name = :typeName
          LIMIT 1
        `,
        {
          replacements: { typeName: newTypeName },
          type: db.Sequelize.QueryTypes.SELECT,
        },
      );

      if (typeRow) {
        // 2️⃣ Update customer profile with new type id

        const customer_code = btoa(Math.random().toString())
          .slice(0, 10)
          .toUpperCase();
        newCustomers.push({
          gst_in: null,
          company_name: name,
          entity_id: 1,
          customer_code,
          financial_year_id: 3,
          employee_id: 2,
          customer_type_id: typeRow.id,
        });
      }
    }
  }

  if (newCustomers.length > 0) {
    const inserted = await db.customerProfile.bulkCreate(newCustomers);
    inserted.forEach((c) => {
      customerMap[c.company_name] = c.dataValues;
    });
  }

  // const existingItems = await db.ItemMaster.findAll({
  //   where: { item_name: uniqueItems },
  //   attributes: ["id", "item_name", "asset_id", "sub_category_id"],
  // });
  const existingItems = await db.sequelize.query(
    `
    SELECT mi.id, mi.item_name, mi.item_code, mi.asset_id, mi.sub_category_id, ma.asset_category_name, msc.sub_category_name
    FROM MASTER_ITEM mi
    INNER JOIN MASTER_ASSET ma ON ma.id = mi.asset_id
    INNER JOIN MASTER_SUB_CATEGORY msc ON msc.id = mi.sub_category_id
    WHERE mi.item_name IN (:items)
  `,
    {
      replacements: { items: uniqueItems },
      type: db.Sequelize.QueryTypes.SELECT,
    },
  );

  const itemMap = {};
  existingItems.forEach((i) => {
    itemMap[i.item_code] = i;
  });

  let newItems = [];
  // For Items Addition or updation
  for (const row of uniqueItemsData) {
    const name = row.Item_Name?.trim();
    const code = row.Item_Code?.trim();
    const itemCategory = row.Item_Category?.trim();
    const itemSubCategory = row.Item_Sub_Category?.trim();

    const existing = itemMap[code];

    if (existing) {
      // TYPE MISMATCH? Update needed
      if (
        existing.item_code !== code &&
        existing.asset_category_name !== itemCategory &&
        existing.sub_category_name !== itemSubCategory
      ) {
        console.log(`Updated item type for ${existing.item_code} -> ${code}`);
      }
    } else {
      const assetRow = await db.sequelize.query(
        `
          SELECT id FROM MASTER_ASSET
          WHERE asset_category_name = :assetName
          LIMIT 1
        `,
        {
          replacements: { assetName: itemCategory },
          type: db.Sequelize.QueryTypes.SELECT,
        },
      );
      if (assetRow.length == 0) {
        db.asset
          .create({
            asset_category_name: itemCategory,
            asset_category_description: itemCategory,
            status: "ACTIVE",
            isDeleted: false,
            entity_id: 1,
          })
          .then((asset) => {
            assetRow = asset;
          });
      }
      const subCategoryRow = await db.sequelize.query(
        `
          SELECT id FROM MASTER_SUB_CATEGORY
          WHERE sub_category_name = :subCategoryName
          LIMIT 1
        `,
        {
          replacements: { subCategoryName: itemSubCategory },
          type: db.Sequelize.QueryTypes.SELECT,
        },
      );
      if (subCategoryRow.length == 0) {
        db.SubCategory.create({
          sub_category_name: itemSubCategory,
          item_category_id: assetRow[0].id,
          status: "ACTIVE",
          isDeleted: false,
          entity_id: 1,
          financial_year_id: 3,
        }).then((asset) => {
          subCategoryRow = asset;
        });
      }
      if (assetRow && subCategoryRow) {
        newItems.push({
          item_name: name,
          item_code: code,
          asset_id: assetRow[0].id,
          sub_category_id: subCategoryRow[0].id,
          mvp: row.DBP,
          isDeleted: false,
          entity_id: 1,
          financial_year_id: 3,
        });
      }
    }
  }

  /** ----------------------
   * STEP 4: Insert missing Items (optional)
   ---------------------- */
  // const newItems = uniqueItemsData
  //   .filter((item) => !itemMap[item.Item_Name])
  //   .map((item) => (item)); // default fallback

  if (newItems.length > 0) {
    const insertedItems = await db.ItemMaster.bulkCreate(newItems);
    insertedItems.forEach((i) => {
      itemMap[i.item_code] = i;
    });
  }

  /** ----------------------
   * STEP 5: Prepare price_master rows
   ---------------------- */
  const priceMasterRows = sheet1.map((r) => ({
    status: "ACTIVE",
    isDeleted: false,
    entity_id: 1,
    financial_year_id: 3,
    customer_type_id: customerMap[r.Customer_Name].customer_type_id,
    customer_id: customerMap[r.Customer_Name].id,
    category_id: itemMap[r.Item_Code]?.asset_id || 1,
    subcategory_id: itemMap[r.Item_Code]?.sub_category_id || 1,
    DBP: r.DBP,
    item_name: r.Item_Name,
    item_code: r.Item_Code,
  }));

  /** ----------------------
   * STEP 6: Skip duplicates in price_master
   ---------------------- */
  const uniqueCombinations = Array.from(
    new Map(
      priceMasterRows.map((r) => [
        `${r.customer_type_id}_${r.customer_id}_${r.category_id}_${r.subcategory_id}`,
        {
          customer_type_id: r.customer_type_id,
          customer_id: r.customer_id,
          category_id: r.category_id,
          subcategory_id: r.subcategory_id,
          entity_id: 1,
          financial_year_id: 3,
        },
      ]),
    ).values(),
  );

  const existingPriceMasters = await db.price_master.findAll({
    where: { [Op.or]: uniqueCombinations },
    attributes: [
      "customer_type_id",
      "customer_id",
      "category_id",
      "subcategory_id",
      "id",
    ],
  });

  const existingMap = {};
  if (existingPriceMasters.length > 0) {
    existingPriceMasters.forEach((p) => {
      existingMap[
        `${p.customer_type_id}_${p.customer_id}_${p.category_id}_${p.subcategory_id}`
      ] = p.id;
    });
  }

  const filteredPriceMasterRows = uniqueCombinations.filter((r) => {
    const key = `${r.customer_type_id}_${r.customer_id}_${r.category_id}_${r.subcategory_id}`;
    return !existingMap[key];
  });

  /** ----------------------
   * STEP 7: Bulk insert price_master
   ---------------------- */
  const priceMasterMap = {}; // map: customer_id + category + subcategory → price_master.id

  for (let i = 0; i < filteredPriceMasterRows.length; i += chunkSize) {
    const chunk = filteredPriceMasterRows.slice(i, i + chunkSize);
    const inserted = await db.price_master.bulkCreate(chunk, {
      returning: true,
    });
    inserted.forEach((p, index) => {
      const original = chunk[index];
      const key = `${p.customer_id}_${original.category_id}_${original.subcategory_id}`;
      priceMasterMap[key] = p.id;
    });
  }

  /** ----------------------
   * STEP 8: Prepare & insert priceMasterItem without duplicates
   ---------------------- */
  const priceItemsMap = {};
  const priceItems = [];

  sheet1.forEach((r) => {
    const customerId = customerMap[r.Customer_Name].id;
    const categoryId = itemMap[r.Item_Code]?.asset_id || 1;
    const subcategoryId = itemMap[r.Item_Code]?.sub_category_id || 1;
    const itemId = itemMap[r.Item_Code]?.id;

    if (!itemId) return; // skip invalid
    console.log(
      `${customerMap[r.Customer_Name].customer_type_id}_${customerId}_${categoryId}_${subcategoryId}`,
    );

    const priceMasterId =
      priceMasterMap[`${customerId}_${categoryId}_${subcategoryId}`] ||
      existingMap[
        `${customerMap[r.Customer_Name].customer_type_id}_${customerId}_${categoryId}_${subcategoryId}`
      ];

    if (!priceMasterId) return; // skip if no price_master exists

    const key = `${priceMasterId}_${itemId}`;
    if (!priceItemsMap[key]) {
      priceItemsMap[key] = true;
      priceItems.push({
        status: "ACTIVE",
        isDeleted: false,
        price_master_id: priceMasterId,
        discount_1: r["D1"],
        discount_2: r["D2"],
        discount_3: r["D3"],
        final_price: r.DBP,
        item_id: itemId,
        discount1Flat: null,
        discount2Flat: null,
        discount3Flat: null,
        rest_price: 0.0,
      });
    }
  });

  for (let i = 0; i < priceItems.length; i += chunkSize) {
    const chunk = priceItems.slice(i, i + chunkSize);
    await db.priceMasterItem.bulkCreate(chunk);
  }

  console.log("✅ Upload completed successfully!");
}

async function main() {
  try {
    // await uploadData();
    console.log("Upload completed!");
  } catch (err) {
    console.error("Upload failed:", err);
  }
}

// main();

app.get("/ping", (req, res) => {
  res.json({ message: "Welcome to ERP Application --> pong." });
});

app.use(
  "/uploaded_files",
  express.static(path.join(__dirname, "/uploaded_files")),
);
app.use(
  "/uploads/performa_invoices",
  express.static(path.join(__dirname, "/app/CRM/utils/pdfs")),
);
app.use(
  "/uploads/quotation_invoices",
  express.static(path.join(__dirname, "/app/CRM/utils/pdfs")),
);
app.use(
  "/generated_offer_letters",
  express.static(path.join(__dirname, "generated_offer_letters")),
);

//////////////// Use For Migration ////////////////////

global.extractModelFields = function (model) {
  if (!model || !model.rawAttributes) {
    throw new Error("Invalid Sequelize model passed");
  }
  const fields = {};

  Object.keys(model.rawAttributes).forEach((key) => {
    const attr = model.rawAttributes[key];

    const fieldDef = {
      type: attr.type, // keep actual Sequelize type
    };

    if (attr.allowNull !== undefined) fieldDef.allowNull = attr.allowNull;
    if (attr.primaryKey) fieldDef.primaryKey = true;
    if (attr.autoIncrement) fieldDef.autoIncrement = true;
    if (attr.defaultValue !== undefined)
      fieldDef.defaultValue = attr.defaultValue;
    if (attr.unique) fieldDef.unique = attr.unique;
    if (attr.comment) fieldDef.comment = attr.comment;
    if (attr.field) fieldDef.field = attr.field; // custom column name

    // Foreign key reference
    if (attr.references) {
      fieldDef.references = attr.references;
      if (attr.onUpdate) fieldDef.onUpdate = attr.onUpdate;
      if (attr.onDelete) fieldDef.onDelete = attr.onDelete;
    }

    // Validation rules (basic only — Sequelize supports complex ones too)
    if (attr.validate && Object.keys(attr.validate).length > 0) {
      fieldDef.validate = attr.validate;
    }

    fields[key] = fieldDef;
  });

  return {
    modelName: model.name,
    fields,
  };
};

async function migrateRBAC() {
  try {
    console.log("⏳ Starting RBAC migration...");

    // 1️⃣ Fetch Level 1: role module master
    const roleModules = await db.role_module_master.findAll();

    for (const role of roleModules) {
      const parentModule = await db.HRMS_RBAC_MODULE_MASTER.create({
        name: role.role_module_master_name,
        title: role.role_module_master_name,
        path: role.module_master_link,
        icon: role.module_master_icon,
        lastIcon: role.module_master_endIcon,
        parentId: null,
        order: role.mOrderBy,
        status: role.status === "ACTIVE",
      });

      const parentId = parentModule.id;

      // 2️⃣ Fetch Level 2: menu_master
      const menus = await db.menu_master.findAll({
        where: { role_module_master_id: role.role_module_master_id },
      });

      for (const menu of menus) {
        const childMenu = await db.HRMS_RBAC_MODULE_MASTER.create({
          name: menu.menu_master_name,
          title: menu.menu_title,
          path: menu.menu_master_link,
          icon: menu.menu_masters_icon,
          lastIcon: menu.menu_master_lastIcon,
          parentId: parentId,
          order: menu.sbOrderBy,
          status: menu.status === "ACTIVE",
        });

        const childId = childMenu.id;

        // 3️⃣ Fetch Level 3: submenu_master
        const submenus = await db.submenu_master.findAll({
          where: { menu_master_id: menu.menu_master_id },
        });

        for (const sub of submenus) {
          await db.HRMS_RBAC_MODULE_MASTER.create({
            name: sub.submenu_master_name,
            title: sub.submenu_master_name,
            path: sub.submenu_masters_link,
            icon: sub.submenu_masters_icon,
            lastIcon: null,
            parentId: childId,
            order: sub.smOrderBy,
            status: sub.status === "ACTIVE",
          });
        }
      }
    }

    console.log("✅ RBAC Migration completed successfully!");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  }
}

// migrateRBAC();

async function migratePermissionRole() {
  try {
    const modules = await db.HRMS_RBAC_MODULE_MASTER.findAll({
      where: { status: true },
      attributes: ["id"],
    });

    if (!modules?.length) {
      console.log("No modules found.");
      return;
    }

    const roleId = 1;

    const permissions = modules.map((mod) => ({
      read: true,
      write: true,
      remove: true,
      moduleId: mod.id,
      roleId: roleId,
      entityId: roleId,
    }));

    await db.HRMS_RBAC_ROLE_PERMISSION.bulkCreate(permissions, {
      ignoreDuplicates: true,
    });

    console.log(
      `Migrated ${permissions.length} module permissions for role ${roleId}.`,
    );
  } catch (error) {
    console.error("Error in migratePermissionRole:", error);
  }
}

// migratePermissionRole();

// Initialize routes
Routes.initializeRoutes(app);

///  curency_convert

async function updateCurrencyRates() {
  try {
    const response = await axios.get("https://open.er-api.com/v6/latest/INR");

    const rates = response.data.rates;

    const Currency_Type = ["INR", "USD", "EUR", "GBP", "CNY"];

    for (const symbol of Currency_Type) {
      if (rates[symbol] !== undefined) {
        await db.currency_convert.update(
          {
            rate: rates[symbol],
            updatedAt: new Date(),
          },
          {
            where: {
              Currency_Type: symbol,
            },
          },
        );

        console.log(`${symbol} updated => ${rates[symbol]}`);
      }
    }

    console.log("Currency rates updated successfully");
  } catch (error) {
    console.error("Currency update failed:", error.message);
  }
}
cron.schedule(
  "0 10 * * *",
  async () => {
    console.log("Currency Update Cron Running:", new Date());

    await updateCurrencyRates();
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  },
);
const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  console.log(` \u001b[1;32m Server is running on port ${PORT}. \u001b[0m`);
});

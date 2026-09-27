const mailQueue = require("./mailQueue");
const {
  sendPerformaInoviceMail,
  sendLinkForTransporterRequest,
  sendAdminApprovelTransporterRequest,
  sendLinkForCreateShippingAlert,
  sendLinkForShippingAlertHistory,
  sendMailPO,
} = require("./mail");

// ✅ Apply job options to the existing queue instance (don't re-create it)
mailQueue.defaultJobOptions = {
  attempts: 3,
  backoff: { type: "exponential", delay: 5000 },
  removeOnComplete: false,
  removeOnFail: false,
};

// ✅ Failure listener for logging
mailQueue.on("failed", (job, err) => {
  console.error(
    `❌ Mail job ${job.id} [${job.data.type}] failed after all retries:`,
    err.message,
  );
});

mailQueue.on("completed", (job) => {
  console.log(`✅ Mail job ${job.id} [${job.data.type}] completed`);
});

// ✅ Processor with try/catch so Bull can retry on failure
mailQueue.process(5, async (job) => {
  const { type } = job.data;

  console.log(`📤 Processing mail job ${job.id} [${type}]`);

  try {
    switch (type) {
      case "PERFORMA_INVOICE": {
        const {
          entity_id,
          contact_person_name,
          created_by_email,
          proposal_no,
          page_mode,
          fileName,
          pdfBase64,
        } = job.data;

        const pdfBuffer = Buffer.from(pdfBase64, "base64");

        await sendPerformaInoviceMail(
          entity_id,
          contact_person_name,
          created_by_email,
          proposal_no,
          { fileName, pdfBuffer },
          page_mode,
        );
        break;
      }
      case "SALES_BOOKING": {
        const {
          entity_id,
          contact_person_name,
          created_by_email,
          proposal_no,
          page_mode,
          fileName,
          pdfBase64,
        } = job.data;

        const pdfBuffer = Buffer.from(pdfBase64, "base64");

        await sendPerformaInoviceMail(
          entity_id,
          contact_person_name,
          created_by_email,
          proposal_no,
          { fileName, pdfBuffer },
          page_mode,
        );
        break;
      }

      case "TRANSPORTER_LINK": {
        const {
          transporter_email,
          contact_person_name,
          link,
          entity_id,
          planning_code,
        } = job.data;

        await sendLinkForTransporterRequest(
          transporter_email,
          contact_person_name,
          link,
          entity_id,
          planning_code,
        );
        break;
      }

      case "ADMIN_TRANSPORTER_ACCEPT": {
        const {
          transporter_email,
          contact_person_name,
          entity_id,
          planning_code,
          request_data,
          admin_status,
        } = job.data;

        await sendAdminApprovelTransporterRequest(
          transporter_email,
          contact_person_name,
          entity_id,
          planning_code,
          request_data,
          admin_status,
        );
        break;
      }

      case "CREATE_SHIPPING_ALERT_LINK": {
        const {
          vendor_email,
          vendor_name,
          link,
          entity_id,
          po_number,
          po_detail,
          entityId,
          item_detail,
          service_detail,
        } = job.data;

        await sendLinkForCreateShippingAlert(
          vendor_email,
          vendor_name,
          link,
          entity_id,
          po_number,
        );
        await sendMailPO(po_detail, entityId, item_detail, service_detail);
        break;
      }

      case "SHIPPING_ALERT_HISTORY_LINK": {
        const { vendor_email, vendor_name, link, entity_id, po_number } =
          job.data;

        await sendLinkForShippingAlertHistory(
          vendor_email,
          vendor_name,
          link,
          entity_id,
          po_number,
        );
        break;
      }

      default:
        // ✅ Throw on unknown type so it shows in failed queue, not silently ignored
        throw new Error(`Unknown mail type: ${type}`);
    }
  } catch (err) {
    console.error(`❌ Error in mail job ${job.id} [${type}]:`, err.message);
    throw err; // ✅ Re-throw so Bull marks job as failed and triggers retry
  }

  return true;
});

const cron = require('node-cron');
const db = require('../../models/index');
const logger = require('../../../logger/index');
const { Op } = require('sequelize');


const calculateSLMDepreciation = (purchaseValue, usefulLifeDays) => {
    const dailyRate = purchaseValue / usefulLifeDays;
    return parseFloat(dailyRate.toFixed(2));
};

const calculateWDVDepreciation = (bookValue, depreciationRate) => {
    const dailyRate = (bookValue * depreciationRate) / 365;
    return parseFloat(dailyRate.toFixed(2));
};

const runDepreciationJob = async () => {
    try {
        const today = new Date().toISOString().slice(0, 10);

        const [assets] = await db.sequelize.query(`SELECT GM.*,ACM.calculationMethod AS depreciationMethodName FROM GRN_MASTER AS GM
            LEFT JOIN ASSETCOMPANYDEPRECIATION_CALCULATIONMETHODS AS ACM ON ACM.id = GM.depreciationMethod
            WHERE GM.isDeleted=false and GM.status='ACTIVE' and GM.disposition_status IS NULL
`)

        for (const asset of assets) {
            const {
                depriciation_by,
                total_amount,
                accumulated_dep,
                accumulated_dep_manual,
                depreciationMethodName,
                depreciation_rate,
                useful_life_days,
                depriciated_value,
                purchase_date,
                item_use_date
            } = asset;
            const assetCurrentAmount = total_amount - accumulated_dep

            let depAmount = 0;
            let newCumulative = 0;
            let closingValue = 0;
            let depreciationStartDate;

            // Determine depreciation start date based on user's choice
            switch (depriciation_by) {
                case 'purchase_date':
                    depreciationStartDate = new Date(purchase_date);
                    break;
                case 'put_to_use_date':
                    depreciationStartDate = new Date(item_use_date);
                    break;
                case 'by_value':
                    // Use manually entered depreciation
                    depAmount = parseFloat(depriciated_value || 0);
                    newCumulative = parseFloat(accumulated_dep || 0) + depAmount;
                    closingValue = assetCurrentAmount - newCumulative;

                    await db.acdl.create({
                        grn_id:asset.id,
                        depreciationDate: today,
                        depAmount,
                        cumulativeDepreciation: newCumulative,
                        closingValue
                    });

                    await db.grnMaster.update({ accumulated_dep: newCumulative },{where:{id:asset.id}});
                    continue;
                default:
                    logger.warn(`Unknown depreciation_by type for asset ID ${asset.id}`);
                    continue;
            }

            // Skip if depreciation should not yet start
            if (!depreciationStartDate || new Date(today) < depreciationStartDate) {
                continue;
            }

            // Calculate depreciation based on selected method
            if (depreciationMethodName === 'SLM') {
                depAmount = calculateSLMDepreciation(assetCurrentAmount, useful_life_days);
            } else if (depreciationMethodName === 'WDV') {
                const bookValue = assetCurrentAmount - (accumulated_dep || 0);
                depAmount = calculateWDVDepreciation(bookValue, depreciation_rate);
            } else {
                logger.warn(`Unknown depreciation_method for asset ID ${asset.id}`);
                continue;
            }

            newCumulative = parseFloat(accumulated_dep || 0) + depAmount;
            closingValue = assetCurrentAmount - newCumulative;

            // Save depreciation entry
            await db.acdl.create({
                grn_id:asset.id,
                depreciationDate: today,
                depAmount,
                cumulativeDepreciation: newCumulative,
                closingValue
            });

            // Update accumulated depreciation in asset
            await db.grnMaster.update({ accumulated_dep: newCumulative },{where:{id:asset.id}});
        }

        logger.info(`[DepreciationJob] Completed at ${new Date().toISOString()}`);
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error('[DepreciationJob] Error:', error);
    }
};


// Schedule job to run at 2:00 AM every day
cron.schedule('0 2 * * *', runDepreciationJob);

module.exports = runDepreciationJob;

function calculateDepreciation(purchaseCost, salvageValue, usefulLife, putToUseDate, method) {
    const putToUse = new Date(putToUseDate);
    let results = [];
    let cumulativeDepYearFraction = 0; 

    if (method === 'SLM') {
        const netValue = purchaseCost - salvageValue;
        const annualDepreciation = netValue / usefulLife;
        let cumulativeDepreciation = 0;

        let financialYearStart = new Date(putToUse.getFullYear(), 3, 1);
        let financialYearEnd = new Date(financialYearStart.getFullYear() + 1, 2, 31);
        let netClosingValueLimit = ((netValue*salvageValue)/100);
        for (let year = 1; year <= usefulLife; year++) {
            let depPeriodDays, depYearFraction;
            if (year === 1) {
                depPeriodDays = Math.max(Math.ceil((financialYearEnd - putToUse) / (1000 * 60 * 60 * 24)) + 1, 0);
                depYearFraction = depPeriodDays > 0 ? Math.abs(depPeriodDays / 365) : 0; 
            } else {
                depPeriodDays = 365;
                depYearFraction = 1;
            }
            let depAmount = annualDepreciation * depYearFraction;
            cumulativeDepreciation += depAmount;
            let closingValue = netValue - cumulativeDepreciation;
            cumulativeDepYearFraction += depYearFraction; 
            if (closingValue < netClosingValueLimit) {
                const prev = results[results.length - 1];
                closingValue = prev ? parseFloat(prev.closingValue) : 0;
                cumulativeDepreciation = prev ? parseFloat(prev.cumulativeDepreciation) : 0;
                depAmount = parseFloat(0.00);

            }
            results.push({
                financialYear: `${financialYearStart.getFullYear()}-${financialYearStart.getFullYear() + 1}`,
                depPeriodDays: depPeriodDays,
                depYearFraction: depYearFraction.toFixed(2),
                depAmount: depAmount.toFixed(2),
                cumulativeDepreciation: cumulativeDepreciation.toFixed(2),
                closingValue: closingValue.toFixed(2),
                cumulativeDepYearFraction: cumulativeDepYearFraction.toFixed(2) 
            });

            financialYearStart.setFullYear(financialYearStart.getFullYear() + 1);
        }

    } else if (method === 'WDV') {
        const netValue = purchaseCost - salvageValue;
        const amountOfDepreciation = netValue / usefulLife;
        const depreciationRate = (amountOfDepreciation / purchaseCost) * 100;
        const rateOfDepreciation = depreciationRate / 100;      
        let currentValue = purchaseCost;
        let cumulativeDepreciation = 0;

        let financialYearStart = new Date(putToUse.getFullYear(), 3, 1);
        let financialYearEnd = new Date(financialYearStart.getFullYear() + 1, 2, 31);

        for (let year = 1; year <= usefulLife; year++) {
            let depPeriodDays, depYearFraction;
            if (year === 1) {
                depPeriodDays = Math.max(Math.floor((financialYearEnd - putToUse) / (1000 * 60 * 60 * 24)) + 1, 0);
                depYearFraction = depPeriodDays > 0 ? Math.abs(depPeriodDays / 365) : 0; 
            } else {
                depPeriodDays = 365;
                depYearFraction = 1;
            }

            const depAmount = currentValue * rateOfDepreciation * depYearFraction;
            cumulativeDepreciation += depAmount;
            currentValue -= depAmount;

            if (currentValue < salvageValue) {
                currentValue = salvageValue;
            }

            cumulativeDepYearFraction += depYearFraction; 

            results.push({
                financialYear: `${financialYearStart.getFullYear()}-${financialYearStart.getFullYear() + 1}`,
                depPeriodDays: depPeriodDays,
                depYearFraction: depYearFraction.toFixed(2),
                depAmount: depAmount.toFixed(2),
                cumulativeDepreciation: cumulativeDepreciation.toFixed(2),
                closingValue: currentValue.toFixed(2),
                cumulativeDepYearFraction: cumulativeDepYearFraction.toFixed(2)
            });

            financialYearStart.setFullYear(financialYearStart.getFullYear() + 1);
        }
    }

    return results;
}


// monhts wise calculate depreciation

function calculateMonthlyDepreciationYearWise(purchaseCost, salvageValue, usefulLife, putToUseDate, method) {
    const putToUse = new Date(putToUseDate);
    const totalMonths = usefulLife * 12;
    let results = [];

    let cumulativeDepreciation = 0;
    let cumulativeDepMonthFraction = 0;
    let netValue = purchaseCost - salvageValue;

    const isBeforeApril = putToUse.getMonth() < 3; // Jan, Feb, Mar
    let financialYear = isBeforeApril
        ? `${putToUse.getFullYear() - 1}-${putToUse.getFullYear()}`
        : `${putToUse.getFullYear()}-${putToUse.getFullYear() + 1}`;

    if (method === 'SLM') {
        const monthlyDepreciation = netValue / totalMonths;

        for (let i = 0; i < totalMonths; i++) {
            const currentDate = new Date(putToUse);
            currentDate.setMonth(currentDate.getMonth() + i);
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

            let depPeriodDays = Math.ceil((endOfMonth - startOfMonth + 1) / (1000 * 60 * 60 * 24));
            let depMonthFraction = depPeriodDays / 365;

            let depAmount = monthlyDepreciation;
            cumulativeDepreciation += depAmount;

            let closingValue = purchaseCost - cumulativeDepreciation;
            if (closingValue < salvageValue) {
                closingValue = salvageValue;
                depAmount = 0;
            }

            cumulativeDepMonthFraction += 1;

            const fyStart = currentDate.getMonth() < 3 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
            const fyEnd = fyStart + 1;
            financialYear = `${fyStart}-${fyEnd}`;

            results.push({
                financialYear: financialYear,
                month: currentDate.toLocaleString('default', { month: 'short', year: 'numeric' }),
                depPeriodDays: depPeriodDays,
                depMonthFraction: depMonthFraction.toFixed(4),
                depAmount: depAmount.toFixed(2),
                cumulativeDepreciation: cumulativeDepreciation.toFixed(2),
                closingValue: closingValue.toFixed(2),
                cumulativeDepMonthFraction: cumulativeDepMonthFraction.toFixed(2)
            });
        }
    } else if (method === 'WDV') {
        const annualRate = 1 - Math.pow((salvageValue / purchaseCost), 1 / usefulLife);
        const monthlyRate = 1 - Math.pow((1 - annualRate), 1 / 12);

        let currentValue = purchaseCost;

        for (let i = 0; i < totalMonths; i++) {
            const currentDate = new Date(putToUse);
            currentDate.setMonth(currentDate.getMonth() + i);
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

            let depPeriodDays = Math.ceil((endOfMonth - startOfMonth + 1) / (1000 * 60 * 60 * 24));
            let depMonthFraction = depPeriodDays / 365;

            let depAmount = currentValue * monthlyRate;
            cumulativeDepreciation += depAmount;
            currentValue -= depAmount;

            if (currentValue < salvageValue) {
                currentValue = salvageValue;
                depAmount = 0;
            }

            cumulativeDepMonthFraction += 1;

            const fyStart = currentDate.getMonth() < 3 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
            const fyEnd = fyStart + 1;
            financialYear = `${fyStart}-${fyEnd}`;

            results.push({
                financialYear: financialYear,
                month: currentDate.toLocaleString('default', { month: 'short', year: 'numeric' }),
                depPeriodDays: depPeriodDays,
                depMonthFraction: depMonthFraction.toFixed(4),
                depAmount: depAmount.toFixed(2),
                cumulativeDepreciation: cumulativeDepreciation.toFixed(2),
                closingValue: currentValue.toFixed(2),
                cumulativeDepMonthFraction: cumulativeDepMonthFraction.toFixed(2)
            });
        }
    }

    return results;
}


module.exports = { calculateDepreciation ,calculateMonthlyDepreciationYearWise };

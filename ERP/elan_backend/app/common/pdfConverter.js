const puppeteer = require('puppeteer');

async function generatePDF(htmlContent) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: true,
        margin: {
            top: '20px',
            bottom: '55px',   // footer ke liye jagah chahiye, warna content overlap hoga
            left: '15px',
            right: '15px'
        },
        headerTemplate: `<div></div>`, // blank header — agar top pe kuch chahiye toh yahan HTML daal do
        footerTemplate: `
            <div style="width:100%; font-size:9px; text-align:center; color:#555; font-family: Arial, sans-serif; padding-top:4px;">
                Page <span class="pageNumber"></span> of <span class="totalPages"></span>
            </div>
        `
    });

    await browser.close();
    return pdfBuffer;
}

module.exports = { generatePDF };
// const puppeteer = require('puppeteer');

// async function generatePDF(htmlContent) {
//     const browser = await puppeteer.launch({
//         headless: true,  
//         args: ['--no-sandbox', '--disable-setuid-sandbox']
//     });

//     const page = await browser.newPage();
//     await page.setContent(htmlContent);
//     const pdfBuffer = await page.pdf({ format: 'A4' });

//     await browser.close();
//     return pdfBuffer;
// }

// module.exports = { generatePDF };

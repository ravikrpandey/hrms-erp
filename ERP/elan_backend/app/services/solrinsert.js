const fs = require('fs');
const solr = require('solr-client');
const mammoth = require('mammoth'); 
const pdfParse = require('pdf-parse'); 
const { join } = require('path');
const path = require('path');


const solrClient = solr.createClient({
    // host: '127.0.0.1',
    host: '13.201.10.123',
    port: '8983',
    core: 'erp_product',
});


async function extractTextFromPdf(pdfPath) {
    const pdfBuffer = fs.readFileSync(pdfPath);
    return pdfParse(pdfBuffer).then((data) => data.text);
}


async function extractTextFromDocx(docxPath) {
    return mammoth.extractRawText({ path: docxPath })
        .then((result) => result.value)
        .catch((err) => {
            throw err;
        });
}

async function sendToSolr(documentId, content) {
    const solrDoc = {
        id: documentId, 
        textcontent: content, 
    };

    try {
       
        await solrClient.add(solrDoc);

       
        await solrClient.commit();
    } catch (err) {
        console.error("Error interacting with Solr:", err);
        throw err; 
    }
}


async function processFileAndSendToSolr(filePath, documentId) {
    try {
        let textContent;

        const appDir = path.join(__dirname, `../../${filePath}`);
        console.log("__dirnamegf", __dirname)
        const fileType = path.extname(filePath).substring(1);
        if (fileType === 'pdf') {
            textContent = await extractTextFromPdf(appDir);
        } else if (fileType === 'docx') {
            textContent = await extractTextFromDocx(appDir);
        } else {
            throw new Error('Unsupported file type. Only PDF and DOCX are supported.');
        }

        
        textContent = textContent.replace(/\n/g, ' ');

        
        textContent = textContent.replace(/[\t\r\f\v\x00-\x1F\x7F]/g, ' ');

        
        textContent = textContent.replace(/[^a-zA-Z0-9\s@-]/g, ' ');

        const solrResponse = await sendToSolr(documentId, textContent);
        console.log('Data sent to Solr successfully:', solrResponse);
    } catch (err) {
        console.error('Error processing file or sending to Solr:', err);
    }
}

module.exports = { processFileAndSendToSolr };

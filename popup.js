import apiKeys from "./hidden.js";
const mistralApiKey = apiKeys.mistralApiKey;
const geminiApiKey = apiKeys.geminiApiKey;

document.getElementById('file-upload').addEventListener('change', async (event) => {
    // Get fileUploaded, returns file object at index 0
    const fileUploaded = event.target.files[0];
    if (fileUploaded == null) {
        return;
    }

    // Create form object for PDF send to OCR API
    const form = new FormData();
    form.append('purpose', 'ocr');
    form.append('file', new File([fileUploaded], `${fileUploaded.name}`));

    // Send to Mistral and get structured markdown
    let ocrJson = await PDFToJson(form);

    // Combine all markdown content into one string
    let markdownExport = "";
    for (const element of ocrJson.pages) {
        markdownExport += element.markdown + " ";
    }

    // Send combined markdown to Gemini for CSV generation
    const geminiJson = await JsonToCSV(markdownExport);
    const geminiResponse = geminiJson.candidates[0].content.parts[0].text;

    // Download the result as a .csv file
    createFileAndDownload("downloadable.csv", geminiResponse);
});

/**
 * Convert a PDF to a JSON object
 * 
 * @param {FormData} form 
 * @returns {Promise<Object>}
 */

async function PDFToJson(form) {
    const uploadedPDF = await fetch('https://api.mistral.ai/v1/files', {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${mistralApiKey}`
        },
        body: form,
    });

    const PDFJson = await uploadedPDF.json();

    const signedURLResponse = await fetch(`https://api.mistral.ai/v1/files/${PDFJson.id}/url?expiry=24`, {
    method: 'GET',
    headers: {
        Accept: "application/json",
        "Authorization": `Bearer ${mistralApiKey}`
        },
    });

    const responseJSON = await signedURLResponse.json();

    const ocrResponse = await fetch('https://api.mistral.ai/v1/ocr', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${mistralApiKey}`
        },
        body: JSON.stringify({
            model: "mistral-ocr-latest",
            document: {
                type: "document_url",
                document_url: responseJSON.url
            }
        }),
    });

    const ocrJSON = await ocrResponse.json();

    return ocrJSON;
}

async function JsonToCSV(markdownExport) {
    const generateContent = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${geminiApiKey}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `Extract all assignments and due dates from the following syllabus.

Return the results in CSV format with exactly these columns:
Due Date, Class, Assignment Name, Assignment Type, Checkbox

Include one row per assignment.
Leave missing information blank.
Return only valid CSV data, without markdown code fences or explanations.

Syllabus:
${markdownExport}`
                            }
                        ]
                    }
                ]
            })
        }
    );

    const responseJSON = await generateContent.json();

    return responseJSON;
}

function createFileAndDownload(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    const p = document.createElement('p');
    p.innerHTML = filename;
    link.append(p);
}
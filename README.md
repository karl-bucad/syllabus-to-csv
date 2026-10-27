# MasterList — Syllabus to CSV Chrome Extension

MasterList is a JavaScript Chrome extension designed to help students organize their coursework by extracting assignments and due dates from PDF syllabi and converting them into a downloadable CSV file.

This project was developed as part of the Imagine Software Club's guided learning tutorials.

## Features

- Upload a PDF syllabus through a Chrome extension popup.
- Use Mistral OCR to extract text from PDF documents.
- Combine extracted text from multiple pages.
- Use Google Gemini to identify assignments, due dates, and assignment types.
- Generate CSV-formatted assignment data.
- Create a downloadable CSV file for organizing coursework.

## Technologies Used

- **JavaScript** — Application logic and asynchronous API requests
- **HTML** — Chrome extension popup interface
- **Chrome Extensions API** — Browser extension environment
- **Mistral OCR API** — PDF text extraction
- **Google Gemini API** — AI-powered assignment extraction and CSV generation

## How It Works

1. The user selects a PDF syllabus in the extension popup.
2. The PDF is uploaded to Mistral for OCR processing.
3. Text extracted from each page is combined into a single string.
4. The combined text is sent to Gemini to identify assignments and deadlines.
5. Gemini returns CSV-formatted data.
6. The extension creates a link to download the generated CSV file.

The CSV is designed to contain these columns:

`Due Date, Class, Assignment Name, Assignment Type, Checkbox`

## Installation and Setup

1. Clone or download this repository.
2. Create a file named `hidden.js` in the project folder.
3. Add your own Mistral and Gemini API keys using this structure:

```javascript
export default {
    mistralApiKey: "YOUR_MISTRAL_API_KEY",
    geminiApiKey: "YOUR_GEMINI_API_KEY"
};
```

4. Open Google Chrome and navigate to `chrome://extensions/`.
5. Enable **Developer mode**.
6. Click **Load unpacked** and select the project folder.
7. Open the extension and select a PDF syllabus.

**Security note:** `hidden.js` is excluded from Git using `.gitignore`. This prevents accidental commits but does not securely protect API keys in a distributed Chrome extension. This project is intended for local educational use.

## Current Status

The core functionality from the tutorial has been implemented.

The extension's interface and PDF upload process have been tested. However, complete PDF-to-CSV functionality has not yet been verified because Mistral OCR requests returned an HTTP 429 rate-limit error associated with API access restrictions.

Additional testing and error handling are needed before the extension can be considered fully functional.

## Future Improvements

- Add error handling and loading indicators.
- Support local PDF text extraction to reduce reliance on paid OCR services.
- Allow users to review and edit extracted assignments.
- Export assignments directly to Google Sheets.
- Support additional syllabus formats.

## Acknowledgments

Built by following Aidan Keighron's [Syllabus to CSV tutorial](https://aidankeighron.github.io/educational-website/posts/Syllabus-To-CSV/) through the Imagine Software Club.

This project was created for hands-on practice with JavaScript, browser extensions, asynchronous programming, and external APIs.

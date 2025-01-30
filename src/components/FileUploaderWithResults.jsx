import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import mammoth from "mammoth";
import * as pdfjs from "pdfjs-dist";

// Set the correct worker version for version 4.10.38
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const FileUploaderWithResults = () => {
  const [file, setFile] = useState(null);
  const [extractedData, setExtractedData] = useState({
    emails: [],
    passwords: [],
  });
  const [loading, setLoading] = useState(false); // Track loading state

  const extractTextFromFile = async (file) => {
    try {
      toast.info("Processing file...");
      setLoading(true);

      if (file.type === "application/pdf") {
        extractTextFromPDF(file);
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        extractTextFromDOCX(file);
      } else {
        toast.error("Unsupported file format. Please upload a PDF or DOCX.");
      }
    } catch (error) {
      toast.error("Error processing file.");
      console.error(error);
      setLoading(false);
    }
  };

  const extractTextFromPDF = async (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const typedArray = new Uint8Array(reader.result);
      try {
        const pdf = await pdfjs.getDocument({ data: typedArray }).promise;

        let extractedText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();

          textContent.items.forEach((item) => {
            extractedText += item.str + " ";
          });
        }

        console.log("Extracted Text from PDF: ", extractedText);
        toast.success("Text extracted from PDF!");
        findEmailPassword(extractedText);
      } catch (error) {
        toast.error("Error extracting text from PDF.");
        console.error(error);
        setLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const extractTextFromDOCX = async (file) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = await mammoth.extractRawText({
        arrayBuffer: event.target.result,
      });
      console.log("Extracted Text from DOCX: ", result.value);
      toast.success("Text extracted from DOCX!");
      findEmailPassword(result.value);
    };
    reader.readAsArrayBuffer(file);
  };

  const findEmailPassword = (text) => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const passwordRegex = /(?:password|pwd)[\s:]*([^\s]+)/gi;

    const emails = text.match(emailRegex) || [];
    const passwords =
      text.match(passwordRegex)?.map((match) => match.split(":")[1]?.trim()) ||
      [];

    console.log("Emails found: ", emails);
    console.log("Passwords found: ", passwords);

    if (emails.length === 0 && passwords.length === 0) {
      toast.warning("No email or password found.");
    } else {
      toast.success("Email and/or password found!");
    }

    setExtractedData({ emails, passwords });
    setLoading(false); // Stop loading once data is extracted
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    extractTextFromFile(uploadedFile);
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-md mx-auto">
      {/* File upload input */}
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileChange}
        className="file:bg-blue-600 file:text-white file:px-6 file:py-3 file:border-none file:rounded-lg file:cursor-pointer file:hover:bg-blue-700 transition-all ease-in-out duration-200"
      />

      {/* Loading and Error States */}
      {loading && <div className="text-xl text-blue-500">Processing...</div>}

      {/* Display Extracted Results */}
      {!loading && extractedData.emails.length > 0 && (
        <div className="mt-6 p-6 border rounded-lg bg-gradient-to-r from-blue-100 to-blue-50 shadow-lg w-full">
          <h2 className="text-lg font-bold text-blue-600 mb-2">
            Extracted Information:
          </h2>
          <div>
            <p className="font-semibold text-gray-700">Emails:</p>
            <ul className="list-disc ml-6 text-blue-700">
              {extractedData.emails.map((email, index) => (
                <li key={index}>{email}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <p className="font-semibold text-gray-700">Passwords:</p>
            <ul className="list-disc ml-6 text-green-700">
              {extractedData.passwords.map((password, index) => (
                <li key={index}>{password}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* If no results are found */}
      {!loading &&
        extractedData.emails.length === 0 &&
        extractedData.passwords.length === 0 && (
          <div className="mt-6 p-6 border rounded-lg bg-red-100 text-red-700 w-full text-center">
            No emails or passwords found.
          </div>
        )}
    </div>
  );
};

export default FileUploaderWithResults;

import FileUploaderWithResults from "./components/FileUploaderWithResults";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6">
        File Scanner App
      </h1>
      <FileUploaderWithResults />
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default App;

// import { useState } from "react";
// import FileUploader from "./components/FileUploader";
// import ResultDisplay from "./components/ResultDisplay";
// import { ToastContainer } from "react-toastify";

// const App = () => {
//   const [extractedData, setExtractedData] = useState({
//     emails: [],
//     passwords: [],
//   });

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
//       <h1 className="text-2xl font-bold text-blue-600 mb-6">
//         File Scanner App
//       </h1>
//       <FileUploader onExtracted={setExtractedData} />
//       <ResultDisplay data={extractedData} />
//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// };

// export default App;

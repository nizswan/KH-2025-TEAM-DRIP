import { useState } from "react";

export default function AttachFile({ onFileSelect, selectedFile, onClearFile }) {
    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            onFileSelect(file);
            console.log("File selected:", file.name);
        }
        // Reset the input so the same file can be selected again
       // event.target.value = '';
    };


    return (
        <div className="mt-8">
            <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                className="hidden"
                accept=".txt"
            />
            <label
                htmlFor="file-upload"
                className="absolute right-125 transform-x-10 -translate-y-1/2 z-10 cursor-pointer inline-block transition-all duration-300 hover:drop-shadow-[0_0_20px_rgba(0,0,0,0.9)]"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="40" fill="black" />
                    <path d="M49.375 27.5V51.458C49.375 53.668 48.497 55.788 46.934 57.351C45.372 58.914 43.252 59.792 41.042 59.792C38.832 59.792 36.712 58.914 35.149 57.351C33.586 55.788 32.708 53.668 32.708 51.458V25.417C32.708 24.035 33.257 22.71 34.234 21.734C35.211 20.757 36.535 20.208 37.917 20.208C39.298 20.208 40.623 20.757 41.6 21.734C42.576 22.71 43.125 24.035 43.125 25.417V47.292C43.125 47.844 42.906 48.374 42.515 48.765C42.124 49.155 41.594 49.375 41.042 49.375C40.489 49.375 39.959 49.155 39.569 48.765C39.178 48.374 38.958 47.844 38.958 47.292V27.5H35.833V47.292C35.833 48.673 36.382 49.998 37.359 50.974C38.336 51.951 39.66 52.5 41.042 52.5C42.423 52.5 43.748 51.951 44.725 50.974C45.701 49.998 46.25 48.673 46.25 47.292V25.417C46.25 23.206 45.372 21.087 43.809 19.524C42.247 17.961 40.127 17.083 37.917 17.083C35.707 17.083 33.587 17.961 32.024 19.524C30.461 21.087 29.583 23.206 29.583 25.417V51.458C29.583 54.497 30.79 57.412 32.94 59.561C35.088 61.709 38.003 62.917 41.042 62.917C44.081 62.917 46.995 61.709 49.144 59.561C51.293 57.412 52.5 54.497 52.5 51.458V27.5H49.375Z" fill="white" />
                </svg>
            </label>

            {/* Show selected file name */}
            {selectedFile && (
                <p className="mt-3 text-sm">
                    Selected: {selectedFile.name}
                </p>
            )}
        </div>
    );
}
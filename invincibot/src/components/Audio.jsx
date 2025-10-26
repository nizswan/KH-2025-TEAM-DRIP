export default function AudioPlayer() {
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("Selected file:", file.name);
        }
    };

    return (
        <div className="mt-8 flex justify-center">
            <input
                // type="file"
                // id="file-upload"
                onChange={handleFileChange}
                className="hidden"
                accept=".mp3, .wav"
            />
            <button
                type="button"
                onClick={() => document.getElementById().click()}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="40" fill="black" />
                    <g transform="translate(25,20) scale(1.2)">
                        <path
                            d="M14.5833 0C16.2409 0 17.8306 0.65848 19.0028 1.83058C20.1749 3.00269 20.8333 4.5924 20.8333 6.25V18.75C20.8333 20.4076 20.1749 21.9973 19.0028 23.1694C17.8306 24.3415 16.2409 25 14.5833 25C12.9257 25 11.336 24.3415 10.1639 23.1694C8.99181 21.9973 8.33333 20.4076 8.33333 18.75V6.25C8.33333 4.5924 8.99181 3.00269 10.1639 1.83058C11.336 0.65848 12.9257 0 14.5833 0ZM29.1667 18.75C29.1667 26.1042 23.7292 32.1667 16.6667 33.1875V39.5833H12.5V33.1875C5.4375 32.1667 0 26.1042 0 18.75H4.16667C4.16667 21.5127 5.26413 24.1622 7.21764 26.1157C9.17114 28.0692 11.8207 29.1667 14.5833 29.1667C17.346 29.1667 19.9955 28.0692 21.949 26.1157C23.9025 24.1622 25 21.5127 25 18.75H29.1667Z"
                            fill="white"
                        />
                    </g>
                </svg>
            </button>
        </div>
    );
}
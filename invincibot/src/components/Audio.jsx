export default function AudioPlayer() {
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("Selected file:", file.name);
        }
    };

    return (
        <div className="mt-8">
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
                className="cursor-pointer inline-block transition-all duration-300 hover:drop-shadow-[0_0_20px_rgba(0,0,0,0.9)]"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
                 <circle cx="25" cy="25" r="25" fill="black" />
                    <path d="M24.9998 4.16666C26.6574 4.16666 28.2472 4.82514 29.4193 5.99724C30.5914 7.16934 31.2498 8.75905 31.2498 10.4167V22.9167C31.2498 24.5743 30.5914 26.164 29.4193 27.3361C28.2472 28.5082 26.6574 29.1667 24.9998 29.1667C23.3422 29.1667 21.7525 28.5082 20.5804 27.3361C19.4083 26.164 18.7498 24.5743 18.7498 22.9167V10.4167C18.7498 8.75905 19.4083 7.16934 20.5804 5.99724C21.7525 4.82514 23.3422 4.16666 24.9998 4.16666ZM39.5832 22.9167C39.5832 30.2708 34.1457 36.3333 27.0832 37.3542V43.75H22.9165V37.3542C15.854 36.3333 10.4165 30.2708 10.4165 22.9167H14.5832C14.5832 25.6793 15.6806 28.3288 17.6341 30.2824C19.5876 32.2359 22.2372 33.3333 24.9998 33.3333C27.7625 33.3333 30.412 32.2359 32.3655 30.2824C34.319 28.3288 35.4165 25.6793 35.4165 22.9167H39.5832Z" fill="white" />
                </svg>
            </button>
        </div>
    );
}
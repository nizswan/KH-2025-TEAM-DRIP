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
                <svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="40" fill="black" />
                    <path d="M40 22.1667C41.6576 22.1667 43.2474 22.8251 44.4195 23.9972C45.5916 25.1693 46.25 26.7591 46.25 28.4167V40.9167C46.25 42.5743 45.5916 44.164 44.4195 45.3361C43.2474 46.5082 41.6576 47.1667 40 47.1667C38.3424 47.1667 36.7527 46.5082 35.5806 45.3361C34.4085 44.164 33.75 42.5743 33.75 40.9167V28.4167C33.75 26.7591 34.4085 25.1693 35.5806 23.9972C36.7527 22.8251 38.3424 22.1667 40 22.1667ZM54.5834 40.9167C54.5834 48.2708 49.1459 54.3333 42.0834 55.3542V61.75H37.9167V55.3542C30.8542 54.3333 25.4167 48.2708 25.4167 40.9167H29.5834C29.5834 43.6793 30.6808 46.3288 32.6343 48.2824C34.5878 50.2359 37.2374 51.3333 40 51.3333C42.7627 51.3333 45.4122 50.2359 47.3657 48.2824C49.3192 46.3288 50.4167 43.6793 50.4167 40.9167H54.5834Z" fill="white"/>
                </svg>
            </button>
        </div>
    );
}
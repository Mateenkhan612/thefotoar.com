var swiper = new Swiper(".mySwiper", {
    slidesPerView: 5,
    spaceBetween: 50,
    loop: true,
    centeredSlides: true,
    autoplay: {
        delay: 0,
        disableOnInteraction: false,
    },
    speed: 4000,
    breakpoints: {
        768: { slidesPerView: 3 },
        480: { slidesPerView: 2 },
        320: { slidesPerView: 1 },
    }
});
// Feather Icons
feather.replace();

// Toggle Mobile Menu
document.getElementById("mobile-menu-button").addEventListener("click", function () {
    var menu = document.getElementById("mobile-menu");
    if (menu.classList.contains("hidden")) {
        menu.classList.remove("hidden");
        setTimeout(() => {
            menu.classList.remove("opacity-0", "scale-95");
            menu.classList.add("opacity-100", "scale-100");
        }, 10);
    } else {
        menu.classList.remove("opacity-100", "scale-100");
        menu.classList.add("opacity-0", "scale-95");
        setTimeout(() => {
            menu.classList.add("hidden");
        }, 300);
    }
});


// Dark Mode Toggle Functionality
const htmlElement = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const themeToggleMobile = document.getElementById("theme-toggle-mobile");

// Check for saved theme preference or default to light mode
const savedTheme = localStorage.getItem("theme") || "light";
if (savedTheme === "dark") {
    htmlElement.classList.add("dark");
}

// Toggle theme on click
const toggleTheme = () => {
    if (htmlElement.classList.contains("dark")) {
        htmlElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
    } else {
        htmlElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
    }
};

// Add event listeners to both toggle buttons
themeToggle.addEventListener("click", toggleTheme);
themeToggleMobile.addEventListener("click", toggleTheme);

// Configure Tailwind CSS to enable dark mode using the 'class' strategy
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {},
    },
};

// Merge Page JS
let pictures = [];
let videos = [];

// Handle drag-and-drop events
function handleDragOver(event) {
    event.preventDefault();
    event.target.closest('.border-dashed').classList.add('drag-over');
}

function handleDragLeave(event) {
    event.target.closest('.border-dashed').classList.remove('drag-over');
}

function handleDrop(event, type, index) {
    event.preventDefault();
    event.target.closest('.border-dashed').classList.remove('drag-over');
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
        const validFiles = validateFiles(files, type);
        if (validFiles.length > 0) {
            displayPreview(validFiles, type);
        }
    }
}

// Handle file selection (for click-to-upload)
function handleFileSelect(event, type, index) {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
        const validFiles = validateFiles(files, type);
        if (validFiles.length > 0) {
            displayPreview(validFiles, type);
        }
        // Clear the input value to allow re-uploading the same file
        event.target.value = '';
    }
}

// Validate files based on type
function validateFiles(files, type) {
    const validFiles = [];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/mov', 'video/avi'];

    files.forEach((file, index) => {
        if (type === 'picture') {
            if (file.type.startsWith('image/')) {
                validFiles.push(file);
            } else {
                alert(`File "${file.name}" is not a valid image. Only image files are allowed for pictures.`);
            }
        } else if (type === 'video') {
            if (file.type.startsWith('video/') && validVideoTypes.includes(file.type.toLowerCase())) {
                validFiles.push(file);
            } else {
                alert(`File "${file.name}" is not a valid video. Only video files (e.g., mp4, webm, ogg, mov, avi) are allowed for videos.`);
            }
        }
    });

    return validFiles;
}

// Display preview of uploaded files
function displayPreview(files, type) {
    const previewContainer = document.getElementById('preview-container-0');
    previewContainer.classList.remove('hidden');

    if (type === 'picture') {
        pictures = pictures.concat(files);
        updatePicturePreviews();
    } else if (type === 'video') {
        videos = videos.concat(files);
        updateVideoPreviews();
    }
}

function updatePicturePreviews() {
    const pictureContainer = document.getElementById('picture-preview-container');
    pictureContainer.innerHTML = '';
    pictures.forEach((file, index) => {
        const div = document.createElement('div');
        div.className = 'relative';
        div.innerHTML = `
                    <img src="${URL.createObjectURL(file)}" class="w-full h-32 object-cover rounded-lg" alt="Picture Preview">
                    <button onclick="removeFile('picture', ${index})" 
                        class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        ×
                    </button>
                `;
        pictureContainer.appendChild(div);
    });
}

function updateVideoPreviews() {
    const videoContainer = document.getElementById('video-preview-container');
    videoContainer.innerHTML = '';
    videos.forEach((file, index) => {
        const div = document.createElement('div');
        div.className = 'relative';
        div.innerHTML = `
                    <video src="${URL.createObjectURL(file)}" class="w-full h-32 rounded-lg" controls></video>
                    <button onclick="removeFile('video', ${index})" 
                        class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        ×
                    </button>
                `;
        videoContainer.appendChild(div);
    });
}

function removeFile(type, index) {
    if (type === 'picture') {
        pictures.splice(index, 1);
        updatePicturePreviews();
    } else {
        videos.splice(index, 1);
        updateVideoPreviews();
    }

    if (pictures.length === 0 && videos.length === 0) {
        document.getElementById('preview-container-0').classList.add('hidden');
    }
}

// Generate QR Code with pair validation
let qrCode = null;
function generateQRCode() {
    // Check if there's at least one picture and one video (a complete pair)
    if (pictures.length === 0 || videos.length === 0) {
        alert('Please upload both a picture and a video to proceed with QR code generation.');
        return;
    }

    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = ''; // Clear previous QR code

    const qrText = `https://thefotoar.com/view?pictures=${pictures.length}&videos=${videos.length}&id=${Date.now()}`;

    qrCode = new QRCode(qrContainer, {
        text: qrText,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    document.getElementById('download-qr-btn').classList.remove('hidden');
}

// Download QR Code
function downloadQRCode() {
    const qrCanvas = document.querySelector('#qrcode canvas');
    if (qrCanvas) {
        const link = document.createElement('a');
        link.download = 'thefotoar-qrcode.png';
        link.href = qrCanvas.toDataURL('image/png');
        link.click();
    }
}
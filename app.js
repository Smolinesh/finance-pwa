// Конфігурація доступу
const PIN = "1234"; // Тестовий PIN
let currentPin = "";

// Ініціалізація Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => console.error('SW Error:', err));
    });
}

// Генерація Numpad
const numpadContainer = document.getElementById('numpad');
const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'FaceID', 0, 'C'];

keys.forEach(key => {
    const btn = document.createElement('button');
    btn.className = "h-16 flex items-center justify-center text-2xl font-medium bg-gray-800 rounded-2xl active:bg-gray-700 transition-colors";
    
    if (key === 'FaceID') {
        btn.innerHTML = `<span class="text-sm font-bold text-blue-400">ID</span>`;
    } else if (key === 'C') {
        btn.innerHTML = `<span class="text-xl font-bold text-red-400">C</span>`;
    } else {
        btn.textContent = key;
    }
    
    btn.onclick = () => handleNumpad(key);
    numpadContainer.appendChild(btn);
});

// Логіка введення PIN
function handleNumpad(val) {
    if (val === 'C') {
        currentPin = currentPin.slice(0, -1);
    } else if (val === 'FaceID') {
        alert("Face ID (WebAuthn) буде підключено після деплою на HTTPS.");
        return;
    } else {
        if (currentPin.length < 4) currentPin += val;
    }
    
    updatePinUI();
    
    if (currentPin.length === 4) {
        setTimeout(() => {
            if (currentPin === PIN) {
                document.getElementById('auth-screen').classList.add('hidden');
                document.getElementById('app-screen').classList.remove('hidden', 'flex');
                document.getElementById('app-screen').classList.add('flex');
            } else {
                currentPin = "";
                updatePinUI();
                alert("Невірний PIN");
            }
        }, 100); // Затримка для відображення останньої точки
    }
}

function updatePinUI() {
    const dots = document.querySelectorAll('.pin-dot');
    dots.forEach((dot, index) => {
        if (index < currentPin.length) {
            dot.classList.remove('bg-gray-700');
            dot.classList.add('bg-blue-500');
        } else {
            dot.classList.remove('bg-blue-500');
            dot.classList.add('bg-gray-700');
        }
    });
}
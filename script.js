// Register the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('sw.js')
        .then(registration => {
            console.log('Service Worker registered successfully:', registration);
        })
        .catch(error => {
            console.error('Service Worker registration failed:', error);
        });
}

// Variables
let reminderInterval;

// Start reminder
document.getElementById('startButton').addEventListener('click', () => {
    const text = document.getElementById('text').value.trim();
    const startTime = document.getElementById('start').value;
    const interval = parseInt(document.getElementById('interval').value, 10);

    if (!text || !startTime || isNaN(interval) || interval <= 0) {
        alert("Please fill out all fields correctly!");
        return;
    }

    const now = new Date();
    const start = convertTimeToMilliseconds(startTime);

    if (now.getTime() > start) {
        alert("The start time must be in the future.");
        return;
    }

    // Request notification permission
    requestNotificationPermission().then(permission => {
        if (permission !== 'granted') {
            alert("Notifications are blocked. Please enable them in your browser.");
            return;
        }

        // Wait until start time to begin notifications
        const delay = start - now.getTime();
        setTimeout(() => {
            sendNotifications(interval, text);
        }, delay);

        document.getElementById('startButton').disabled = true;
        document.getElementById('endButton').disabled = false;
    });
});

// Stop reminder
document.getElementById('endButton').addEventListener('click', () => {
    clearInterval(reminderInterval);
    alert("Reminder stopped.");
    document.getElementById('startButton').disabled = false;
    document.getElementById('endButton').disabled = true;
});

// Convert time to milliseconds
function convertTimeToMilliseconds(time) {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes).getTime();
}

// Send notifications
function sendNotifications(interval, text) {
    reminderInterval = setInterval(() => {
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                title: 'Reminder!',
                body: text,
            });
        } else {
            console.error("Service Worker is not controlling the page.");
        }
    }, interval * 1000);
}

// Request notification permission
function requestNotificationPermission() {
    return Notification.requestPermission();
}

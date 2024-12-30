let reminderInterval;

document.getElementById('startButton').addEventListener('click', () => {
    const text = document.getElementById('text').value.trim();
    const startTime = document.getElementById('start').value;
    const interval = parseInt(document.getElementById('interval').value, 10);

    if (!text || !startTime || !interval) {
        alert("Please fill out all fields!");
        return;
    }

    const now = new Date();
    const start = convertTimeToMilliseconds(startTime);

    if (now.getTime() > start) {
        alert("The start time must be in the future.");
        return;
    }

    // Enable notifications
    requestNotificationPermission();

    // Wait until start time to begin notifications
    const delay = start - now.getTime();
    setTimeout(() => {
        sendNotifications(interval, text);
    }, delay);

    document.getElementById('startButton').disabled = true;
    document.getElementById('endButton').disabled = false;
});

document.getElementById('endButton').addEventListener('click', () => {
    clearInterval(reminderInterval);
    alert("Reminder stopped.");
    document.getElementById('startButton').disabled = false;
    document.getElementById('endButton').disabled = true;
});

function convertTimeToMilliseconds(time) {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes).getTime();
}

function sendNotifications(interval, text) {
    reminderInterval = setInterval(() => {
        new Notification("Reminder!", { body: text });
    }, interval * 1000);
}

function requestNotificationPermission() {
    if (Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
            if (permission !== "granted") {
                alert("Notifications are blocked. Please enable them in your browser.");
            }
        });
    } else if (Notification.permission === "denied") {
        alert("Notifications are blocked. Please enable them in your browser.");
    }
}

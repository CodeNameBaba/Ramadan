const duas = {
    suhoor: {
        title: "Next: Suhoor",
        arabic: "نَوَيْتُ أَنْ أَصُومَ غَدًا لِلَّهِ تَعَالَى مِنْ فَرْضِ رَمَضَانَ هَذَا",
        translit: "Nawaitu An Asuma Gadal'Lillahi Ta'aala Min Farzy RAMAZAN haaza",
        translat: '"I intend to keep the fast for tomorrow for Allah the Almighty from the obligation of this Ramadan."'
    },
    iftar: {
        title: "Next: Iftar",
        arabic: "اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَبِكَ امَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَ عَلَى رِزْقِكَ أَفْطَرْتُ",
        translit: "Allahumma inni laka sumtu, wa bika aamantu, wa 'alayka tawakkaltu, wa 'ala rizq-ika aftartu",
        translat: '"O Allah! I fasted for You and I believe in You and I put my trust in You and I break my fast with Your sustenance."'
    }
};

// Hardcoded schedule so it works locally without a server
const schedule = [
  { "date": "2026-02-19", "suhoor": "05:22:00", "iftar": "18:17:00" },
  { "date": "2026-02-20", "suhoor": "05:22:00", "iftar": "18:17:00" },
  { "date": "2026-02-21", "suhoor": "05:21:00", "iftar": "18:18:00" },
  { "date": "2026-02-22", "suhoor": "05:21:00", "iftar": "18:18:00" },
  { "date": "2026-02-23", "suhoor": "05:20:00", "iftar": "18:19:00" },
  { "date": "2026-02-24", "suhoor": "05:20:00", "iftar": "18:19:00" },
  { "date": "2026-02-25", "suhoor": "05:19:00", "iftar": "18:19:00" },
  { "date": "2026-02-26", "suhoor": "05:19:00", "iftar": "18:19:00" },
  { "date": "2026-02-27", "suhoor": "05:18:00", "iftar": "18:20:00" },
  { "date": "2026-02-28", "suhoor": "05:17:00", "iftar": "18:20:00" },
  { "date": "2026-03-01", "suhoor": "05:16:00", "iftar": "18:21:00" },
  { "date": "2026-03-02", "suhoor": "05:15:00", "iftar": "18:21:00" },
  { "date": "2026-03-03", "suhoor": "05:14:00", "iftar": "18:22:00" },
  { "date": "2026-03-04", "suhoor": "05:13:00", "iftar": "18:22:00" },
  { "date": "2026-03-05", "suhoor": "05:12:00", "iftar": "18:23:00" },
  { "date": "2026-03-06", "suhoor": "05:12:00", "iftar": "18:23:00" },
  { "date": "2026-03-07", "suhoor": "05:11:00", "iftar": "18:24:00" },
  { "date": "2026-03-08", "suhoor": "05:11:00", "iftar": "18:24:00" },
  { "date": "2026-03-09", "suhoor": "05:10:00", "iftar": "18:25:00" },
  { "date": "2026-03-10", "suhoor": "05:09:00", "iftar": "18:25:00" },
  { "date": "2026-03-11", "suhoor": "05:08:00", "iftar": "18:25:00" },
  { "date": "2026-03-12", "suhoor": "05:07:00", "iftar": "18:25:00" },
  { "date": "2026-03-13", "suhoor": "05:06:00", "iftar": "18:26:00" },
  { "date": "2026-03-14", "suhoor": "05:05:00", "iftar": "18:26:00" },
  { "date": "2026-03-15", "suhoor": "05:04:00", "iftar": "18:27:00" },
  { "date": "2026-03-16", "suhoor": "05:03:00", "iftar": "18:27:00" },
  { "date": "2026-03-17", "suhoor": "05:02:00", "iftar": "18:27:00" },
  { "date": "2026-03-18", "suhoor": "05:01:00", "iftar": "18:27:00" },
  { "date": "2026-03-19", "suhoor": "05:00:00", "iftar": "18:28:00" },
  { "date": "2026-03-20", "suhoor": "05:00:00", "iftar": "18:28:00" }
];

let azanPlayedFor = null; 
let testModeTargetTime = null; // Used for overriding time during testing
let testEventType = 'iftar';   // Default test event

// Initialize the app immediately
setHijriDate();
setInterval(updateClocksAndEvents, 1000);

function toUrduDigits(numStr) {
    const urduDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return numStr.replace(/\d/g, d => urduDigits[d]);
}

function setHijriDate() {
    const now = new Date();
    const gregorianOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const hijriOptions = { day: 'numeric', month: 'long', year: 'numeric', calendar: 'islamic' };
    
    const gregStr = new Intl.DateTimeFormat('en-US', gregorianOptions).format(now);
    const hijriStr = new Intl.DateTimeFormat('en-US-u-ca-islamic', hijriOptions).format(now);
    
    document.getElementById('hijri-date').innerText = `${gregStr} | ${hijriStr}`;
}

function updateClocksAndEvents() {
    const now = new Date();
    
    // Update Digital Clocks
    const timeString = now.toLocaleTimeString('en-US', { hour12: false });
    document.getElementById('eng-clock').innerText = timeString;
    document.getElementById('urdu-clock').innerText = toUrduDigits(timeString);

    let targetTime;
    let eventType;

    // ----- TEST OVERRIDE LOGIC -----
    if (testModeTargetTime) {
        targetTime = testModeTargetTime;
        eventType = testEventType;
        if (now > targetTime) {
            testModeTargetTime = null; // Reset test mode after it finishes
        }
    } else {
        // ----- NORMAL TIMETABLE LOGIC -----
        const todayStr = now.toISOString().split('T')[0];
        const todayData = schedule.find(d => d.date === todayStr);

        if (!todayData) {
            document.getElementById('next-event').innerText = "Schedule not available for today.";
            return;
        }

        const suhoorTime = new Date(`${todayStr}T${todayData.suhoor}`);
        const iftarTime = new Date(`${todayStr}T${todayData.iftar}`);

        if (now < suhoorTime) {
            targetTime = suhoorTime;
            eventType = 'suhoor';
        } else if (now < iftarTime) {
            targetTime = iftarTime;
            eventType = 'iftar';
        } else {
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];
            const tomorrowData = schedule.find(d => d.date === tomorrowStr);
            
            if (tomorrowData) {
                targetTime = new Date(`${tomorrowStr}T${tomorrowData.suhoor}`);
                eventType = 'suhoor';
            } else {
                document.getElementById('next-event').innerText = "End of schedule.";
                return;
            }
        }
    }

    // Update UI
    document.getElementById('next-event').innerText = testModeTargetTime ? `TEST: ${duas[eventType].title}` : duas[eventType].title;
    document.getElementById('target-time').innerText = `Time: ${targetTime.toLocaleTimeString('en-US', {hour12: true})}`;
    document.getElementById('dua-title').innerText = `Dua for ${eventType.charAt(0).toUpperCase() + eventType.slice(1)}`;
    document.getElementById('dua-arabic').innerText = duas[eventType].arabic;
    document.getElementById('dua-translit').innerText = duas[eventType].translit;
    document.getElementById('dua-translat').innerText = duas[eventType].translat;

    // Calculate Countdown
    const diffMs = Math.max(0, targetTime - now); // Prevent negative numbers
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    document.getElementById('countdown').innerText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // Play Audio (Triggers exactly at 00:00:00)
    if (hours === 0 && minutes === 0 && seconds === 0 && diffMs < 1000) {
        const eventKey = `${eventType}-${targetTime.getTime()}`;
        
        if (azanPlayedFor !== eventKey) {
            const audioElement = document.getElementById(`${eventType}-audio`);
            if (audioElement) {
                // Browsers require user interaction before audio plays. 
                // Using the test button satisfies this requirement!
                audioElement.play().catch(e => console.error("Audio block: Click anywhere on the page first.", e));
            }
            azanPlayedFor = eventKey; 
        }
    }
}

// --- Event Listeners ---

// Test Button
document.getElementById('test-azan-btn').addEventListener('click', () => {
    // Sets target time exactly 5 seconds into the future
    testModeTargetTime = new Date(new Date().getTime() + 5000); 
    // Alternate between testing suhoor and iftar
    testEventType = testEventType === 'iftar' ? 'suhoor' : 'iftar'; 
});

// Tasbeeh
let count = 0;
const countDisplay = document.getElementById('tasbeeh-count');
document.getElementById('tasbeeh-btn').addEventListener('click', () => {
    count++;
    countDisplay.innerText = count;
});
document.getElementById('reset-btn').addEventListener('click', () => {
    count = 0;
    countDisplay.innerText = count;
});

// Swipe Dots
const slider = document.getElementById('clock-slider');
const dots = document.querySelectorAll('.dot');
slider.addEventListener('scroll', () => {
    const scrollLeft = slider.scrollLeft;
    const width = slider.offsetWidth;
    const index = Math.round(scrollLeft / width);
    
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[index]) {
        dots[index].classList.add('active');
    }
});
    document.getElementById('hijri-date').innerText = `${gregStr} | ${hijriStr}`;
}

// Main logic for clocks and countdowns
function updateClocksAndEvents() {
    const now = new Date();
    
    // Update Digital Clocks
    const timeString = now.toLocaleTimeString('en-US', { hour12: false });
    document.getElementById('eng-clock').innerText = timeString;
    document.getElementById('urdu-clock').innerText = toUrduDigits(timeString);

    const todayStr = now.toISOString().split('T')[0];
    const todayData = schedule.find(d => d.date === todayStr);

    if (!todayData) {
        document.getElementById('next-event').innerText = "Awaiting timetable data...";
        return;
    }

    const suhoorTime = new Date(`${todayStr}T${todayData.suhoor}`);
    const iftarTime = new Date(`${todayStr}T${todayData.iftar}`);
    
    let targetTime;
    let eventType;

    // Determine what the next event is
    if (now < suhoorTime) {
        targetTime = suhoorTime;
        eventType = 'suhoor';
    } else if (now < iftarTime) {
        targetTime = iftarTime;
        eventType = 'iftar';
    } else {
        // If today's iftar is done, look for tomorrow's suhoor
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        const tomorrowData = schedule.find(d => d.date === tomorrowStr);
        
        if (tomorrowData) {
            targetTime = new Date(`${tomorrowStr}T${tomorrowData.suhoor}`);
            eventType = 'suhoor';
        } else {
            document.getElementById('next-event').innerText = "End of schedule.";
            return;
        }
    }

    // Update UI with event data and Duas
    document.getElementById('next-event').innerText = duas[eventType].title;
    document.getElementById('target-time').innerText = `Time: ${targetTime.toLocaleTimeString('en-US', {hour12: true})}`;
    document.getElementById('dua-title').innerText = `Dua for ${eventType.charAt(0).toUpperCase() + eventType.slice(1)}`;
    document.getElementById('dua-arabic').innerText = duas[eventType].arabic;
    document.getElementById('dua-translit').innerText = duas[eventType].translit;
    document.getElementById('dua-translat').innerText = duas[eventType].translat;

    // Calculate Countdown
    const diffMs = targetTime - now;
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    document.getElementById('countdown').innerText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // Azan Audio Logic (triggers distinct audio files)
    if (hours === 0 && minutes === 0 && seconds === 0) {
        const eventKey = `${eventType}-${targetTime.getTime()}`;
        
        // Ensure it only plays once per event
        if (azanPlayedFor !== eventKey) {
            // This selects either 'suhoor-audio' or 'iftar-audio' dynamically
            const audioElement = document.getElementById(`${eventType}-audio`);
            if (audioElement) {
                audioElement.play();
            }
            azanPlayedFor = eventKey; 
        }
    }
}

// Tasbeeh Counter Logic
let count = 0;
const countDisplay = document.getElementById('tasbeeh-count');
document.getElementById('tasbeeh-btn').addEventListener('click', () => {
    count++;
    countDisplay.innerText = count;
});
document.getElementById('reset-btn').addEventListener('click', () => {
    count = 0;
    countDisplay.innerText = count;
});

// Swipe Indicator (Dots) Logic for Clocks
const slider = document.getElementById('clock-slider');
const dots = document.querySelectorAll('.dot');
slider.addEventListener('scroll', () => {
    const scrollLeft = slider.scrollLeft;
    const width = slider.offsetWidth;
    const index = Math.round(scrollLeft / width);
    
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[index]) {
        dots[index].classList.add('active');
    }
});
    const gregorianOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    // This API naturally handles the Hijri calendar conversion
    const hijriOptions = { day: 'numeric', month: 'long', year: 'numeric', calendar: 'islamic' };
    
    const gregStr = new Intl.DateTimeFormat('en-US', gregorianOptions).format(now);
    const hijriStr = new Intl.DateTimeFormat('en-US-u-ca-islamic', hijriOptions).format(now);
    
    document.getElementById('hijri-date').innerText = `${gregStr} | ${hijriStr}`;
}

// Main logic for clocks and countdowns
function updateClocksAndEvents() {
    const now = new Date();
    
    // Update Digital Clocks
    const timeString = now.toLocaleTimeString('en-US', { hour12: false });
    document.getElementById('eng-clock').innerText = timeString;
    document.getElementById('urdu-clock').innerText = toUrduDigits(timeString);

    const todayStr = now.toISOString().split('T')[0];
    const todayData = schedule.find(d => d.date === todayStr);

    if (!todayData) {
        document.getElementById('next-event').innerText = "Awaiting timetable data...";
        return;
    }

    const suhoorTime = new Date(`${todayStr}T${todayData.suhoor}`);
    const iftarTime = new Date(`${todayStr}T${todayData.iftar}`);
    
    let targetTime;
    let eventType;

    // Determine what the next event is
    if (now < suhoorTime) {
        targetTime = suhoorTime;
        eventType = 'suhoor';
    } else if (now < iftarTime) {
        targetTime = iftarTime;
        eventType = 'iftar';
    } else {
        // If today's iftar is done, look for tomorrow's suhoor
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        const tomorrowData = schedule.find(d => d.date === tomorrowStr);
        
        if (tomorrowData) {
            targetTime = new Date(`${tomorrowStr}T${tomorrowData.suhoor}`);
            eventType = 'suhoor';
        } else {
            document.getElementById('next-event').innerText = "End of schedule.";
            return;
        }
    }

    // Update UI with event data and Duas
    document.getElementById('next-event').innerText = duas[eventType].title;
    document.getElementById('target-time').innerText = `Time: ${targetTime.toLocaleTimeString('en-US', {hour12: true})}`;
    document.getElementById('dua-title').innerText = `Dua for ${eventType.charAt(0).toUpperCase() + eventType.slice(1)}`;
    document.getElementById('dua-arabic').innerText = duas[eventType].arabic;
    document.getElementById('dua-translit').innerText = duas[eventType].translit;
    document.getElementById('dua-translat').innerText = duas[eventType].translat;

    // Calculate Countdown
    const diffMs = targetTime - now;
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    document.getElementById('countdown').innerText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // Azan Audio Logic (triggers distinct audio files)
    if (hours === 0 && minutes === 0 && seconds === 0) {
        const eventKey = `${eventType}-${targetTime.getTime()}`;
        
        // Ensure it only plays once per event
        if (azanPlayedFor !== eventKey) {
            // This selects either 'suhoor-audio' or 'iftar-audio' dynamically
            const audioElement = document.getElementById(`${eventType}-audio`);
            if (audioElement) {
                audioElement.play();
            }
            azanPlayedFor = eventKey; 
        }
    }
}

// Tasbeeh Counter Logic
let count = 0;
const countDisplay = document.getElementById('tasbeeh-count');
document.getElementById('tasbeeh-btn').addEventListener('click', () => {
    count++;
    countDisplay.innerText = count;
});
document.getElementById('reset-btn').addEventListener('click', () => {
    count = 0;
    countDisplay.innerText = count;
});

// Swipe Indicator (Dots) Logic for Clocks
const slider = document.getElementById('clock-slider');
const dots = document.querySelectorAll('.dot');
slider.addEventListener('scroll', () => {
    const scrollLeft = slider.scrollLeft;
    const width = slider.offsetWidth;
    const index = Math.round(scrollLeft / width);
    
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[index]) {
        dots[index].classList.add('active');
    }
});
        targetTime = suhoorTime;
        eventType = 'suhoor';
    } else if (now < iftarTime) {
        targetTime = iftarTime;
        eventType = 'iftar';
    } else {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        const tomorrowData = schedule.find(d => d.date === tomorrowStr);
        
        if (tomorrowData) {
            targetTime = new Date(`${tomorrowStr}T${tomorrowData.suhoor}`);
            eventType = 'suhoor';
        } else {
            return;
        }
    }

    // Update UI
    document.getElementById('next-event').innerText = duas[eventType].title;
    document.getElementById('target-time').innerText = `Time: ${targetTime.toLocaleTimeString('en-US', {hour12: true})}`;
    document.getElementById('dua-title').innerText = `Dua for ${eventType.charAt(0).toUpperCase() + eventType.slice(1)}`;
    document.getElementById('dua-arabic').innerText = duas[eventType].arabic;
    document.getElementById('dua-translit').innerText = duas[eventType].translit;
    document.getElementById('dua-translat').innerText = duas[eventType].translat;

    // Countdown
    const diffMs = targetTime - now;
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    document.getElementById('countdown').innerText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // Azan Logic
    if (hours === 0 && minutes === 0 && seconds === 0) {
        const eventKey = `${eventType}-${targetTime.getTime()}`;
        if (azanPlayedFor !== eventKey) {
            document.getElementById('azan-audio').play();
            azanPlayedFor = eventKey; 
        }
    }
}

// Tasbeeh Logic
let count = 0;
const countDisplay = document.getElementById('tasbeeh-count');
document.getElementById('tasbeeh-btn').addEventListener('click', () => {
    count++;
    countDisplay.innerText = count;
});
document.getElementById('reset-btn').addEventListener('click', () => {
    count = 0;
    countDisplay.innerText = count;
});

// Swipe Indicator Logic
const slider = document.getElementById('clock-slider');
const dots = document.querySelectorAll('.dot');
slider.addEventListener('scroll', () => {
    const scrollLeft = slider.scrollLeft;
    const width = slider.offsetWidth;
    const index = Math.round(scrollLeft / width);
    
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[index]) {
        dots[index].classList.add('active');
    }
});
  

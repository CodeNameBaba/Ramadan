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

let schedule = [];
let azanPlayedFor = null; 

// Fetch JSON data
fetch('times.json')
    .then(response => response.json())
    .then(data => {
        schedule = data;
        setInterval(updateClocksAndEvents, 1000);
        setHijriDate();
    })
    .catch(error => console.error("Error loading times.json:", error));

function toUrduDigits(numStr) {
    const urduDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return numStr.replace(/\d/g, d => urduDigits[d]);
}

// Generate Hijri Date native to JS
function setHijriDate() {
    const now = new Date();
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
  

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
let testModeTargetTime = null; 
let testEventType = 'iftar';   

// --- BULLETPROOF HELPER FUNCTIONS ---

// 1. Safe Date Parser (Prevents NaN crashes on Safari/Old browsers)
function parseSafeDate(dateStr, timeStr) {
    const [year, month, day] = dateStr.split('-');
    const [hours, minutes, seconds] = timeStr.split(':');
    return new Date(year, month - 1, day, hours, minutes, seconds);
}

// 2. Safe Local Date String
function getLocalDateString(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 3. Urdu Digits
function toUrduDigits(numStr) {
    const urduDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return numStr.replace(/\d/g, d => urduDigits[d]);
}

// 4. Safe Hijri Date (Prevents fatal crashes if API is unsupported)
function setHijriDate() {
    try {
        const now = new Date();
        const gregorianOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const hijriOptions = { day: 'numeric', month: 'long', year: 'numeric', calendar: 'islamic' };
        
        const gregStr = new Intl.DateTimeFormat('en-US', gregorianOptions).format(now);
        const hijriStr = new Intl.DateTimeFormat('en-US-u-ca-islamic', hijriOptions).format(now);
        
        document.getElementById('hijri-date').innerText = `${gregStr} | ${hijriStr}`;
    } catch (error) {
        console.warn("Hijri format not supported. Using fallback.");
        const fallbackDate = new Date().toDateString();
        document.getElementById('hijri-date').innerText = `${fallbackDate} | Ramadan 1447`;
    }
}

// --- MAIN LOOP ---

function updateClocksAndEvents() {
    const now = new Date();
    
    // 1. Force the clocks to update FIRST, no matter what happens below
    try {
        const timeString = now.toLocaleTimeString('en-US', { hour12: false });
        const engClock = document.getElementById('eng-clock');
        const urduClock = document.getElementById('urdu-clock');
        if (engClock) engClock.innerText = timeString;
        if (urduClock) urduClock.innerText = toUrduDigits(timeString);
    } catch (e) {
        console.error("Error updating digital clocks:", e);
    }

    let targetTime;
    let eventType;

    // ----- TEST OVERRIDE LOGIC -----
    if (testModeTargetTime) {
        targetTime = testModeTargetTime;
        eventType = testEventType;
        if (now > targetTime) {
            testModeTargetTime = null; 
        }
    } else {
        // ----- NORMAL TIMETABLE LOGIC -----
        const todayStr = getLocalDateString(now);
        const todayData = schedule.find(d => d.date === todayStr);

        if (!todayData) {
            document.getElementById('next-event').innerText = "Schedule not available for today.";
            return; // Stops here if date isn't in JSON
        }

        const suhoorTime = parseSafeDate(todayStr, todayData.suhoor);
        const iftarTime = parseSafeDate(todayStr, todayData.iftar);

        if (now < suhoorTime) {
            targetTime = suhoorTime;
            eventType = 'suhoor';
        } else if (now < iftarTime) {
            targetTime = iftarTime;
            eventType = 'iftar';
        } else {
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = getLocalDateString(tomorrow);
            const tomorrowData = schedule.find(d => d.date === tomorrowStr);
            
            if (tomorrowData) {
                targetTime = parseSafeDate(tomorrowStr, tomorrowData.suhoor);
                eventType = 'suhoor';
            } else {
                document.getElementById('next-event').innerText = "End of schedule.";
                return;
            }
        }
    }

    // 2. Update UI Safely
    try {
        document.getElementById('next-event').innerText = testModeTargetTime ? `TEST: ${duas[eventType].title}` : duas[eventType].title;
        document.getElementById('target-time').innerText = `Time: ${targetTime.toLocaleTimeString('en-US', {hour12: true})}`;
        document.getElementById('dua-title').innerText = `Dua for ${eventType.charAt(0).toUpperCase() + eventType.slice(1)}`;
        document.getElementById('dua-arabic').innerText = duas[eventType].arabic;
        document.getElementById('dua-translit').innerText = duas[eventType].translit;
        document.getElementById('dua-translat').innerText = duas[eventType].translat;

        // Calculate Countdown
        const diffMs = Math.max(0, targetTime - now); 
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
                    audioElement.play().catch(e => console.log("Audio requires a user click first.", e));
                }
                azanPlayedFor = eventKey; 
            }
        }
    } catch (e) {
        console.error("Error updating event UI:", e);
    }
}

// --- INITIALIZE (Safely) ---
try {
    setHijriDate();
    updateClocksAndEvents(); 
    setInterval(updateClocksAndEvents, 1000);
} catch (e) {
    console.error("Critical failure during initialization:", e);
}

// --- EVENT LISTENERS ---
const testBtn = document.getElementById('test-azan-btn');
if(testBtn) {
    testBtn.addEventListener('click', () => {
        testModeTargetTime = new Date(new Date().getTime() + 5000); 
        testEventType = testEventType === 'iftar' ? 'suhoor' : 'iftar'; 
    });
}

let count = 0;
const countDisplay = document.getElementById('tasbeeh-count');
const tasbeehBtn = document.getElementById('tasbeeh-btn');
const resetBtn = document.getElementById('reset-btn');

if(tasbeehBtn && countDisplay) {
    tasbeehBtn.addEventListener('click', () => {
        count++;
        countDisplay.innerText = count;
    });
}
if(resetBtn && countDisplay) {
    resetBtn.addEventListener('click', () => {
        count = 0;
        countDisplay.innerText = count;
    });
}

const slider = document.getElementById('clock-slider');
const dots = document.querySelectorAll('.dot');
if(slider && dots.length > 0) {
    slider.addEventListener('scroll', () => {
        const scrollLeft = slider.scrollLeft;
        const width = slider.offsetWidth;
        const index = Math.round(scrollLeft / width);
        
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    });
}

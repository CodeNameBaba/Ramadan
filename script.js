document.addEventListener("DOMContentLoaded",function(){

const duas={
suhoor:{
title:"Next: Suhoor",
arabic:"نَوَيْتُ أَنْ أَصُومَ غَدًا لِلَّهِ تَعَالَى مِنْ فَرْضِ رَمَضَانَ هَذَا",
translit:"Nawaitu An Asuma Gadal'Lillahi Ta'aala Min Farzy RAMAZAN haaza",
translat:"I intend to keep the fast for tomorrow for Allah from Ramadan."
},

iftar:{
title:"Next: Iftar",
arabic:"اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَبِكَ امَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَ عَلَى رِزْقِكَ أَفْطَرْتُ",
translit:"Allahumma inni laka sumtu wa bika aamantu wa 'alayka tawakkaltu",
translat:"O Allah I fasted for You and break it with Your provision."
}
};


const schedule=[
{date:"2026-03-08",suhoor:"05:11:00",iftar:"18:24:00"},
{date:"2026-03-09",suhoor:"05:10:00",iftar:"18:25:00"},
{date:"2026-03-10",suhoor:"05:09:00",iftar:"18:25:00"}
];


function toUrduDigits(str){

const d=['٠','١','٢','٣','٤','٥','٦','٧','٨','٩']

return str.replace(/\d/g,a=>d[a])

}


function setHijriDate(){

const now=new Date()

const greg=new Intl.DateTimeFormat('en-US',
{weekday:'long',year:'numeric',month:'long',day:'numeric'}).format(now)

const hijri=new Intl.DateTimeFormat(
'en-US-u-ca-islamic',
{day:'numeric',month:'long',year:'numeric'}
).format(now)

document.getElementById("hijri-date").innerText=
`${greg} | ${hijri}`

}



function update(){

const now=new Date()

const time=now.toLocaleTimeString('en-IN',{hour12:false})

document.getElementById("eng-clock").innerText=time

document.getElementById("urdu-clock").innerText=
toUrduDigits(time)


const today=now.toISOString().split("T")[0]

const data=schedule.find(d=>d.date===today)

if(!data)return


const suhoor=new Date(`${today}T${data.suhoor}`)
const iftar=new Date(`${today}T${data.iftar}`)

let target
let type

if(now<suhoor){

target=suhoor
type="suhoor"

}else{

target=iftar
type="iftar"

}


document.getElementById("next-event").innerText=
duas[type].title


document.getElementById("dua-arabic").innerText=
duas[type].arabic

document.getElementById("dua-translit").innerText=
duas[type].translit

document.getElementById("dua-translat").innerText=
duas[type].translat


const diff=Math.max(0,target-now)

const h=Math.floor(diff/3600000)
const m=Math.floor(diff%3600000/60000)
const s=Math.floor(diff%60000/1000)

document.getElementById("countdown").innerText=
`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`

document.getElementById("target-time").innerText=
`Time: ${target.toLocaleTimeString()}`


if(diff<1000){

const audio=document.getElementById(`${type}-audio`)

audio.play().catch(()=>{})

}

}


setHijriDate()

update()

setInterval(update,1000)



let count=0

document.getElementById("tasbeeh-btn").onclick=()=>{

count++

document.getElementById("tasbeeh-count").innerText=count

}

document.getElementById("reset-btn").onclick=()=>{

count=0

document.getElementById("tasbeeh-count").innerText=0

}



document.getElementById("test-azan-btn").onclick=()=>{

setTimeout(()=>{

document.getElementById("iftar-audio").play()

},5000)

}



const slider=document.getElementById("clock-slider")

const dots=document.querySelectorAll(".dot")

slider.addEventListener("scroll",()=>{

const i=Math.round(slider.scrollLeft/slider.offsetWidth)

dots.forEach(d=>d.classList.remove("active"))

if(dots[i])dots[i].classList.add("active")

})

});
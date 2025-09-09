// Static-first list so the page is stable. Add more as you publish.
const FALLBACK_VIDEOS = [
  { id: "h9y4XlUzcbA", title: "HOW TO MAKE A RADAR #arduinoproject" },
  { id: "Z2dTQ0p2Yy4", title: "HOW TO MAKE A RADAR SENSOR" },
  { id: "F1O1rNi2B3k", title: "AUTOMATIC WATER DISPENSER" }
];

function card({id,title}){
  const a = document.createElement("a");
  a.className = "card";
  a.href = `https://www.youtube.com/watch?v=${id}`;
  a.target="_blank"; a.rel="noopener";
  a.innerHTML = `<div class="thumb"><img loading="lazy" src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt=""></div><h3>${title}</h3>`;
  return a;
}
document.addEventListener("DOMContentLoaded",()=>{
  const grid = document.querySelector(".video-grid");
  grid.innerHTML="";
  FALLBACK_VIDEOS.forEach(v=>grid.appendChild(card(v)));
});

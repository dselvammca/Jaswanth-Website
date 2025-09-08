
const API_KEY = "AIzaSyDrvLGWZBA6bEYgzWqg5kYOOo3CZLeiEO8";
const CHANNEL_ID = "UC9ps706fEeZp_d-bacSUvdQ";
const MAX_PER_PAGE = 50;
const FALLBACK_VIDEOS = [];
function createCard(v){
  const url = `https://www.youtube.com/watch?v=${v.id}`;
  const thumb = `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
  const el = document.createElement('div');
  el.className = 'video-card';
  el.innerHTML = `<a href="${url}" target="_blank" rel="noopener">${escapeHtml(v.title)}</a>
                  <span class="video-thumb"><a href="${url}" target="_blank" rel="noopener">
                    <img src="${thumb}" alt="${escapeHtml(v.title)}"></a></span>`;
  return el;
}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
async function fetchAllVideos(){
  const grid=document.getElementById('videoGrid'); grid.innerHTML='';
  if(!API_KEY||API_KEY.includes('YOUR_')||!CHANNEL_ID||CHANNEL_ID.includes('YOUR_')){
    grid.innerHTML='<div class="warning">Add API key & channel ID in assets/videos.js</div>'; 
    FALLBACK_VIDEOS.forEach(v=>grid.appendChild(createCard(v))); return;
  }
  const chRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`).then(r=>r.json()).catch(()=>null);
  if(!chRes||!chRes.items||!chRes.items[0]){grid.innerHTML='<div class="warning">Could not load channel. Check API key/ID.</div>'; return;}
  const uploads = chRes.items[0].contentDetails.relatedPlaylists.uploads;
  let next=''; const vids=[];
  while(true){
    const plRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${MAX_PER_PAGE}&playlistId=${uploads}&key=${API_KEY}${next?`&pageToken=${next}`:''}`).then(r=>r.json());
    (plRes.items||[]).forEach(it=>{const id=it.snippet.resourceId?.videoId; if(id) vids.push({id, title: it.snippet.title||'Untitled'});});
    next = plRes.nextPageToken; if(!next) break;
  }
  vids.forEach(v=>grid.appendChild(createCard(v)));
}
document.addEventListener('DOMContentLoaded', fetchAllVideos);

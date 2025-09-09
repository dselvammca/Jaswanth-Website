/* YouTube gallery loader (titles below thumbnail) */
const API_KEY = "AIzaSyDrvLGWZBA6bEYgzWqg5kYOOo3CZLeiEO8";
const CHANNEL_ID = "UC9ps706fEeZp_d-bacSUvdQ";
const MAX_PER_PAGE = 50;

const FALLBACK_VIDEOS = [
  // { id: "VIDEO_ID", title: "Robo Rangers – Sample" },
];

const $grid = document.getElementById("videoGrid");
const $help = document.getElementById("helpCard");

function showHelp(show){ if(!$help) return; $help.classList[show?'remove':'add']('hidden'); }
function escapeHtml(s){ return s.replace(/[&<>"']/g,m=>({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[m])); }

function createCard(v){
  const url = `https://www.youtube.com/watch?v=${v.id}`;
  const thumb = `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
  const el = document.createElement('div');
  el.className = 'video-card';
  el.innerHTML = `
    <a class="video-thumb" href="${url}" target="_blank" rel="noopener noreferrer">
      <img src="${thumb}" alt="${escapeHtml(v.title||'Video')}" loading="lazy">
    </a>
    <a class="video-title" href="${url}" target="_blank" rel="noopener noreferrer">
      ${escapeHtml(v.title||'Untitled')}
    </a>
  `;
  return el;
}

async function fetchAllVideos(){
  $grid.innerHTML = '';
  showHelp(false);

  if(!API_KEY || !CHANNEL_ID){
    $grid.innerHTML = `<div class="warning">Add API key & channel ID in <code>assets/videos.js</code></div>`;
    FALLBACK_VIDEOS.forEach(v => $grid.appendChild(createCard(v)));
    showHelp(true); return;
  }

  try{
    // 1) Get uploads playlist
    const ch = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`);
    const chJson = await ch.json();
    const uploads = chJson?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if(!uploads) throw new Error('No uploads playlist');

    // 2) Iterate playlist pages
    let next = ''; const vids = [];
    do{
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${MAX_PER_PAGE}&playlistId=${uploads}&key=${API_KEY}` + (next?`&pageToken=${next}`:'');
      const resp = await fetch(url);
      const data = await resp.json();
      (data.items||[]).forEach(it=>{
        const id = it?.snippet?.resourceId?.videoId;
        if(id) vids.push({id, title: it.snippet?.title || 'Untitled'});
      });
      next = data.nextPageToken || '';
    }while(next);

    if(!vids.length) throw new Error('No videos returned');

    // 3) Render
    $grid.innerHTML = '';
    vids.forEach(v => $grid.appendChild(createCard(v)));
    showHelp(false);

  }catch(err){
    console.error('YouTube load failed:', err);
    showHelp(true);
    if(FALLBACK_VIDEOS.length){
      $grid.innerHTML=''; FALLBACK_VIDEOS.forEach(v => $grid.appendChild(createCard(v)));
    }else{
      $grid.innerHTML = `<div class="warning">Could not load channel. Check API key/ID.</div>`;
    }
  }
}

document.addEventListener('DOMContentLoaded', fetchAllVideos);

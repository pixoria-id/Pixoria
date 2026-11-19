(() => {
  const SUPABASE_URL = "https://bkhsxoehgqcwduzjmevl.supabase.co";
  const SUPABASE_KEY = "sb_publishable_dmXlBjNd3AkQ-0wz-NA7lQ_ildC6A5M";
  const client = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);
  const fallbackGames = [
    {id:"a-short-hike",slug:"a-short-hike",title:"A Short Hike",short_description:"Wander, climb, and find your own peaceful path through a charming island.",genres:["Adventure","Exploration"],platforms:["PC","Nintendo Switch","PlayStation","Xbox"],mood_tags:["Cozy","Exploration","Relaxing"],price_type:"paid",is_featured:true,cover_url:"",official_url:"https://ashorthike.com/"},
    {id:"celeste",slug:"celeste",title:"Celeste",short_description:"A heartfelt mountain-climbing journey about courage and discovery.",genres:["Platformer","Adventure"],platforms:["PC","Nintendo Switch","PlayStation","Xbox"],mood_tags:["Story rich","Challenge","Atmospheric"],price_type:"paid",is_featured:true,cover_url:"",official_url:"https://www.celestegame.com/"},
    {id:"eastward",slug:"eastward",title:"Eastward",short_description:"Travel through a beautifully detailed world full of curious characters.",genres:["Adventure","RPG"],platforms:["PC","Nintendo Switch"],mood_tags:["Story rich","Atmospheric","Exploration"],price_type:"paid",is_featured:true,cover_url:"",official_url:"https://eastwardgame.com/"},
    {id:"moonlighter",slug:"moonlighter",title:"Moonlighter",short_description:"Run a little shop by day and explore mysterious dungeons by night.",genres:["Action RPG","Roguelite"],platforms:["PC","Nintendo Switch","PlayStation","Xbox"],mood_tags:["Adventure","Management","Fantasy"],price_type:"paid",is_featured:false,cover_url:"",official_url:"https://moonlighterthegame.com/"},
    {id:"stardew-valley",slug:"stardew-valley",title:"Stardew Valley",short_description:"Build a quiet life, grow a farm, and make a home in the valley.",genres:["Farming","RPG"],platforms:["PC","Android","iOS","Nintendo Switch"],mood_tags:["Cozy","Relaxing","Life sim"],price_type:"paid",is_featured:true,cover_url:"",official_url:"https://www.stardewvalley.net/"},
    {id:"undertale",slug:"undertale",title:"Undertale",short_description:"A memorable underground adventure shaped by the choices you make.",genres:["RPG","Adventure"],platforms:["PC","Nintendo Switch","PlayStation","Xbox"],mood_tags:["Story rich","Humorous","Emotional"],price_type:"paid",is_featured:false,cover_url:"",official_url:"https://undertale.com/"},
    {id:"minami-lane",slug:"minami-lane",title:"Minami Lane",short_description:"Build a tiny Japanese-inspired street and help its residents thrive.",genres:["Simulation","Management","Building"],platforms:["PC","Nintendo Switch"],mood_tags:["Cozy","Relaxing","Creative","Life sim"],price_type:"paid",is_featured:false,cover_url:"",official_url:"https://store.steampowered.com/app/2678990/Minami_Lane/"},
    {id:"a-space-for-the-unbound",slug:"a-space-for-the-unbound",title:"A Space for the Unbound",short_description:"A magical coming-of-age adventure set in the Indonesian countryside.",genres:["Adventure","Narrative","Puzzle"],platforms:["PC","Nintendo Switch","PlayStation","Xbox"],mood_tags:["Story rich","Atmospheric","Emotional","Exploration"],price_type:"paid",is_featured:false,cover_url:"",official_url:"https://store.steampowered.com/app/1201270/A_Space_for_the_Unbound/"},
    {id:"chicory-a-colorful-tale",slug:"chicory-a-colorful-tale",title:"Chicory: A Colorful Tale",short_description:"Explore a coloring-book world and bring it to life with your paintbrush.",genres:["Adventure","Puzzle","RPG"],platforms:["PC","Mac","PlayStation","Nintendo Switch"],mood_tags:["Creative","Cozy","Story rich","Exploration"],price_type:"paid",is_featured:false,cover_url:"",official_url:"https://www.chicorygame.com/"}
  ];
  const symbols = ["🌾","🌿","⛏️","🍱","🐈","🌙","🍄","🏡"];
  let games = [];
  let activeMood = "all";
  let toastTimer;
  const $ = id => document.getElementById(id);
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const wishlistKey = "pixoria-wishlist-v1";
  const getWishlist = () => { try { return JSON.parse(localStorage.getItem(wishlistKey) || "[]"); } catch { return []; } };
  const setWishlist = list => { localStorage.setItem(wishlistKey, JSON.stringify(list)); updateWishlistCount(); };
  const updateWishlistCount = () => $("wishlist-count").textContent = getWishlist().length;
  const showToast = message => { const el=$("toast"); el.textContent=message; el.classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("show"),2100); };
  const gameId = game => String(game.id || game.slug || game.title);
  const tags = game => [...(game.genres || []).slice(0,2), ...(game.platforms || []).slice(0,1)];
  function sceneClass(game) {
    const key = String(game.slug || game.title || "world").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
    return "scene-" + key;
  }
  function coverArt(game,index,large=false) {
    if(game.cover_url) return '<div class="game-cover '+(large?"dialog-cover":"")+'"><img src="'+escapeHtml(game.cover_url)+'" alt="" loading="lazy"><span class="cover-index">PIXORIA / '+String(index+1).padStart(2,"0")+'</span><span class="cover-type">'+escapeHtml(game.price_type==="free"?"FREE TO PLAY":game.price_type==="paid"?"PAID":"DISCOVER")+'</span></div>';
    return '<div class="game-cover '+(large?"dialog-cover":"")+' '+sceneClass(game)+'"><span class="cover-sun"></span><span class="cover-ridge"></span><span class="cover-world"></span><span class="cover-pixels"></span><span class="cover-index">PIXORIA / '+String(index+1).padStart(2,"0")+'</span><span class="cover-type">'+escapeHtml(game.price_type==="free"?"FREE TO PLAY":game.price_type==="paid"?"PAID":"DISCOVER")+'</span></div>';
  }
  function card(game,index) {
    const saved=getWishlist().includes(gameId(game));
    return '<article class="game-card" data-game="'+escapeHtml(gameId(game))+'" tabindex="0" aria-label="View '+escapeHtml(game.title)+' details">'+coverArt(game,index)+'<div class="game-card-body"><div class="game-meta"><span>'+escapeHtml((game.genres||["Pixel game"])[0])+'</span><span class="price-label '+escapeHtml(game.price_type||"unknown")+'">'+escapeHtml(game.price_type==="free"?"FREE":game.price_type==="paid"?"PAID":"PRICE N/A")+'</span></div><h3 class="game-title">'+escapeHtml(game.title)+'</h3><p class="game-desc">'+escapeHtml(game.short_description || game.description || "A little world waiting to be discovered.")+'</p><div class="game-card-foot"><div class="tag-list">'+tags(game).map(t=>'<span class="tag">'+escapeHtml(t)+'</span>').join("")+'</div><button class="save-button '+(saved?"saved":"")+'" data-save="'+escapeHtml(gameId(game))+'" aria-label="'+(saved?"Remove from":"Add to")+' wishlist">'+(saved?"♥":"♡")+'</button></div><span class="card-discover">DISCOVER WORLD <span>↗</span></span></div></article>';
  }
  function renderCollectionStats() {
    const genreCount=new Set(games.flatMap(game=>game.genres||[])).size;
    const platformCount=new Set(games.flatMap(game=>game.platforms||[])).size;
    const freeCount=games.filter(game=>game.price_type==="free").length;
    $("collection-stats").innerHTML='<div><strong>'+games.length+'</strong><span>WORLDS TO DISCOVER</span></div><div><strong>'+genreCount+'</strong><span>GENRES</span></div><div><strong>'+platformCount+'</strong><span>PLATFORMS</span></div><div><strong>'+freeCount+'</strong><span>FREE TO PLAY</span></div>';
  }
  function renderGames() {
    const query=$("search-input").value.trim().toLowerCase(), genre=$("genre-filter").value, platform=$("platform-filter").value, price=$("price-filter").value, sort=$("sort-filter").value;
    let filtered=games.filter(g=>(!query || [g.title,g.short_description,g.description,g.developer,g.publisher,...(g.genres||[]),...(g.platforms||[]),...(g.mood_tags||[])].join(" ").toLowerCase().includes(query))&&(genre==="all"||(g.genres||[]).some(x=>x.toLowerCase()===genre.toLowerCase()))&&(platform==="all"||(g.platforms||[]).some(x=>x.toLowerCase()===platform.toLowerCase()))&&(price==="all"||g.price_type===price)&&(activeMood==="all"||(g.mood_tags||[]).some(x=>x.toLowerCase().includes(activeMood))||(g.genres||[]).some(x=>x.toLowerCase().includes(activeMood))));
    if(sort==="az") filtered.sort((a,b)=>a.title.localeCompare(b.title)); if(sort==="za") filtered.sort((a,b)=>b.title.localeCompare(a.title)); if(sort==="featured") filtered.sort((a,b)=>Number(b.is_featured)-Number(a.is_featured));
    renderCollectionStats();
    $("results-count").textContent=filtered.length+" LITTLE WORLD"+(filtered.length===1?"":"S")+" TO EXPLORE";
    $("game-grid").innerHTML=filtered.map(card).join(""); $("empty-state").hidden=filtered.length>0;
    renderWishlist();
  }
  function renderWishlist() {
    const saved=getWishlist(), selected=saved.map(id=>games.find(g=>gameId(g)===id)).filter(Boolean);
    $("wishlist-grid").innerHTML=selected.length?selected.map(card).join(""):'<p class="wishlist-empty">Your wishlist is waiting for its first little world. ♡</p>';
  }
  const homeSections=["home","discover","about","wishlist"];
  function showHome(){
    $("game-detail").hidden=true;
    homeSections.forEach(id=>$(id).hidden=false);
    document.title="PIXORIA.ID — Discover Your Little World";
  }
  function openGame(id,updateUrl=true) {
    const game=games.find(g=>gameId(g)===id || String(g.slug)===id);
    if(!game)return;
    const slug=String(game.slug||game.id||game.title).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
    if(updateUrl && location.hash!=="#game/"+slug) history.pushState({game:slug},"","#game/"+slug);
    homeSections.forEach(section=>$(section).hidden=true);
    const saved=getWishlist().includes(gameId(game));
    const scoreRelated = item => {
      if(gameId(item)===gameId(game)) return -1;
      const overlap=(a,b)=> (a||[]).filter(value=>(b||[]).some(other=>String(value).toLowerCase()===String(other).toLowerCase())).length;
      return overlap(item.genres,game.genres)*4 + overlap(item.mood_tags,game.mood_tags)*3 + overlap(item.platforms,game.platforms) + (item.is_featured?0.25:0);
    };
    const related=games.filter(item=>gameId(item)!==gameId(game)).map(item=>({item,score:scoreRelated(item)})).sort((a,b)=>b.score-a.score || a.item.title.localeCompare(b.item.title)).slice(0,3).map(entry=>entry.item);
    const developer=game.developer||"Independent creator";
    const release=game.release_date?new Date(game.release_date+"T00:00:00").toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}):"Not listed";
    const moodTags=(game.mood_tags||[]).slice(0,5);
    $("game-detail").innerHTML='<div class="detail-topline"><button class="back-link" type="button" id="detail-back">← BACK TO DISCOVER</button><span>PIXORIA / GAME JOURNAL</span></div><div class="detail-layout"><div class="detail-main">'+coverArt(game,Math.max(0,games.indexOf(game)),true)+'<div class="detail-eyebrow"><span class="eyebrow-line"></span> '+escapeHtml((game.genres||["PIXEL GAME"]).join(" · ").toUpperCase())+'</div><h1 class="detail-heading">'+escapeHtml(game.title)+'</h1><p class="detail-lead">'+escapeHtml(game.short_description||"A little world waiting to be discovered.")+'</p>'+(moodTags.length?'<div class="detail-mood-tags" aria-label="Game moods">'+moodTags.map(tag=>'<span>'+escapeHtml(tag)+'</span>').join("")+'</div>':"")+'<div class="detail-actions"><button class="button button-primary" type="button" id="detail-save">'+(saved?"♥ SAVED TO WISHLIST":"♡ ADD TO WISHLIST")+'</button><button class="button button-secondary" type="button" id="detail-share">SHARE GAME ↗</button>'+(game.official_url?'<a class="button button-secondary" target="_blank" rel="noopener" href="'+escapeHtml(game.official_url)+'">OFFICIAL WEBSITE ↗</a>':"")+'</div><div class="detail-description">'+escapeHtml(game.description||game.short_description||"Discover a new little world.")+'</div></div><aside class="detail-sidebar"><div class="sidebar-kicker">THE GAME NOTES</div><div class="detail-facts"><div><span>DEVELOPER</span><strong>'+escapeHtml(developer)+'</strong></div><div><span>PUBLISHER</span><strong>'+escapeHtml(game.publisher||"Independent")+'</strong></div><div><span>PLATFORMS</span><strong>'+escapeHtml((game.platforms||[]).join(" · ")||"Not listed")+'</strong></div><div><span>GENRE</span><strong>'+escapeHtml((game.genres||[]).join(" · ")||"Pixel game")+'</strong></div><div><span>PRICE</span><strong>'+escapeHtml(game.price_type==="free"?"Free to play":game.price_type==="paid"?"Paid":"Not listed")+'</strong></div><div><span>RELEASE</span><strong>'+escapeHtml(String(release))+'</strong></div></div><p class="sidebar-note">A small discovery, selected for your next little escape.</p></aside></div>'+(related.length?'<section class="related-section"><div class="eyebrow"><span class="eyebrow-line"></span> KEEP WANDERING</div><h2>More little <em>worlds.</em></h2><div class="related-grid">'+related.map(item=>card(item,games.indexOf(item))).join("")+'</div></section>':"");
    $("game-detail").hidden=false;
    document.title=game.title+" — PIXORIA.ID";
    $("detail-back").addEventListener("click",()=>{history.pushState({home:true},"","#discover");showHome();$("discover").scrollIntoView({behavior:"smooth"});});
    $("detail-save").addEventListener("click",()=>{toggleWishlist(gameId(game));openGame(gameId(game),false);});
    $("detail-share").addEventListener("click",async()=>{const url=location.href;try{await navigator.clipboard.writeText(url);showToast("Game link copied");}catch{showToast(url);}});
    window.scrollTo({top:0,behavior:"auto"});
  }
  function routeFromHash(){
    const match=location.hash.match(/^#game\/(.+)$/);
    if(match){const slug=decodeURIComponent(match[1]);const game=games.find(item=>String(item.slug||item.id||item.title).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")===slug);if(game){openGame(gameId(game),false);return;}}
    showHome();
  }
  function toggleWishlist(id) {
    const list=getWishlist(), exists=list.includes(id);
    setWishlist(exists?list.filter(x=>x!==id):[...list,id]);
    showToast(exists?"Removed from your wishlist":"Saved to your little collection");
    renderGames();
  }
  document.addEventListener("click",event=>{
    const save=event.target.closest("[data-save]"); if(save){event.stopPropagation();toggleWishlist(save.dataset.save);return;}
    const article=event.target.closest("[data-game]"); if(article && !event.target.closest("button"))openGame(article.dataset.game);
  });
  ["search-input","genre-filter","platform-filter","price-filter","sort-filter"].forEach(id=>$(id).addEventListener(id==="search-input"?"input":"change",renderGames));
  $("genre-filter").addEventListener("change",renderGenreChips);
  $("genre-chips").addEventListener("click",event=>{const chip=event.target.closest("[data-genre]");if(!chip)return;$("genre-filter").value=chip.dataset.genre;renderGenreChips();renderGames();$("game-grid").scrollIntoView({behavior:"smooth",block:"start"});});
  $("surprise-me").addEventListener("click",()=>{const visible=[...$("game-grid").querySelectorAll("[data-game]")].map(card=>games.find(game=>gameId(game)===card.dataset.game)).filter(Boolean);if(!visible.length){showToast("No little worlds match these filters yet");return;}const pick=visible[Math.floor(Math.random()*visible.length)];openGame(gameId(pick));});
  $("game-grid").addEventListener("keydown",event=>{const article=event.target.closest("[data-game]");if(article&&(event.key==="Enter"||event.key===" ")){event.preventDefault();openGame(article.dataset.game);}});
  $("wishlist-grid").addEventListener("keydown",event=>{const article=event.target.closest("[data-game]");if(article&&(event.key==="Enter"||event.key===" ")){event.preventDefault();openGame(article.dataset.game);}});
  $("game-detail").addEventListener("keydown",event=>{const article=event.target.closest(".related-grid [data-game]");if(article&&(event.key==="Enter"||event.key===" ")){event.preventDefault();openGame(article.dataset.game);}});
  document.querySelectorAll("[data-mood]").forEach(button=>button.addEventListener("click",()=>{
    activeMood=button.dataset.mood;
    document.querySelectorAll("[data-mood]").forEach(item=>item.classList.toggle("active",item.dataset.mood===activeMood));
    renderGames();
    if(button.classList.contains("atelier-card")) $("game-grid").scrollIntoView({behavior:"smooth",block:"start"});
  }));
  $("clear-filters").addEventListener("click",()=>{$("search-input").value="";$("genre-filter").value="all";$("platform-filter").value="all";$("price-filter").value="all";$("sort-filter").value="featured";renderGenreChips();activeMood="all";document.querySelectorAll("[data-mood]").forEach(item=>item.classList.toggle("active",item.dataset.mood==="all"));renderGames();});
  $("dialog-close").addEventListener("click",()=>$("game-dialog").close());
  $("game-dialog").addEventListener("click",e=>{if(e.target===$("game-dialog"))$("game-dialog").close();});
  function populateFilters() {
    const fill = (id, values, label) => {
      const select = $(id), current = select.value;
      select.innerHTML = '<option value="all">' + label + '</option>' +
        [...new Set(values.filter(Boolean))].sort((a,b)=>a.localeCompare(b))
          .map(value => '<option value="' + escapeHtml(value) + '">' + escapeHtml(value) + '</option>').join("");
      if ([...select.options].some(option => option.value === current)) select.value = current;
    };
    fill("genre-filter", games.flatMap(game => game.genres || []), "All genres");
    fill("platform-filter", games.flatMap(game => game.platforms || []), "All platforms");
    renderGenreChips();
  }
  function renderGenreChips(){
    const genres=[...new Set(games.flatMap(game=>game.genres||[]))].sort((a,b)=>a.localeCompare(b));
    $("genre-chips").innerHTML='<button type="button" class="genre-chip '+($("genre-filter").value==="all"?"active":"")+'" data-genre="all">All worlds</button>'+genres.map(genre=>'<button type="button" class="genre-chip '+($("genre-filter").value===genre?"active":"")+'" data-genre="'+escapeHtml(genre)+'">'+escapeHtml(genre)+'</button>').join("");
  }
  async function loadGames() {
    if(client) {
      try { const {data,error}=await client.from("games").select("*").eq("is_published",true).order("is_featured",{ascending:false}).order("title"); if(error)throw error; if(data?.length){games=data;populateFilters();renderGames();return;} }
      catch(error){console.warn("Pixoria database unavailable; showing starter collection.",error);}
    }
    games=fallbackGames; populateFilters(); renderGames();
  }

  const navLinks=[...document.querySelectorAll(".main-nav a")];
  if("IntersectionObserver" in window){
    const sectionObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(link=>link.classList.toggle("active",link.getAttribute("href")==="#"+entry.target.id));}});
    },{rootMargin:"-35% 0px -55% 0px"});
    ["home","discover","about"].forEach(id=>{const section=$(id);if(section)sectionObserver.observe(section);});
  }
  window.addEventListener("hashchange",routeFromHash);
  window.addEventListener("popstate",routeFromHash);
  updateWishlistCount();
  loadGames().then(routeFromHash);
})();
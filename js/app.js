(() => {
  const SUPABASE_URL = "https://bkhsxoehgqcwduzjmevl.supabase.co";
  const SUPABASE_KEY = "sb_publishable_dmXlBjNd3AkQ-0wz-NA7lQ_ildC6A5M";
  const client = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);
  const fallbackGames = [
    {id:"stardew-valley",slug:"stardew-valley",title:"Stardew Valley",short_description:"Build a quiet life, grow a farm, and make a home in the valley.",genres:["Farming","RPG"],platforms:["PC","Android","iOS"],mood_tags:["cozy","relaxing"],price_type:"paid",is_featured:true,cover_url:"",official_url:"https://www.stardewvalley.net/"},
    {id:"terraria",slug:"terraria",title:"Terraria",short_description:"Dig, build, explore, and uncover a world full of surprises.",genres:["Adventure","Sandbox"],platforms:["PC","Android","iOS"],mood_tags:["adventure","creative"],price_type:"paid",is_featured:true,cover_url:"",official_url:"https://terraria.org/"},
    {id:"minecraft",slug:"minecraft",title:"Minecraft",short_description:"Make your own little place in an endless block-shaped world.",genres:["Sandbox","Adventure"],platforms:["PC","Android","iOS"],mood_tags:["creative","exploration"],price_type:"paid",is_featured:true,cover_url:"",official_url:"https://www.minecraft.net/"},
    {id:"inbento",slug:"inbento",title:"inbento",short_description:"A charming food-themed puzzle about arranging tiny lunch boxes.",genres:["Puzzle"],platforms:["Android","iOS","PC"],mood_tags:["cute","puzzle"],price_type:"paid",is_featured:false,cover_url:"",official_url:"https://www.inbento.com/"},
    {id:"soul-knight",slug:"soul-knight",title:"Soul Knight",short_description:"A lively pixel dungeon adventure with quick, playful runs.",genres:["RPG","Action"],platforms:["Android","iOS","PC"],mood_tags:["action","pixel"],price_type:"free",is_featured:false,cover_url:"",official_url:"https://www.chillyroom.com/"},
    {id:"nameless-cat",slug:"nameless-cat",title:"Nameless Cat",short_description:"A small cat, a mysterious world, and a heartfelt platform adventure.",genres:["Adventure","Platformer"],platforms:["Android","iOS"],mood_tags:["story","cute"],price_type:"free",is_featured:false,cover_url:"",official_url:"https://www.namelesscat.com/"}
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
    return '<article class="game-card" data-game="'+escapeHtml(gameId(game))+'" tabindex="0" role="button" aria-label="View '+escapeHtml(game.title)+' details">'+coverArt(game,index)+'<div class="game-card-body"><div class="game-meta"><span>'+escapeHtml((game.genres||["Pixel game"])[0])+'</span><span>✦ CURATED</span></div><h3 class="game-title">'+escapeHtml(game.title)+'</h3><p class="game-desc">'+escapeHtml(game.short_description || game.description || "A little world waiting to be discovered.")+'</p><div class="game-card-foot"><div class="tag-list">'+tags(game).map(t=>'<span class="tag">'+escapeHtml(t)+'</span>').join("")+'</div><button class="save-button '+(saved?"saved":"")+'" data-save="'+escapeHtml(gameId(game))+'" aria-label="'+(saved?"Remove from":"Add to")+' wishlist">'+(saved?"♥":"♡")+'</button></div><span class="card-discover">DISCOVER WORLD <span>↗</span></span></div></article>';
  }
  function renderGames() {
    const query=$("search-input").value.trim().toLowerCase(), genre=$("genre-filter").value, platform=$("platform-filter").value, sort=$("sort-filter").value;
    let filtered=games.filter(g=>(!query || [g.title,g.short_description,g.description,...(g.genres||[]),...(g.mood_tags||[])].join(" ").toLowerCase().includes(query))&&(genre==="all"||(g.genres||[]).some(x=>x.toLowerCase()===genre.toLowerCase()))&&(platform==="all"||(g.platforms||[]).some(x=>x.toLowerCase()===platform.toLowerCase()))&&(activeMood==="all"||(g.mood_tags||[]).some(x=>x.toLowerCase().includes(activeMood))||(g.genres||[]).some(x=>x.toLowerCase().includes(activeMood))));
    if(sort==="az") filtered.sort((a,b)=>a.title.localeCompare(b.title)); if(sort==="za") filtered.sort((a,b)=>b.title.localeCompare(a.title)); if(sort==="featured") filtered.sort((a,b)=>Number(b.is_featured)-Number(a.is_featured));
    $("results-count").textContent=filtered.length+" LITTLE WORLD"+(filtered.length===1?"":"S")+" TO EXPLORE";
    $("game-grid").innerHTML=filtered.map(card).join(""); $("empty-state").hidden=filtered.length>0;
    renderWishlist();
  }
  function renderWishlist() {
    const saved=getWishlist(), selected=saved.map(id=>games.find(g=>gameId(g)===id)).filter(Boolean);
    $("wishlist-grid").innerHTML=selected.length?selected.map(card).join(""):'<p class="wishlist-empty">Your wishlist is waiting for its first little world. ♡</p>';
  }
  function openGame(id) {
    const game=games.find(g=>gameId(g)===id); if(!game)return;
    const saved=getWishlist().includes(id);
    $("dialog-content").innerHTML=coverArt(game,Math.max(0,games.indexOf(game)),true)+'<div class="eyebrow"><span class="eyebrow-line"></span> '+escapeHtml((game.genres||["PIXEL GAME"]).join(" · ").toUpperCase())+'</div><h2 class="dialog-title">'+escapeHtml(game.title)+'</h2><p class="dialog-description">'+escapeHtml(game.description||game.short_description||"A little world waiting to be discovered.")+'</p><div class="detail-facts"><div><span>PLATFORMS</span><strong>'+escapeHtml((game.platforms||[]).join(" · ")||"Not listed")+'</strong></div><div><span>PRICE</span><strong>'+escapeHtml(game.price_type==="free"?"Free to play":game.price_type==="paid"?"Paid":"Not listed")+'</strong></div><div><span>GENRE</span><strong>'+escapeHtml((game.genres||[]).join(" · ")||"Pixel game")+'</strong></div></div><div class="dialog-actions"><button class="button button-primary" id="dialog-save">'+(saved?"Remove from wishlist":"Save to wishlist")+'</button>'+(game.official_url?'<a class="button button-secondary" target="_blank" rel="noopener" href="'+escapeHtml(game.official_url)+'">Official site ↗</a>':"")+'</div>';
    $("game-dialog").showModal();
    $("dialog-save").addEventListener("click",()=>{toggleWishlist(id);openGame(id);});
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
  ["search-input","genre-filter","platform-filter","sort-filter"].forEach(id=>$(id).addEventListener(id==="search-input"?"input":"change",renderGames));
  $("game-grid").addEventListener("keydown",event=>{const article=event.target.closest("[data-game]");if(article&&(event.key==="Enter"||event.key===" ")){event.preventDefault();openGame(article.dataset.game);}});
  $("wishlist-grid").addEventListener("keydown",event=>{const article=event.target.closest("[data-game]");if(article&&(event.key==="Enter"||event.key===" ")){event.preventDefault();openGame(article.dataset.game);}});
  document.querySelectorAll("[data-mood]").forEach(button=>button.addEventListener("click",()=>{
    activeMood=button.dataset.mood;
    document.querySelectorAll("[data-mood]").forEach(item=>item.classList.toggle("active",item===button));
    renderGames();
  }));
  $("clear-filters").addEventListener("click",()=>{$("search-input").value="";$("genre-filter").value="all";$("platform-filter").value="all";$("sort-filter").value="featured";activeMood="all";document.querySelectorAll("[data-mood]").forEach(item=>item.classList.toggle("active",item.dataset.mood==="all"));renderGames();});
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
  }
  async function loadGames() {
    if(client) {
      try { const {data,error}=await client.from("games").select("*").eq("is_published",true).order("is_featured",{ascending:false}).order("title"); if(error)throw error; if(data?.length){games=data;populateFilters();renderGames();return;} }
      catch(error){console.warn("Pixoria database unavailable; showing starter collection.",error);}
    }
    games=fallbackGames; populateFilters(); renderGames();
  }
  updateWishlistCount(); loadGames();
})();
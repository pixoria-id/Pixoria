(() => {
  const SUPABASE_URL = "https://bkhsxoehgqcwduzjmevl.supabase.co";
  const SUPABASE_KEY = "sb_publishable_dmXlBjNd3AkQ-0wz-NA7lQ_ildC6A5M";
  const client = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);
  const fallbackGames = [
    {id:"a-short-hike",slug:"a-short-hike",title:"A Short Hike",developer:"adamgryu",publisher:"adamgryu",release_date:"2019-07-30",short_description:"Wander, climb, and find your own peaceful path through a charming island.",genres:["Adventure","Exploration"],platforms:["PC","Nintendo Switch","PlayStation","Xbox"],mood_tags:["Cozy","Exploration","Relaxing"],price_type:"paid",is_featured:true,cover_url:"",official_url:"https://ashorthike.com/"},
    {id:"celeste",slug:"celeste",title:"Celeste",developer:"Maddy Makes Games Inc.",publisher:"Maddy Makes Games Inc.",release_date:"2018-01-25",short_description:"A heartfelt mountain-climbing journey about courage and discovery.",genres:["Platformer","Adventure"],platforms:["PC","Nintendo Switch","PlayStation","Xbox"],mood_tags:["Story rich","Challenge","Atmospheric"],price_type:"paid",is_featured:true,cover_url:"",official_url:"https://www.celestegame.com/"},
    {id:"eastward",slug:"eastward",title:"Eastward",developer:"Pixpil",publisher:"Chucklefish, XD",release_date:"2021-09-16",short_description:"Travel through a beautifully detailed world full of curious characters.",genres:["Adventure","RPG"],platforms:["PC","Nintendo Switch"],mood_tags:["Story rich","Atmospheric","Exploration"],price_type:"paid",is_featured:true,cover_url:"",official_url:"https://eastwardgame.com/"},
    {id:"moonlighter",slug:"moonlighter",title:"Moonlighter",developer:"Digital Sun",publisher:"11 bit studios",release_date:"2018-05-29",short_description:"Run a little shop by day and explore mysterious dungeons by night.",genres:["Action RPG","Roguelite"],platforms:["PC","Nintendo Switch","PlayStation","Xbox"],mood_tags:["Adventure","Management","Fantasy"],price_type:"paid",is_featured:false,cover_url:"",official_url:"https://moonlighterthegame.com/"},
    {id:"stardew-valley",slug:"stardew-valley",title:"Stardew Valley",developer:"ConcernedApe",publisher:"ConcernedApe",release_date:"2016-02-26",short_description:"Build a quiet life, grow a farm, and make a home in the valley.",genres:["Farming","RPG"],platforms:["PC","Android","iOS","Nintendo Switch"],mood_tags:["Cozy","Relaxing","Life sim"],price_type:"paid",is_featured:true,cover_url:"",official_url:"https://www.stardewvalley.net/"},
    {id:"undertale",slug:"undertale",title:"Undertale",developer:"Toby Fox",publisher:"tobyfox",release_date:"2015-09-15",short_description:"A memorable underground adventure shaped by the choices you make.",genres:["RPG","Adventure"],platforms:["PC","Nintendo Switch","PlayStation","Xbox"],mood_tags:["Story rich","Humorous","Emotional"],price_type:"paid",is_featured:false,cover_url:"",official_url:"https://undertale.com/"},
    {id:"minami-lane",slug:"minami-lane",title:"Minami Lane",developer:"Blibloop",publisher:"Doot Tiny Games, Wholesome Games Presents",release_date:"2024-02-28",short_description:"Build a tiny Japanese-inspired street and help its residents thrive.",genres:["Simulation","Management","Building"],platforms:["PC","Nintendo Switch"],mood_tags:["Cozy","Relaxing","Creative","Life sim"],price_type:"paid",is_featured:false,cover_url:"",official_url:"https://store.steampowered.com/app/2678990/Minami_Lane/"},
    {id:"a-space-for-the-unbound",slug:"a-space-for-the-unbound",title:"A Space for the Unbound",developer:"Mojiken",publisher:"Toge Productions, Chorus Worldwide",release_date:"2023-01-19",short_description:"A magical coming-of-age adventure set in the Indonesian countryside.",genres:["Adventure","Narrative","Puzzle"],platforms:["PC","Nintendo Switch","PlayStation","Xbox"],mood_tags:["Story rich","Atmospheric","Emotional","Exploration"],price_type:"paid",is_featured:false,cover_url:"",official_url:"https://store.steampowered.com/app/1201270/A_Space_for_the_Unbound/"},
    {id:"chicory-a-colorful-tale",slug:"chicory-a-colorful-tale",title:"Chicory: A Colorful Tale",developer:"Greg Lobanov and team",publisher:"Finji",release_date:"2021-06-10",short_description:"Explore a coloring-book world and bring it to life with your paintbrush.",genres:["Adventure","Puzzle","RPG"],platforms:["PC","Mac","PlayStation","Nintendo Switch"],mood_tags:["Creative","Cozy","Story rich","Exploration"],price_type:"paid",is_featured:false,cover_url:"",official_url:"https://www.chicorygame.com/"}
  ];
  const symbols = ["🌾","🌿","⛏️","🍱","🐈","🌙","🍄","🏡"];
  let games = [];
  let activeMood = "all";
  let activeSuggestionIndex = -1;
  let toastTimer;
  const $ = id => document.getElementById(id);
  function updatePageMeta(title,description) {
    document.title=title;
    const meta=document.querySelector('meta[name="description"]');
    const ogTitle=document.querySelector('meta[property="og:title"]');
    const ogDescription=document.querySelector('meta[property="og:description"]');
    if(meta)meta.content=description;
    if(ogTitle)ogTitle.content=title;
    if(ogDescription)ogDescription.content=description;
  }
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const wishlistKey = "pixoria-wishlist-v1";
  const recentKey = "pixoria-recent-v1";
  const getRecent = () => { try { const value=JSON.parse(localStorage.getItem(recentKey)||"[]"); return Array.isArray(value)?value:[]; } catch { return []; } };
  const saveRecent = id => { try { localStorage.setItem(recentKey,JSON.stringify([id,...getRecent().filter(item=>item!==id)].slice(0,5))); } catch {} };
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
    if(game.cover_url) return '<div class="game-cover '+(large?"dialog-cover":"")+'"><img src="'+escapeHtml(game.cover_url)+'" alt="'+escapeHtml(game.title)+' cover artwork" loading="lazy"><span class="cover-index">PIXORIA / '+String(index+1).padStart(2,"0")+'</span><span class="cover-type">'+escapeHtml(game.price_type==="free"?"FREE TO PLAY":game.price_type==="paid"?"PAID":"DISCOVER")+'</span></div>';
    const slug=String(game.slug||game.id||game.title).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
    return '<div class="game-cover '+(large?"dialog-cover":"")+' '+sceneClass(game)+'"><img class="pixoria-original-cover" src="assets/covers/'+escapeHtml(slug)+'.svg" alt="Original PIXORIA pixel-art scene for '+escapeHtml(game.title)+'" loading="lazy" onerror="this.remove();this.parentElement.classList.add(\'cover-image-failed\')"><span class="cover-index">PIXORIA / '+String(index+1).padStart(2,"0")+'</span><span class="cover-type">PIXORIA ART</span></div>';
  }
  function card(game,index) {
    const saved=getWishlist().includes(gameId(game));
    return '<article class="game-card" data-game="'+escapeHtml(gameId(game))+'" tabindex="0" aria-label="View '+escapeHtml(game.title)+' details">'+coverArt(game,index)+'<div class="game-card-body"><div class="game-meta"><span>'+escapeHtml((game.genres||["Pixel game"])[0])+'</span><span class="price-label '+escapeHtml(game.price_type||"unknown")+'">'+escapeHtml(game.price_type==="free"?"FREE":game.price_type==="paid"?"PAID":"PRICE N/A")+'</span></div><h3 class="game-title">'+escapeHtml(game.title)+'</h3><p class="game-desc">'+escapeHtml(game.short_description || game.description || "A little world waiting to be discovered.")+'</p>'+((game.developer||game.release_date)?'<div class="game-credit">'+(game.developer?'<span>'+escapeHtml(game.developer)+'</span>':'<span>Independent game</span>')+(game.release_date?'<span>'+escapeHtml(String(game.release_date).slice(0,4))+'</span>':'')+'</div>':'')+'<div class="game-card-foot"><div class="tag-list">'+tags(game).map(t=>'<span class="tag">'+escapeHtml(t)+'</span>').join("")+'</div><button class="save-button '+(saved?"saved":"")+'" data-save="'+escapeHtml(gameId(game))+'" aria-label="'+(saved?"Remove from":"Add to")+' wishlist">'+(saved?"♥":"♡")+'</button></div><span class="card-discover">DISCOVER WORLD <span>↗</span></span></div></article>';
  }
  function renderEditorsPicks() {
    const featured=games.filter(game=>game.is_featured);
    const picks=[...featured,...games.filter(game=>!game.is_featured)].slice(0,3);
    $("editors-picks").innerHTML=picks.map((game,index)=>'<article class="editor-pick" data-game="'+escapeHtml(gameId(game))+'" tabindex="0" aria-label="Discover '+escapeHtml(game.title)+'"><div class="editor-pick-art">'+coverArt(game,index)+'</div><div class="editor-pick-copy"><span class="editor-pick-number">0'+(index+1)+' / CURATOR\'S PICK</span><h4>'+escapeHtml(game.title)+'</h4><p>'+escapeHtml(game.short_description||"A little world waiting to be discovered.")+'</p><span class="editor-pick-link">STEP INSIDE ↗</span></div></article>').join("");
  }
  function renderRecentlyViewed() {
    const recent=getRecent().map(id=>games.find(game=>gameId(game)===id)).filter(Boolean).slice(0,3);
    const section=$("recent-shelf");
    section.hidden=!recent.length;
    $("recent-grid").innerHTML=recent.map(game=>card(game,games.indexOf(game))).join("");
  }
  function renderCollectionStats() {
    const genreCount=new Set(games.flatMap(game=>game.genres||[])).size;
    const platformCount=new Set(games.flatMap(game=>game.platforms||[])).size;
    const freeCount=games.filter(game=>game.price_type==="free").length;
    $("collection-stats").innerHTML='<div><strong>'+games.length+'</strong><span>WORLDS TO DISCOVER</span></div><div><strong>'+genreCount+'</strong><span>GENRES</span></div><div><strong>'+platformCount+'</strong><span>PLATFORMS</span></div><div><strong>'+freeCount+'</strong><span>FREE TO PLAY</span></div>';
  }
  const normalize = value => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
  function searchText(game) {
    return normalize([game.title,game.short_description,game.description,game.developer,game.publisher,...(game.genres||[]),...(game.platforms||[]),...(game.mood_tags||[]),game.price_type==="free"?"free gratis":"",game.price_type==="paid"?"paid berbayar":"", "game pixel pixel-art"].join(" "));
  }
  const searchAliases = {
    santai:["cozy","relaxing","calm","slow"],tenang:["cozy","relaxing","calm"],nyaman:["cozy","relaxing"],
    petualangan:["adventure","exploration"],jelajah:["exploration","adventure"],eksplorasi:["exploration"],
    cerita:["story","narrative","emotional"],kisah:["story","narrative"],narasi:["narrative","story"],
    berkebun:["farming","life sim"],kebun:["farming"],bertani:["farming"],simulasi:["simulation","management"],
    membangun:["building","management","creative"],bangun:["building","creative"],teka:["puzzle"],teki:["puzzle"],puzzle:["puzzle"],
    kreatif:["creative"],mewarnai:["creative","coloring"],aksi:["action"],gratis:["free"],berbayar:["paid"],
    hp:["android","ios"],ponsel:["android","ios"],mobile:["android","ios"],komputer:["pc"],switch:["nintendo switch"]
  };
  const searchTerms = query => normalize(query).split(/\s+/).filter(term=>term&&!["game","games","pixel","pixel-art","yang","untuk","dan","di","the","a"].includes(term));
  function matchesSearch(game,query) {
    const text=searchText(game);
    return searchTerms(query).every(term=>[term,...(searchAliases[term]||[])].some(alias=>text.includes(normalize(alias))));
  }
  function searchRelevance(game,query) {
    const terms=searchTerms(query);
    if(!terms.length)return 0;
    const title=normalize(game.title), genres=normalize((game.genres||[]).join(" ")), moods=normalize((game.mood_tags||[]).join(" "));
    let score=0;
    terms.forEach(term=>{
      const aliases=[term,...(searchAliases[term]||[])].map(normalize);
      if(aliases.some(alias=>title===alias))score+=100;
      else if(aliases.some(alias=>title.startsWith(alias)))score+=75;
      else if(aliases.some(alias=>title.includes(alias)))score+=55;
      else if(aliases.some(alias=>genres.includes(alias)))score+=35;
      else if(aliases.some(alias=>moods.includes(alias)))score+=25;
      else score+=10;
    });
    if(game.is_featured)score+=2;
    return score;
  }
  function setActiveSuggestion(index){
    const options=[...$("search-suggestions").querySelectorAll("[data-suggest]")];
    activeSuggestionIndex=options.length?Math.max(0,Math.min(index,options.length-1)):-1;
    options.forEach((option,i)=>{
      const active=i===activeSuggestionIndex;
      option.setAttribute("aria-selected",String(active));
      option.classList.toggle("is-active",active);
    });
    const active=options[activeSuggestionIndex];
    if(active){$("search-input").setAttribute("aria-activedescendant",active.id);active.scrollIntoView({block:"nearest"});}
    else $("search-input").removeAttribute("aria-activedescendant");
  }
  function selectSuggestion(id){
    const game=games.find(entry=>gameId(entry)===id);
    if(!game)return;
    $("search-input").value=game.title;
    $("search-suggestions").hidden=true;
    $("search-input").setAttribute("aria-expanded","false");
    $("search-input").removeAttribute("aria-activedescendant");
    activeSuggestionIndex=-1;
    renderGames();
    openGame(gameId(game));
  }
  function renderSearchSuggestions() {
    const input=$("search-input"), panel=$("search-suggestions"), query=normalize(input.value);
    activeSuggestionIndex=-1;
    input.removeAttribute("aria-activedescendant");
    if(!query){panel.hidden=true;input.setAttribute("aria-expanded","false");return;}
    const matches=games.filter(game=>matchesSearch(game,query)).sort((a,b)=>searchRelevance(b,query)-searchRelevance(a,query)||a.title.localeCompare(b.title)).slice(0,5);
    panel.innerHTML=matches.length?matches.map((game,index)=>'<button type="button" class="suggestion-item" role="option" aria-selected="false" id="search-option-'+index+'" data-suggest="'+escapeHtml(gameId(game))+'"><span>'+escapeHtml(game.title)+'</span><small>'+escapeHtml((game.genres||[]).slice(0,2).join(" · ")||"Pixel game")+'</small></button>').join(""):'<p class="suggestion-empty">No matching worlds yet</p>';
    panel.hidden=false;input.setAttribute("aria-expanded","true");
  }
  function renderActiveFilters() {
    const chips=[];
    const add=(key,label)=>chips.push('<button type="button" class="active-filter" data-clear-filter="'+key+'">'+escapeHtml(label)+' <span aria-hidden="true">×</span></button>');
    if($("search-input").value.trim()) add("search",'Search: '+$("search-input").value.trim());
    if($("genre-filter").value!=="all") add("genre",$("genre-filter").value);
    if($("platform-filter").value!=="all") add("platform",$("platform-filter").value);
    if($("price-filter").value!=="all") add("price",$("price-filter").value==="free"?"Free":"Paid");
    if(activeMood!=="all") add("mood",activeMood.charAt(0).toUpperCase()+activeMood.slice(1));
    $("active-filters").innerHTML=chips.length?'<span class="active-filter-label">FILTERING BY</span>'+chips.join("")+'<button type="button" class="clear-all-filters" data-clear-filter="all">Clear all</button>':"";
    $("active-filters").hidden=!chips.length;
  }
  function renderGames() {
    const query=$("search-input").value, genre=$("genre-filter").value, platform=$("platform-filter").value, price=$("price-filter").value, sort=$("sort-filter").value;
    let filtered=games.filter(g=>{const text=searchText(g);return matchesSearch(g,query)&&(genre==="all"||(g.genres||[]).some(x=>normalize(x)===normalize(genre)))&&(platform==="all"||(g.platforms||[]).some(x=>normalize(x)===normalize(platform)))&&(price==="all"||g.price_type===price)&&(activeMood==="all"||(g.mood_tags||[]).some(x=>normalize(x).includes(activeMood))||(g.genres||[]).some(x=>normalize(x).includes(activeMood)));});
    if(sort==="az") filtered.sort((a,b)=>a.title.localeCompare(b.title));
    if(sort==="za") filtered.sort((a,b)=>b.title.localeCompare(a.title));
    if(sort==="newest") filtered.sort((a,b)=>(Date.parse(b.release_date||"")||0)-(Date.parse(a.release_date||"")||0)||a.title.localeCompare(b.title));
    if(sort==="oldest") filtered.sort((a,b)=>(Date.parse(a.release_date||"")||Infinity)-(Date.parse(b.release_date||"")||Infinity)||a.title.localeCompare(b.title));
    if(sort==="featured") filtered.sort((a,b)=>(query?searchRelevance(b,query)-searchRelevance(a,query):0)||Number(b.is_featured)-Number(a.is_featured)||a.title.localeCompare(b.title));
    renderCollectionStats();
    renderRecentlyViewed();
    $("results-count").textContent="SHOWING "+filtered.length+" OF "+games.length+" LITTLE WORLDS";
    $("game-grid").innerHTML=filtered.map(card).join(""); $("empty-state").hidden=filtered.length>0;
    renderActiveFilters();renderWishlist();
  }
  function renderWishlist() {
    const saved=getWishlist(), selected=saved.map(id=>games.find(g=>gameId(g)===id)).filter(Boolean);
    $("wishlist-grid").innerHTML=selected.length?selected.map(card).join(""):'<p class="wishlist-empty">Your wishlist is waiting for its first little world. ♡</p>';
  }
  const homeSections=["home","discover","about","wishlist"];
  const categorySlug=value=>normalize(value).replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  function renderCategoryDirectory(){
    const counts=new Map();
    games.forEach(game=>(game.genres||[]).forEach(genre=>counts.set(genre,(counts.get(genre)||0)+1)));
    $("category-tiles").innerHTML=[...counts.entries()].sort((a,b)=>a[0].localeCompare(b[0])).map(([genre,count])=>'<button class="category-tile" type="button" data-open-category="'+escapeHtml(genre)+'"><small>PIXORIA / GENRE</small><strong>'+escapeHtml(genre)+'</strong><span>'+count+' little '+(count===1?"world":"worlds")+' <b>↗</b></span></button>').join("");
  }
  function openCategory(genre,updateUrl=true){
    const selected=games.filter(game=>(game.genres||[]).some(item=>normalize(item)===normalize(genre)));
    if(!selected.length)return;
    if(updateUrl)history.pushState({category:categorySlug(genre)},"","#category/"+categorySlug(genre));
    $("game-detail").hidden=true;$("category-page").hidden=false;
    homeSections.forEach(id=>$(id).hidden=true);
    const genres=[...new Set(games.flatMap(game=>game.genres||[]))].sort((a,b)=>a.localeCompare(b));
    $("category-page").innerHTML='<div class="category-topline"><button class="back-link" id="category-back" type="button">← BACK TO DISCOVER</button><span>PIXORIA / THE LITTLE INDEX</span></div><div class="category-hero"><div class="eyebrow">EXPLORE A LITTLE FURTHER</div><h1>'+escapeHtml(genre)+' <em>worlds.</em></h1><p>'+selected.length+' curated '+(selected.length===1?"game":"games")+' in this corner of the collection. Find a new favorite, one little world at a time.</p></div><div class="category-switcher">'+genres.map(item=>'<button class="category-switch '+(normalize(item)===normalize(genre)?"active":"")+'" data-open-category="'+escapeHtml(item)+'" type="button">'+escapeHtml(item)+'</button>').join("")+'</div><div class="category-results-line"><span>THE '+escapeHtml(genre.toUpperCase())+' COLLECTION</span><span>'+selected.length+' WORLDS</span></div><div class="category-game-grid">'+selected.map(game=>card(game,games.indexOf(game))).join("")+'</div>';
    $("category-back").addEventListener("click",()=>{history.pushState({home:true},"","#discover");showHome();$("discover").scrollIntoView({behavior:"smooth"});});
    updatePageMeta(genre+" Games — PIXORIA.ID","Explore "+selected.length+" "+genre.toLowerCase()+" pixel-art games in the PIXORIA collection.");navLinks.forEach(link=>link.classList.toggle("active",link.getAttribute("href")==="#discover"));window.scrollTo({top:0,behavior:"auto"});
  }
  function showHome(){
    $("game-detail").hidden=true;
    $("category-page").hidden=true;
    homeSections.forEach(id=>$(id).hidden=false);
    updatePageMeta("PIXORIA.ID — Discover Your Little World","Temukan game pixel-art cozy untuk petualangan kecil, hari yang tenang, dan cerita yang tinggal lebih lama.");
  }
  function openGame(id,updateUrl=true) {
    $("category-page").hidden=true;
    const game=games.find(g=>gameId(g)===id || String(g.slug)===id);
    if(!game)return;
    const slug=String(game.slug||game.id||game.title).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
    if(updateUrl && location.hash!=="#game/"+slug) history.pushState({game:slug},"","#game/"+slug);
    homeSections.forEach(section=>$(section).hidden=true);
    const saved=getWishlist().includes(gameId(game));
    saveRecent(gameId(game));
    const sharedValues=(a,b)=>[...(a||[])].filter(value=>(b||[]).some(other=>String(value).toLowerCase()===String(other).toLowerCase()));
    const similarity=(a,b)=>{
      const left=new Set((a||[]).map(value=>String(value).toLowerCase()));
      const right=new Set((b||[]).map(value=>String(value).toLowerCase()));
      if(!left.size&&!right.size)return 0;
      const intersection=[...left].filter(value=>right.has(value)).length;
      return intersection/(left.size+right.size-intersection||1);
    };
    const relatedCandidates=games.filter(item=>gameId(item)!==gameId(game)).map(item=>{
      const genres=sharedValues(item.genres,game.genres);
      const moods=sharedValues(item.mood_tags,game.mood_tags);
      const platforms=sharedValues(item.platforms,game.platforms);
      const score=similarity(item.genres,game.genres)*0.48+similarity(item.mood_tags,game.mood_tags)*0.37+similarity(item.platforms,game.platforms)*0.15;
      const strongest=moods.length?moods[0]:genres.length?genres[0]:platforms[0];
      const reason=moods.length?"SHARED MOOD · "+strongest.toUpperCase():genres.length?"SAME GENRE · "+strongest.toUpperCase():platforms.length?"ALSO ON · "+strongest.toUpperCase():"ANOTHER LITTLE WORLD";
      return {item,score,genres,moods,platforms,reason};
    }).sort((a,b)=>b.score-a.score||a.item.title.localeCompare(b.item.title));
    const related=[];
    while(related.length<3&&related.length<relatedCandidates.length){
      const ranked=relatedCandidates.filter(candidate=>!related.some(chosen=>gameId(chosen.item)===gameId(candidate.item))).map(candidate=>{
        const crowding=related.reduce((total,chosen)=>total+Math.max(similarity(candidate.item.genres,chosen.item.genres),similarity(candidate.item.mood_tags,chosen.item.mood_tags))*0.18,0);
        return {...candidate,adjustedScore:candidate.score-crowding};
      }).sort((a,b)=>b.adjustedScore-a.adjustedScore||a.item.title.localeCompare(b.item.title));
      related.push(ranked[0]);
    }
    const developer=game.developer||"Independent creator";
    const release=game.release_date?new Date(game.release_date+"T00:00:00").toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}):"Not listed";
    const moodTags=(game.mood_tags||[]).slice(0,5);
    $("game-detail").innerHTML='<div class="detail-topline"><button class="back-link" type="button" id="detail-back">← BACK TO DISCOVER</button><span>PIXORIA / GAME JOURNAL</span></div><div class="detail-layout"><div class="detail-main">'+coverArt(game,Math.max(0,games.indexOf(game)),true)+'<div class="detail-eyebrow"><span class="eyebrow-line"></span> '+escapeHtml((game.genres||["PIXEL GAME"]).join(" · ").toUpperCase())+'</div><div class="detail-genre-links" aria-label="Explore game genres">'+(game.genres||[]).map(genre=>'<button type="button" data-open-category="'+escapeHtml(genre)+'">'+escapeHtml(genre)+' ↗</button>').join("")+(game.platforms||[]).map(platform=>'<button type="button" class="platform-detail-link" data-open-platform="'+escapeHtml(platform)+'" aria-label="Explore all games on '+escapeHtml(platform)+'">'+escapeHtml(platform)+' · EXPLORE PLATFORM ↗</button>').join("")+'</div><h1 class="detail-heading">'+escapeHtml(game.title)+'</h1><p class="detail-lead">'+escapeHtml(game.short_description||"A little world waiting to be discovered.")+'</p>'+(moodTags.length?'<div class="detail-mood-tags" aria-label="Game moods">'+moodTags.map(tag=>'<span>'+escapeHtml(tag)+'</span>').join("")+'</div>':"")+'<div class="detail-actions"><button class="button button-primary" type="button" id="detail-save">'+(saved?"♥ SAVED TO WISHLIST":"♡ ADD TO WISHLIST")+'</button><button class="button button-secondary" type="button" id="detail-share">SHARE GAME ↗</button>'+(game.official_url?'<a class="button button-secondary" target="_blank" rel="noopener" href="'+escapeHtml(game.official_url)+'">OFFICIAL WEBSITE ↗</a>':"")+'</div><div class="detail-description">'+escapeHtml(game.description||game.short_description||"Discover a new little world.")+'</div></div><aside class="detail-sidebar"><div class="sidebar-kicker">THE GAME NOTES</div><div class="detail-facts"><div><span>DEVELOPER</span><strong>'+escapeHtml(developer)+'</strong></div><div><span>PUBLISHER</span><strong>'+escapeHtml(game.publisher||"Independent")+'</strong></div><div><span>PLATFORMS</span><strong>'+escapeHtml((game.platforms||[]).join(" · ")||"Not listed")+'</strong></div><div><span>GENRE</span><strong>'+escapeHtml((game.genres||[]).join(" · ")||"Pixel game")+'</strong></div><div><span>PRICE</span><strong>'+escapeHtml(game.price_type==="free"?"Free to play":game.price_type==="paid"?"Paid":"Not listed")+'</strong></div><div><span>RELEASE</span><strong>'+escapeHtml(String(release))+'</strong></div></div><p class="sidebar-note">A small discovery, selected for your next little escape.</p></aside></div>'+(related.length?'<section class="related-section"><div class="eyebrow"><span class="eyebrow-line"></span> KEEP WANDERING</div><h2>More little <em>worlds.</em></h2><p class="related-intro">Picked by shared moods, genres, and places you can play.</p><div class="related-grid">'+related.map(entry=>'<div class="related-item"><span class="related-reason">'+escapeHtml(entry.reason)+'</span>'+card(entry.item,games.indexOf(entry.item))+'</div>').join("")+'</div></section>':"");
    $("game-detail").hidden=false;
    updatePageMeta(game.title+" — PIXORIA.ID",game.short_description||"Discover "+game.title+" in the PIXORIA collection of little pixel-art worlds.");
    renderRecentlyViewed();
    $("detail-back").addEventListener("click",()=>{history.pushState({home:true},"","#discover");showHome();$("discover").scrollIntoView({behavior:"smooth"});});
    $("detail-save").addEventListener("click",()=>{toggleWishlist(gameId(game));openGame(gameId(game),false);});
    $("detail-share").addEventListener("click",async()=>{
      const url=location.href;
      const shareData={title:game.title+" — PIXORIA.ID",text:game.short_description||"Discover this little world on PIXORIA.ID",url};
      if(navigator.share){try{await navigator.share(shareData);return;}catch(error){if(error.name==="AbortError")return;}}
      try{await navigator.clipboard.writeText(url);showToast("Game link copied");}
      catch{showToast("Copy this link: "+url);}
    });
    window.scrollTo({top:0,behavior:"auto"});
  }
  function routeFromHash(){
    const categoryMatch=location.hash.match(/^#category\/(.+)$/);
    if(categoryMatch){const slug=decodeURIComponent(categoryMatch[1]);const genre=[...new Set(games.flatMap(item=>item.genres||[]))].find(item=>categorySlug(item)===slug);if(genre){openCategory(genre,false);return;}}
    const match=location.hash.match(/^#game\/(.+)$/);
    if(match){const slug=decodeURIComponent(match[1]);const game=games.find(item=>String(item.slug||item.id||item.title).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")===slug);if(game){openGame(gameId(game),false);return;}}
    showHome();
    const target=location.hash.replace(/^#/,"");
    if(homeSections.includes(target)){const section=$(target);if(section)section.scrollIntoView({behavior:"auto",block:"start"});}
  }
  function toggleWishlist(id) {
    const list=getWishlist(), exists=list.includes(id);
    setWishlist(exists?list.filter(x=>x!==id):[...list,id]);
    showToast(exists?"Removed from your wishlist":"Saved to your little collection");
    renderGames();
  }
  document.addEventListener("error",event=>{
    const image=event.target;
    if(!(image instanceof HTMLImageElement)||!image.closest(".game-cover"))return;
    const cover=image.closest(".game-cover");
    image.remove();cover.classList.add("cover-image-failed");
    const art=document.createElement("span");art.className="cover-fallback-art";
    art.innerHTML='<span class="cover-sun"></span><span class="cover-ridge"></span><span class="cover-world"></span><span class="cover-pixels"></span>';
    cover.insertBefore(art,cover.querySelector(".cover-index"));
  },true);
  document.addEventListener("click",event=>{
    const category=event.target.closest("[data-open-category]");if(category){openCategory(category.dataset.openCategory);return;}
    const platform=event.target.closest("[data-open-platform]");if(platform){const value=platform.dataset.openPlatform;const option=[...$("platform-filter").options].find(item=>normalize(item.value)===normalize(value));history.pushState({section:"discover",platform:value},"","#discover");showHome();$("search-input").value="";$("genre-filter").value="all";$("platform-filter").value=option?option.value:"all";$("price-filter").value="all";$("sort-filter").value="featured";activeMood="all";document.querySelectorAll("[data-mood]").forEach(item=>item.classList.toggle("active",item.dataset.mood==="all"));$("search-suggestions").hidden=true;$("search-input").setAttribute("aria-expanded","false");renderGenreChips();renderGames();$("discover").scrollIntoView({behavior:"smooth",block:"start"});return;}
    const save=event.target.closest("[data-save]"); if(save){event.stopPropagation();toggleWishlist(save.dataset.save);return;}
    const article=event.target.closest("[data-game]"); if(article && !event.target.closest("button"))openGame(article.dataset.game);
  });

  const heroSearchButton=$("hero-search-button");
  if(heroSearchButton)heroSearchButton.addEventListener("click",()=>{$("search-input").focus();$("discover").scrollIntoView({behavior:"smooth",block:"start"});});
\n  $("search-input").addEventListener("input",()=>{renderSearchSuggestions();renderGames();});
  ["genre-filter","platform-filter","price-filter","sort-filter"].forEach(id=>$(id).addEventListener("change",renderGames));
  $("search-suggestions").addEventListener("click",event=>{const item=event.target.closest("[data-suggest]");if(item)selectSuggestion(item.dataset.suggest);});
  $("search-input").addEventListener("keydown",event=>{
    const panel=$("search-suggestions"),options=panel.querySelectorAll("[data-suggest]");
    if(panel.hidden||!options.length)return;
    if(event.key==="ArrowDown"){event.preventDefault();setActiveSuggestion(activeSuggestionIndex+1);}
    else if(event.key==="ArrowUp"){event.preventDefault();setActiveSuggestion(activeSuggestionIndex<0?options.length-1:activeSuggestionIndex-1);}
    else if(event.key==="Enter"&&activeSuggestionIndex>=0){event.preventDefault();selectSuggestion(options[activeSuggestionIndex].dataset.suggest);}
  });
  $("active-filters").addEventListener("click",event=>{const button=event.target.closest("[data-clear-filter]");if(!button)return;const key=button.dataset.clearFilter;if(key==="all"){resetDiscovery();return;}if(key==="search")$("search-input").value="";if(key==="genre")$("genre-filter").value="all";if(key==="platform")$("platform-filter").value="all";if(key==="price")$("price-filter").value="all";if(key==="mood"){activeMood="all";document.querySelectorAll("[data-mood]").forEach(item=>item.classList.toggle("active",item.dataset.mood==="all"));}renderGenreChips();renderSearchSuggestions();renderGames();});
  document.addEventListener("click",event=>{if(!event.target.closest(".search-wrap")){$("search-suggestions").hidden=true;$("search-input").setAttribute("aria-expanded","false");}});
  document.addEventListener("keydown",event=>{if(event.key==="/"&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){event.preventDefault();$("search-input").focus();}if(event.key==="Escape"){$("search-suggestions").hidden=true;$("search-input").setAttribute("aria-expanded","false");$("search-input").removeAttribute("aria-activedescendant");activeSuggestionIndex=-1;}});
  $("genre-filter").addEventListener("change",renderGenreChips);
  $("genre-chips").addEventListener("click",event=>{const chip=event.target.closest("[data-genre]");if(!chip)return;$("genre-filter").value=chip.dataset.genre;renderGenreChips();renderGames();$("game-grid").scrollIntoView({behavior:"smooth",block:"start"});});
  $("surprise-me").addEventListener("click",()=>{const visible=[...$("game-grid").querySelectorAll("[data-game]")].map(card=>games.find(game=>gameId(game)===card.dataset.game)).filter(Boolean);if(!visible.length){showToast("No little worlds match these filters yet");return;}const pick=visible[Math.floor(Math.random()*visible.length)];openGame(gameId(pick));});
  $("editors-picks").addEventListener("keydown",event=>{const article=event.target.closest("[data-game]");if(article&&(event.key==="Enter"||event.key===" ")){event.preventDefault();openGame(article.dataset.game);}});
  $("game-grid").addEventListener("keydown",event=>{const article=event.target.closest("[data-game]");if(article&&(event.key==="Enter"||event.key===" ")){event.preventDefault();openGame(article.dataset.game);}});
  $("wishlist-grid").addEventListener("keydown",event=>{const article=event.target.closest("[data-game]");if(article&&(event.key==="Enter"||event.key===" ")){event.preventDefault();openGame(article.dataset.game);}});
  $("recent-grid").addEventListener("keydown",event=>{const article=event.target.closest("[data-game]");if(article&&(event.key==="Enter"||event.key===" ")){event.preventDefault();openGame(article.dataset.game);}});
  $("game-detail").addEventListener("keydown",event=>{const article=event.target.closest(".related-grid [data-game]");if(article&&(event.key==="Enter"||event.key===" ")){event.preventDefault();openGame(article.dataset.game);}});
  document.querySelectorAll("[data-mood]").forEach(button=>button.addEventListener("click",()=>{
    activeMood=button.dataset.mood;
    document.querySelectorAll("[data-mood]").forEach(item=>item.classList.toggle("active",item.dataset.mood===activeMood));
    renderGames();
    if(button.classList.contains("atelier-card")) $("game-grid").scrollIntoView({behavior:"smooth",block:"start"});
  }));
  function resetDiscovery(){$("search-input").value="";$("genre-filter").value="all";$("platform-filter").value="all";$("price-filter").value="all";$("sort-filter").value="featured";renderGenreChips();activeMood="all";document.querySelectorAll("[data-mood]").forEach(item=>item.classList.toggle("active",item.dataset.mood==="all"));$("search-suggestions").hidden=true;$("search-input").setAttribute("aria-expanded","false");$("search-input").removeAttribute("aria-activedescendant");activeSuggestionIndex=-1;renderGames();}
  $("clear-filters").addEventListener("click",resetDiscovery);
  $("clear-recent").addEventListener("click",()=>{try{localStorage.removeItem(recentKey);}catch{}renderRecentlyViewed();showToast("Recently explored list cleared");});
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
    renderCategoryDirectory();
    renderEditorsPicks();
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
  document.querySelectorAll(".main-nav a, .wishlist-link, .site-header .brand").forEach(link=>link.addEventListener("click",event=>{
    event.preventDefault();
    const href=link.getAttribute("href")||"#home";
    const target=href==="#"?"home":href.slice(1);
    if(!homeSections.includes(target))return;
    history.pushState({section:target},"","#"+target);
    showHome();
    navLinks.forEach(item=>item.classList.toggle("active",item.getAttribute("href")==="#"+target));
    $(target).scrollIntoView({behavior:"smooth",block:"start"});
  }));
  window.addEventListener("hashchange",routeFromHash);
  window.addEventListener("popstate",routeFromHash);
  updateWishlistCount();
  loadGames().then(routeFromHash);
})();
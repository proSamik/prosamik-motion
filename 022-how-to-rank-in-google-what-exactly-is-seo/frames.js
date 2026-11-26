/* Storyboard data for issue #22: How to rank in Google, what exactly is SEO?  (v4)
   ---------------------------------------------------------------------------
   v4.1 rules: rounded elevated cards, every card starts with its title (largest text) and gets
   smaller below it, no eyebrows or kickers above titles, no middle dots, no production labels on
   the frame, and on-screen graphics never say the checklist costs nothing (the spoken cue may).
   v4 keeps the v3 script, cues, timings and camera framing, and restyles the plates to
   prosamik.com: white cards, Arial 750 headlines, Caveat hand-written accent words, the
   thumbnail red (#E62117 to #E8590C) only as an accent. Every entrance is choreographed by
   engine.js (GSAP), so a frame only lists WHAT appears; the engine decides HOW it moves.

   Camera rule (unchanged): nothing ever goes above his head. Talking-head frames zoom into the
   left or right part of the camera frame, his face sits off-centre, graphics live on the open side.

   HOW TO WRITE YOUR OWN (one object per frame):
   {
     section: "Hook",            // chapter label
     time: "0:00",               // rough start time
     cue: "The exact line you say",   // also becomes the burned-in captions (2-3 words at a time)
     cam: { shot: "head", ref: 1, zoom: 1.45, face: "right" },
          // shot: "head" (talking head) | "screen" (screen share) | "cut" (full-screen cutaway)
          // ref: which of your camera looks (1 or 3 = close, 2 = slightly wider)
          // zoom: 1 | 1.25 | 1.45   face: "left" | "right" | "center"
     layers: [ { type, slot, delay, ...fields } ],
     onscreen: "Plain-English description of what appears",
     motion: "How it enters and leaves",
     deliver: "How to say it: pause, gesture, look"
   }
   slots on talking-head frames: side, side-top, side-low. They are stacked top to bottom in one
          column on the open side (centred, 28px apart), so cards never collide with each other,
          the face or the mic.
   slots on screen-share frames: win (inside the app window), pill (chapter pill above your camera
          box), win-note (hand-written note, place it with style:"left:..px;top:..px")
   slots on cutaways: full, cut-mid.   col-left: a fixed column on the wall (end screen).
   types: kicker{text,num}  (chapter title; num renders in a red box)
          headline{text,size:"sm",count}  (count: N counts the [#1] box down from #N to #1)
          card{title,body,items,ink,num}  (no eyebrows: the title is always the largest text)   items: ["text" | {t,s,ok}]  ok = tick that pops
          lowerthird{name,role}  search{query} (types on)  flow{steps:[{t,s,hi}],gap}
          chips{items:["!highlighted","plain"]}  note{text,arrow:"up"|"upr"|"down"|"left"}
          full{text,sub}  endtiles{tiles:[{t,s}]}  demo{kind:"serp"|"page"|"console", ...}
   text tricks: *word* = Caveat hand-written accent word with a drawn underline,
                [word] = solid red key-word box that wipes in, \n = new line (each line rises in)
   delay: seconds after the frame starts (use it to land a graphic on a later word in the line)
*/
window.STORYBOARD = {
  issue: 22,
  version: 4.1,
  title: "How to rank in Google, what exactly is SEO?",
  accent: ["#e62117", "#e8590c"], // from the thumbnail's red "#1" box
  frames: [
    // ---------------- HOOK ----------------
    {
      section: "Hook", time: "0:00",
      cam: { shot: "head", ref: 1, zoom: 1.45, face: "right" },
      cue: "You published the page. So why does nobody find it on Google?",
      layers: [
        { type: "search", slot: "side", query: "your page, anyone?", delay: 0.2 },
        { type: "note", slot: "side-low", text: "0 results", arrow: "up", delay: 1.7 }
      ],
      onscreen: "Zoomed in, your face on the right. On the left a search bar types \"your page, anyone?\" and a note says \"0 results\".",
      motion: "Bar rises in (0.4s), text types on. The note and its arrow draw on \"nobody\".",
      deliver: "Start mid-thought, no hello. Slight lean in. Half-second pause after \"page.\" Look straight into the lens."
    },
    {
      section: "Hook", time: "0:05",
      cam: { shot: "head", ref: 3, zoom: 1.25, face: "left" },
      cue: "It's not luck. Google follows a process, and SEO is how you work with it.",
      layers: [
        { type: "headline", slot: "side-top", text: "It's not\n*luck*." },
        { type: "headline", slot: "side-low", size: "sm", text: "It's a [process].", delay: 0.9 }
      ],
      onscreen: "Camera jumps to your face on the left. Right side: \"It's not luck.\", then \"It's a process\" with the red box.",
      motion: "Hard cut to the new side. Words slide in from the right (0.42s), underline draws. The red box lands on \"process\".",
      deliver: "Small head shake on \"not luck\". Then steady and confident on \"process\". Hands open."
    },
    {
      section: "Hook", time: "0:10",
      cam: { shot: "head", ref: 2, zoom: 1.25, face: "right" },
      cue: "By the end you'll know exactly how a page gets ranked, and you get a free checklist to do it.",
      layers: [
        { type: "headline", slot: "side-top", text: "RANK [#1]", count: 9 },
        { type: "card", slot: "side-low", title: "SEO checklist", body: "One page, beginner friendly", delay: 0.8 }
      ],
      onscreen: "Slightly wider look, face on the right. Left: the thumbnail line \"RANK #1\", then a card teasing the SEO checklist.",
      motion: "Headline in, card slides in 0.8s later on \"checklist\".",
      deliver: "Count it off: one hand for \"how it ranks\", the other toward screen-left on \"checklist\"."
    },
    // ---------------- WHY ----------------
    {
      section: "Why it matters", time: "0:15",
      cam: { shot: "head", ref: 1, zoom: 1.25, face: "left" },
      cue: "If you have a site, a blog, a SaaS or a portfolio, and you want people to find it, this is for you.",
      layers: [
        { type: "lowerthird", slot: "side-top", name: "Samik Choudhury", role: "Builds Rankizz and Subclip" },
        { type: "chips", slot: "side-low", items: ["Website", "Blog", "!SaaS", "Portfolio"], delay: 0.5 }
      ],
      onscreen: "Face on the left. Right: your name card, then four pills with SaaS highlighted.",
      motion: "Name card wipes in left to right (0.55s), pills pop in 60ms apart.",
      deliver: "Relaxed, friendly. Slight nod on each item in the list."
    },
    {
      section: "Why it matters", time: "0:22",
      cam: { shot: "head", ref: 1, zoom: 1.45, face: "right" },
      cue: "Search is where people go when they already want something.",
      layers: [{ type: "headline", slot: "side", text: "People search\nwhen they\n*want* it." }],
      onscreen: "Same look, but the camera glides across and in: face on the right. Left: big headline, \"want\" hand-written in red.",
      motion: "Camera pans and pushes over 0.6s (same take, so it moves instead of cutting). Headline slides in, underline draws under \"want\".",
      deliver: "Slow down. Lean on the word \"want\"."
    },
    {
      section: "Why it matters", time: "0:27",
      cam: { shot: "cut" },
      cue: "Show up there, and visitors come to you every day, without paying for ads.",
      layers: [
        { type: "full", slot: "full", text: "Visitors *every* day,\nwithout ads.", sub: "How search traffic works" },
        { type: "flow", slot: "cut-mid", delay: 0.5, steps: [{ t: "Search" }, { t: "Your page", hi: true }, { t: "Visitor", s: "every day, no ads" }] }
      ],
      onscreen: "Full-screen white cutaway: \"Visitors every day, without ads.\", then Search → Your page → Visitor.",
      motion: "White frame fades in, then each box slides in 0.22s after the last.",
      deliver: "You're off screen here, so keep the voice warm. Smile on \"without paying for ads\"."
    },
    // ---------------- ROADMAP ----------------
    {
      section: "Roadmap", time: "0:35",
      cam: { shot: "head", ref: 2, zoom: 1.25, face: "right" },
      cue: "Here's the whole thing in five parts.",
      layers: [
        { type: "card", slot: "side", title: "The 5 parts", items: [
          { t: "How Google works" }, { t: "Keywords" }, { t: "On-page" }, { t: "Off-page" }, { t: "Technical" }
        ] }
      ],
      onscreen: "Wider look, face on the right. Left: one card listing the five parts.",
      motion: "Card slides in, rows stagger 70ms apart.",
      deliver: "Hold up five fingers, then drop the hand. Pause one beat before the next line."
    },
    // ---------------- STEP 1 ----------------
    {
      section: "1. How Google works", time: "0:40",
      cam: { shot: "head", ref: 3, zoom: 1.45, face: "left" },
      cue: "Google does three things. It crawls, it indexes, and it ranks.",
      layers: [
        { type: "kicker", slot: "side-top", num: 1, text: "How Google works" },
        { type: "flow", slot: "side-low", delay: 0.6, gap: 0.7, steps: [{ t: "Crawl" }, { t: "Index" }, { t: "Rank", hi: true }] }
      ],
      onscreen: "Close, face on the left. Right: chapter 1 pill, then Crawl → Index → Rank.",
      motion: "Pill rises in. Each box lands on its spoken word (about 0.7s apart).",
      deliver: "One beat per word. Tap the air three times."
    },
    {
      section: "1. How Google works", time: "0:47",
      cam: { shot: "screen" },
      cue: "Crawling means Google's bot follows links and reads your pages.",
      layers: [
        { type: "demo", slot: "win", kind: "page", url: "yoursite.com/blog/post", title: "How to add subtitles to a video", hl: "links" },
        { type: "note", slot: "win-note", style: "left:1180px;top:560px", text: "the bot follows these", arrow: "left", delay: 0.8 }
      ],
      onscreen: "Screen share: one of your blog posts. The links in it get outlined, note \"the bot follows these\".",
      motion: "Hard cut to the screen layout. Outlines and the arrow draw 0.8s in.",
      deliver: "Move the mouse over a link while you say \"follows links\"."
    },
    {
      section: "1. How Google works", time: "0:53",
      cam: { shot: "head", ref: 1, zoom: 1.25, face: "left" },
      cue: "Indexing means it stores what each page is about, like a giant library catalogue.",
      layers: [{ type: "card", slot: "side", title: "A *catalogue*", body: "Google's index of every page it understood" }],
      onscreen: "Back on camera, face on the left. Right: card \"A catalogue\", with \"Google's index of every page it understood\" below.",
      motion: "Card slides in from the right, underline draws under \"catalogue\".",
      deliver: "Hands shape a big box on \"giant library\". Keep it light."
    },
    {
      section: "1. How Google works", time: "1:00",
      cam: { shot: "screen" },
      cue: "And ranking means when someone searches, it picks the most useful pages and puts them in order.",
      layers: [{ type: "demo", slot: "win", kind: "serp", query: "how to rank in google", rows: [
        { url: "bigsite.com", t: "What is SEO? The full guide" },
        { url: "yoursite.com", t: "How to rank in Google, step by step", me: true },
        { url: "forum.com", t: "SEO question thread" },
        { url: "blog.example.com", t: "10 SEO tips for beginners" }
      ] }],
      onscreen: "Screen share: a results page for \"how to rank in google\", your result outlined in red.",
      motion: "Results drop in 80ms apart, yours gets the red outline last.",
      deliver: "Scroll slowly down the results while you say \"in order\"."
    },
    {
      section: "1. How Google works", time: "1:08",
      cam: { shot: "screen" },
      cue: "So step zero: check Google can find you. Search site, colon, your domain, and see what shows up.",
      layers: [
        { type: "demo", slot: "win", kind: "serp", query: "site:yourdomain.com", rows: [
          { url: "yourdomain.com", t: "Home" },
          { url: "yourdomain.com/blog", t: "Blog" },
          { url: "yourdomain.com/pricing", t: "Pricing" }
        ], hl: "query" },
        { type: "note", slot: "win-note", style: "left:1110px;top:470px", text: "listed = Google found you", arrow: "left", delay: 1.2 }
      ],
      onscreen: "Screen share: type site:yourdomain.com. Your pages list, note \"listed = Google found you\".",
      motion: "The query box gets a red outline, results drop in, the note draws 1.2s later.",
      deliver: "Type it live and spell it out. This is the first action they take. Pause after \"shows up\"."
    },
    // ---------------- STEP 2 ----------------
    {
      section: "2. Keywords", time: "1:35",
      cam: { shot: "head", ref: 2, zoom: 1.25, face: "right" },
      cue: "Keywords are the words people actually type, not the words you'd use.",
      layers: [
        { type: "headline", slot: "side-top", text: "Their words,\nnot *yours*." },
        { type: "kicker", slot: "side-low", num: 2, text: "Keywords", delay: 0.5 }
      ],
      onscreen: "Wider look, face on the right. Left: \"Their words, not yours.\", then the chapter 2 pill below it.",
      motion: "Pill rises, headline slides in, underline under \"yours\".",
      deliver: "Point at the camera on \"people\", at yourself on \"you'd use\"."
    },
    {
      section: "2. Keywords", time: "1:42",
      cam: { shot: "head", ref: 3, zoom: 1.45, face: "left" },
      cue: "You might call it a caption generator. People actually search: add subtitles to a video.",
      layers: [
        { type: "card", slot: "side-top", title: "caption generator", body: "What you call it" },
        { type: "card", slot: "side-low", ink: true, title: "add subtitles to video", body: "What people search", delay: 1.4 }
      ],
      onscreen: "Close, face on the left. Right: a white card (what you call it), then a card with a red edge (what people search).",
      motion: "Top card in, bottom card lands 1.4s later on \"people actually search\".",
      deliver: "Shrug a little on \"caption generator\", then firm on \"add subtitles\"."
    },
    {
      section: "2. Keywords", time: "1:52",
      cam: { shot: "head", ref: 1, zoom: 1.45, face: "right" },
      cue: "Pick one main keyword per page, and make that page answer it.",
      layers: [{ type: "headline", slot: "side", text: "1 page\n= 1 *keyword*" }],
      onscreen: "Close, face on the right. Left: \"1 page = 1 keyword\".",
      motion: "Slide in, underline draws.",
      deliver: "Hold up one finger. Firm and short."
    },
    // ---------------- STEP 3 ----------------
    {
      section: "3. On-page", time: "2:15",
      cam: { shot: "screen" },
      cue: "On-page is everything Google reads on the page itself.",
      layers: [
        { type: "kicker", slot: "pill", num: 3, text: "On-page" },
        { type: "demo", slot: "win", kind: "page", url: "yoursite.com/add-subtitles", title: "How to add subtitles to a video", hl: "title" }
      ],
      onscreen: "Screen share: your page with its title outlined in red. Chapter 3 pill above your camera box.",
      motion: "Pill rises, red outline draws round the title.",
      deliver: "Neutral, explanatory. Hover the title as you say \"the page itself\"."
    },
    {
      section: "3. On-page", time: "2:22",
      cam: { shot: "head", ref: 3, zoom: 1.25, face: "left" },
      cue: "Put the keyword in the title, the main heading, and the first few lines.",
      layers: [{ type: "card", slot: "side", title: "Keyword goes in", items: [
        { t: "Page title", ok: true }, { t: "Main heading (H1)", ok: true }, { t: "First few lines", ok: true }
      ] }],
      onscreen: "Face on the left. Right: checklist card with three ticks.",
      motion: "Rows tick in one per item, 70ms stagger.",
      deliver: "Count on three fingers, one per item."
    },
    {
      section: "3. On-page", time: "2:32",
      cam: { shot: "head", ref: 1, zoom: 1.45, face: "right" },
      cue: "Then actually answer the question better than the pages already ranking.",
      layers: [{ type: "headline", slot: "side", text: "Be the\n*best* answer." }],
      onscreen: "Close, face on the right. Left: \"Be the best answer.\"",
      motion: "Headline slides in, underline draws under \"best\".",
      deliver: "Slow down, this is the key idea. Stress \"better\". Hold eye contact."
    },
    // ---------------- STEP 4 ----------------
    {
      section: "4. Off-page", time: "3:00",
      cam: { shot: "head", ref: 3, zoom: 1.25, face: "left" },
      cue: "Off-page is mostly backlinks, other sites linking to yours.",
      layers: [
        { type: "kicker", slot: "side-top", num: 4, text: "Off-page" },
        { type: "flow", slot: "side-low", delay: 0.4, steps: [{ t: "Other site" }, { t: "links to" }, { t: "Your page", hi: true }] }
      ],
      onscreen: "Face on the left. Right: chapter 4 pill, then Other site → links to → Your page.",
      motion: "Pill rises, boxes slide in one after another.",
      deliver: "Hand moves from far away toward yourself."
    },
    {
      section: "4. Off-page", time: "3:08",
      cam: { shot: "head", ref: 1, zoom: 1.45, face: "right" },
      cue: "Each link is like a vote of trust. A link from a site people trust counts for more.",
      layers: [
        { type: "headline", slot: "side-top", size: "sm", text: "A link is a\n*vote*." },
        { type: "chips", slot: "side-low", items: ["!Trusted site", "Relevant topic", "Spammy directory"], delay: 0.9 },
        { type: "note", slot: "side-low", text: "quality beats quantity", arrow: "up", delay: 1.6 }
      ],
      onscreen: "Close, face on the right. Left: \"A link is a vote.\", three pills with the trusted one highlighted, note \"quality beats quantity\".",
      motion: "Headline in, pills pop in, note and arrow draw last.",
      deliver: "Raise a hand like casting a vote on \"vote\"."
    },
    // ---------------- STEP 5 ----------------
    {
      section: "5. Technical", time: "3:40",
      cam: { shot: "head", ref: 3, zoom: 1.25, face: "left" },
      cue: "Last, the technical basics. Is it fast? Does it work on mobile?",
      layers: [
        { type: "card", slot: "side", num: 5, title: "Technical", items: [
          { t: "Loads fast" }, { t: "Works on mobile" }, { t: "Has a sitemap", s: "next video" }
        ], delay: 0.4 }
      ],
      onscreen: "Face on the left. Right: one card titled \"Technical\" with the chapter number 5, then three checks, the last one tagged \"next video\".",
      motion: "Card slides in, title rises, rows stagger.",
      deliver: "Quicker pace here. Phone gesture on \"mobile\"."
    },
    {
      section: "5. Technical", time: "3:50",
      cam: { shot: "screen" },
      cue: "And do you have a sitemap telling Google where every page is? Submit it in Search Console.",
      layers: [
        { type: "demo", slot: "win", kind: "console", site: "yoursite.com", sitemap: "sitemap.xml" },
        { type: "note", slot: "win-note", style: "left:1230px;top:392px", text: "paste it, press Submit", arrow: "upr", delay: 1 }
      ],
      onscreen: "Screen share: Search Console's Sitemaps page. You paste sitemap.xml and press Submit, a \"Success\" row appears.",
      motion: "The Submit button gets the red outline, the note draws on \"Search Console\".",
      deliver: "Do it live: paste, submit, then point at \"Success\"."
    },
    // ---------------- RECAP ----------------
    {
      section: "Recap", time: "4:15",
      cam: { shot: "head", ref: 2, zoom: 1.25, face: "right" },
      cue: "So: Google crawls, indexes and ranks. You help it with keywords, on-page, off-page and the technical basics.",
      layers: [{ type: "card", slot: "side", title: "Recap", items: [
        { t: "How Google works", ok: true }, { t: "Keywords", ok: true }, { t: "On-page", ok: true }, { t: "Off-page", ok: true }, { t: "Technical", ok: true }
      ] }],
      onscreen: "Wider look, face on the right. Left: the five parts, all ticked.",
      motion: "Card slides in, ticks stagger as you say each part.",
      deliver: "Even rhythm, one item per beat. Smile at the end."
    },
    // ---------------- GIVEAWAY ----------------
    {
      section: "Give-away", time: "4:30",
      cam: { shot: "head", ref: 3, zoom: 1.45, face: "left" },
      cue: "I put all of this on a one-page beginner SEO checklist. It's free, the link is below.",
      layers: [
        { type: "card", slot: "side-top", ink: true, title: "Beginner SEO\n*checklist*", body: "One page, link in the description" },
        { type: "note", slot: "side-low", text: "below", arrow: "down", delay: 1.2 }
      ],
      onscreen: "Close, face on the left. Right: card \"Beginner SEO checklist\" with a red edge, hand-written \"below\" with an arrow pointing down.",
      motion: "Card slides in, arrow draws on \"below\".",
      deliver: "Point down on \"below\". Warm, generous tone."
    },
    // ---------------- NEXT ----------------
    {
      section: "Next video", time: "4:40",
      cam: { shot: "head", ref: 3, zoom: 1, face: "center" },
      cue: "Next up, the sitemap: what it is and why Google needs it. Watch that one next.",
      layers: [
        { type: "endtiles", slot: "full", delay: 0.6, tiles: [{ t: "What is a sitemap?", s: "Watch next" }, { t: "Subscribe" }] }
      ],
      onscreen: "Same take as the last frame, the camera eases back out to your full frame, face centred. End-screen boxes on the wall (left, titled \"What is a sitemap?\") and the shelf (right, \"Subscribe\").",
      motion: "Camera zooms out over 0.6s, end-screen boxes fade in. Hold 10 to 20 seconds.",
      deliver: "Point to the left box on \"watch that one\". Then stay still and smile for 5 seconds so the end screen has room."
    }
  ]
};

/* Storyboard data for issue #22: How to rank in Google, what exactly is SEO?
   ---------------------------------------------------------------------------
   HOW TO WRITE YOUR OWN (one object per frame):
   {
     section: "Hook",            // chapter label
     time: "0:00",               // rough start time
     cue: "The exact line you say",
     shot: "mid" | "punch" | "wide",   // punch = 112% zoom on the face
     layers: [ { type, slot, delay, ...fields } ],
     onscreen: "Plain-English description of what appears",
     motion: "How it enters and leaves",
     deliver: "How to say it: pause, gesture, look"
   }
   slots: left, right, left-low, right-low, top, bottom, lower, full  (person stays in the centre)
   types: kicker{text} headline{text,size:"sm"} card{eyebrow,title,body,items,ink}
          list{items:[{t,s,ok}]} lowerthird{name,role} search{query} serp{rows:[{url,t,me}]}
          stat{value,label,source} flow{steps:[{t,s,hi}]} chips{items:["!highlighted","plain"]}
          note{text,flip} screen{url,caption,hl:"title"|"text"|"link"} full{text,sub,kicker} endtiles{}
   text tricks: *word* = hand-written accent word with drawn underline, [word] = red highlight box
   delay: seconds after the frame starts (use it to land a graphic on a later word in the line)
*/
window.STORYBOARD = {
  issue: 22,
  title: "How to rank in Google, what exactly is SEO?",
  accent: ["#e62117", "#e8590c"], // from the thumbnail's red "#1" box
  frames: [
    // ---------------- HOOK ----------------
    {
      section: "Hook", time: "0:00", shot: "punch",
      cue: "You published the page. So why does nobody find it on Google?",
      layers: [{ type: "search", slot: "bottom", query: "your page, anyone?", delay: 0.2 }],
      onscreen: "Close on your face. A search bar types itself across your chest area.",
      motion: "Bar rises 28px and fades in (0.4s ease-out), text types on. Cuts out with the frame.",
      deliver: "Start mid-thought, no hello. Slight lean in. Half-second pause after \"page.\" Look straight into the lens."
    },
    {
      section: "Hook", time: "0:05", shot: "mid",
      cue: "It's not luck. Google follows a process, and SEO is how you work with it.",
      layers: [
        { type: "headline", slot: "left", text: "It's not\n*luck*." },
        { type: "headline", slot: "right", size: "sm", text: "It's a\n[process].", delay: 0.9 }
      ],
      onscreen: "Left: \"It's not luck.\" Right, a beat later: \"It's a process\" with the red box.",
      motion: "Left words slide in from the right (0.42s), underline draws. Right lands on the word \"process\".",
      deliver: "Small head shake on \"not luck\". Then steady and confident on \"process\". Hands open."
    },
    {
      section: "Hook", time: "0:10", shot: "mid",
      cue: "By the end you'll know exactly how a page gets ranked, and you get a free checklist to do it.",
      layers: [
        { type: "headline", slot: "left", text: "RANK [#1]" },
        { type: "card", slot: "right", eyebrow: "Free at the end", title: "SEO checklist", body: "One page. Beginner friendly.", delay: 0.8 }
      ],
      onscreen: "Left: the thumbnail line \"RANK #1\". Right: small card teasing the free checklist.",
      motion: "Headline in, card slides in 0.8s later on \"checklist\".",
      deliver: "Count it off: one hand for \"how it ranks\", other hand toward screen-right on \"checklist\"."
    },
    // ---------------- WHY ----------------
    {
      section: "Why it matters", time: "0:15", shot: "mid",
      cue: "If you have a site, a blog, a SaaS or a portfolio, and you want people to find it, this is for you.",
      layers: [
        { type: "lowerthird", slot: "lower", name: "Samik Choudhury", role: "Builds Rankizz and Subclip" },
        { type: "chips", slot: "right", items: ["Website", "Blog", "!SaaS", "Portfolio"], delay: 0.5 }
      ],
      onscreen: "Name lower third bottom-left. Right: four pills, SaaS highlighted.",
      motion: "Lower third wipes in left to right (0.55s), chips pop in one by one (60ms apart). Lower third leaves at the cut.",
      deliver: "Relaxed, friendly. Slight nod on each item in the list."
    },
    {
      section: "Why it matters", time: "0:22", shot: "mid",
      cue: "Search is where people go when they already want something.",
      layers: [{ type: "headline", slot: "left", text: "People search\nwhen they\n*want* it." }],
      onscreen: "Left: big headline, \"want\" hand-written in red.",
      motion: "Slide in, underline draws under \"want\".",
      deliver: "Slow down. Lean on the word \"want\"."
    },
    {
      section: "Why it matters", time: "0:27", shot: "mid",
      cue: "Show up there, and visitors come to you every day, without paying for ads.",
      layers: [
        { type: "flow", slot: "bottom", steps: [{ t: "Search" }, { t: "Your page", hi: true }, { t: "Visitor", s: "every day, no ads" }] }
      ],
      onscreen: "Bottom band: Search → Your page → Visitor.",
      motion: "Each box slides in 0.22s after the last, arrows draw between them.",
      deliver: "Hand moves left to right with the three boxes. Smile on \"without paying for ads\"."
    },
    // ---------------- ROADMAP ----------------
    {
      section: "Roadmap", time: "0:35", shot: "wide",
      cue: "Here's the whole thing in five parts.",
      layers: [
        { type: "card", slot: "right", style: "top:200px", eyebrow: "The 5 parts", items: [
          { t: "How Google works" }, { t: "Keywords" }, { t: "On-page" }, { t: "Off-page" }, { t: "Technical" }
        ] }
      ],
      onscreen: "Right: one card listing the five parts. Camera slightly wider.",
      motion: "Card slides in, rows stagger 70ms apart.",
      deliver: "Hold up five fingers, then drop the hand. Pause one beat before the next line."
    },
    // ---------------- STEP 1 ----------------
    {
      section: "1 · How Google works", time: "0:40", shot: "mid",
      cue: "Google does three things. It crawls, it indexes, and it ranks.",
      layers: [
        { type: "kicker", slot: "top", text: "1 · How Google works" },
        { type: "flow", slot: "bottom", delay: 0.6, steps: [{ t: "Crawl" }, { t: "Index" }, { t: "Rank", hi: true }] }
      ],
      onscreen: "Top pill: chapter 1. Bottom: Crawl → Index → Rank.",
      motion: "Pill rises in. Each word box lands on the spoken word (about 0.7s apart).",
      deliver: "One beat per word. Tap the air three times, moving left to right."
    },
    {
      section: "1 · How Google works", time: "0:47", shot: "mid",
      cue: "Crawling means Google's bot follows links and reads your pages.",
      layers: [
        { type: "screen", slot: "left", style: "top:250px", url: "yoursite.com/blog/post", caption: "Googlebot reads this", hl: "link" },
        { type: "note", slot: "left-low", style: "left:420px;top:700px", text: "follows links", delay: 0.6 }
      ],
      onscreen: "Left: a browser window. A link is highlighted, hand-written note \"follows links\".",
      motion: "Window slides in, highlight and arrow draw 0.6s later.",
      deliver: "Glance at the window (screen-left) on \"reads your pages\", then back to camera."
    },
    {
      section: "1 · How Google works", time: "0:53", shot: "mid",
      cue: "Indexing means it stores what each page is about, like a giant library catalogue.",
      layers: [{ type: "card", slot: "right", eyebrow: "Index", title: "A *catalogue*", body: "of every page Google understood." }],
      onscreen: "Right: card \"Index: a catalogue of every page Google understood\".",
      motion: "Card slides in from the right, underline draws under \"catalogue\".",
      deliver: "Hands shape a big box on \"giant library\". Keep it light."
    },
    {
      section: "1 · How Google works", time: "1:00", shot: "mid",
      cue: "And ranking means when someone searches, it picks the most useful pages and puts them in order.",
      layers: [{ type: "serp", slot: "right", style: "top:240px", rows: [
        { url: "bigsite.com", t: "What is SEO? Full guide" },
        { url: "yoursite.com", t: "How to rank in Google", me: true, rank: 2 },
        { url: "forum.com", t: "SEO question thread", rank: 3 }
      ] }],
      onscreen: "Right: a results list, your page highlighted in red.",
      motion: "Rows stagger in 80ms apart, yours last to settle.",
      deliver: "Point to screen-right on \"in order\"."
    },
    {
      section: "1 · How Google works", time: "1:08", shot: "punch",
      cue: "So step zero: check Google can find you. Search site, colon, your domain, and see what shows up.",
      layers: [{ type: "search", slot: "bottom", query: "site:yourdomain.com", delay: 0.4 }],
      onscreen: "Punch-in. Search bar types \"site:yourdomain.com\".",
      motion: "Zoom 112% over 0.6s, bar rises in, text types on the word \"site\".",
      deliver: "Slow and clear, spell it out. This is the first action they take. Pause after \"shows up\"."
    },
    // ---------------- STEP 2 ----------------
    {
      section: "2 · Keywords", time: "1:35", shot: "mid",
      cue: "Keywords are the words people actually type, not the words you'd use.",
      layers: [
        { type: "kicker", slot: "top", text: "2 · Keywords" },
        { type: "headline", slot: "left", text: "Their words,\nnot *yours*." }
      ],
      onscreen: "Top pill: chapter 2. Left: \"Their words, not yours.\"",
      motion: "Pill rises, headline slides in, underline under \"yours\".",
      deliver: "Point at the camera on \"people\", at yourself on \"you'd use\"."
    },
    {
      section: "2 · Keywords", time: "1:42", shot: "mid",
      cue: "You might call it a caption generator. People actually search: add subtitles to a video.",
      layers: [
        { type: "card", slot: "left", eyebrow: "You say", title: "caption generator" },
        { type: "card", slot: "right", ink: true, eyebrow: "They search", title: "add subtitles to video", delay: 1.4 }
      ],
      onscreen: "Left white card: what you say. Right black card: what they search.",
      motion: "Left card in, right card lands 1.4s later on \"people actually search\".",
      deliver: "Gesture to screen-left, then screen-right. Small pause between the two."
    },
    {
      section: "2 · Keywords", time: "1:52", shot: "mid",
      cue: "Pick one main keyword per page, and make that page answer it.",
      layers: [{ type: "headline", slot: "right", text: "1 page\n= 1 *keyword*" }],
      onscreen: "Right: \"1 page = 1 keyword\".",
      motion: "Slide in, underline draws.",
      deliver: "Hold up one finger. Firm and short."
    },
    // ---------------- STEP 3 ----------------
    {
      section: "3 · On-page", time: "2:15", shot: "mid",
      cue: "On-page is everything Google reads on the page itself.",
      layers: [
        { type: "kicker", slot: "top", text: "3 · On-page" },
        { type: "screen", slot: "left", style: "top:260px", url: "yoursite.com/add-subtitles", hl: "title" }
      ],
      onscreen: "Top pill: chapter 3. Left: a page with the title highlighted.",
      motion: "Pill rises, window slides in, red outline on the title.",
      deliver: "Neutral, explanatory. Glance at the window once."
    },
    {
      section: "3 · On-page", time: "2:22", shot: "mid",
      cue: "Put the keyword in the title, the main heading, and the first few lines.",
      layers: [{ type: "card", slot: "right", style: "top:240px", eyebrow: "Keyword goes in", items: [
        { t: "Page title", ok: true }, { t: "Main heading (H1)", ok: true }, { t: "First few lines", ok: true }
      ] }],
      onscreen: "Right: checklist card with three ticks.",
      motion: "Rows tick in one per item, 70ms stagger.",
      deliver: "Count on three fingers, one per item."
    },
    {
      section: "3 · On-page", time: "2:32", shot: "punch",
      cue: "Then actually answer the question better than the pages already ranking.",
      layers: [{ type: "headline", slot: "left", text: "Be the\n*best* answer." }],
      onscreen: "Punch-in. Left: \"Be the best answer.\"",
      motion: "Zoom 112%, headline slides in.",
      deliver: "Slow down, this is the key idea. Stress \"better\". Hold eye contact."
    },
    // ---------------- STEP 4 ----------------
    {
      section: "4 · Off-page", time: "3:00", shot: "mid",
      cue: "Off-page is mostly backlinks, other sites linking to yours.",
      layers: [
        { type: "kicker", slot: "top", text: "4 · Off-page" },
        { type: "flow", slot: "bottom", delay: 0.4, steps: [{ t: "Other site" }, { t: "links to" }, { t: "Your page", hi: true }] }
      ],
      onscreen: "Top pill: chapter 4. Bottom: Other site → links to → Your page.",
      motion: "Pill rises, boxes slide in one after another.",
      deliver: "Hand moves from far screen-left toward yourself."
    },
    {
      section: "4 · Off-page", time: "3:08", shot: "mid",
      cue: "Each link is like a vote of trust. A link from a site people trust counts for more.",
      layers: [
        { type: "headline", slot: "left", size: "sm", text: "A link is a\n*vote*." },
        { type: "chips", slot: "right", items: ["!Trusted site", "Relevant topic", "Spammy directory"], delay: 0.9 },
        { type: "note", slot: "right-low", style: "top:520px", text: "quality beats quantity", delay: 1.6 }
      ],
      onscreen: "Left: \"A link is a vote.\" Right: three pills, the trusted one highlighted, note \"quality beats quantity\".",
      motion: "Headline in, pills pop in, note and arrow draw last.",
      deliver: "Raise a hand like casting a vote on \"vote\"."
    },
    // ---------------- STEP 5 ----------------
    {
      section: "5 · Technical", time: "3:40", shot: "mid",
      cue: "Last, the technical basics. Is it fast? Does it work on mobile?",
      layers: [
        { type: "kicker", slot: "top", text: "5 · Technical" },
        { type: "card", slot: "right", style: "top:240px", eyebrow: "Check", items: [
          { t: "Loads fast" }, { t: "Works on mobile" }, { t: "Has a sitemap", s: "next video" }
        ], delay: 0.4 }
      ],
      onscreen: "Top pill: chapter 5. Right: three checks, the last one tagged \"next video\".",
      motion: "Pill rises, card slides in, rows stagger.",
      deliver: "Quicker pace here. Phone gesture on \"mobile\"."
    },
    {
      section: "5 · Technical", time: "3:50", shot: "mid",
      cue: "And do you have a sitemap telling Google where every page is? Submit it in Search Console.",
      layers: [
        { type: "screen", slot: "left", style: "top:260px", url: "yoursite.com/sitemap.xml", caption: "sitemap.xml" },
        { type: "note", slot: "left-low", style: "left:420px;top:700px", text: "submit in Search Console", delay: 0.8 }
      ],
      onscreen: "Left: a browser showing sitemap.xml, note \"submit in Search Console\".",
      motion: "Window slides in, note draws on \"Search Console\".",
      deliver: "Point to screen-left on \"sitemap\"."
    },
    // ---------------- RECAP ----------------
    {
      section: "Recap", time: "4:15", shot: "wide",
      cue: "So: Google crawls, indexes and ranks. You help it with keywords, on-page, off-page and the technical basics.",
      layers: [{ type: "card", slot: "left", style: "top:200px", eyebrow: "Recap", items: [
        { t: "How Google works", ok: true }, { t: "Keywords", ok: true }, { t: "On-page", ok: true }, { t: "Off-page", ok: true }, { t: "Technical", ok: true }
      ] }],
      onscreen: "Camera slightly wider. Left: the five parts, all ticked.",
      motion: "Card slides in, ticks stagger as you say each part.",
      deliver: "Even rhythm, one item per beat. Smile at the end."
    },
    // ---------------- GIVEAWAY ----------------
    {
      section: "Give-away", time: "4:30", shot: "mid",
      cue: "I put all of this on a one-page beginner SEO checklist. It's free, the link is below.",
      layers: [
        { type: "card", slot: "right", ink: true, eyebrow: "Free download", title: "Beginner SEO\n*checklist*", body: "Link in the description" },
        { type: "note", slot: "right-low", style: "top:640px;left:1380px", text: "below", flip: true, delay: 1.2 }
      ],
      onscreen: "Right: black card \"Beginner SEO checklist\", hand-written \"below\" with an arrow pointing down.",
      motion: "Card slides in, arrow draws on \"below\".",
      deliver: "Point down on \"below\". Warm, generous tone."
    },
    // ---------------- NEXT ----------------
    {
      section: "Next video", time: "4:40", shot: "mid",
      cue: "Next up, the sitemap: what it is and why Google needs it. Watch that one next.",
      layers: [
        { type: "kicker", slot: "top", text: "Up next: what is a sitemap?" },
        { type: "endtiles", slot: "bottom", style: "bottom:330px", delay: 0.6 }
      ],
      onscreen: "Top pill: up next. Two end-screen boxes either side of you (YouTube end screen goes here).",
      motion: "Pill rises, end-screen boxes fade in. Hold 10 to 20 seconds.",
      deliver: "Point to the left box on \"watch that one\". Then stay still and smile for 5 seconds so the end screen has room."
    }
  ]
};

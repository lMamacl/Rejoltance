RE:Joltance - web build (PC-first, 1920x1080 stage that scales to the window)
Host the folder on any static host or run:  python3 -m http.server  inside web/  then open http://localhost:8000
Controls: click a hand card (or press 1-8). Units -> click a glowing lane. Targeted spells -> click a red-outlined unit.
Spells with no target (HellFire, Excision Conjucture, The Pale, Curtain Call...) -> whole board lights up, click anywhere on it (or Enter).
Esc / right-click / Cancel = cancel.  Enter/Space = End Turn.  L = log.  Hover any card for a zoomed view + keyword rules.
Tests: node tests/cards.test.js  (every card + 600 random bot games)

ONLINE 2-PLAYER (room codes)
Menu -> "Host Online" shows a 5-character room code (and a "Copy invite link" button). The other player picks a deck, then
"Join Online" and types the code - or just opens the invite link (?room=CODE). Each player chooses their own deck and mulligan.
How it works: the host's browser runs the game and is the referee; the guest sends its choices and sees a mirrored view with the
host's hand/deck hidden. Connection is peer-to-peer (WebRTC via PeerJS); the free public PeerJS broker only does the introduction.
Notes: keep the host's tab open (a refresh ends the game); both players should load the same deployed version (the join is refused
if the card data differs - reload with Ctrl+F5). Own broker: set window.RJ_PEER={host,port,path,secure} before net.js loads.
Files: net.js (online layer), peerjs.min.js (PeerJS 1.5.4, vendored), small hooks in ui.js.

MENU / SETTINGS / SOUND
Main menu: two tiles - "Play with a friend" (opens Host Online / Join Online) and "Play with the bot" (opens your deck + bot deck + Start).
Settings (main menu): display name (shown on your name bar and sent to your online opponent), bot difficulty, font, sound-effects volume, music volume - all remembered in the browser.
Sound effects: put the 51 files in sfx/ (see sfx/README.txt). They also play in online games (the guest gets the same events).

ONLINE ACROSS DIFFERENT NETWORKS (TURN)
Playing over the internet between two different networks needs a TURN relay as a fallback (direct WebRTC fails behind many routers / mobile data).
net.js ships with the free public Open Relay TURN servers. They are shared and best-effort - if joining still fails, create your own free relay
(metered.ca -> TURN credentials, or Cloudflare Calls / Twilio / your own coturn) and add to index.html BEFORE the net.js script:
  <script>window.RJ_ICE=[{urls:'stun:stun.l.google.com:19302'},{urls:['turn:YOUR_HOST:80','turn:YOUR_HOST:443?transport=tcp','turns:YOUR_HOST:443?transport=tcp'],username:'USER',credential:'PASS'}];</script>

DYNAMIC MUSIC
audio/stems/*.mp3 are 7 loop-synced layers of the theme, mixed live by music.js: calm layers appear over the first rounds, and as YOUR hero health
drops (or the game drags on, or you are about to win) low strings, war drums and a dissonant choir fade in while the flute fades out.
Regenerate / tweak with  python3 tools/make_music_stems.py  (needs numpy + ffmpeg). Thresholds live in musicTargets() in music.js.
Test in the browser console:  MUS.force={hp:4,turn:9,ehp:20}   (MUS.force=null to stop).
Opened straight from disk (file://) the browser can't decode the stems, so audio/music.mp3 (the static version) plays instead - use a web server / Netlify for the dynamic mix.

RULE CHANGES (v11)
- Regifter: if it sacrifices a friendly unit only YOU draw 2; if it could not sacrifice, both heroes draw 2.
- No reshuffling: drawing from an empty deck deals fatigue damage (1, then 2, 3, ...) to that hero.
- After the mulligan each player picks "go first" / "go second". Different picks are honoured; identical picks -> random.
- Cost reductions on a unit (e.g. The Creature) are kept when it dies / returns to hand / is bounced.
- Drawing from the discard pile takes the most recently discarded cards first.
- v11b: card text auto-shrinks to fit its box (e.g. after a unit gains keywords); first/second choice is asked AFTER you see your post-mulligan hand.

- Twins: new Transform action (a unit becomes another card in place, with a card-flip animation). Hidden pair: Failed Experiment (id 61) + Therapist (id 62); if both are on your side they become Brother (907) and Sister (908). Art: img/<id>.webp; missing art falls back to img/missing_texture.webp.
- Bonus Attack now plays a lunge animation (wind-up, strike, spring back). Transform plays a poker-style card turn-over, and the twin you just played finishes its normal play animation as its old self before both cards turn.
- Transform flip reworked: bottom-right corner lifts and the card swings over its vertical axis (left/right swap).

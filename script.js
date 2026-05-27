/* ════════════════════════════════════════════════
   FORMSPREE IDs — replace with your real IDs
   FIX: removed the broken 'partnership' key that
   referenced a non-existent standalone form
════════════════════════════════════════════════ */
var FORMSPREE = {
  enrol: 'mkoknpzq',
  perf:  'xpqkzojj',
  gen:   'xaqaylpw',
  part:  'mkoknpzq'
};

/* ── NAV ── */
function toggleMobileNav() {
  var btn   = document.getElementById('hamburger');
  var panel = document.getElementById('mobilePanel');
  var open  = panel.classList.toggle('open');
  btn.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
function closeMobileNav() {
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('hamburger').setAttribute('aria-expanded','false');
  document.getElementById('mobilePanel').classList.remove('open');
  document.body.style.overflow = '';
}
window.addEventListener('scroll', function() {
  document.getElementById('topbar').classList.toggle('scrolled', window.scrollY > 50);
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeMobileNav();
});

/* ── REVEAL ── */
var io = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: .07 });
document.querySelectorAll('.reveal').forEach(function(el) { io.observe(el); });

/* ── TABS: programs ── */
function switchProgTab(name, btn) {
  document.querySelectorAll('.prog-panel').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.prog-tab').forEach(function(b) { b.classList.remove('active'); });
  document.getElementById('prog-' + name).classList.add('active');
  btn.classList.add('active');
}

/* ── TABS: booking forms ── */
document.querySelectorAll('.form-tab-nav-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.form-tab-nav-btn').forEach(function(b) { b.classList.remove('active'); });
    document.querySelectorAll('.ftab-panel').forEach(function(p) { p.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('ftab-' + btn.dataset.ftab).classList.add('active');
  });
});

/* ── SLIDESHOW ── */
var slideIdx = 0;
var slides = document.querySelectorAll('#slideshow img');
var dots   = document.querySelectorAll('#slideDots .slide-dot');
function goSlide(n) {
  slides[slideIdx].classList.remove('active');
  dots[slideIdx].classList.remove('active');
  slideIdx = n;
  slides[slideIdx].classList.add('active');
  dots[slideIdx].classList.add('active');
}
setInterval(function() { goSlide((slideIdx + 1) % slides.length); }, 3800);

/* ── GALLERY SLIDESHOW ── */
var gallerySlideIdx = 0;
var gallerySlides = document.querySelectorAll('#gallery-slideshow img');
var galleryDots   = document.querySelectorAll('#gallery-slideDots .slide-dot');
var galleryInterval;
var galleryPlaying = true;

function goSlideGallery(n) {
  gallerySlides[gallerySlideIdx].classList.remove('active');
  galleryDots[gallerySlideIdx].classList.remove('active');
  gallerySlideIdx = n;
  gallerySlides[gallerySlideIdx].classList.add('active');
  galleryDots[gallerySlideIdx].classList.add('active');
}

function toggleGallerySlideshow() {
  var btn = document.getElementById('gallery-play-pause');
  if (galleryPlaying) {
    clearInterval(galleryInterval);
    btn.textContent = '⏸';
  } else {
    galleryInterval = setInterval(function() { goSlideGallery((gallerySlideIdx + 1) % gallerySlides.length); }, 3800);
    btn.textContent = '▶';
  }
  galleryPlaying = !galleryPlaying;
}

galleryInterval = setInterval(function() { goSlideGallery((gallerySlideIdx + 1) % gallerySlides.length); }, 3800);

/* ════════════════════════════════════════════════
   FORM VALIDATION & SUBMISSION
════════════════════════════════════════════════ */
function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }

function vField(id, fgId, check) {
  var el = document.getElementById(id);
  var fg = fgId ? document.getElementById(fgId) : null;
  var ok = check(el.value);
  el.classList.toggle('invalid', !ok);
  if (fg) fg.classList.toggle('has-err', !ok);
  return ok;
}

function validateEnrol() {
  var n = vField('en_name',  'fg_en_name',  function(v){ return v.trim().length > 1; });
  var e = vField('en_email', 'fg_en_email', isEmail);
  var a = vField('en_age',   'fg_en_age',   function(v){ return v !== ''; });
  var p = vField('en_prog',  'fg_en_prog',  function(v){ return v !== ''; });
  var l = vField('en_level', 'fg_en_level', function(v){ return v !== ''; });
  return n && e && a && p && l;
}
function validatePerf() {
  var n  = vField('pf_name',  'fg_pf_name',  function(v){ return v.trim().length > 1; });
  var e  = vField('pf_email', 'fg_pf_email', isEmail);
  var t  = vField('pf_type',  'fg_pf_type',  function(v){ return v !== ''; });
  var d  = vField('pf_date',  'fg_pf_date',  function(v){ return v !== ''; });
  var lo = vField('pf_loc',   'fg_pf_loc',   function(v){ return v.trim().length > 1; });
  var m  = vField('pf_msg',   'fg_pf_msg',   function(v){ return v.trim().length > 5; });
  return n && e && t && d && lo && m;
}
function validateGen() {
  var n = vField('gn_name',    'fg_gn_name',    function(v){ return v.trim().length > 1; });
  var e = vField('gn_email',   'fg_gn_email',   isEmail);
  var s = vField('gn_subject', 'fg_gn_subject', function(v){ return v.trim().length > 2; });
  var m = vField('gn_msg',     'fg_gn_msg',     function(v){ return v.trim().length > 5; });
  return n && e && s && m;
}
function validatePart() {
  var n = vField('pt_name',  'fg_pt_name',  function(v){ return v.trim().length > 1; });
  var e = vField('pt_email', 'fg_pt_email', isEmail);
  var t = vField('pt_type',  'fg_pt_type',  function(v){ return v !== ''; });
  var m = vField('pt_msg',   'fg_pt_msg',   function(v){ return v.trim().length > 5; });
  return n && e && t && m;
}

function collectEnrolData() {
  return {
    'Form Type':      'Enrolment Application',
    'Full Name':      document.getElementById('en_name').value.trim(),
    'email':          document.getElementById('en_email').value.trim(),
    'Phone':          document.getElementById('en_phone').value.trim() || '—',
    'Age Group':      document.getElementById('en_age').value,
    'Program':        document.getElementById('en_prog').value,
    'Level':          document.getElementById('en_level').value,
    'Qualifications': document.getElementById('en_qual').value.trim() || '—',
    'Notes':          document.getElementById('en_msg').value.trim() || '—',
    'Newsletter':     document.getElementById('en_newsletter').checked ? 'Yes' : 'No'
  };
}
function collectPerfData() {
  return {
    'Form Type':    'Performance Booking',
    'Name':         document.getElementById('pf_name').value.trim(),
    'email':        document.getElementById('pf_email').value.trim(),
    'Phone':        document.getElementById('pf_phone').value.trim() || '—',
    'Event Type':   document.getElementById('pf_type').value,
    'Event Date':   document.getElementById('pf_date').value,
    'Location':     document.getElementById('pf_loc').value.trim(),
    'Requirements': document.getElementById('pf_msg').value.trim(),
    'Newsletter':   document.getElementById('pf_newsletter').checked ? 'Yes' : 'No'
  };
}
function collectGenData() {
  return {
    'Form Type': 'General Enquiry',
    'Name':      document.getElementById('gn_name').value.trim(),
    'email':     document.getElementById('gn_email').value.trim(),
    'Subject':   document.getElementById('gn_subject').value.trim(),
    'message':   document.getElementById('gn_msg').value.trim(),
    'Newsletter': document.getElementById('gn_newsletter').checked ? 'Yes' : 'No'
  };
}
function collectPartData() {
  return {
    'Form Type':         'Partnership & Donation',
    'Name/Organization': document.getElementById('pt_name').value.trim(),
    'email':             document.getElementById('pt_email').value.trim(),
    'Phone':             document.getElementById('pt_phone').value.trim() || '—',
    'Partnership Type':  document.getElementById('pt_type').value,
    'Details':           document.getElementById('pt_msg').value.trim(),
    'Newsletter':        document.getElementById('pt_newsletter').checked ? 'Yes' : 'No'
  };
}

/* FIX: removed the broken 'partnership' entries — only 4 real forms exist */
var resetIds = {
  enrol: ['en_name','en_email','en_phone','en_age','en_prog','en_level','en_qual','en_msg'],
  perf:  ['pf_name','pf_email','pf_phone','pf_type','pf_date','pf_loc','pf_msg'],
  gen:   ['gn_name','gn_email','gn_subject','gn_msg'],
  part:  ['pt_name','pt_email','pt_phone','pt_type','pt_msg']
};

function resetLSMForm(id) {
  resetIds[id].forEach(function(fid) {
    var el = document.getElementById(fid);
    if (!el) return;
    el.tagName === 'SELECT' ? (el.selectedIndex = 0) : (el.value = '');
    el.classList.remove('invalid');
  });
  document.querySelectorAll('#ftab-' + id + ' .fg').forEach(function(fg) {
    fg.classList.remove('has-err');
  });
}

/* Clear errors on input */
document.querySelectorAll('input, select, textarea').forEach(function(el) {
  el.addEventListener('input', function() {
    el.classList.remove('invalid');
    if (el.closest('.fg')) el.closest('.fg').classList.remove('has-err');
  });
});

/* FIX: removed 'partnership' from validators/collectors — only 4 real forms */
async function submitLSMForm(id) {
  var validators = { enrol: validateEnrol, perf: validatePerf, gen: validateGen, part: validatePart };
  var collectors = { enrol: collectEnrolData, perf: collectPerfData, gen: collectGenData, part: collectPartData };

  if (!validators[id]()) return;

  var btn  = document.getElementById('btn_' + id);
  var spin = document.getElementById('spin_' + id);
  var okEl = document.getElementById('ok_' + id);
  var erEl = document.getElementById('err_' + id);
  var formId = FORMSPREE[id];

  okEl.classList.remove('show');
  erEl.classList.remove('show');
  btn.disabled = true;
  spin.style.display = 'block';

  var data = collectors[id]();

  try {
    var res = await fetch('https://formspree.io/f/' + formId, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });
    var json = await res.json();
    if (res.ok) {
      okEl.classList.add('show');
      resetLSMForm(id);
    } else {
      erEl.classList.add('show');
      console.error('Formspree error:', json);
    }
  } catch (err) {
    erEl.classList.add('show');
    console.error('Network error:', err);
  } finally {
    btn.disabled = false;
    spin.style.display = 'none';
  }
}

/* ── FULLSCREEN VIDEO ── */
function toggleFullscreen() {
  var video = document.getElementById('videoPlayer');
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.webkitRequestFullscreen) {
    video.webkitRequestFullscreen();
  } else if (video.msRequestFullscreen) {
    video.msRequestFullscreen();
  }
}

function minimizeVideo() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}
// Video click-to-play and fallback handling
(function(){
  var thumbnail = document.getElementById('videoThumbnail');
  var playBtn = document.getElementById('playVideoBtn');
  var vid = document.getElementById('videoPlayer');
  var noContent = document.getElementById('noContent');
  var toggleBtn = document.getElementById('togglePlayPause');
  if (!vid || !thumbnail) return;

  // Click to play
  if (playBtn) {
    playBtn.addEventListener('click', function(e){
      e.stopPropagation();
      thumbnail.style.display = 'none';
      vid.style.display = 'block';
      toggleBtn.style.display = 'inline-block';
      vid.play();
    });
  }

  // Toggle play/pause
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function(){
      if (vid.paused) {
        vid.play();
        toggleBtn.textContent = 'Pause';
      } else {
        vid.pause();
        toggleBtn.textContent = 'Play';
      }
    });
  }

  function showNoContent(){
    try { thumbnail.style.display = 'none'; vid.style.display = 'none'; } catch(e){}
    noContent.style.display = 'block';
  }

  // Check if video source is valid
  var sources = document.querySelectorAll('#videoPlayer source');
  vid.addEventListener('error', function(){ showNoContent(); });
  sources.forEach(function(s){ s.addEventListener('error', function(){ showNoContent(); }); });

  // Check if source exists and is valid
  var hasSrc = Array.from(sources).some(function(s){ var v = s.getAttribute('src'); return v && v.trim() !== '' && !v.includes('path/to'); });
  if (!hasSrc) showNoContent();
})();

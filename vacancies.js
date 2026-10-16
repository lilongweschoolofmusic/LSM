document.addEventListener('DOMContentLoaded', function() {
  var track = document.querySelector('.vacancies-track');
  var controls = document.querySelector('.vacancies-controls');
  var indicators = document.querySelector('.vacancy-indicators');
  var previous = document.querySelector('.vacancy-previous');
  var next = document.querySelector('.vacancy-next');

  if (!track || !controls || !indicators || !previous || !next) return;

  var slides = Array.from(track.querySelectorAll('.vacancy-card'));
  if (slides.length < 2) return;

  controls.hidden = false;

  var dots = slides.map(function(slide, index) {
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', (index + 1) + ' of ' + slides.length);

    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'vacancy-indicator';
    dot.setAttribute('aria-label', 'Show vacancy ' + (index + 1));
    dot.addEventListener('click', function() {
      scrollToSlide(index);
    });
    indicators.appendChild(dot);
    return dot;
  });

  var activeIndex = 0;

  function updateControls() {
    previous.disabled = activeIndex === 0;
    next.disabled = activeIndex === slides.length - 1;
    dots.forEach(function(dot, index) {
      if (index === activeIndex) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }
    });
  }

  function scrollToSlide(index) {
    activeIndex = index;
    updateControls();
    track.scrollTo({
      left: slides[index].offsetLeft - track.offsetLeft,
      behavior: 'smooth'
    });
  }

  track.addEventListener('scroll', function() {
    activeIndex = Math.round(track.scrollLeft / track.clientWidth);
    activeIndex = Math.max(0, Math.min(activeIndex, slides.length - 1));
    updateControls();
  });

  previous.addEventListener('click', function() {
    if (activeIndex > 0) scrollToSlide(activeIndex - 1);
  });

  next.addEventListener('click', function() {
    if (activeIndex < slides.length - 1) scrollToSlide(activeIndex + 1);
  });

  updateControls();
});

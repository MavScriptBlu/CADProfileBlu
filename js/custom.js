/* ============================================================
   Custom jQuery for Alex Morgan Personal Portfolio

   jQuery Components Implemented:
   1. Animated Scroll Effects (fade-in on scroll)
   2. Form Validation (contact form)
   3. Animated Counters (stats section)
   4. Portfolio Filtering (toggle/filter projects by category)
   ============================================================ */

$(document).ready(function () {

  /* ============================================================
     JQUERY COMPONENT 1: Animated Scroll Effects
     - Fade-in elements as they enter the viewport
     - Navbar style change on scroll
     - Back-to-top button visibility
     ============================================================ */

  // Fade-in elements on scroll
  function checkFadeIn() {
    $('.fade-in').each(function () {
      var elementTop = $(this).offset().top;
      var viewportBottom = $(window).scrollTop() + $(window).height();
      // Trigger when element is 80px into the viewport
      if (elementTop < viewportBottom - 80) {
        $(this).addClass('visible');
      }
    });
  }

  // Run on load for elements already in view
  checkFadeIn();

  // Run on scroll
  $(window).on('scroll', function () {
    checkFadeIn();

    // Navbar scroll effect
    if ($(window).scrollTop() > 50) {
      $('#mainNav').addClass('scrolled');
    } else {
      $('#mainNav').removeClass('scrolled');
    }

    // Back to top button
    if ($(window).scrollTop() > 400) {
      $('#backToTop').addClass('show');
    } else {
      $('#backToTop').removeClass('show');
    }
  });

  // Back to top click
  $('#backToTop').on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 600);
  });

  // Smooth scrolling for nav links
  $('a.nav-link[href^="#"]').on('click', function (e) {
    e.preventDefault();
    var target = $(this).attr('href');
    if ($(target).length) {
      $('html, body').animate({
        scrollTop: $(target).offset().top - 70
      }, 600);
    }
    // Close mobile nav on link click
    var navCollapse = $('#navbarNav');
    if (navCollapse.hasClass('show')) {
      navCollapse.collapse('hide');
    }
  });

  // Smooth scrolling for CTA buttons
  $('a.btn[href^="#"]').on('click', function (e) {
    e.preventDefault();
    var target = $(this).attr('href');
    if ($(target).length) {
      $('html, body').animate({
        scrollTop: $(target).offset().top - 70
      }, 600);
    }
  });

  // Update active nav link on scroll
  $(window).on('scroll', function () {
    var scrollPos = $(window).scrollTop() + 100;
    $('section[id]').each(function () {
      var sectionTop = $(this).offset().top;
      var sectionBottom = sectionTop + $(this).outerHeight();
      var sectionId = $(this).attr('id');
      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        $('a.nav-link').removeClass('active');
        $('a.nav-link[href="#' + sectionId + '"]').addClass('active');
      }
    });
  });


  /* ============================================================
     JQUERY COMPONENT 2: Form Validation
     - Validates all required fields on the contact form
     - Email format validation with regex
     - Shows success message on valid submission
     ============================================================ */

  $('#contactForm').on('submit', function (e) {
    e.preventDefault();
    var form = $(this);
    var isValid = true;

    // Reset previous validation states
    form.find('.form-control').removeClass('is-invalid is-valid');

    // Validate Name
    var name = $('#nameInput').val().trim();
    if (name.length < 2) {
      $('#nameInput').addClass('is-invalid');
      isValid = false;
    } else {
      $('#nameInput').addClass('is-valid');
    }

    // Validate Email with regex
    var email = $('#emailInput').val().trim();
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      $('#emailInput').addClass('is-invalid');
      isValid = false;
    } else {
      $('#emailInput').addClass('is-valid');
    }

    // Validate Subject
    var subject = $('#subjectInput').val().trim();
    if (subject.length < 2) {
      $('#subjectInput').addClass('is-invalid');
      isValid = false;
    } else {
      $('#subjectInput').addClass('is-valid');
    }

    // Validate Message
    var message = $('#messageInput').val().trim();
    if (message.length < 10) {
      $('#messageInput').addClass('is-invalid');
      $('#messageInput').siblings('.invalid-feedback').text('Please enter at least 10 characters.');
      isValid = false;
    } else {
      $('#messageInput').addClass('is-valid');
    }

    // If all valid, show success and reset
    if (isValid) {
      $('#formSuccessAlert').removeClass('d-none').hide().fadeIn(400);
      form[0].reset();
      form.find('.form-control').removeClass('is-valid');

      // Hide success message after 5 seconds
      setTimeout(function () {
        $('#formSuccessAlert').fadeOut(400, function () {
          $(this).addClass('d-none');
        });
      }, 5000);
    }
  });

  // Live validation: clear error state on input
  $('#contactForm .form-control').on('input', function () {
    $(this).removeClass('is-invalid');
  });


  /* ============================================================
     JQUERY COMPONENT 3: Animated Counters
     - Counts up from 0 to the target number
     - Triggers when the stats section enters the viewport
     - Runs only once
     ============================================================ */

  var countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;

    var statsSection = $('#stats');
    if (!statsSection.length) return;

    var sectionTop = statsSection.offset().top;
    var viewportBottom = $(window).scrollTop() + $(window).height();

    if (viewportBottom > sectionTop + 100) {
      countersAnimated = true;

      $('.stat-number').each(function () {
        var $this = $(this);
        var target = parseInt($this.data('target'), 10);
        var duration = 2000; // 2 seconds
        var startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          // Ease-out effect
          var eased = 1 - Math.pow(1 - progress, 3);
          var current = Math.floor(eased * target);
          $this.text(current.toLocaleString());
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            $this.text(target.toLocaleString());
          }
        }

        requestAnimationFrame(step);
      });
    }
  }

  $(window).on('scroll', animateCounters);
  // Also check on load
  animateCounters();


  /* ============================================================
     JQUERY COMPONENT 4: Portfolio Filtering
     - Filters portfolio cards by category
     - Animated show/hide with CSS transitions
     ============================================================ */

  $('.filter-group .btn').on('click', function () {
    // Update active button
    $('.filter-group .btn').removeClass('active');
    $(this).addClass('active');

    var filter = $(this).data('filter');

    if (filter === 'all') {
      $('.portfolio-item').removeClass('hide').addClass('show');
      // Restore normal flow
      setTimeout(function () {
        $('.portfolio-item').css('position', '');
      }, 400);
    } else {
      // Hide non-matching items
      $('.portfolio-item').each(function () {
        var category = $(this).data('category');
        if (category === filter) {
          $(this).removeClass('hide').addClass('show').css('position', '');
        } else {
          $(this).removeClass('show').addClass('hide');
        }
      });
    }
  });


  /* ============================================================
     Animate Progress Bars on Scroll
     (Enhances Bootstrap progress bars with jQuery)
     ============================================================ */

  var progressAnimated = false;

  function animateProgressBars() {
    if (progressAnimated) return;

    var skillsSection = $('#skills');
    if (!skillsSection.length) return;

    var sectionTop = skillsSection.offset().top;
    var viewportBottom = $(window).scrollTop() + $(window).height();

    if (viewportBottom > sectionTop + 100) {
      progressAnimated = true;

      $('.progress-bar').each(function (index) {
        var $bar = $(this);
        var target = $bar.data('target');
        // Stagger the animation
        setTimeout(function () {
          $bar.css('width', target + '%');
        }, index * 150);
      });
    }
  }

  $(window).on('scroll', animateProgressBars);
  // Also check on load
  animateProgressBars();


  /* ============================================================
     Initialize Bootstrap Tooltips
     ============================================================ */
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (el) {
    return new bootstrap.Tooltip(el);
  });

});

/**
 * THIỆP CƯỚI NGUYỄN PHƯƠNG NAM & LÊ HÀ TRANG (18/10/2026)
 * JavaScript logic: Envelope, Countdown, Audio, Lightbox, Wishes & Gift Tabs
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. CẤU HÌNH & KHỞI TẠO ÂM THANH
  const bgMusic = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-btn');
  let isPlaying = false;

  function togglePlayMusic() {
    if (!bgMusic) return;
    if (isPlaying) {
      bgMusic.pause();
      musicBtn.classList.remove('playing');
      musicBtn.setAttribute('title', 'Bật nhạc');
      showToast('Đã tạm dừng nhạc cưới');
      isPlaying = false;
    } else {
      bgMusic.play().then(() => {
        musicBtn.classList.add('playing');
        musicBtn.setAttribute('title', 'Tắt nhạc');
        showToast('Đang phát: Canon in D (Wedding Melody)');
        isPlaying = true;
      }).catch(err => {
        console.log('Autoplay was prevented:', err);
      });
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', togglePlayMusic);
  }

  // 2. HIỆU ỨNG MỞ PHONG BÌ DẤU SÁP
  const envelopeOverlay = document.getElementById('envelope-overlay');
  const envelopeWrapper = document.querySelector('.envelope-wrapper');
  const waxSeal = document.getElementById('wax-seal');

  function openEnvelope() {
    if (!envelopeWrapper || envelopeWrapper.classList.contains('open-anim')) return;

    // Kích hoạt animation mở nắp phong bì và thiệp trồi lên
    envelopeWrapper.classList.add('open-anim');

    // Thử phát nhạc ngay khi người dùng tương tác
    if (bgMusic && !isPlaying) {
      bgMusic.play().then(() => {
        if (musicBtn) musicBtn.classList.add('playing');
        isPlaying = true;
      }).catch(() => {});
    }

    // Hiệu ứng pháo hoa trái tim nhỏ
    burstHearts(window.innerWidth / 2, window.innerHeight / 2);

    // Sau khi nắp mở và thiệp trồi lên đầy đủ, ẩn overlay phong bì mượt mà
    setTimeout(() => {
      if (envelopeOverlay) {
        envelopeOverlay.classList.add('opened');
        document.body.style.overflow = 'auto';
      }
    }, 1400);
  }

  if (waxSeal) {
    waxSeal.addEventListener('click', openEnvelope);
  }
  if (envelopeWrapper) {
    envelopeWrapper.addEventListener('click', openEnvelope);
  }
  const envelopeHint = document.getElementById('envelope-hint');
  if (envelopeHint) {
    envelopeHint.addEventListener('click', openEnvelope);
  }

  // 3. ĐẾM NGƯỢC THỜI GIAN ĐẾN NGÀY CƯỚI (18/10/2026 11:00:00)
  const weddingDate = new Date('2026-10-18T11:00:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      const cdEl = document.getElementById('countdown-grid');
      if (cdEl) {
        cdEl.innerHTML = '<div style="grid-column: span 4; font-family: var(--font-classic); color: var(--color-primary); font-size: 1.3rem; font-weight: bold; padding: 15px;">HÔM NAY LÀ NGÀY TRỌNG ĐẠI! CHÚC MỪNG HẠNH PHÚC!</div>';
      }
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const elDays = document.getElementById('count-days');
    const elHours = document.getElementById('count-hours');
    const elMins = document.getElementById('count-mins');
    const elSecs = document.getElementById('count-secs');

    if (elDays) elDays.innerText = String(days).padStart(2, '0');
    if (elHours) elHours.innerText = String(hours).padStart(2, '0');
    if (elMins) elMins.innerText = String(minutes).padStart(2, '0');
    if (elSecs) elSecs.innerText = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 4. ALBUM ẢNH & LIGHTBOX
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  let currentImgIndex = 0;

  const galleryImages = [];
  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
      galleryImages.push(img.src);
      item.addEventListener('click', () => {
        openLightbox(index);
      });
    }
  });

  function openLightbox(index) {
    if (!lightboxModal || !lightboxImg || galleryImages.length === 0) return;
    currentImgIndex = index;
    lightboxImg.src = galleryImages[currentImgIndex];
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  function showNextImage() {
    if (galleryImages.length === 0) return;
    currentImgIndex = (currentImgIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentImgIndex];
  }

  function showPrevImage() {
    if (galleryImages.length === 0) return;
    currentImgIndex = (currentImgIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentImgIndex];
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });

  // 5. HỘP MỪNG CƯỚI - TABS & COPY SỐ TÀI KHOẢN
  const tabGroomBtn = document.getElementById('tab-groom-btn');
  const tabBrideBtn = document.getElementById('tab-bride-btn');
  const cardGroom = document.getElementById('gift-card-groom');
  const cardBride = document.getElementById('gift-card-bride');

  if (tabGroomBtn && tabBrideBtn && cardGroom && cardBride) {
    tabGroomBtn.addEventListener('click', () => {
      tabGroomBtn.classList.add('active');
      tabBrideBtn.classList.remove('active');
      cardGroom.classList.add('active');
      cardBride.classList.remove('active');
    });

    tabBrideBtn.addEventListener('click', () => {
      tabBrideBtn.classList.add('active');
      tabGroomBtn.classList.remove('active');
      cardBride.classList.add('active');
      cardGroom.classList.remove('active');
    });
  }

  // Nút sao chép số tài khoản
  const copyButtons = document.querySelectorAll('.btn-copy-acc');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const accNumber = btn.getAttribute('data-account');
      if (accNumber) {
        navigator.clipboard.writeText(accNumber).then(() => {
          showToast(`Đã sao chép STK: ${accNumber}`);
        }).catch(() => {
          showToast(`STK: ${accNumber}`);
        });
      }
    });
  });

  // 6. SỔ LƯU BÚT CHÚC PHÚC (GUESTBOOK)
  const defaultWishes = [
    {
      name: "Nguyễn Tuấn Anh",
      tag: "Bạn thân chú rể",
      message: "Chúc hai bạn trăm năm hạnh phúc, sớm đón quý tử! Mãi mãi ngọt ngào như ngày đầu nhé Phương Nam & Hà Trang!",
      sticker: "🥂",
      time: "Vừa xong"
    },
    {
      name: "Trần Thùy Linh",
      tag: "Bạn cô dâu",
      message: "Cô dâu Hà Trang xinh đẹp nhất hôm nay! Chúc hai bạn một đời an yên, cùng nhau vượt qua mọi chông gai và luôn yêu thương nhau.",
      sticker: "❤️",
      time: "15 phút trước"
    },
    {
      name: "Gia đình Bác Hải",
      tag: "Họ hàng",
      message: "Chúc mừng hạnh phúc hai cháu Nam và Trang. Chúc hai cháu răng long đầu bạc, thuận vợ thuận chồng!",
      sticker: "💍",
      time: "1 giờ trước"
    }
  ];

  // Khởi tạo danh sách lời chúc từ LocalStorage nếu có
  let storedWishes = JSON.parse(localStorage.getItem('wedding_wishes_nam_trang') || 'null');
  if (!storedWishes || !Array.isArray(storedWishes) || storedWishes.length === 0) {
    storedWishes = defaultWishes;
    localStorage.setItem('wedding_wishes_nam_trang', JSON.stringify(storedWishes));
  }

  const wishesWall = document.getElementById('wishes-wall');
  function renderWishes() {
    if (!wishesWall) return;
    wishesWall.innerHTML = '';
    storedWishes.forEach(item => {
      const div = document.createElement('div');
      div.className = 'wish-item';
      div.innerHTML = `
        <div class="wish-header">
          <span class="wish-author">${item.name} ${item.sticker || '❤️'}</span>
          <span class="wish-tag">${item.tag || 'Khách mời'}</span>
        </div>
        <p class="wish-message">${item.message}</p>
        <div class="wish-time">${item.time || 'Vừa xong'}</div>
      `;
      wishesWall.appendChild(div);
    });
  }
  renderWishes();

  // Chọn sticker
  const stickerChips = document.querySelectorAll('.sticker-chip');
  let selectedSticker = '❤️';
  stickerChips.forEach(chip => {
    chip.addEventListener('click', () => {
      stickerChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedSticker = chip.getAttribute('data-sticker') || '❤️';
    });
  });

  // Gửi lời chúc mới
  const wishForm = document.getElementById('wish-form');
  if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('wish-name');
      const tagInput = document.getElementById('wish-tag');
      const msgInput = document.getElementById('wish-message');

      const name = nameInput.value.trim();
      const tag = tagInput.value.trim() || 'Khách quý';
      const message = msgInput.value.trim();

      if (!name || !message) {
        showToast('Vui lòng nhập tên và lời chúc của bạn');
        return;
      }

      const newWish = {
        name,
        tag,
        message,
        sticker: selectedSticker,
        time: 'Vừa xong'
      };

      storedWishes.unshift(newWish);
      localStorage.setItem('wedding_wishes_nam_trang', JSON.stringify(storedWishes));
      renderWishes();

      nameInput.value = '';
      msgInput.value = '';

      showToast('Cảm ơn lời chúc ngọt ngào của bạn! ❤️');
      burstHearts(window.innerWidth / 2, window.innerHeight * 0.7);
    });
  }

  // 7. RSVP FORM (XÁC NHẬN THAM DỰ)
  const rsvpForm = document.getElementById('rsvp-form');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('rsvp-name').value.trim();
      const status = document.querySelector('input[name="rsvp_status"]:checked')?.value || 'Tham dự';
      
      showToast(`Cảm ơn ${name}! Chúng mình rất mong chờ được đón tiếp bạn! ❤️`);
      rsvpForm.reset();
      burstHearts(window.innerWidth / 2, window.innerHeight * 0.8);
    });
  }

  // 8. TẢI FILE LỊCH (.ICS) VÀ GOOGLE CALENDAR
  const btnIcs = document.getElementById('btn-download-ics');
  if (btnIcs) {
    btnIcs.addEventListener('click', () => {
      const icsData = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Dam Cuoi Phuong Nam Ha Trang//VI",
        "BEGIN:VEVENT",
        "UID:damcuoi-phuongnam-hatrang-20261018",
        "DTSTAMP:20261004T000000Z",
        "DTSTART:20261018T040000Z",
        "DTEND:20261018T140000Z",
        "SUMMARY:Lễ Thành Hôn - Nguyễn Phương Nam & Lê Hà Trang",
        "DESCRIPTION:Trân trọng kính mời quý khách đến dự tiệc cưới của Phương Nam & Hà Trang",
        "LOCATION:Trung Tâm Tiệc Cưới Trống Đồng Palace, Hà Nội",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Lich_Cuoi_PhuongNam_HaTrang.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Đã tải lịch nhắc hẹn (.ics) về máy');
    });
  }

  // 9. NÚT CHIA SẺ THIỆP
  const btnShare = document.getElementById('btn-share-wedding');
  if (btnShare) {
    btnShare.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: 'Thiệp Cưới - Nguyễn Phương Nam & Lê Hà Trang',
          text: 'Trân trọng kính mời bạn đến chung vui cùng gia đình chúng tôi vào ngày 18/10/2026!',
          url: window.location.href
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
          showToast('Đã sao chép liên kết thiệp cưới!');
        }).catch(() => {
          showToast('Đã sao chép liên kết!');
        });
      }
    });
  }

  // 10. HIỆU ỨNG CÁNH HOA HỒNG RƠI (CANVAS PETALS)
  const canvas = document.getElementById('petals-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const petalCount = 28;
    const petals = [];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 8 + 5,
        dx: Math.random() * 1.5 - 0.75,
        dy: Math.random() * 1.5 + 1,
        tilt: Math.random() * 10,
        tiltAngle: Math.random() * Math.PI,
        tiltAngleInc: Math.random() * 0.05 + 0.01,
        color: Math.random() > 0.3 ? 'rgba(166, 32, 36, 0.75)' : 'rgba(212, 175, 55, 0.65)'
      });
    }

    function renderPetals() {
      ctx.clearRect(0, 0, width, height);

      petals.forEach(p => {
        p.tiltAngle += p.tiltAngleInc;
        p.y += p.dy;
        p.x += Math.sin(p.tiltAngle) * 0.8 + p.dx;
        p.tilt = Math.sin(p.tiltAngle) * 12;

        if (p.y > height) {
          p.y = -15;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.ellipse(p.x, p.y, p.r, p.r * 0.6, p.tilt * Math.PI / 180, 0, 2 * Math.PI);
        ctx.fill();
      });

      requestAnimationFrame(renderPetals);
    }
    renderPetals();
  }

  // Nút bật/tắt cánh hoa
  const petalsToggleBtn = document.getElementById('petals-toggle-btn');
  if (petalsToggleBtn && canvas) {
    let petalsActive = true;
    petalsToggleBtn.addEventListener('click', () => {
      petalsActive = !petalsActive;
      canvas.style.display = petalsActive ? 'block' : 'none';
      showToast(petalsActive ? 'Đã bật hiệu ứng cánh hoa' : 'Đã tắt hiệu ứng cánh hoa');
    });
  }

  // 11. HÀM TẠO PHÁO TIM TRẢI NGHIỆM (BURST HEARTS)
  function burstHearts(x, y) {
    for (let i = 0; i < 15; i++) {
      const heart = document.createElement('div');
      heart.innerText = ['❤️', '💖', '囍', '✨', '🌸'][Math.floor(Math.random() * 5)];
      heart.style.position = 'fixed';
      heart.style.left = `${x}px`;
      heart.style.top = `${y}px`;
      heart.style.fontSize = `${Math.random() * 16 + 18}px`;
      heart.style.pointerEvents = 'none';
      heart.style.zIndex = '10005';
      heart.style.transition = 'transform 1s cubic-bezier(0.25, 1, 0.5, 1), opacity 1s ease';
      document.body.appendChild(heart);

      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 120 + 40;
      const destX = Math.cos(angle) * distance;
      const destY = Math.sin(angle) * distance;

      requestAnimationFrame(() => {
        heart.style.transform = `translate(${destX}px, ${destY}px) scale(0)`;
        heart.style.opacity = '0';
      });

      setTimeout(() => {
        heart.remove();
      }, 1000);
    }
  }

  // 12. TOAST NOTIFICATION
  function showToast(msg) {
    let toast = document.querySelector('.toast-msg');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-msg';
      document.body.appendChild(toast);
    }
    toast.innerText = msg;
    toast.classList.add('show');
    clearTimeout(toast.timeoutId);
    toast.timeoutId = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }
});

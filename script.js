let isSpinning = false;
let wheelSize = 280; // Default mobile size

// Detect device and set wheel size
function setWheelSize() {
  const width = window.innerWidth;
  
  if (width < 360) {
    wheelSize = 240;
  } else if (width < 481) {
    wheelSize = 280;
  } else if (width < 769) {
    wheelSize = 320;
  } else if (width < 1025) {
    wheelSize = 380;
  } else if (width < 1440) {
    wheelSize = 420;
  } else {
    wheelSize = 450;
  }
  
  // Adjust for landscape on mobile
  if (window.innerHeight < 500 && width < 769) {
    wheelSize = 220;
  }
  
  const canvas = document.getElementById('wheel');
  canvas.width = wheelSize;
  canvas.height = wheelSize;
  
  drawWheel();
}

function drawWheel(rotation = 0) {
  const canvas = document.getElementById('wheel');
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = canvas.width / 2;
  
  const segments = [
    { text: '10% OFF', color: '#007FFF' },
    { text: 'Free Shipping', color: '#7BCDFF' },
    { text: '15% OFF', color: '#005099' },
    { text: 'Free Protect spray on next order', color: '#007FFF' },
    { text: 'Buy 2 Get 1', color: '#7BCDFF' }
  ];
  
  const anglePerSegment = (2 * Math.PI) / segments.length;
  
  // Scale font size based on wheel size
  const fontSize = Math.max(14, Math.floor(wheelSize / 20));
  const centerRadius = Math.max(50, Math.floor(wheelSize / 7));
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);
  
  // Draw segments
  segments.forEach((segment, i) => {
    const startAngle = i * anglePerSegment - Math.PI / 2;
    const endAngle = startAngle + anglePerSegment;
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = segment.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = Math.max(2, wheelSize / 150);
    ctx.stroke();
    
    // Draw text
    ctx.save();
    const textAngle = startAngle + anglePerSegment / 2;
    ctx.rotate(textAngle + Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 3;
    ctx.fillText(segment.text, 0, -radius * 0.65);
    ctx.restore();
  });
  
  // Draw center circle
  ctx.beginPath();
  ctx.arc(0, 0, centerRadius, 0, 2 * Math.PI);
  
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, centerRadius);
  gradient.addColorStop(0, '#007FFF');
  gradient.addColorStop(1, '#005099');
  ctx.fillStyle = gradient;
  ctx.fill();
  
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = Math.max(8, wheelSize / 50);
  ctx.stroke();
  
  // Inner shadow
  ctx.beginPath();
  ctx.arc(0, 0, centerRadius - 8, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Center text
  const centerFontSize = Math.max(16, Math.floor(wheelSize / 22));
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${centerFontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 6;
  ctx.fillText('SPIN', 0, -centerFontSize / 4);
  
  ctx.font = `bold ${Math.floor(centerFontSize * 0.7)}px Arial`;
  ctx.fillText('NOW', 0, centerFontSize / 2);
  
  ctx.restore();
}

// Initialize
setWheelSize();

// Handle resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (!isSpinning) {
      setWheelSize();
    }
  }, 250);
});

// Handle orientation change
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    if (!isSpinning) {
      setWheelSize();
    }
  }, 300);
});

function isClickOnCenter(x, y, canvas) {
  const rect = canvas.getBoundingClientRect();
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const clickX = (x - rect.left) * (canvas.width / rect.width);
  const clickY = (y - rect.top) * (canvas.height / rect.height);
  
  const centerRadius = Math.max(50, Math.floor(wheelSize / 7));
  const distance = Math.sqrt(Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2));
  return distance <= centerRadius;
}

// Touch and click events
const canvas = document.getElementById('wheel');

canvas.addEventListener('click', function(e) {
  if (!isSpinning && isClickOnCenter(e.clientX, e.clientY, this)) {
    spin();
  }
});

canvas.addEventListener('touchstart', function(e) {
  e.preventDefault();
  if (!isSpinning) {
    const touch = e.touches[0];
    if (isClickOnCenter(touch.clientX, touch.clientY, this)) {
      spin();
    }
  }
}, { passive: false });

canvas.addEventListener('mousemove', function(e) {
  if (!isSpinning && isClickOnCenter(e.clientX, e.clientY, this)) {
    this.style.cursor = 'pointer';
  } else {
    this.style.cursor = 'default';
  }
});

function spin() {
  if (isSpinning) return;
  
  const canvas = document.getElementById('wheel');
  isSpinning = true;
  canvas.classList.add('spinning');
  
  // Haptic feedback on mobile
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
  
  const spins = 5 + Math.random() * 3;
  const finalRotation = spins * 2 * Math.PI + Math.random() * 2 * Math.PI;
  
  const startTime = Date.now();
  const duration = 7000;
  
  function animate() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const currentRotation = finalRotation * easeOut;
    
    drawWheel(currentRotation);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Haptic feedback on completion
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      
      setTimeout(() => {
        window.location.href = 'reward.html';
      }, 500);
    }
  }
  
  animate();
}

let isSpinning = false;
let wheelSize = 280;

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
    { text: 'Free\nProtect\nSpray', color: '#007FFF' },
    { text: 'Buy 2 Get 1', color: '#7BCDFF' }
  ];
  
  const anglePerSegment = (2 * Math.PI) / segments.length;
  const fontSize = Math.max(14, Math.floor(wheelSize / 20));
  const centerRadius = Math.max(50, Math.floor(wheelSize / 7));
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);
  
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
    
    ctx.save();
    const textAngle = startAngle + anglePerSegment / 2;
    ctx.rotate(textAngle + Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFFFFF';
    
    const lines = segment.text.split('\n');
    
    let adjustedFontSize;
    if (lines.length >= 3) {
      adjustedFontSize = Math.max(10, Math.floor(fontSize * 0.65));
    } else if (lines.length === 2) {
      adjustedFontSize = Math.max(12, Math.floor(fontSize * 0.75));
    } else {
      adjustedFontSize = fontSize;
    }
    
    ctx.font = `bold ${adjustedFontSize}px Arial`;
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 3;
    
    const lineHeight = adjustedFontSize * 1.5;
    const totalHeight = (lines.length - 1) * lineHeight;
    const startY = -radius * 0.65 - totalHeight / 2;
    
    lines.forEach((line, lineIndex) => {
      ctx.fillText(line, 0, startY + (lineIndex * lineHeight));
    });
    
    ctx.restore();
  });
  
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
  
  ctx.beginPath();
  ctx.arc(0, 0, centerRadius - 8, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 2;
  ctx.stroke();
  
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

setWheelSize();

let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (!isSpinning) {
      setWheelSize();
    }
  }, 250);
});

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
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      
      setTimeout(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email') || '';
        const name = urlParams.get('name') || '';
        
        const selectedReward = getSelectedSegment(finalRotation);
        
        console.log('Redirecting:', { email, name, reward: selectedReward });
        
        window.location.href = `reward.html?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&reward=${encodeURIComponent(selectedReward)}`;
      }, 500);
    }
  }
  
  animate();
}

function getSelectedSegment(rotation) {
  const segments = [
    '10% OFF',
    'Free Shipping',
    '15% OFF',
    'Free Protect Spray',
    'Buy 2 Get 1'
  ];
  
  const normalizedRotation = rotation % (2 * Math.PI);
  const segmentAngle = (2 * Math.PI) / segments.length;
  
  // Arrow points up - calculate which segment is at top
  let segmentAtTop = Math.floor((normalizedRotation + Math.PI / 2) / segmentAngle) % segments.length;
  segmentAtTop = (segments.length - segmentAtTop) % segments.length;
  
  console.log('Selected:', segments[segmentAtTop]);
  
  return segments[segmentAtTop];
}

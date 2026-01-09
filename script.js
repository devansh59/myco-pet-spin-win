// Draw the wheel with Myco Pet blue theme
function drawWheel(rotation = 0) {
  const canvas = document.getElementById('wheel');
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = canvas.width / 2;
  
  const segments = [
    { text: '10% OFF', color: '#007FFF' },
    { text: 'SAMPLE', color: '#7BCDFF' },
    { text: '15% OFF', color: '#005099' },
    { text: 'SHIPPING', color: '#007FFF' },
    { text: '20% OFF', color: '#7BCDFF' },
    { text: 'GIFT', color: '#005099' }
  ];
  
  const anglePerSegment = (2 * Math.PI) / segments.length;
  
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
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw text
    ctx.save();
    const textAngle = startAngle + anglePerSegment / 2;
    ctx.rotate(textAngle + Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Arial';
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 4;
    ctx.fillText(segment.text, 0, -radius * 0.65);
    ctx.restore();
  });
  
  // Draw center circle
  ctx.beginPath();
  ctx.arc(0, 0, 50, 0, 2 * Math.PI);
  ctx.fillStyle = '#005099';
  ctx.fill();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 8;
  ctx.stroke();
  
  // Draw "SPIN" text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 6;
  ctx.fillText('SPIN', 0, 0);
  
  ctx.restore();
}

// Initialize wheel
drawWheel();

// Spin function
function spin() {
  const canvas = document.getElementById('wheel');
  const btn = document.getElementById('btn');
  
  btn.disabled = true;
  btn.style.opacity = '0.6';
  
  const spins = 5 + Math.random() * 3;
  const finalRotation = spins * 2 * Math.PI + Math.random() * 2 * Math.PI;
  
  const startTime = Date.now();
  const duration = 7000;
  
  function animate() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const currentRotation = finalRotation * easeOut;
    
    drawWheel(currentRotation);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      setTimeout(() => {
        window.location.href = 'reward.html';
      }, 500);
    }
  }
  
  animate();
}

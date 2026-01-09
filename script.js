let isSpinning = false;

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
    
    ctx.save();
    const textAngle = startAngle + anglePerSegment / 2;
    ctx.rotate(textAngle + Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px Arial';
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 4;
    ctx.fillText(segment.text, 0, -radius * 0.65);
    ctx.restore();
  });
  
  ctx.beginPath();
  ctx.arc(0, 0, 65, 0, 2 * Math.PI);
  
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 65);
  gradient.addColorStop(0, '#007FFF');
  gradient.addColorStop(1, '#005099');
  ctx.fillStyle = gradient;
  ctx.fill();
  
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 10;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(0, 0, 55, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 8;
  ctx.fillText('SPIN', 0, -5);
  
  ctx.font = 'bold 16px Arial';
  ctx.fillText('NOW', 0, 15);
  
  ctx.restore();
}

drawWheel();

function isClickOnCenter(x, y, canvas) {
  const rect = canvas.getBoundingClientRect();
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const clickX = (x - rect.left) * (canvas.width / rect.width);
  const clickY = (y - rect.top) * (canvas.height / rect.height);
  
  const distance = Math.sqrt(Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2));
  return distance <= 65;
}

document.getElementById('wheel').addEventListener('click', function(e) {
  if (!isSpinning && isClickOnCenter(e.clientX, e.clientY, this)) {
    spin();
  }
});

document.getElementById('wheel').addEventListener('mousemove', function(e) {
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
      setTimeout(() => {
        window.location.href = 'reward.html';
      }, 500);
    }
  }
  
  animate();
}

function spin() {
  const wheel = document.getElementById('wheel');
  const btn = document.getElementById('btn');
  
  // Disable button
  btn.disabled = true;
  btn.style.opacity = '0.6';
  
  // Calculate random rotation (5-8 full spins + random position)
  const spins = 5 + Math.random() * 3;
  const degrees = spins * 360 + Math.random() * 360;
  
  // Apply rotation
  wheel.style.transform = `rotate(${degrees}deg)`;
  
  // Optional: Add sound effect here
  // const spinSound = new Audio('spin-sound.mp3');
  // spinSound.play();
  
  // Redirect to reward page after spin completes
  setTimeout(() => {
    window.location.href = 'reward.html';
  }, 7500);
}

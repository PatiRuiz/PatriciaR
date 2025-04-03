document.addEventListener('DOMContentLoaded', function() {
    // Create custom cursor elements
    const cursorContainer = document.createElement('div');
    cursorContainer.className = 'cursor-container';

    // Main cursor (heart shape)
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    
    // Add the heart SVG inside the cursor
    cursor.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="#e79cd7">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
    `;
    
    // Create the sparkle trail container
    const trailContainer = document.createElement('div');
    trailContainer.className = 'trail-container';
    
    // Add elements to the DOM
    cursorContainer.appendChild(cursor);
    document.body.appendChild(cursorContainer);
    document.body.appendChild(trailContainer);
    
    // Hide the default cursor
    document.body.style.cursor = 'none';
    
    // Add "no-cursor" class to the entire document
    document.documentElement.classList.add('no-cursor');
    
    // Track cursor position
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    // Sparkle trail particles array
    const particles = [];
    const sparkleColors = ['#e79cd7', '#8A3E6E', '#f5b6e6', '#ffffff', '#f3c1ff'];
    
    // Sparkle shapes (will rotate between these)
    const sparkleShapes = [
        // Star shape
        `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12,1.5l2.61,6.727l6.89.53-5.278,4.688l1.65,6.744L12,16.67L6.128,20.189l1.65-6.744L2.5,8.757l6.89-.53L12,1.5z"/></svg>`,
        // Simple sparkle
        `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12,0l1.5,9L24,12l-10.5,3L12,24l-1.5-9L0,12l10.5-3L12,0z"/></svg>`,
        // Circle
        `<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="12"/></svg>`
    ];
    
    // Update cursor position based on mouse movement
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Create new sparkle particle
        if (Math.random() > 0.8) { // Only create particle 20% of the time for performance
            createSparkle(mouseX, mouseY);
        }
    });
    
    // Make form elements still usable
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [role="button"]');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.documentElement.classList.remove('no-cursor');
            cursor.style.opacity = '0.5'; // Fade the cursor
        });
        
        el.addEventListener('mouseleave', () => {
            document.documentElement.classList.add('no-cursor');
            cursor.style.opacity = '1'; // Show the cursor
        });
    });
    
    // Create a sparkle particle
    function createSparkle(x, y) {
        // Create sparkle element
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        // Randomize sparkle properties
        const size = Math.random() * 10 + 5; // Size between 5-15px
        const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
        const shape = sparkleShapes[Math.floor(Math.random() * sparkleShapes.length)];
        const angle = Math.random() * 360; // Random rotation
        
        // Set sparkle styles
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.innerHTML = shape;
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
        sparkle.querySelector('path, circle').setAttribute('fill', color);
        
        // Add to DOM
        trailContainer.appendChild(sparkle);
        
        // Add to particles array
        const particle = {
            element: sparkle,
            x: x,
            y: y,
            size: size,
            angle: angle,
            speedX: (Math.random() - 0.5) * 2, // Random direction
            speedY: Math.random() * -3 - 1,    // Move up with random speed
            rotation: (Math.random() - 0.5) * 5, // Random rotation speed
            opacity: 1,
            life: 100 // Particle lifespan
        };
        
        particles.push(particle);
        
        // Remove when animation ends
        setTimeout(() => {
            particles.splice(particles.indexOf(particle), 1);
            trailContainer.removeChild(sparkle);
        }, 1000); // Match this to the CSS animation duration
    }
    
    // Animation loop
    function animate() {
        // Smooth cursor movement
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        
        // Update cursor position with transform translate
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        
        // Update all particles
        particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.angle += particle.rotation;
            particle.life -= 1;
            particle.opacity = particle.life / 100;
            
            // Update particle element
            particle.element.style.left = `${particle.x}px`;
            particle.element.style.top = `${particle.y}px`;
            particle.element.style.transform = `translate(-50%, -50%) rotate(${particle.angle}deg)`;
            particle.element.style.opacity = particle.opacity;
            particle.element.style.scale = particle.opacity;
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
});
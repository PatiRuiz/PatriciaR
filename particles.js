// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // First, make sure the canvas element exists
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) {
        console.error('Canvas element with id "particleCanvas" not found');
        // Create the canvas if it doesn't exist
        const newCanvas = document.createElement('canvas');
        newCanvas.id = 'particleCanvas';
        newCanvas.style.position = 'fixed';
        newCanvas.style.top = '0';
        newCanvas.style.left = '0';
        newCanvas.style.width = '100%';
        newCanvas.style.height = '100%';
        newCanvas.style.zIndex = '-1';
        document.body.insertBefore(newCanvas, document.body.firstChild);
        console.log('Created new canvas element');
        return; // Reload the page to initialize with the new canvas
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get 2D context from canvas');
        return;
    }
    
    console.log('Canvas initialized successfully');
    
    // Get the navbar height
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 60;
    console.log('Navbar height:', navbarHeight);
    
    // Set canvas size - IMPORTANT
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        console.log('Canvas resized to:', canvas.width, 'x', canvas.height);
    }
    
    // Initial resize
    resizeCanvas();
    
    // Mouse position tracking
    let mouse = {
        x: undefined,
        y: undefined,
        radius: Math.min(150, window.innerWidth / 8)
    };
    
    // Track mouse movement
    document.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    // Basic particle class - simplified for reliability
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            // Start particles below navbar
            this.y = Math.random() * (canvas.height - navbarHeight) + navbarHeight;
            // Adjust size based on screen
            this.size = window.innerWidth <= 768 ? 2 : 3;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
        }
        
        draw() {
            if (this.y >= navbarHeight) {
                ctx.fillStyle = 'rgba(231, 156, 215, 0.8)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
        }
        
        update() {
            if (mouse.x && mouse.y) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius && distance > 0) {
                    // Calculate force direction
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    // Calculate force
                    let force = (mouse.radius - distance) / mouse.radius;
                    // Movement based on force
                    let directionX = forceDirectionX * force * this.density;
                    let directionY = forceDirectionY * force * this.density;
                    
                    // Apply force
                    this.x -= directionX;
                    this.y -= directionY;
                }
            }
            
            // Return to original position
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx/10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy/10;
            }
            
            // Keep particles below navbar
            if (this.y < navbarHeight) {
                this.y = navbarHeight;
            }
        }
    }
    
    // Create particles array
    const particles = [];
    
    // Initialize particles based on screen size
    function initParticles() {
        particles.length = 0; // Clear existing particles
        
        let particleCount;
        if (window.innerWidth <= 480) {
            // Mobile phones
            particleCount = 80;
        } else if (window.innerWidth <= 768) {
            // Tablets
            particleCount = 150;
        } else if (window.innerWidth <= 1200) {
            // Small laptops
            particleCount = 220;
        } else {
            // Large screens
            particleCount = 280;
        }
        
        console.log(`Initializing ${particleCount} particles for screen width: ${window.innerWidth}px`);
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Initialize particles
    initParticles();
    
    // Main animation function
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw all particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        connectParticles();
        
        // Continue animation loop
        requestAnimationFrame(animate);
    }
    
    // Connect particles with lines
    function connectParticles() {
        const connectionDistance = window.innerWidth <= 768 ? 80 : 120;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i; j < particles.length; j++) {
                // Skip navbar area
                if (particles[i].y < navbarHeight || particles[j].y < navbarHeight) {
                    continue;
                }
                
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    let opacity = 1 - (distance / connectionDistance);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = window.innerWidth <= 768 ? 0.6 : 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Resize canvas
        resizeCanvas();
        // Update mouse radius
        mouse.radius = Math.min(150, window.innerWidth / 8);
        // Reinitialize particles for new screen size
        initParticles();
        
        console.log('Window resized, particles reinitialized');
    });
    
    // Touch events for mobile
    canvas.addEventListener('touchmove', function(event) {
        event.preventDefault();
        mouse.x = event.touches[0].clientX;
        mouse.y = event.touches[0].clientY;
    });
    
    canvas.addEventListener('touchend', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    });
    
    // Start animation
    console.log('Starting animation');
    animate();
});

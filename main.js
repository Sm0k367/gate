// --- EPIC TECH AI // THE ARCHITECTS // CINEMATIC GLIDE ---
let audioContext, analyzer, dataArray, source, audio;
let isPlaying = false;
let progress = 0;

// THE VELOCITY: Reduced by 70% for a smooth, readable flow
const velocity = 0.00015; 

// --- THREE.JS FOUNDATION ---
const scene = new THREE.Scene();
// Deep atmosphere instead of pure black
scene.fog = new THREE.FogExp2(0x0a1012, 0.02);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('tribute-canvas'), 
    antialias: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 1. THE ARCHITECTS (The Heavy Hitters)
const hitters = [
    "@threejs", "@mrdoob", "@Vercel", "@p01", 
    "@Anemone_Eth", "@Rainmaker1973", "@Future_Explore", 
    "@CyberpunkGame", "@OpenFreeAI", "@Design_Critique", "@Framer"
];

// 2. THE PATH (Extended for more space between names)
const points = [];
for (let i = 0; i <= 20; i++) {
    points.push(new THREE.Vector3(
        Math.sin(i * 0.4) * 20, 
        Math.cos(i * 0.3) * 20, 
        i * 60 // Spacing stretched out
    ));
}
const curve = new THREE.CatmullRomCurve3(points);
curve.closed = true;

// 3. THE TUNNEL (Luminous Architecture)
const tubeGeom = new THREE.TubeGeometry(curve, 250, 6, 20, true);
const tubeMat = new THREE.MeshStandardMaterial({
    color: 0x00f2ff,
    emissive: 0x00f2ff,
    emissiveIntensity: 0.5,
    wireframe: true,
    transparent: true,
    opacity: 0.2,
    side: THREE.BackSide
});
const tunnel = new THREE.Mesh(tubeGeom, tubeMat);
scene.add(tunnel);

// 4. SPATIAL NAMES (Bigger, Brighter, Clearer)
const tagSprites = [];
hitters.forEach((handle, i) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 2048; // High resolution for text
    canvas.height = 512;
    
    // Gradient text for that "Holographic" look
    const grad = ctx.createLinearGradient(0, 0, 2048, 0);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.5, "#00f2ff");
    grad.addColorStop(1, "#ffffff");
    
    ctx.fillStyle = grad;
    ctx.font = "900 180px Syncopate";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0, 242, 255, 0.8)";
    ctx.shadowBlur = 30;
    ctx.fillText(handle.toUpperCase(), 1024, 256);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0 });
    const sprite = new THREE.Sprite(material);
    
    // Spread them out significantly
    const p = i / hitters.length;
    const pos = curve.getPointAt(p);
    sprite.position.copy(pos).add(new THREE.Vector3(0, 2, 0));
    sprite.scale.set(16, 4, 1);
    
    sprite.userData = { handle: handle, threshold: p };
    tagSprites.push(sprite);
    scene.add(sprite);
});

// 5. THE LIGHTING (High Intensity)
const light = new THREE.PointLight(0xffffff, 80, 100);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.2));

// --- AUDIO & LAUNCH ---
const audioInput = document.getElementById('audio-input');
const launchBtn = document.getElementById('launch-btn');

audioInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        audio = new Audio(URL.createObjectURL(file));
        document.getElementById('status-text').innerHTML = `<span class="text-white">STREAM LOADED:</span><br>${file.name.toUpperCase()}`;
        launchBtn.classList.remove('hidden');
    }
});

launchBtn.addEventListener('click', async () => {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    await audioContext.resume();
    source = audioContext.createMediaElementSource(audio);
    analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256;
    source.connect(analyzer);
    analyzer.connect(audioContext.destination);
    dataArray = new Uint8Array(analyzer.frequencyBinCount);

    gsap.to("#setup-overlay", { opacity: 0, scale: 1.1, duration: 2.5, onComplete: () => {
        document.getElementById('setup-overlay').style.display = 'none';
        document.getElementById('interface').style.opacity = '1';
        audio.play();
        isPlaying = true;
    }});
});

// --- ENGINE LOOP ---
function animate() {
    requestAnimationFrame(animate);

    if (isPlaying) {
        analyzer.getByteFrequencyData(dataArray);
        const bass = dataArray[2];

        // Smooth glide with very subtle audio reactivity
        progress += velocity + (bass * 0.000001);
        if (progress > 1) progress = 0;

        const pos = curve.getPointAt(progress);
        const lookAt = curve.getPointAt((progress + 0.02) % 1);
        camera.position.copy(pos);
        camera.lookAt(lookAt);
        light.position.copy(pos);

        // Update UI Flow
        document.getElementById('hz-display').innerText = `${(bass / 2.55).toFixed(2)}%`;
        
        // Tag Visibility & HUD Update
        tagSprites.forEach(sprite => {
            const dist = camera.position.distanceTo(sprite.position);
            
            // Fade in/out names as you glide past
            if (dist < 40) {
                sprite.material.opacity = Math.min(1, (40 - dist) / 15);
                
                // When we are closest, update the HUD
                if (dist < 12) {
                    const tagEl = document.getElementById('active-tag');
                    if (tagEl.innerText !== sprite.userData.handle) {
                        tagEl.innerText = sprite.userData.handle;
                    }
                }
            } else {
                sprite.material.opacity = 0;
            }
        });

        // Slow color cycle
        const time = Date.now() * 0.0001;
        tubeMat.color.setHSL(time % 1, 0.8, 0.5);
        light.intensity = 60 + (bass / 4);
    }
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

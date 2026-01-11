// --- EPIC TECH AI // THE COLLECTIVE // MASS-FOLLOWER ENGINE ---

// 1. THE ROSTER: Add all your verified followers here in quotes separated by commas.
const followers = [
    "@threejs", "@mrdoob", "@Vercel", "@p01", "@Anemone_Eth", 
    "@Rainmaker1973", "@Future_Explore", "@CyberpunkGame", 
    "@OpenFreeAI", "@Design_Critique", "@Framer", 
    // Add the rest of your followers here...
    "@Follower_1", "@Follower_2", "@Follower_3" 
];

let audioContext, analyzer, dataArray, source, audio;
let isPlaying = false;
let progress = 0;
const velocity = 0.00012; // Slow cinematic glide

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a1012, 0.02);

const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('tribute-canvas'), 
    antialias: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 2. THE PATH (Extended for the crowd)
const points = [];
const pathSegments = Math.max(20, followers.length); // Scales path length to follower count
for (let i = 0; i <= pathSegments; i++) {
    points.push(new THREE.Vector3(
        Math.sin(i * 0.4) * 25, 
        Math.cos(i * 0.3) * 25, 
        i * 70 
    ));
}
const curve = new THREE.CatmullRomCurve3(points);
curve.closed = true;

// 3. THE TUNNEL
const tubeGeom = new THREE.TubeGeometry(curve, pathSegments * 10, 8, 20, true);
const tubeMat = new THREE.MeshStandardMaterial({
    color: 0x00f2ff,
    emissive: 0x00f2ff,
    emissiveIntensity: 0.4,
    wireframe: true,
    transparent: true,
    opacity: 0.15,
    side: THREE.BackSide
});
const tunnel = new THREE.Mesh(tubeGeom, tubeMat);
scene.add(tunnel);

// 4. GENERATING FOLLOWER SPRITES
const tagSprites = [];
followers.forEach((handle, i) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 256;
    
    ctx.fillStyle = "white";
    ctx.font = "900 80px Syncopate";
    ctx.textAlign = "center";
    ctx.shadowColor = "cyan";
    ctx.shadowBlur = 15;
    ctx.fillText(handle.toUpperCase(), 512, 128);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0 });
    const sprite = new THREE.Sprite(material);
    
    // Spread them perfectly along the infinite loop
    const p = i / followers.length;
    const pos = curve.getPointAt(p);
    sprite.position.copy(pos).add(new THREE.Vector3(0, 3, 0));
    sprite.scale.set(12, 3, 1);
    
    sprite.userData = { handle: handle };
    tagSprites.push(sprite);
    scene.add(sprite);
});

const light = new THREE.PointLight(0xffffff, 100, 150);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.1));

// --- AUDIO LOGIC ---
const audioInput = document.getElementById('audio-input');
const launchBtn = document.getElementById('launch-btn');

audioInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        audio = new Audio(URL.createObjectURL(file));
        document.getElementById('status-text').innerHTML = `COLLECTIVE SIGNAL READY`;
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

    gsap.to("#setup-overlay", { opacity: 0, scale: 1.2, duration: 3, onComplete: () => {
        document.getElementById('setup-overlay').style.display = 'none';
        document.getElementById('interface').style.opacity = '1';
        audio.play();
        isPlaying = true;
    }});
});

// --- RENDER LOOP ---
function animate() {
    requestAnimationFrame(animate);

    if (isPlaying) {
        analyzer.getByteFrequencyData(dataArray);
        const bass = dataArray[2];

        progress += velocity + (bass * 0.0000005);
        if (progress > 1) progress = 0;

        const pos = curve.getPointAt(progress);
        const lookAt = curve.getPointAt((progress + 0.015) % 1);
        camera.position.copy(pos);
        camera.lookAt(lookAt);
        light.position.copy(pos);

        document.getElementById('hz-display').innerText = `${(bass / 2.55).toFixed(2)}%`;
        
        tagSprites.forEach(sprite => {
            const dist = camera.position.distanceTo(sprite.position);
            // Dynamic Visibility: Names appear as you approach and fade as you pass
            if (dist < 50) {
                sprite.material.opacity = Math.min(1, (50 - dist) / 20);
                if (dist < 15) {
                    const tagEl = document.getElementById('active-tag');
                    if (tagEl.innerText !== sprite.userData.handle) {
                        tagEl.innerText = sprite.userData.handle;
                    }
                }
            } else {
                sprite.material.opacity = 0;
            }
        });

        // Slow cinematic color shift
        tubeMat.color.setHSL((Date.now() * 0.00005) % 1, 0.7, 0.5);
    }
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- EPIC TECH AI // THE HEAVY HITTERS PROTOCOL ---
let audioContext, analyzer, dataArray, source, audio;
let isPlaying = false;
let progress = 0;
const velocity = 0.0008; 

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.05);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('tribute-canvas'), 
    antialias: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 1. THE ARCHITECTS (The Heavy Hitters)
const hitters = [
    "@threejs", "@mrdoob", "@Vercel", "@p01", "@Anemone_Eth", 
    "@Rainmaker1973", "@Future_Explore", "@CyberpunkGame", 
    "@OpenFreeAI", "@Design_Critique", "@Framer"
];

// 2. THE PATH
const points = [];
for (let i = 0; i <= 20; i++) {
    points.push(new THREE.Vector3(
        Math.sin(i * 0.8) * 15, 
        Math.cos(i * 0.5) * 15, 
        i * 40
    ));
}
const curve = new THREE.CatmullRomCurve3(points);
curve.closed = true;

// 3. THE TUNNEL (Emissive Wireframe)
const tubeGeom = new THREE.TubeGeometry(curve, 200, 4, 12, true);
const tubeMat = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    wireframe: true,
    transparent: true,
    opacity: 0.3,
    side: THREE.BackSide
});
const tunnel = new THREE.Mesh(tubeGeom, tubeMat);
scene.add(tunnel);

// 4. SPATIAL TAGS (Placing the names in 3D space)
const textGroup = new THREE.Group();
const tagSprites = [];

hitters.forEach((handle, i) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 256;
    ctx.fillStyle = "white";
    ctx.font = "bold 120px Syncopate";
    ctx.textAlign = "center";
    ctx.fillText(handle, 512, 128);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0 });
    const sprite = new THREE.Sprite(material);
    
    // Position the sprite along the curve at intervals
    const p = i / hitters.length;
    const pos = curve.getPointAt(p);
    sprite.position.copy(pos).add(new THREE.Vector3(0, 2, 0));
    sprite.scale.set(8, 2, 1);
    
    sprite.userData = { handle: handle, threshold: p };
    tagSprites.push(sprite);
    scene.add(sprite);
});

const light = new THREE.PointLight(0x00f2ff, 40, 60);
scene.add(light);

// --- AUDIO & LAUNCH ---
const audioInput = document.getElementById('audio-input');
const launchBtn = document.getElementById('launch-btn');

audioInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        audio = new Audio(URL.createObjectURL(file));
        document.getElementById('status-text').innerText = "STREAM READY";
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

    gsap.to("#setup-overlay", { opacity: 0, duration: 2, onComplete: () => {
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
        const treble = dataArray[100];

        // Travel Logic
        progress += velocity + (bass * 0.000005);
        if (progress > 1) progress = 0;

        const pos = curve.getPointAt(progress);
        const lookAt = curve.getPointAt((progress + 0.01) % 1);
        camera.position.copy(pos);
        camera.lookAt(lookAt);
        light.position.copy(pos);

        // Reactivity & UI Updates
        document.getElementById('hz-display').innerText = `${(bass / 2.55).toFixed(2)}%`;
        
        // Check for "Passing" a Heavy Hitter
        tagSprites.forEach(sprite => {
            const dist = camera.position.distanceTo(sprite.position);
            if (dist < 15) {
                sprite.material.opacity = 1 - (dist / 15);
                if (dist < 5) {
                    const tagEl = document.getElementById('active-tag');
                    if (tagEl.innerText !== sprite.userData.handle) {
                        tagEl.innerText = sprite.userData.handle;
                        tagEl.classList.add('glitch-active');
                        setTimeout(() => tagEl.classList.remove('glitch-active'), 300);
                    }
                }
            } else {
                sprite.material.opacity = 0;
            }
        });

        // Visual Colors
        tubeMat.color.setHSL((Date.now() * 0.0001) % 1, 1, 0.5);
        light.color.setHSL((Date.now() * 0.00015) % 1, 1, 0.5);
    }
    renderer.render(scene, camera);
}
animate();

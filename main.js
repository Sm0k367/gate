// --- AI MASTERY NETWORK // THE COLLECTIVE ARCHIVE // ULTRA-GLIDE VERSION ---

const members = [
    "Adam Normandin", "Akachukwu Nnubuogu", "Akorede Ibrahim", "Alexandar Danilovic", 
    "Alice Gannon Boss", "Alisher Farhadi", "Altin Kukaj", "Amit Kumar", 
    "Andrew Chidley", "Andy Wergedal", "Ansh Maheshwari", "Anthony Bassett", 
    "Arianit Kukaj", "AS Katoch", "Audrey Taylor", "A'buroos A'abdul K'ashif", 
    "Bech Amr", "Brad OntheGo", "Cameron McNerney", "Carlos Olivas", 
    "Charis TheAI", "Charles Lowe", "Cheryl DeSanctis", "Chris Conley", 
    "Chuck Baggett", "Ciara Wearen", "Cordell Weathersbee II", "Cornelius Aderinboye", 
    "Cyril Monkewitz", "Dan Roeder", "Dan Ryan Neff", "Daniel Roeder", 
    "Danielle Bruce", "David Egbon", "Dorien Van den Abbeele", "Douglas Chapman", 
    "Douglas Hirsh", "Dylan White", "d'Artz Modello", "Elizabeth R", 
    "Epic Tech", "Evaflow SkyStarter", "Evan Ezell", "Fabio P.", 
    "Francis Aiello", "Gaby Tello", "Gaurav Ahuja", "Gbenga Fagbenro", 
    "George Karl Real", "George Nisen", "Georgi Todorov", "Hallie Bery", 
    "Jacob Stacy", "James DiMeo", "Jane Scott", "Jay X", 
    "Jayjay Muhanguzi", "Jeff Goldman", "John Allen", "John Woznakewicz", 
    "Jonathan Batchelor", "Jordan Baker", "Joseph Gaither", "Joseph Hogarth", 
    "Julie Todd", "Kassandra Kuehl", "Katie Musgrave", "Kevin McConnell", 
    "Kimberly Coffey", "Kirk Greninger", "Kore Jo", "Kym Coffey", 
    "Laura Aguirre", "Lilybelle Richards", "Linda G.", "Lisa Kass", 
    "LK MLAND", "Lovvr Eth", "Lucia Walker", "Lucky Rodriguez", 
    "Ludovic Creator", "Lyn X", "Mahamat Younous", "Marcos Polaco", 
    "Masha C.", "Matthew Leigh", "Memetic Culture", "Michael Neuvirth", 
    "Michael Riendeau", "Mimi Brown", "Mohamed Ayoub", "MoNique Holland", 
    "Morgen OConnor", "Mr. Viet", "Mubarak OGUNLAJA", "Mukul Gupta", 
    "My Melanin Moods", "Nadiah Abidin", "NFT N8TV", "Noah Patterson", 
    "Ockert Joubert", "Orion Good", "Otman Mechbal", "Pallavi Patil", 
    "Patrick Bolton", "Petr Novak", "Philip Gill", "R Cohen", 
    "Rangiku Matsumoto", "Refound 445", "Renan Svarozhich", "Ricardo Arias", 
    "Robert Stratton", "Ross Cohen", "Ruh Roh Astro", "Sanmon 132", 
    "Sarah Hodsdon", "Satoshi Shalom", "Satoshi's Bride", "Sharon Jerman", 
    "Sotiris Karagiannis", "State.Port Charbonneau", "Stephanie Gray", "Sterling Roberson", 
    "T S", "Title Pending", "Todd McMullen", "Travis Edgar", 
    "Trenton Davis", "Trevor Smith", "Valentino Rivera", "Vinod Sharma", 
    "Williamfaith Obi", "Wilson Eboh"
];

let audioContext, analyzer, dataArray, source, audio;
let isPlaying = false;
let progress = 0;

// REDUCED VELOCITY: For maximum readability and cinematic flow
const velocity = 0.000035; 

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020202, 0.01);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 3000);
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('tribute-canvas'), 
    antialias: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// THE PATH: Stretched to 180 units per member for massive spacing
const points = [];
const pathDensity = members.length;
for (let i = 0; i <= pathDensity; i++) {
    points.push(new THREE.Vector3(
        Math.sin(i * 0.3) * 35, 
        Math.cos(i * 0.2) * 35, 
        i * 180 
    ));
}
const curve = new THREE.CatmullRomCurve3(points);
curve.closed = true;

// THE TUNNEL
const tubeGeom = new THREE.TubeGeometry(curve, pathDensity * 8, 12, 16, true);
const tubeMat = new THREE.MeshStandardMaterial({
    color: 0x00f2ff,
    emissive: 0x00f2ff,
    emissiveIntensity: 0.2,
    wireframe: true,
    transparent: true,
    opacity: 0.08,
    side: THREE.BackSide
});
const tunnel = new THREE.Mesh(tubeGeom, tubeMat);
scene.add(tunnel);

// SPRITES (Enhanced for clarity)
const tagSprites = [];
members.forEach((name, i) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 256;
    
    ctx.fillStyle = "white";
    ctx.font = "900 70px Syncopate";
    ctx.textAlign = "center";
    ctx.shadowColor = "#00f2ff";
    ctx.shadowBlur = 25;
    ctx.fillText(name.toUpperCase(), 512, 128);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0 });
    const sprite = new THREE.Sprite(material);
    
    const p = i / members.length;
    const pos = curve.getPointAt(p);
    sprite.position.copy(pos).add(new THREE.Vector3(0, 5, 0));
    sprite.scale.set(18, 4.5, 1);
    
    sprite.userData = { name: name };
    tagSprites.push(sprite);
    scene.add(sprite);
});

const light = new THREE.PointLight(0xffffff, 100, 300);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.05));

// --- LAUNCH LOGIC ---
const audioInput = document.getElementById('audio-input');
const launchBtn = document.getElementById('launch-btn');

audioInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        audio = new Audio(URL.createObjectURL(file));
        document.getElementById('status-text').innerText = "SIGNAL READY";
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

    gsap.to("#setup-overlay", { opacity: 0, duration: 3, onComplete: () => {
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

        // Subtle audio response that doesn't ruin readability
        progress += velocity + (bass * 0.0000001);
        if (progress > 1) progress = 0;

        const pos = curve.getPointAt(progress);
        const lookAt = curve.getPointAt((progress + 0.005) % 1);
        camera.position.copy(pos);
        camera.lookAt(lookAt);
        light.position.copy(pos);

        document.getElementById('hz-display').innerText = `${(bass / 2.55).toFixed(2)}%`;
        
        tagSprites.forEach(sprite => {
            const dist = camera.position.distanceTo(sprite.position);
            
            // Fades in earlier and lasts longer on screen
            if (dist < 100) {
                sprite.material.opacity = Math.min(1, (100 - dist) / 40);
                if (dist < 25) {
                    const tagEl = document.getElementById('active-tag');
                    if (tagEl.innerText !== sprite.userData.name) {
                        tagEl.innerText = sprite.userData.name;
                    }
                }
            } else {
                sprite.material.opacity = 0;
            }
        });

        tubeMat.color.setHSL((Date.now() * 0.00002) % 1, 0.8, 0.5);
    }
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

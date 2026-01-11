// --- AI MASTERY NETWORK // THE COLLECTIVE ARCHIVE ---

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
const velocity = 0.00008; // Ultra-smooth cinematic drift

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020202, 0.015);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('tribute-canvas'), 
    antialias: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 2. THE EXPANDED PATH
const points = [];
const pathDensity = members.length;
for (let i = 0; i <= pathDensity; i++) {
    points.push(new THREE.Vector3(
        Math.sin(i * 0.2) * 30, 
        Math.cos(i * 0.1) * 30, 
        i * 80 // Massive spacing for readability
    ));
}
const curve = new THREE.CatmullRomCurve3(points);
curve.closed = true;

// 3. THE TUNNEL
const tubeGeom = new THREE.TubeGeometry(curve, pathDensity * 6, 10, 16, true);
const tubeMat = new THREE.MeshStandardMaterial({
    color: 0x00f2ff,
    emissive: 0x00f2ff,
    emissiveIntensity: 0.3,
    wireframe: true,
    transparent: true,
    opacity: 0.1,
    side: THREE.BackSide
});
const tunnel = new THREE.Mesh(tubeGeom, tubeMat);
scene.add(tunnel);

// 4. MEMBER SPRITES
const tagSprites = [];
members.forEach((name, i) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 256;
    
    ctx.fillStyle = "white";
    ctx.font = "900 60px Syncopate";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0, 242, 255, 1)";
    ctx.shadowBlur = 20;
    ctx.fillText(name.toUpperCase(), 512, 128);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0 });
    const sprite = new THREE.Sprite(material);
    
    const p = i / members.length;
    const pos = curve.getPointAt(p);
    sprite.position.copy(pos).add(new THREE.Vector3(0, 4, 0));
    sprite.scale.set(14, 3.5, 1);
    
    sprite.userData = { name: name };
    tagSprites.push(sprite);
    scene.add(sprite);
});

const light = new THREE.PointLight(0xffffff, 80, 200);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.05));

// --- LAUNCH LOGIC ---
const audioInput = document.getElementById('audio-input');
const launchBtn = document.getElementById('launch-btn');

audioInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        audio = new Audio(URL.createObjectURL(file));
        document.getElementById('status-text').innerText = "SIGNAL SYNCED";
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

    gsap.to("#setup-overlay", { opacity: 0, duration: 2.5, onComplete: () => {
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

        progress += velocity + (bass * 0.0000003);
        if (progress > 1) progress = 0;

        const pos = curve.getPointAt(progress);
        const lookAt = curve.getPointAt((progress + 0.01) % 1);
        camera.position.copy(pos);
        camera.lookAt(lookAt);
        light.position.copy(pos);

        document.getElementById('hz-display').innerText = `${(bass / 2.55).toFixed(2)}%`;
        
        tagSprites.forEach(sprite => {
            const dist = camera.position.distanceTo(sprite.position);
            if (dist < 60) {
                sprite.material.opacity = Math.min(1, (60 - dist) / 25);
                if (dist < 18) {
                    const tagEl = document.getElementById('active-tag');
                    if (tagEl.innerText !== sprite.userData.name) {
                        tagEl.innerText = sprite.userData.name;
                    }
                }
            } else {
                sprite.material.opacity = 0;
            }
        });

        tubeMat.color.setHSL((Date.now() * 0.00003) % 1, 0.8, 0.5);
    }
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

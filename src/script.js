import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from "gsap/TextPlugin";

import front from '../static/imgs/front.png';
import back from '../static/imgs/back.png';
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Light
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(0, 10, 10)
scene.add(directionalLight)
scene.add(new THREE.AmbientLight(
    0xffffff, 0.86
))
/**
 * Objects
 */

// particles
const particlesGeometry = new THREE.BufferGeometry();
const particleCnt = 1000

const positions = new Float32Array(particleCnt * 3);

for (let i = 0; i < particleCnt * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particleMaterial = new THREE.PointsMaterial({
    size: 0.005
})

const particles = new THREE.Points(particlesGeometry, particleMaterial)
scene.add(particles)

// sphere
const sphere = new THREE.SphereGeometry(1, 20, 10);
const sphereMaterial = new THREE.LineBasicMaterial({color: 0xffffff});
const sphereWireframe = new THREE.EdgesGeometry(sphere);
const sphereLines = new THREE.LineSegments(sphereWireframe, sphereMaterial);
sphereLines.rotateZ(0.41)
scene.add(sphereLines)

let frontTexture = new THREE.TextureLoader().load(front);
let backTexture = new THREE.TextureLoader().load(back);

[frontTexture, backTexture].forEach(t => {
    t.wrapS = 1000;
    t.wrapT = 1000;
    t.repeat.set(1, 1);
    t.offset.setX(0.5);
    t.flipY = false;
});


let frontMaterial = new THREE.MeshStandardMaterial({
    map: frontTexture,
    side: THREE.BackSide,
    roughness: 0.65,
    metalness: 0.25,
    alphaTest: true,
    flatShading: true
})

let backMaterial = new THREE.MeshStandardMaterial({
    map: backTexture,
    side: THREE.FrontSide,
    roughness: 0.65,
    metalness: 0.25,
    alphaTest: true,
    flatShading: true

})


let num = 5;
let curvePoints = []
for (let i = 0; i < num; i++) {
    let theta = i / num * Math.PI * 2;
    curvePoints.push(
        new THREE.Vector3().setFromSphericalCoords(
            1,
            Math.PI / 2 + (Math.random() - 0.5),
            theta
        )
    )
}
const curve = new THREE.CatmullRomCurve3(curvePoints);
curve.tension = 1;
curve.closed = true;

// const points = curve.getPoints( 50 );
// const geometry = new THREE.BufferGeometry().setFromPoints(points);

// const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

// // Create the final object to add to the scene
// const curveObject = new THREE.Line(geometry, material);
// scene.add(curveObject)

let number = 1000;
let frenetFrames = curve.computeFrenetFrames(number, true);
let spacedPoints = curve.getSpacedPoints(number);
let tempPlane = new THREE.PlaneBufferGeometry(1, 1, number - 1, 1);
let dimensions = [-.1, 0.1];

let ribbonMaterial = [frontMaterial, backMaterial]
tempPlane.addGroup(0, 6000, 0)
tempPlane.addGroup(0, 6000, 1)

let point = new THREE.Vector3();
let binormalShift = new THREE.Vector3();
let temp2 = new THREE.Vector3();

let finalPoints = []

dimensions.forEach(d => {
    for (let i = 0; i < number; i++) {
        point = spacedPoints[i];
        binormalShift.add(frenetFrames.binormals[i]).multiplyScalar(d);
        finalPoints.push(new THREE.Vector3().copy(point).add(binormalShift));        
    }
})

tempPlane.setFromPoints(finalPoints)

let finalMesh = new THREE.Mesh(
    tempPlane,
    ribbonMaterial
)
scene.add(finalMesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.render(scene, camera)

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

const clock = new THREE.Clock();
let previousTime = 0;

/**
 * Scroll
 */


function animate() {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    sphereLines.position.x += (parallaxX - sphereLines.position.x) * 5 * deltaTime
    sphereLines.position.y += (parallaxY - sphereLines.position.y) * 5 * deltaTime

    sphereLines.rotation.y += deltaTime * 0.1;
    particles.rotation.y += deltaTime * 0.12;
    renderer.render(scene, camera)

    ribbonMaterial.forEach((mat, i) => {
        mat.map.offset.setX(elapsedTime * 0.1)
        if (i > 0) {
            mat.map.offset.setX((elapsedTime * 0.1))
        }
    });
    controls.update()

    requestAnimationFrame(animate)
}

animate()
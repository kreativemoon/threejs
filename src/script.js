import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from "gsap/TextPlugin";
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// gsap.to(document.querySelector('title'), {duration: 2, text: "This is the new text", ease: "none"});
let tl = gsap.timeline({defaults: {ease: "Slowmo.easeOut"}});
tl.to('h2', {y: '0%', duration:0.7, stagger:0.2});
/**
 * Light
 */
//  const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
//  directionalLight.position.set(1, 1, 0)
//  scene.add(directionalLight)

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

// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

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
    // controls.update()

    requestAnimationFrame(animate)
}

animate()
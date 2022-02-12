import './style.css'
import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Light
 */
//  const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
//  directionalLight.position.set(1, 1, 0)
//  scene.add(directionalLight)

/**
 * Objects
 */

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
renderer.render(scene, camera)

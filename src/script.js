import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import gsap from 'gsap'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const panel = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const matcapNumber = 10;
const textureLoader = new THREE.TextureLoader();
const matCapTexture = textureLoader.load(`textures/matcaps/${matcapNumber}.png`);
const material = new THREE.MeshMatcapMaterial({ matcap: matCapTexture });

/**
 * Fonts
 */
const fontLoader = new FontLoader();

fontLoader.load(
    '/fonts/Cyberpunk_Regular.json',
    (font) =>
    {
        const textGeometry = new TextGeometry(
            'RZTPROG',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 4,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4
            }
        )

        // Add text to scene
        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)

        // Variables
        textGeometry.center()
        material.wireframe = false
        const rotationSpeed = { speed: 0 }
        let randomColorArray = [0xff00ff, 0x00ff00, 0x0000ff]

        // REWORK THIS PARAMETERS
        const parameters = {
                color: 0xbbbbbb,
                spin: () => {
                    gsap.to(text.rotation, { duration: 1, y: text.rotation.y + Math.PI * 2 })
                },
                randomcolor: () => {
                    // Rework this feature
                    let randomNumber = Math.floor(Math.random() * 3)

                    console.log(randomColorArray.indexOf(parameters.color))

                    material.color.set(randomColorArray[randomNumber])
                }
        }
            
        // Panel part
        panel.add(material, 'wireframe', true, false).name("Material Wireframe")
        panel.addColor(parameters, "color").onChange(() =>{
            material.color.set(parameters.color)
        }).name("Material color")
        panel.add(parameters, "spin").name("Spin text")
        panel.add(parameters, "randomcolor").name("Randomcolor (RGB)")
        panel.add(rotationSpeed, "speed").min(0).max(100).step(0.1).name("Text Rotation Speed")

        const textTick = () =>
        {
            const elapsedTime = clock.getElapsedTime() * rotationSpeed.speed

            // Rotation
            text.rotation.y = elapsedTime

            // Render
            renderer.render(scene, camera)

            // Call tick again on the next frame
            window.requestAnimationFrame(textTick)
        }
        
        textTick()
    }
)

/**
 * AxesHelper
 */
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

/**
 * Sizes
 */
// Fullscreen
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Realtime calculs for resizing
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

/**
 * Controls
 */
// Threejs native control
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Sphere
 */
const sphereNumber = 3;
const sphereSize = 0.15;
const sphereGeometry = new THREE.SphereBufferGeometry(sphereSize, 16 , 16);
const sphereArray = [];

for(let i = 0; i < sphereNumber; i++){
    const sphere = new THREE.Mesh(sphereGeometry, material)

    sphere.position.x = (Math.random()) * 1.5
    sphere.position.y = (Math.random()) * 1.5
    sphere.position.z = (Math.random()) * 1.5

    sphereArray.push(sphere)

    scene.add(sphere)
}

/**
 * Renderer
 */
// Tell webgl the canvas is canvas class="webgl" in html
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
// Fullscreen
renderer.setSize(sizes.width, sizes.height)
// Prevent anti-aliasing
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animations
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // console.log(Math.floor((Math.random() * (100 - 1) + 1)))

    // Sphere rotate animation
    // donutArray[Math.floor((Math.random() * (100 - 1) + 1))].rotation.y = elapsedTime * 0.5
    // donutArray[Math.floor((Math.random() * (100 - 1) + 1))].rotation.x = elapsedTime * 0.5
    // donutArray[Math.floor((Math.random() * (100 - 1) + 1))].rotation.z = elapsedTime * 0.5

    sphereArray[0].position.y = Math.sin(elapsedTime)
    sphereArray[0].position.x = Math.cos(elapsedTime)
    sphereArray[0].position.z = Math.cos(elapsedTime)

    sphereArray[1].position.y = Math.cos(elapsedTime)
    sphereArray[1].position.x = Math.sin(elapsedTime)
    sphereArray[1].position.z = Math.cos(elapsedTime)

    sphereArray[2].position.y = Math.cos(elapsedTime) 
    sphereArray[2].position.x = Math.cos(elapsedTime) 
    sphereArray[2].position.z = Math.sin(elapsedTime)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
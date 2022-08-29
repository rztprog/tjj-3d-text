import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { PlaneHelper } from 'three'

/**
 * Base
 */
// Debug
const panel = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
let matcapNumber = {number: 10}
const textureLoader = new THREE.TextureLoader()
const matCapTexture = textureLoader.load(`textures/matcaps/${matcapNumber.number}.png`)
const material = new THREE.MeshMatcapMaterial({ matcap: matCapTexture })

/**
 * Fonts
 */

const fontLoader = new FontLoader()

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

        // textGeometry.computeBoundingBox()
        // textGeometry.translate(
        //     - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
        //     - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
        //     - (textGeometry.boundingBox.max.z - 0.03) * 0.5
        // )
        // console.log(textGeometry.boundingBox)

        textGeometry.center()
        const text = new THREE.Mesh(textGeometry, material)
        
        material.wireframe = false
        const rotationSpeed = {speed: 0}
        panel.add(material, 'wireframe', true, false).name("Material Wireframe")
        // panel.add(text.rotation, 'y').min(0).max(Math.PI * 2).step(0.01).name("Rotation")
        scene.add(text)

        let randomColorArray = [0xff00ff, 0x00ff00, 0x0000ff]

        const parameters = {
                color: 0xffffff,
                spin: () => {
                    text.rotation.y += Math.PI;
                },
                randomcolor: () => {
                    let randomNumber = Math.floor(Math.random() * 3)
                    // console.log(randomNumber)

                    console.log(randomColorArray.indexOf(parameters.color))

                    material.color.set(randomColorArray[randomNumber])
                    // console.log(randomColorArray.indexOf(0xff00ff))

                    // console.log(material.color);
                    // console.log(randomColorArray[Math.floor(Math.random() * 3)]);
                }
            }
            
            panel.addColor(parameters, "color").onChange(() =>{
                material.color.set(parameters.color)
            }).name("Material color")
            panel.add(parameters, "spin").name("Spin text")
            panel.add(parameters, "randomcolor").name("Randomcolor (RGB)")

        const tick = () =>
        {
            const elapsedTime = clock.getElapsedTime() * rotationSpeed.speed
        
            // Rotation
            text.rotation.y = elapsedTime
        
            // Render
            renderer.render(scene, camera)
        
            // Call tick again on the next frame
            window.requestAnimationFrame(tick)
        }
        panel.add(rotationSpeed, "speed").min(0).max(100).step(0.1).name("Text Rotation speed")
        
        tick()
    }
)
    


/**
 * AxesHelper
 */

// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)


/**
 *  Panel
 */

// panel.add(textGeometry.font)
// panel.add(mesh.rotation.x = Math.PI * 0.25)

/*** sphereRotationSpeed
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

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

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Donuts
 */

// const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)
const sphereSize = 0.15
const donutGeometry = new THREE.SphereBufferGeometry(sphereSize, 16 , 16)
const donutArray = [];


for(let i = 0; i < 3; i++){
    
    const donut = new THREE.Mesh(donutGeometry, material)

    // donut.position.x = (Math.random() - 0.5 ) * 10
    // donut.position.y = (Math.random() - 0.5 ) * 10
    // donut.position.z = (Math.random() - 0.5 ) * 10

    
    // donut.rotation.x = Math.random() * Math.PI
    // donut.rotation.y = Math.random() * Math.PI

    donut.position.x = (Math.random()) * 1.5
    donut.position.y = (Math.random()) * 1.5
    donut.position.z = (Math.random()) * 1.5
    
    // const scale = Math.random()
    // const scale = 1.5
    // donut.scale.set(scale, scale, scale)

    donutArray.push(donut)

    scene.add(donut)
}

// console.log(donutArray[0]);
// panel.add(donutArray[0].rotation, "y",).min(0).max(Math.PI * 2).step(0.01).name("Rotation")


// const parameters = {
//     color: 0x000000,
//     spin: () => {
//         gsap.to(text.rotation, { duration: 1, y: mesh.rotation.y + Math.PI })
//     },
//     randomcolor: () => {
//         let randomColorArray = ["#ff00ff", "#00ff00", "#0f0f0f"]
//         material.color.set(randomColorArray[Math.floor(Math.random() * 3)])
//         // console.log(randomColorArray[Math.floor(Math.random() * 3)]);
//     }
// }

// panel.addColor(parameters, "color").onChange(() =>{
//     material.color.set(parameters.color)
// })
// panel.add(parameters, "spin")
// panel.add(parameters, "randomcolor")

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let sphereRotationSpeed = 2 

// donutArray.forEach(element => {
//     console.log(element);
// })


const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // console.log(Math.floor((Math.random() * (100 - 1) + 1)))

    // Rotation
    // donutArray[Math.floor((Math.random() * (100 - 1) + 1))].rotation.y += 0.5
    // donutArray[Math.floor((Math.random() * (100 - 1) + 1))].rotation.x += 0.5
    // donutArray[Math.floor((Math.random() * (100 - 1) + 1))].rotation.z += 0.5

    donutArray[0].position.y = Math.sin(elapsedTime)
    donutArray[0].position.x = Math.cos(elapsedTime)
    donutArray[0].position.z = Math.cos(elapsedTime)

    donutArray[1].position.y = Math.cos(elapsedTime)
    donutArray[1].position.x = Math.sin(elapsedTime)
    donutArray[1].position.z = Math.cos(elapsedTime)

    donutArray[2].position.y = Math.cos(elapsedTime) 
    donutArray[2].position.x = Math.cos(elapsedTime) 
    donutArray[2].position.z = Math.sin(elapsedTime)


    // Camera lookat
    // camera.lookAt(text.scale)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
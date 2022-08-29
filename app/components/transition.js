import gsap from "gsap"
import * as THREE from "three"

import vertex from "../shaders/vertex.glsl"
import fragment from "../shaders/fragment.glsl"

export default class Transition {
    constructor() {
        this.bind()

        // this.tl = gsap.timeline({
        //     paused: true,
        //     defaults: {
        //         duration: 1.25,
        //         ease: 'power3.inOut'
        //     }
        // })

        this.rAF = undefined

        this.init()
    }

    bind() {
        ["animate", "resize", "update"].forEach((fn) => (this[fn] = this[fn].bind(this)))
    }

    initRenderer() {
        const canvas = document.querySelector(".webgl")
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            canvas: canvas
        })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.setClearColor(0xffffff, 0)
    }

    initScene() {
        this.scene = new THREE.Scene()
    }

    initCamera() {
        this.camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 100)
        this.camera.lookAt(this.scene.position)
        this.camera.position.z = 1
        this.scene.add(this.camera)
    }

    initShape() {
        this.geometry = new THREE.BufferGeometry()
        // this.geometry = new THREE.PlaneBufferGeometry(1, 1, 10, 10)

        const vertices = new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0])
        const uvs = new Float32Array([0, 0, 2, 0, 0, 2])

        this.geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
        this.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))

        this.material = new THREE.RawShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: {
                uProgress: { value: 0 },
                uPower: { value: 0 },
                uOut: { value: true },
            }
        })

        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.scale.set(window.innerWidth / 2, window.innerHeight / 2, 1)
        this.mesh.frustumCulled = false
        this.scene.add(this.mesh)
    }
    
    resize() {
        // Update camera
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()

        // Update renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    update() {
        // Update renderer
        this.renderer.render(this.scene, this.camera)
    }

    animate() {
        if(this.isAnimating) return
        this.reverse ? this.in() : this.out()
        
        // COMBINED CLOSE AND OPEN WITH RESET PAGE TRANSITION ANIMATION
        // window.addEventListener('click', () => {
        //   app.out()
        //   window.setTimeout(() => {
        //     app.in()
        //   }, 1250)
        //   window.setTimeout(() => {
        //     app.reset()
        //   }, 2600)
        // })
    }

    out() {
        this.reverse = true
        this.isAnimating = true

        const { uProgress } = this.material.uniforms

        const tl = new gsap.timeline({
          paused: true,
          defaults: {
            duration: 1.25,
            ease: 'power3.inOut'
          }
        })
        tl.to(uProgress, { value: 1, onUpdate: () => this.update() }, 0)
        tl.to(this.bend(), { progress: 1 }, 0)
        tl.add(() => { this.isAnimating = false })
        tl.play()

        // this.tl.clear()
        // this.tl.to(uProgress, { value: 1, onUpdate: () => this.update() }, 0)
        // this.tl.to(this.bend(), { progress: 1 }, 0)
        // this.tl.play()
    }

    in() {
        this.reverse = false
        this.isAnimating = true

        const { uProgress, uOut } = this.material.uniforms

        const tl = new gsap.timeline({
          paused: true,
          defaults: {
            duration: 1.25,
            ease: 'power3.inOut'
          }
        })
        tl.set(uOut, { value: false })
        tl.to(uProgress, { value: 0, onUpdate: () => this.update() }, 0)
        // Trying to kill these timelines as they are being created each time
        // tl.to(uProgress, { value: 0, onUpdate: () => this.update(), onComplete: () => { tl.kill() } }, 0)
        tl.to(this.bend(), { progress: 1 }, 0)
        tl.set(uOut, { value: true })
        tl.add(() => { this.isAnimating = false })
        tl.play()

        // this.tl.clear()
        // this.tl.set(uOut, { value: false })
        // this.tl.to(uProgress, { value: 0, onUpdate: () => this.update() }, 0)
        // this.tl.to(this.bend(), { progress: 1 }, 0)
        // this.tl.play()
    }

    bend() {
        const { uPower } = this.material.uniforms

        const bendTl = gsap.timeline({
            paused: true,
            defaults: {
                ease: 'linear',
                duration: 0.5
            },
        })
        bendTl.to(uPower, { value: 1 })
        bendTl.to(uPower, { value: 0 })

        return bendTl
    }

    requestAnimationFrame() {
        this.rAF = requestAnimationFrame(this.update)
    }

    cancelAnimationFrame() {
        cancelAnimationFrame(this.rAF)
    }

    addEventListeners() {
        this.update()
        window.addEventListener('click', this.animate, false)
        window.addEventListener('resize', this.resize, false)

    }
    
    removeEventListeners() {
        window.removeEventListener('resize', this.resize, false)
    }

    destroy() {
        this.removeEventListeners()
    }
    
    init() {
        this.initRenderer()
        this.initScene()
        this.initCamera()
        this.initShape()
        this.resize()
        this.addEventListeners()
    }
}
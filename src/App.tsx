import {
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  DodecahedronBufferGeometry,
  Mesh,
  MeshLambertMaterial,
  MeshNormalMaterial,
  MeshToonMaterial,
  PerspectiveCamera,
  Scene,
  WebGL1Renderer,
} from 'three'
import React, { useEffect, useRef } from 'react'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { totesRando } from '.'

interface sourceState {
  width: number
  height: number
  renderer: WebGL1Renderer | undefined
  camera: PerspectiveCamera | undefined
  controls: TrackballControls | undefined
  scene: Scene | undefined
}

export const App: React.FC = () => {
  // const SELF = useSource()
  const ref = useRef<any>(undefined)
  let {
    current: { camera, controls, height, renderer, scene, width },
  } = useRef<sourceState>({
    width: 0,
    height: 0,
    renderer: undefined,
    camera: undefined,
    controls: undefined,
    scene: undefined,
  })

  useEffect(() => {
    width = window.innerWidth
    height = window.innerHeight
    init()
    animate()
    addShapes()
    render()
  }, [])

  const init = () => {
    // RENDERER
    renderer = new WebGL1Renderer({ canvas: ref.current })
    renderer.setClearColor(0x111111)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)

    // CAMERA
    camera = new PerspectiveCamera(70, width / height, 1, 1000)
    camera.position.z = 200
    camera.position.y = 150

    // CONTROLS
    controls = new TrackballControls(camera, renderer.domElement)

    // LISTENERS
    controls.addEventListener('change', render)
    window.addEventListener('resize', onWindowResize, false)

    // SCENE
    scene = new Scene()

    // LIGHTS
    const light1 = new AmbientLight(0xffffff, 0.5)
    const light2 = new DirectionalLight(0xffffff)
    light2.position.set(10, 120, 1)

    // FINAL
    scene.add(light1)
    scene.add(light2)
  }

  const render = () => {
    if (renderer && scene && camera) {
      renderer?.render(scene, camera)
    }
  }

  const animate = () => {
    requestAnimationFrame(animate)
    controls?.update()
  }

  const addShapes = () => {
    if (scene) {
      const num = 20
      const distance = 10
      const offset = 300
      for (let i = 0; i < num; i++) {
        for (let j = 0; j < num; j++) {
          const randomValue = totesRando(50, 150)
          const geometry = new BoxGeometry(10, randomValue, 10)
          const color = new Color(`hsl(${totesRando(180, 210)},100%,50%)`)
          const material = new MeshLambertMaterial({ color })
          const mesh = new Mesh(geometry, material)
          mesh.position.x = distance * i - 100
          mesh.position.z = distance * j - 100
          scene.add(mesh)
        }
      }
      // BALL
      const geo2 = new DodecahedronBufferGeometry(10, 1)
      const material2 = new MeshToonMaterial({ color: 0xffff00 })
      const mesh2 = new Mesh(geo2, material2)
      mesh2.position.y = 120
      mesh2.position.z = -100
      scene?.add(mesh2)
    }
  }

  const onWindowResize = () => {
    if (camera && renderer && controls) {
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      controls.handleResize()
    }
  }
  // hello
  return <canvas ref={ref}></canvas>
}

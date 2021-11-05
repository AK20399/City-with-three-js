import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  Mesh,
  MeshNormalMaterial,
  PerspectiveCamera,
  Scene,
  WebGL1Renderer,
} from 'three'
import React, { useEffect, useRef } from 'react'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'

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
    camera.position.z = 100

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
    light2.position.set(1, 1, 1)

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
    const geometry = new BoxGeometry(10, 10, 10)
    const material = new MeshNormalMaterial()
    const mesh = new Mesh(geometry, material)
    scene?.add(mesh)
  }

  const onWindowResize = () => {
    if (camera && renderer && controls) {
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      controls.handleResize()
    }
  }

  return <canvas ref={ref}></canvas>
}

/////////////////////////////////////////////////////////////////////
// MeshSelectionExtension, written by Philippe Leefsma - Dec 2017
// 
// Illustrates how to perform double ray casting to detect selection
// of custom meshes added to the scene and handle occlusion with
// Viewer meshes from loaded model.
//
/////////////////////////////////////////////////////////////////////
class MeshSelectionExtension extends Autodesk.Viewing.Extension {

  /////////////////////////////////////////////////////////
  // Class constructor
  //
  /////////////////////////////////////////////////////////
  constructor(viewer, options) {

    super(viewer, options)

    this.viewer = viewer
  }

  /////////////////////////////////////////////////////////
  // Load callback
  //
  /////////////////////////////////////////////////////////
  load() {

    console.log('Viewing.Extension.MeshSelection loaded')

    this.viewer.addEventListener(
      Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, () => {

        this.dbIds = this.getAllDbIds()
      })

    this.viewer.toolController.registerTool(this)

    this.viewer.toolController.activateTool(
      'Viewing.Extension.MeshSelection')

    this.intersectMeshes = [
      // this.addMesh(),
      // this.addMesh(),
      // this.addMesh(),
      // this.addMesh(),
      // this.addMesh()
    ]

    return true
  }

  /////////////////////////////////////////////////////////
  // Tool Interface
  //
  /////////////////////////////////////////////////////////
  getNames() {

    return ['Viewing.Extension.MeshSelection']
  }

  activate() {

  }

  deactivate() {

  }
  addPersonToView(mesh) {
    // console.log(`${name} hello`)
    // this.intersectMeshes = [
    // this.addMesh(mesh),
    // this.addMesh(mesh),
    // this.addMesh(mesh),
    // this.addMesh(mesh)


    // ]
    console.log('this.intersectMeshes', this.intersectMeshes)
    let isExist = false
    this.intersectMeshes.forEach(_mesh => {
      // let _userData = mesh.userData
      if (_mesh.userData.personID === mesh.userData.personID) {
        isExist = true
        _mesh.position.x = mesh.position.x
        _mesh.position.y = mesh.position.y
        _mesh.position.z = mesh.position.z
        this.viewer.impl.sceneUpdated(true)
      }
    })

    if (isExist === false) {
      this.intersectMeshes.push(this.addMesh(mesh))
    }

  }
  /////////////////////////////////////////////////////////
  // Unload callback
  //
  /////////////////////////////////////////////////////////
  unload() {

    console.log('Viewing.Extension.MeshSelection unloaded')

    this.viewer.toolController.deactivateTool(
      'Viewing.Extension.MeshSelection')

    this.viewer.toolController.unregisterTool(this)

    return true
  }

  /////////////////////////////////////////////////////////
  // Adds a box mesh with random size and position
  // to the scene
  //
  /////////////////////////////////////////////////////////
  addMesh(mesh) {

    // const geometry = new THREE.BoxGeometry(
    //     Math.random() * 10 + 5.0,
    //     Math.random() * 10 + 5.0,
    //     Math.random() * 10 + 5.0)

    // const color = Math.floor(Math.random() * 16777215)

    // const material = this.createColorMaterial(color)

    // const mesh = new THREE.Mesh(geometry, material)

    // mesh.position.x = -50 + Math.random() * 100
    // mesh.position.y = -50 + Math.random() * 100
    // mesh.position.z = -50 + Math.random() * 100
    // mesh['userData'] = Math.random() * 10 + 5.0
    this.viewer.impl.scene.add(mesh)

    this.viewer.impl.sceneUpdated(true)

    return mesh
  }

  /////////////////////////////////////////////////////////
  // Creates color material from int
  //
  /////////////////////////////////////////////////////////
  createColorMaterial(color) {

    const material = new THREE.MeshPhongMaterial({
      specular: new THREE.Color(color),
      side: THREE.DoubleSide,
      reflectivity: 0.0,
      color
    })

    const materials = this.viewer.impl.getMaterials()

    materials.addMaterial(
      color.toString(16),
      material,
      true)

    return material
  }

  /////////////////////////////////////////////////////////
  // Creates Raycaster object from the pointer
  //
  /////////////////////////////////////////////////////////
  pointerToRaycaster(domElement, camera, pointer) {

    const pointerVector = new THREE.Vector3()
    const pointerDir = new THREE.Vector3()
    const ray = new THREE.Raycaster()

    const rect = domElement.getBoundingClientRect()

    const x = ((pointer.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((pointer.clientY - rect.top) / rect.height) * 2 + 1

    if (camera.isPerspective) {

      pointerVector.set(x, y, 0.5)

      pointerVector.unproject(camera)

      ray.set(camera.position,
        pointerVector.sub(
          camera.position).normalize())

    } else {

      pointerVector.set(x, y, -1)

      pointerVector.unproject(camera)

      pointerDir.set(0, 0, -1)

      ray.set(pointerVector,
        pointerDir.transformDirection(
          camera.matrixWorld))
    }

    return ray
  }

  /////////////////////////////////////////////////////////
  // Click handler
  //
  /////////////////////////////////////////////////////////
  handleSingleClick(event) {

    const pointer = event.pointers ?
      event.pointers[0] :
      event

    const rayCaster = this.pointerToRaycaster(
      this.viewer.impl.canvas,
      this.viewer.impl.camera,
      pointer)

    const intersectResults = rayCaster.intersectObjects(
      this.intersectMeshes, true)

    const hitTest = this.viewer.model.rayIntersect(
      rayCaster, true, this.dbIds)

    const selections = intersectResults.filter((res) =>

      (!hitTest || (hitTest.distance > res.distance))
    )

    if (selections.length) {

      console.log('Custom meshes selected:', selections[0].object)
      console.log(selections[0].object.userData)

      // selections[0].object.position.x = 1; //-71
      // selections[0].object.position.y = 1; //-81
      // selections[0].object.position.z = 0;

      window.dispatchEvent(new CustomEvent('onExtEvent', {
        'detail': {
          id: selections[0].object.userData,
        }
      }));

      return true
    }

    return false
  }

  /////////////////////////////////////////////////////////
  // Get list of all dbIds in the model
  //
  /////////////////////////////////////////////////////////
  getAllDbIds() {

    const {
      instanceTree
    } = this.viewer.model.getData()

    const {
      dbIdToIndex
    } = instanceTree.nodeAccess

    return Object.keys(dbIdToIndex).map((dbId) => {
      return parseInt(dbId)
    })
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension(
  'Viewing.Extension.MeshSelection',
  MeshSelectionExtension)

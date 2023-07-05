import * as THREE from "three";
import Grid from "./grid";

/**
 * Create a ground plane that has a grid over it
 */
export function createGroundPlaneWired(
  width,
  height,
  widthSegments = 10,
  heightSegments = 10,
  lineWidth = 3,
  gcolor = null,
  wcolor = null
) {
  if (!gcolor) gcolor = "rgb(60, 30, 150)";
  if (!wcolor) wcolor = "rgb(150, 150, 150)";

  //---------------------------------------------------------------------------------------
  // create the ground plane with a grid
  var planeGeometry = new THREE.PlaneGeometry(
    width,
    height,
    widthSegments,
    heightSegments
  );
  planeGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
  var planeMaterial = new THREE.MeshPhongMaterial({
    color: gcolor,
    polygonOffset: true,
    polygonOffsetFactor: 1, // positive value pushes polygon further away
    polygonOffsetUnits: 1,
  });

  // Create the grid object
  let grid = new Grid(
    width,
    height,
    widthSegments,
    heightSegments,
    wcolor,
    lineWidth
  );

  let plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.rotateX(-Math.PI / 2);

  plane.add(grid); // Add the grid to the plane
  return plane;
}

/**
 * Initialize a simple default renderer and binds it to the "webgl-output" dom
 * element.
 *
 * @param additionalProperties Additional properties to pass into the renderer
 */
export function initRenderer(color = "rgb(0, 0, 0)") {
  //var props = (typeof additionalProperties !== 'undefined' && additionalProperties) ? additionalProperties : {};
  var renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.setClearColor(new THREE.Color(color));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.getElementById("webgl-output").appendChild(renderer.domElement);

  return renderer;
}

/**
 * Initialize a simple camera and point it at the center of a scene
 *
 * @param {THREE.Vector3} [initialPosition]
 */
export function initCamera(initialPosition) {
  var position =
    initialPosition !== undefined
      ? initialPosition
      : new THREE.Vector3(-30, 40, 30);
  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.copy(position);
  camera.lookAt(new THREE.Vector3(0, 0, 0)); // or camera.lookAt(0, 0, 0);
  //camera.up.set(0, 1, 0); // That's the default value
  return camera;
}

/**
 * Set a basic material for the initial examples
 * @param {color} color
 * @returns Basic lambert material of a given color
 */
export function setDefaultMaterial(color = "rgb(255,20,20)") {
  let basicMaterial = new THREE.MeshLambertMaterial({ color: color });
  return basicMaterial;
}

/**
 * Class box - show information onscreen
 *
 */
export class InfoBox {
  constructor() {
    this.infoBox = document.createElement("div");
    this.infoBox.id = "InfoxBox";
    this.infoBox.style.padding = "6px 14px";
    this.infoBox.style.position = "fixed";
    this.infoBox.style.bottom = "0";
    this.infoBox.style.right = "0";
    this.infoBox.style.backgroundColor = "rgba(255,255,255,0.2)";
    this.infoBox.style.color = "white";
    this.infoBox.style.fontFamily = "sans-serif";
    this.infoBox.style.userSelect = "none";
    this.infoBox.style.textAlign = "left";
  }

  addParagraph() {
    const paragraph = document.createElement("br");
    this.infoBox.appendChild(paragraph);
  }

  add(text) {
    var textnode = document.createTextNode(text);
    this.infoBox.appendChild(textnode);
    this.addParagraph();
  }

  show() {
    document.body.appendChild(this.infoBox);
  }
}

/**
 * Fix camera and renderer when window size changes
 */
export function onWindowResize(camera, renderer, frustumSize = 5) {
  let w = window.innerWidth;
  let h = window.innerHeight;
  let aspect = w / h;
  let f = frustumSize;
  if (camera instanceof THREE.PerspectiveCamera) {
    camera.aspect = aspect;
  }
  if (camera instanceof THREE.OrthographicCamera) {
    camera.left = (-f * aspect) / 2;
    camera.right = (f * aspect) / 2;
    camera.top = f / 2;
    camera.bottom = -f / 2;
  }
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

/*
 * Sphere to represent light position
 */
export function createLightSphere(
  scene,
  radius,
  widthSegments,
  heightSegments,
  position
) {
  var geometry = new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments,
    0,
    Math.PI * 2,
    0,
    Math.PI
  );
  var material = new THREE.MeshBasicMaterial({ color: "rgb(255,255,50)" });
  var object = new THREE.Mesh(geometry, material);
  object.visible = true;
  object.position.copy(position);
  scene.add(object);

  return object;
}

/**
 Compute the max size acording to XYZ axes
 Return the maxSzie
*/
export function getMaxSize(obj) {
  var maxSize;
  var box = new THREE.Box3().setFromObject(obj);
  var min = box.min;
  var max = box.max;

  var size = new THREE.Box3();
  size.x = max.x - min.x;
  size.y = max.y - min.y;
  size.z = max.z - min.z;

  if (size.x >= size.y && size.x >= size.z) maxSize = size.x;
  else {
    if (size.y >= size.z) maxSize = size.y;
    else {
      maxSize = size.z;
    }
  }
  return maxSize;
}

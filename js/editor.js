var container, worldPopup, interval, camera, scene, renderer, projector, plane, cube, linesMaterial, color = 0,
	colors = [0x1F4FDF, 0xDFAF1F, 0xDF1F1F, 0x80DF1F, 0x1FDF50, 0x1FDFDF, 0x7F1FDF, 0xDF1FAF, 0xEFEFEF, 0x303030],
	ray, brush, objectHovered, startPlaced = false,
	goalPlaced = false,
	mouse3D, isMouseDown = false,
	onMouseDownPosition, radious = 1600,
	theta = 45,
	onMouseDownTheta = 45,
	phi = 60,
	onMouseDownPhi = 60,
	isShiftDown = false;

init();
render();

function init() {
	container = document.createElement('div');
	var $con = $(container);
	$('body').append(container);

	var info = document.getElementById('info');
	$(info).addClass('info');
	$(info).show();
	worldPopup = document.getElementById('world_popup');
	$(worldPopup).addClass('world_popup');
	container.appendChild(worldPopup);

	camera = new THREE.Camera(40, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.x = radious * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
	camera.position.y = radious * Math.sin(phi * Math.PI / 360);
	camera.position.z = radious * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
	camera.target.position.y = 200;

	scene = new THREE.Scene();

	// Grid
	var geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(-500, 0, 0)));
	geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(500, 0, 0)));

	linesMaterial = new THREE.LineColorMaterial(0x000000, 0.2);

	for (var i = 0; i <= 20; i++) {
		var line;
		line = new THREE.Line(geometry, linesMaterial);
		line.position.z = (i * 50) - 500;
		scene.addObject(line);

		line = new THREE.Line(geometry, linesMaterial);
		line.position.x = (i * 50) - 500;
		line.rotation.y = 90 * Math.PI / 180;
		scene.addObject(line);

	}

	projector = new THREE.Projector();

	plane = new THREE.Mesh(new Plane(1000, 1000));
	plane.rotation.x = -90 * Math.PI / 180;
	scene.addObject(plane);

	cube = new Cube(50, 50, 50);

	ray = new THREE.Ray(camera.position, null);

	brush = new THREE.Mesh(cube, new THREE.MeshColorFillMaterial(colors[color], 0.4));
	brush.position.y = 2000;
	brush.overdraw = true;
	scene.addObject(brush);

	onMouseDownPosition = new THREE.Vector2();

	// Lights
	var ambientLight = new THREE.AmbientLight(0x404040);
	scene.addLight(ambientLight);
	var directionalLight;
	directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.x = 1;
	directionalLight.position.y = 1;
	directionalLight.position.z = 0.75;
	directionalLight.position.normalize();
	scene.addLight(directionalLight);

	directionalLight = new THREE.DirectionalLight(0x808080);
	directionalLight.position.x = -1;
	directionalLight.position.y = 1;
	directionalLight.position.z = -0.75;
	directionalLight.position.normalize();
	scene.addLight(directionalLight);

	renderer = new THREE.CanvasRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);

	container.appendChild(renderer.domElement);

	document.addEventListener('keydown', onDocumentKeyDown, false);
	document.addEventListener('keyup', onDocumentKeyUp, false);

	document.addEventListener('mousemove', onDocumentMouseMove, false);

	var canvas = document.getElementsByTagName('canvas')[0];
	canvas.addEventListener('mousedown', onDocumentMouseDown, false);
	canvas.addEventListener('mouseup', onDocumentMouseUp, false);
	canvas.addEventListener('mousewheel', onDocumentMouseWheel, false);

}

function closePopup() {
	worldPopup.style.display = 'none';
}

function onDocumentKeyDown(event) {

	switch (event.keyCode) {

	case 49:
		setBrushColor(0);
		break;
	case 50:
		setBrushColor(1);
		break;
	case 51:
		setBrushColor(2);
		break;
	case 52:
		setBrushColor(3);
		break;
	case 53:
		setBrushColor(4);
		break;
	case 54:
		setBrushColor(5);
		break;
	case 55:
		setBrushColor(6);
		break;
	case 56:
		setBrushColor(7);
		break;
	case 57:
		setBrushColor(8);
		break;
	case 48:
		setBrushColor(9);
		break;

	case 16:
		isShiftDown = true;
		interact();
		render();
		break;

	case 37:
		offsetScene(-1, 0);
		break;
	case 38:
		offsetScene(0, -1);
		break;
	case 39:
		offsetScene(1, 0);
		break;
	case 40:
		offsetScene(0, 1);
		break;

	}

}

function onDocumentKeyUp(event) {

	switch (event.keyCode) {

	case 16:
		isShiftDown = false;
		interact();
		render();
		break;

	}

}

function onDocumentMouseDown(event) {
	event.preventDefault();

	if (event.button == 1) {
		isMouseDown = true;
	}

	onMouseDownTheta = theta;
	onMouseDownPhi = phi;
	onMouseDownPosition.x = event.clientX;
	onMouseDownPosition.y = event.clientY;

}

function onDocumentMouseMove(event) {

	event.preventDefault();

	if (isMouseDown) {

		theta = -((event.clientX - onMouseDownPosition.x) * 0.5) + onMouseDownTheta;
		phi = ((event.clientY - onMouseDownPosition.y) * 0.5) + onMouseDownPhi;

		phi = Math.min(180, Math.max(0, phi));

		camera.position.x = radious * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
		camera.position.y = radious * Math.sin(phi * Math.PI / 360);
		camera.position.z = radious * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
		camera.updateMatrix();

	}

	mouse3D = projector.unprojectVector(new THREE.Vector3((event.clientX / renderer.domElement.width) * 2 - 1, -(event.clientY / renderer.domElement.height) * 2 + 1, 0.5), camera);
	ray.direction = mouse3D.subSelf(camera.position).normalize();

	interact();
	render();

}

function onDocumentMouseUp(event) {

	event.preventDefault();

	isMouseDown = false;

	if (event.button === 0) {

		onMouseDownPosition.x = event.clientX - onMouseDownPosition.x;
		onMouseDownPosition.y = event.clientY - onMouseDownPosition.y;

		if (onMouseDownPosition.length() > 5) {

			return;

		}

		var intersect, intersects = ray.intersectScene(scene);

		if (intersects.length > 0) {

			intersect = intersects[0].object == brush ? intersects[1] : intersects[0];

			if (intersect) {

				if (isShiftDown) {

					if (intersect.object != plane) {

						if ((colors.indexOf(intersect.object.material[0].color.hex & 0xffffff) + 1) == 1) {
							startPlaced = false;
						} else if ((colors.indexOf(intersect.object.material[0].color.hex & 0xffffff) + 1) == 2) {
							goalPlaced = false;
						}
						scene.removeObject(intersect.object);

					}

				} else if (!((color === 0 && startPlaced) || (color === 1 && goalPlaced))) {

					var position = new THREE.Vector3().add(intersect.point, intersect.object.matrixRotation.transform(intersect.face.normal.clone()));

					var voxel = new THREE.Mesh(cube, new THREE.MeshColorFillMaterial(colors[color]));
					if (color === 0) {
						startPlaced = true;
					} else if (color == 1) {
						goalPlaced = true;
					}
					voxel.position.x = Math.floor(position.x / 50) * 50 + 25;
					voxel.position.y = Math.floor(position.y / 50) * 50 + 25;
					voxel.position.z = Math.floor(position.z / 50) * 50 + 25;
					voxel.overdraw = true;
					scene.addObject(voxel);

				}

			}

		}

	}
	interact();
	render();

}

function onDocumentMouseWheel(event) {

	radious -= event.wheelDeltaY;

	camera.position.x = radious * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
	camera.position.y = radious * Math.sin(phi * Math.PI / 360);
	camera.position.z = radious * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
	camera.updateMatrix();

	interact();
	render();

}

function setBrushColor(value) {

	color = value;
	brush.material[0].color.setHex(colors[color] ^ 0x4C000000);

	render();

}

function buildFromHash() {



}

function saveWorld() {

	var world = [];

	for (var x = 0; x < 20; x++) {
		world.push([]);
		for (var y = 0; y < 20; y++) {
			world[x].push([]);
			for (var z = 0; z < 20; z++) {
				world[x][y].push("0");
			}
		}
	}

	console.log(world);

	for (var i in scene.objects) {

		object = scene.objects[i];

		if (object instanceof THREE.Mesh && object !== plane && object !== brush) {

			world[((object.position.x - 25) / 50) + 10][(object.position.y - 25) / 50][((object.position.z - 25) / 50) + 10] = (colors.indexOf(object.material[0].color.hex & 0xffffff) - 1).toString().replace("-1", "p").replace("0", "g").replace("8", "a");
		}

	}
	var worldFile = {
		"world": []
	};
	for (var lay = 0; lay < 20; lay++) {
		var layer = [];
		for (var lin = 0; lin < 20; lin++) {
			var line = "";
			for (var vox = 0; vox < 20; vox++) {
				line += world[lin][lay][vox];
			}
			layer.push(line);
		}
		worldFile["world"].push(layer);
	}
	document.getElementById('worldDisplay').value = JSON.stringify(worldFile, null, 4);
	worldPopup.style.display = 'inline';
}

function offsetScene(x, z) {

	var offset = new THREE.Vector3(x, 0, z).multiplyScalar(50);

	for (var i in scene.objects) {

		object = scene.objects[i];

		if (object instanceof THREE.Mesh && object !== plane && object !== brush) {

			object.position.addSelf(offset);

		}

	}

	interact();
	render();

}

function interact() {

	if (objectHovered) {

		objectHovered.material[0].color.a = 1;
		objectHovered.material[0].color.updateStyleString();
		objectHovered = null;

	}

	var position, intersect, intersects = ray.intersectScene(scene);

	if (intersects.length > 0) {

		intersect = intersects[0].object != brush ? intersects[0] : intersects[1];

		if (intersect) {

			if (isShiftDown) {

				if (intersect.object != plane) {

					objectHovered = intersect.object;
					objectHovered.material[0].color.a = 0.5;
					objectHovered.material[0].color.updateStyleString();

					return;

				}

			} else {

				position = new THREE.Vector3().add(intersect.point, intersect.object.matrixRotation.transform(intersect.face.normal.clone()));

				brush.position.x = Math.floor(position.x / 50) * 50 + 25;
				brush.position.y = Math.floor(position.y / 50) * 50 + 25;
				brush.position.z = Math.floor(position.z / 50) * 50 + 25;

				return;

			}

		}

	}

	brush.position.y = 2000;

}

function render() {

	renderer.render(scene, camera);

}

function screenshot() {

	linesMaterial.color.setRGBA(0, 0, 0, 0);
	brush.position.y = 2000;
	render();

	window.open(renderer.domElement.toDataURL('image/png'), 'mywindow');

	linesMaterial.color.setRGBA(0, 0, 0, 0.2);
	render();

}

function clear() {

	if (!confirm('Are you sure?')) {

		return;

	}

	var i = 0;

	while (i < scene.objects.length) {

		object = scene.objects[i];

		if (object instanceof THREE.Mesh && object !== plane && object !== brush) {

			scene.removeObject(object);
			continue;
		}

		i++;
	}

	startPlaced = false;
	goalPlaced = false;
	render();

}
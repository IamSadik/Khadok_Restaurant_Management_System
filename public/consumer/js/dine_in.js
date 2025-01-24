

// Initializing the 3D Floor using Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Aspect ratio will be updated dynamically
const renderer = new THREE.WebGLRenderer({ antialias: true }); // Enable anti-aliasing
renderer.setSize(window.innerWidth, window.innerHeight); // Resize canvas to window dimensions
document.getElementById("floor-Container").appendChild(renderer.domElement);

// Get the container element for the canvas
const floorContainer = document.getElementById("floor-Container");

// Function to update renderer size and camera aspect ratio
function updateRendererSize() {
    const containerWidth = floorContainer.clientWidth ; // Responsive width of the container
    const containerHeight = floorContainer.clientHeight; // Responsive height of the container
    renderer.setSize(containerWidth, containerHeight); // Update renderer size
    camera.aspect = containerWidth / containerHeight; // Update camera aspect ratio
    camera.updateProjectionMatrix(); // Apply the updated aspect ratio
}

// Adjust the camera and floor
camera.position.set(0, 60, 100); // Increase the z value for a zoomed-out view
camera.lookAt(0, 0, 0); // Ensure the camera looks at the center of the floor

// Create the floor (a simple plane)
const floorGeometry = new THREE.PlaneGeometry(100, 100); // 100x100 size for floor
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = Math.PI / 2; // Rotate floor to be flat
floor.position.y =30; // Raise the floor's position in the canvas
floor.position.x = -25; // Raise the floor's position in the canvas
scene.add(floor);

// Create a table icon function (with table type passed as argument)
function createTableIcon(tableType, x, y) {
    const iconGeometry = new THREE.CylinderGeometry(1, 1, 0.1, 32); // Create a round table icon
    let color;
    switch (tableType) {
        case "2":
            color = 0x007bff; // Blue
            break;
        case "4":
            color = 0x198754; // Green
            break;
        case "8":
            color = 0xFFC13C; // Yellow
            break;
        case "16":
            color = 0xC82333; // Red
            break;
        case "5":
            color = 0x0DCAF0; // light blue
            break;
        default:
            color = 0x000000; // Black
    }
    const iconMaterial = new THREE.MeshBasicMaterial({ color: color });
    const icon = new THREE.Mesh(iconGeometry, iconMaterial);
    icon.position.set(x - 20, 30, y); // Adjust position: raise by y=30 and shift x by -20
    icon.userData = { tableType }; // Store table type in userData for later use
    scene.add(icon);
    return icon;
}


// Adding table icons dynamically to the floor (can be updated based on data)
createTableIcon("2", -20, 20); // Adjusted automatically
createTableIcon("4", 20, 20);
createTableIcon("8", -20, -20);
createTableIcon("16", 20, -20);
createTableIcon("5", 0, 0);


// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Add rotation for the floor to give it a 360-degree view effect
    floor.rotation.z += 0.001; // Slowly rotate the floor around the z-axis

    renderer.render(scene, camera);
}

// Mouse control to rotate the scene (for horizontal rotation only)
let isMouseDown = false;
let lastMouseX = 0;
let rotationSpeed = 0.005;

renderer.domElement.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    lastMouseX = e.clientX;
});

renderer.domElement.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
        const deltaX = e.clientX - lastMouseX;
        // Only adjust the horizontal rotation (rotation around the Y-axis)
        scene.rotation.y += deltaX * rotationSpeed;
        lastMouseX = e.clientX;
    }
});

renderer.domElement.addEventListener("mouseup", () => {
    isMouseDown = false;
});
// Table Click Logic (for interacting with the tables)
renderer.domElement.addEventListener("click", (event) => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        const table = intersects[0].object;
        const tableType = table.userData.tableType;
        updateTableCount(tableType); // Call the table count update
    }
});



// Start the animation loop
animate();

document.addEventListener('DOMContentLoaded', () => {
    fetch('/interior/fetch-table-info')
        .then(response => {
            console.log('Fetch response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Fetched table data:', data);

            if (data.success) {
                const tableData = data.data;
                document.querySelectorAll('[data-table-type]').forEach(span => {
                    const tableType = span.getAttribute('data-table-type');
                    span.textContent = tableData[tableType] || 0; // Default to 0 if not found
                });
            } else {
                console.error('Failed to fetch table data:', data.error);
            }
        })
        .catch(error => console.error('Error fetching table data:', error));
});

document.addEventListener('DOMContentLoaded', () => {
    if (typeof PANOLENS === 'undefined' || typeof THREE === 'undefined') {
        console.error('PANOLENS or THREE.js not properly loaded');
        return;
    }

    const imageContainer = document.querySelector('.image-container');

    // Fetch the 360-degree image URL for the logged-in stakeholder
    fetch('/interior/get-interior-image')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.imageUrl) {
                // Use the fetched image URL to load the panorama
                const panoramaImage = new PANOLENS.ImagePanorama(data.imageUrl);
                const viewer = new PANOLENS.Viewer({
                    container: imageContainer,
                    autoRotate: true,
                    autoRotateSpeed: 0.3,
                    controlBar: false,
                });
                viewer.add(panoramaImage);
            } else {
                console.error('Failed to load image:', data.message);
            }
        })
        .catch(error => console.error('Error fetching image:', error));
});



document.addEventListener('DOMContentLoaded', () => {
    const tableForm = document.getElementById('tableForm');
    const tableFields = document.getElementById('tableFields');
    const addMoreBtn = document.getElementById('addMore');
    const removeLastBtn = document.getElementById('removeLast');
    let tableFieldCount = 1; // Counter to uniquely identify radio button groups

    // Add More functionality
    addMoreBtn.addEventListener('click', () => {
        const newField = `
            <div class="row align-items-center mb-3" id="dynamicRow-${tableFieldCount}">
                <div class="col-md-8">
                    <div class="btn-group d-flex" role="group">
                        <input type="radio" class="btn-check" name="tableType-${tableFieldCount}" id="twoPerson-${tableFieldCount}" value="2" required>
                        <label class="btn btn-outline-primary" for="twoPerson-${tableFieldCount}"><i class="fas fa-chair"></i> 2 Person</label>

                        <input type="radio" class="btn-check" name="tableType-${tableFieldCount}" id="fourPerson-${tableFieldCount}" value="4">
                        <label class="btn btn-outline-success" for="fourPerson-${tableFieldCount}"><i class="fas fa-couch"></i> 4 Person</label>

                        <input type="radio" class="btn-check" name="tableType-${tableFieldCount}" id="eightPerson-${tableFieldCount}" value="8">
                        <label class="btn btn-outline-info" for="eightPerson-${tableFieldCount}"><i class="fas fa-table"></i> 8 Person</label>

                        <input type="radio" class="btn-check" name="tableType-${tableFieldCount}" id="sixteenPerson-${tableFieldCount}" value="16">
                        <label class="btn btn-outline-warning" for="sixteenPerson-${tableFieldCount}"><i class="fas fa-table-cells"></i> 16 Person</label>

                        <input type="radio" class="btn-check" name="tableType-${tableFieldCount}" id="roundTable-${tableFieldCount}" value="5">
                        <label class="btn btn-outline-danger" for="roundTable-${tableFieldCount}"><i class="fas fa-circle-notch"></i> Round Table</label>
                    </div>
                </div>
                <div class="col-md-4">
                    <input type="number" class="form-control" name="tableCount" placeholder="Number of Tables" required>
                </div>
            </div>`;
        tableFields.insertAdjacentHTML('beforeend', newField);
        tableFieldCount++;

        // Show "Remove Last" button when a row is added
        removeLastBtn.classList.remove('d-none');
    });

    // Remove Last functionality
    removeLastBtn.addEventListener('click', () => {
        const lastRow = document.querySelector(`#dynamicRow-${tableFieldCount - 1}`);
        if (lastRow) {
            lastRow.remove();
            tableFieldCount--;
        }

        // Hide "Remove Last" button if no dynamic rows remain
        if (tableFieldCount === 1) {
            removeLastBtn.classList.add('d-none');
        }
    });

    // Submit table form
    tableForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            const tables = Array.from(tableFields.querySelectorAll('.row')).map(row => {
                const tableType = row.querySelector('input[type="radio"]:checked')?.value;
                const tableCount = row.querySelector('input[type="number"]').value;
                if (!tableType) throw new Error('Table type is not selected');
                return { tableType, tableCount };
            });

            const response = await fetch('/interior/add-tables', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tables })
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                window.location.reload(); // Refresh the page after successful insertion
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error adding tables:', error);
            alert('Failed to add tables: ' + error.message);
        }
    });
    // Remaining functionality remains unchanged...

// Submit image upload form
document.getElementById("imageUploadForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("interiorImage");
    const formData = new FormData();
    formData.append("interiorImage", fileInput.files[0]); // Match the backend field name

    try {
        const response = await fetch("/interior/upload-image", {
            method: "POST",
            body: formData,
        });
        const result = await response.json();
        if (response.ok) {
            alert("Image uploaded successfully!");
            window.location.reload(); // Refresh the page after a successful upload
        } else {
            alert(result.message); // Show error message from the server
        }
    } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
    }
});

    

   
});

// Increment Button for Remove Number of Tables
document.getElementById('incrementTableCount').addEventListener('click', function () {
    const tableCountInput = document.getElementById('removeTableCount');
    let currentValue = parseInt(tableCountInput.value) || 1;
    tableCountInput.value = currentValue + 1;
});

// Decrement Button for Remove Number of Tables
document.getElementById('decrementTableCount').addEventListener('click', function () {
    const tableCountInput = document.getElementById('removeTableCount');
    let currentValue = parseInt(tableCountInput.value) || 1;
    if (currentValue > 1) {
        tableCountInput.value = currentValue - 1;
    }
});

//Function to remove tables
document.getElementById('removeTableForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const confirmation = confirm('Are you sure you want to remove the selected tables?');
    if (!confirmation) return;

    const removeTableType = document.querySelector('input[name="removeTableType"]:checked')?.value;
    const removeTableCount = document.getElementById('removeTableCount').value;

    try {
        const response = await fetch('/interior/remove-tables', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ removeTableType, removeTableCount }), // Matching keys with backend
        });

        const result = await response.json();
        if (response.ok) {
            
            window.location.reload();
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Error removing tables:', error);
        alert('Failed to remove tables ' );
    }
});


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

// Update table count based on clicked table type
function updateTableCount(tableType) {
    fetch(`/interior/get-table-count?tableType=${tableType}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const countElement = document.getElementById(`${tableType}PersonCount`);
                countElement.textContent = data.count;
            }
        })
        .catch(error => console.error("Error fetching table count:", error));
}



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


// Delete 360 view
document.getElementById("load360View").addEventListener("click", async () => {
    if (!confirm("Are you sure you want to delete the 360 view?")) return; // Confirm delete action

    try {
        const response = await fetch("/interior/delete-image", {
            method: "DELETE",
        });
        const result = await response.json();
        if (response.ok) {
            
            window.location.reload(); // Refresh the page
        } else {
            alert(result.message); // Show error message from the server
        }
    } catch (error) {
        console.error("Error deleting 360 view:", error);
        alert("Failed to delete 360 view. Please try again.");
    }
});

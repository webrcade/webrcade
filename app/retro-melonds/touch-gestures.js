const touchArea = document.getElementById('touch-area');
const cursor = document.getElementById('cursor');

let touchStart = { x: 0, y: 0 };
let lastTouch = { x: 0, y: 0 };
let touchStartTime = 0;  // Define touchStartTime
let activeTouches = [];
let cursorMoving = false; // To track if the cursor is already moving

// Function to simulate mouse events
function simulateMouseEvent(type, x, y, button = 0) {
    const mouseEvent = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
        button: button,
        buttons: button === 0 ? 1 : 2 // left button (0) or right button (2)
    });
    touchArea.dispatchEvent(mouseEvent);
}

// Handle touch start event
touchArea.addEventListener('touchstart', (e) => {
    e.preventDefault();
    activeTouches = Array.from(e.changedTouches);
    touchStart = { x: activeTouches[0].clientX, y: activeTouches[0].clientY };
    lastTouch = { ...touchStart };  // Set last touch position to the initial touch position
    touchStartTime = Date.now();   // Record the time when the touch started

    // Initialize the cursor position on first touch
    if (!cursorMoving) {
        cursor.style.left = `${touchStart.x}px`;
        cursor.style.top = `${touchStart.y}px`;
        cursorMoving = true; // Indicate that the cursor is now moving
    }

    if (activeTouches.length === 1) {
        // Simulate a left mouse button press for a single tap
        simulateMouseEvent('mousedown', touchStart.x, touchStart.y, 0);
    } else if (activeTouches.length === 2) {
        // Simulate right click for a two-finger tap
        simulateMouseEvent('mousedown', touchStart.x, touchStart.y, 2);
    }
});

// Handle touch move event
touchArea.addEventListener('touchmove', (e) => {
    e.preventDefault();
    activeTouches = Array.from(e.changedTouches);

    if (activeTouches.length === 1) {
        // Handle single finger drag (move pointer)
        const touch = activeTouches[0];

        // Move the cursor relative to the last touch position (delta movement)
        const dx = touch.clientX - lastTouch.x;
        const dy = touch.clientY - lastTouch.y;

        // Move the cursor element by the delta change
        cursor.style.left = `${cursor.offsetLeft + dx}px`;
        cursor.style.top = `${cursor.offsetTop + dy}px`;

        // Update last touch position to the current position
        lastTouch = { x: touch.clientX, y: touch.clientY };

        // Simulate mouse movement
        simulateMouseEvent('mousemove', touch.clientX, touch.clientY);
    } else if (activeTouches.length === 2) {
        // Handle two-finger drag (drag and drop with left mouse button)
        const touch1 = activeTouches[0];
        const touch2 = activeTouches[1];

        // Calculate the average position of the two fingers
        const avgX = (touch1.clientX + touch2.clientX) / 2;
        const avgY = (touch1.clientY + touch2.clientY) / 2;

        // Move the cursor relative to the last touch position (delta movement)
        const dx = avgX - lastTouch.x;
        const dy = avgY - lastTouch.y;

        cursor.style.left = `${cursor.offsetLeft + dx}px`;
        cursor.style.top = `${cursor.offsetTop + dy}px`;

        // Update last touch position to the average of the two touches
        lastTouch = { x: avgX, y: avgY };

        // Simulate left mouse drag behavior
        simulateMouseEvent('mousemove', avgX, avgY);
    } else if (activeTouches.length === 3) {
        // Handle three-finger drag (drag and drop with right mouse button)
        const touch1 = activeTouches[0];
        const touch2 = activeTouches[1];
        const touch3 = activeTouches[2];

        // Calculate the average position of the three fingers
        const avgX = (touch1.clientX + touch2.clientX + touch3.clientX) / 3;
        const avgY = (touch1.clientY + touch2.clientY + touch3.clientY) / 3;

        // Move the cursor relative to the last touch position (delta movement)
        const dx = avgX - lastTouch.x;
        const dy = avgY - lastTouch.y;

        cursor.style.left = `${cursor.offsetLeft + dx}px`;
        cursor.style.top = `${cursor.offsetTop + dy}px`;

        // Update last touch position to the average of the three touches
        lastTouch = { x: avgX, y: avgY };

        // Simulate right mouse drag behavior
        simulateMouseEvent('mousemove', avgX, avgY);
    }
});

// Handle touch end event
touchArea.addEventListener('touchend', (e) => {
    e.preventDefault();
    activeTouches = Array.from(e.changedTouches);
    const touchCount = activeTouches.length;

    if (touchCount === 1) {
        const touch = activeTouches[0];
        const timeDiff = Date.now() - touchStartTime;
        if (timeDiff < 200) {
            // Simulate a left-click for a short single finger tap
            simulateMouseEvent('click', touch.clientX, touch.clientY, 0);
        }
        // End the drag for a single finger drag
        simulateMouseEvent('mouseup', touch.clientX, touch.clientY, 0);
    } else if (touchCount === 2) {
        const touch = activeTouches[0];
        // End the drag for two-finger drag
        simulateMouseEvent('mouseup', touch.clientX, touch.clientY, 0);
    } else if (touchCount === 3) {
        const touch = activeTouches[0];
        // End the drag for three-finger drag
        simulateMouseEvent('mouseup', touch.clientX, touch.clientY, 2);
    }

    lastTouchCount = touchCount;
});

// Handle touch cancel event (optional for cleanup)
touchArea.addEventListener('touchcancel', (e) => {
    e.preventDefault();
    // Cleanup and remove any active touch simulation
    activeTouches = [];
});

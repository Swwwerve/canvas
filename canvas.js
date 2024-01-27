const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

let drawingHistory = [];

document.addEventListener('keydown', handleKeyDown);

document.getElementById('download').addEventListener('click', function(e) {
    // Create a temporary canvas to draw on
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    // Set the temporary canvas size to match the original canvas
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    
    // Set the background color to white on the temporary canvas
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // Redraw the drawing on the temporary canvas
    tempCtx.drawImage(canvas, 0, 0);
    
    // Convert the temporary canvas to a data URL with JPEG format
    let canvasUrl = tempCanvas.toDataURL('image/jpeg');
    
    // Create an anchor, and set the href value to our data URL
    const createEl = document.createElement('a');
    createEl.href = canvasUrl;

    // This is the name of our downloaded file with .jpg extension
    createEl.download = "canvas.jpg";

    // Click the download button, causing a download, and then remove it
    createEl.click();
    createEl.remove();
});

function handleKeyDown(e) {
    if (e.ctrlKey && e.key === 'z') {
        undoDrawing();
    }
}

function undoDrawing() {
    if (drawingHistory.length > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawingHistory.clear();
        redrawDrawing();
    }
}

function redrawDrawing() {
    ctx.beginPath();
    drawingHistory.forEach(path => {
        ctx.moveTo(path[0].x, path[0].y);
        path.forEach(point => {
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
        });
    });
}

function draw(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    // Store the drawing path for undo
    drawingHistory.push([{ x, y }]);
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

document.getElementById('download').addEventListener('click', function(e) {
    // Convert our canvas to a data URL
    let canvasUrl = canvas.toDataURL();
    // Create an anchor, and set the href value to our data URL
    const createEl = document.createElement('a');
    createEl.href = canvasUrl;

    // This is the name of our downloaded file
    createEl.download = "canvas";

    // Click the download button, causing a download, and then remove it
    createEl.click();
    createEl.remove();
});
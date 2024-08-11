const canvas = new fabric.Canvas('canvas', { isDrawingMode: false });
const imageInput = document.getElementById('imageInput');
const uploadButton = document.getElementById('upload-button');
const processButton = document.getElementById('process-button');
const editButton = document.getElementById('edit-button');
const downloadButton = document.getElementById('download-btn');
const drawButton = document.getElementById('draw');

uploadButton.addEventListener('click', () => {
    imageInput.click();
});

imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            fabric.Image.fromURL(e.target.result, (img) => {
                canvas.clear();
                img.scaleToWidth(500);
                img.scaleToHeight(400);
                canvas.add(img);
                processButton.style.display = 'block';
                editButton.style.display = 'none';
                downloadButton.style.display = 'none';
            });
        };
        reader.readAsDataURL(file);
    }
});

processButton.addEventListener('click', async () => {
    const file = imageInput.files[0];
    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('size', 'auto');

    try {
        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': 'gTFWr4viCunzMeE7Yqk4Q2zf'
            },
            body: formData
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            fabric.Image.fromURL(url, (img) => {
                canvas.clear();
                img.scaleToWidth(500);
                img.scaleToHeight(400);
                canvas.add(img);
                editButton.style.display = 'block';
                processButton.style.display = 'none';
                downloadButton.href = url;
                downloadButton.download = 'processed-image.png';
                downloadButton.style.display = 'block';
            });
        } else {
            console.error('Error:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

editButton.addEventListener('click', () => {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    canvas.freeDrawingBrush.color = '#ffff';
    canvas.freeDrawingBrush.width = 10;
});

downloadButton.addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/png');
    downloadButton.href = dataURL;
    downloadButton.download = 'edited-image.png';
});

drawButton.addEventListener('click', () => {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    if (canvas.isDrawingMode) {
        drawButton.textContent = 'Stop Drawing';
    } else {
        drawButton.textContent = 'Toggle Draw';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('imageInput');
    const cameraInput = document.getElementById('cameraInput');
    const previewImage = document.getElementById('preview-image');
    const loadingIndicator = document.getElementById('loading-indicator');
    const uploadButton = document.getElementById('uploadButton');

    fileInput.addEventListener('change', handleFileSelect);
    cameraInput.addEventListener('change', handleFileSelect);
    uploadButton.addEventListener('click', uploadImage);

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }

    async function uploadImage() {
        const file = fileInput.files[0] || cameraInput.files[0];

        if (!file) {
            alert("Please choose a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        loadingIndicator.style.display = 'block';

        try {
            const response = await fetch(`${window.apiUrl}/predict/`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);  // Debugging response

            // Check if prediction is valid, otherwise show an error
            if (data.prediction !== undefined && data.prediction >= 0 && data.prediction < 5) {
                const flowerNames = ['Daisy', 'Dandelion', 'Rose', 'Sunflower', 'Tulip'];
                const flowerName = flowerNames[data.prediction];

                // Show prediction result
                document.getElementById('result').innerText = `Prediction: ${flowerName}`;

                // Display flower info card based on the prediction
                showFlowerInfo(flowerName);

                // Track discovered flowers
                let discoveredFlowers = JSON.parse(localStorage.getItem('discoveredFlowers')) || [];
                if (!discoveredFlowers.includes(flowerName)) {
                    discoveredFlowers.push(flowerName);
                    localStorage.setItem('discoveredFlowers', JSON.stringify(discoveredFlowers));
                }
            } else {
                throw new Error('Invalid prediction response');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            document.getElementById('result').innerText = 'Error occurred while making prediction';
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }

    function showFlowerInfo(flowerName) {
        const flowerInfoCard = document.getElementById('flower-info-card');
        const flowerDescription = document.getElementById('flower-description');
        const flowerImage = document.getElementById('flower-image');

        // Hide previous flower info
        flowerInfoCard.style.display = 'none';

        setTimeout(() => {
            flowerInfoCard.style.display = 'block';
            flowerInfoCard.classList.add('fade-in');

            // Set flower-specific data
            switch (flowerName) {
                case 'Daisy':
                    flowerDescription.innerHTML = `
                        <strong>Daisy</strong> - A symbol of purity and innocence.
                        Daisies are common flowers known for their simple beauty and resilience.
                        They thrive in many environments and are often found in meadows and fields.`;
                    flowerImage.src = 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Leucanthemum_vulgare_3.jpg';
                    break;
                case 'Dandelion':
                    flowerDescription.innerHTML = `
                        <strong>Dandelion</strong> - Known for its bright yellow petals,
                        the dandelion is often seen as a weed but is also loved for its symbolism of resilience.`;
                    flowerImage.src = 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Taraxacum_officinale_-_bl%C3%BChende_Pusteblume.jpg';
                    break;
                case 'Rose':
                    flowerDescription.innerHTML = `
                        <strong>Rose</strong> - A symbol of love, beauty, and passion.
                        Roses are often used in bouquets and decorations due to their stunning colors and fragrance.`;
                    flowerImage.src = 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Red_Rose.jpg';
                    break;
                case 'Sunflower':
                    flowerDescription.innerHTML = `
                        <strong>Sunflower</strong> - Known for their large, bright yellow petals,
                        sunflowers symbolize happiness and positivity. They always face the sun as they grow.`;
                    flowerImage.src = 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Sunflower_in_March_2017.jpg';
                    break;
                case 'Tulip':
                    flowerDescription.innerHTML = `
                        <strong>Tulip</strong> - A spring flower that comes in many colors.
                        Tulips are often associated with new beginnings and are a popular flower in gardens.`;
                    flowerImage.src = 'https://upload.wikimedia.org/wikipedia/commons/2/26/Tulip_Paris.jpg';
                    break;
                default:
                    flowerDescription.innerHTML = 'Sorry, we couldn\'t find any information.';
                    flowerImage.src = '';
            }
        }, 300);  // Delay for fade-in effect
    }
});

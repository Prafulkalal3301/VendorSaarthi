// Initial vegetable suggestions and emojis
const vegetableSuggestions = [
    { name: "Carrot", emoji: "🥕" },
    { name: "Potato", emoji: "🥔" },
    { name: "Tomato", emoji: "🍅" },
    { name: "Onion", emoji: "🧅" },
    { name: "Spinach", emoji: "🌿" }
];
let selectedVegetables = {};

// Load vegetables from local storage on page load
document.addEventListener("DOMContentLoaded", () => {
    const savedVegetables = localStorage.getItem('vegetableList');
    if (savedVegetables) {
        selectedVegetables = JSON.parse(savedVegetables);
        updateVegList();
        document.getElementById('vegListContainer').classList.remove('hidden');
    } else {
        document.getElementById('vegListContainer').classList.add('hidden');
    }
});

// Add vegetable to the list
function addVegetable() {
    const vegInput = document.getElementById('vegInput').value.trim();
    const vegPrice = document.getElementById('vegPrice').value.trim();
    const quantityUnit = document.getElementById('quantityUnit').value;
    
    if (vegInput && vegPrice) {
        selectedVegetables[vegInput] = { price: vegPrice, unit: quantityUnit };
        updateVegList();
        saveVegetables();
        document.getElementById('vegInput').value = ''; // Clear input after adding
        document.getElementById('vegPrice').value = ''; // Clear price input
    }
}

// Update and display the vegetable list
function updateVegList() {
    const vegList = document.getElementById('vegList');
    const copyButton = document.getElementById('copyButton');
    vegList.innerHTML = '';
    
    // Display vegetables
    const sortedVeggies = Object.keys(selectedVegetables).sort();
    sortedVeggies.forEach(veg => {
        const div = document.createElement('div');
        div.className = 'veg-item';
        div.innerHTML = `${getEmoji(veg)} ${veg}: 
            <input type="number" value="${selectedVegetables[veg].price}" class="price-input" data-veg="${veg}" />
            <select class="quantity-dropdown" data-veg="${veg}">
                <option value="kg" ${selectedVegetables[veg].unit === 'kg' ? 'selected' : ''}>kg</option>
                <option value="ltr" ${selectedVegetables[veg].unit === 'ltr' ? 'selected' : ''}>ltr</option>
                <option value="dozen" ${selectedVegetables[veg].unit === 'dozen' ? 'selected' : ''}>dozen</option>
            </select>`;
        vegList.appendChild(div);
    });

    // Show list container and buttons if there are vegetables in the list
    const hasVeggies = sortedVeggies.length > 0;
    document.getElementById('vegListContainer').classList.remove('hidden');
    copyButton.classList.toggle('hidden', !hasVeggies);
}

// Show vegetable suggestions based on user input
function showSuggestions() {
    const input = document.getElementById('vegInput').value.toLowerCase();
    const suggestions = document.getElementById('vegSuggestions');
    suggestions.innerHTML = '';
    
    if (input) {
        vegetableSuggestions.forEach(veg => {
            if (veg.name.toLowerCase().includes(input)) {
                const li = document.createElement('li');
                li.textContent = `${veg.emoji} ${veg.name}`;
                li.onclick = () => {
                    document.getElementById('vegInput').value = veg.name;
                    suggestions.innerHTML = '';
                };
                suggestions.appendChild(li);
            }
        });
        suggestions.classList.remove('hidden');
    } else {
        suggestions.classList.add('hidden');
    }
}

// Get emoji for a vegetable
function getEmoji(vegName) {
    const veg = vegetableSuggestions.find(v => v.name.toLowerCase() === vegName.toLowerCase());
    return veg ? veg.emoji : '';
}

// Save vegetables to local storage
function saveVegetables() {
    localStorage.setItem('vegetableList', JSON.stringify(selectedVegetables));
}

// Update the price and unit of a vegetable
function updateVegetable(vegName, newPrice, newUnit) {
    if (selectedVegetables.hasOwnProperty(vegName)) {
        selectedVegetables[vegName] = { price: newPrice, unit: newUnit };
        saveVegetables();
    }
}

// Generate and display the final list
function generateAndCopyList() {
    const sortedVeggies = Object.keys(selectedVegetables).sort();
    let listWithEmojis = '';

    sortedVeggies.forEach(veg => {
        const priceInput = document.querySelector(`.price-input[data-veg="${veg}"]`);
        const unitSelect = document.querySelector(`.quantity-dropdown[data-veg="${veg}"]`);

        if (priceInput && unitSelect) {
            const price = priceInput.value;
            const unit = unitSelect.value;
            listWithEmojis += `${getEmoji(veg)} ${veg}: ₹${price} / ${unit}\n`;
            updateVegetable(veg, price, unit); // Update local storage
        }
    });

    // Display the list in the popup
    const resultPopup = document.getElementById('resultPopup');
    const finalListDisplay = document.getElementById('finalListDisplay');
    finalListDisplay.textContent = listWithEmojis;
    resultPopup.style.display = 'block'; // Show popup
}

// Copy the final list to the clipboard
function copyFinalList() {
    const listWithEmojis = document.getElementById('finalListDisplay').textContent;
    navigator.clipboard.writeText(listWithEmojis).then(() => {
        alert('List copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Close the result popup
function closePopup() {
    document.getElementById('resultPopup').style.display = 'none';
}


const vegetableSuggestions = [
    { name: "Carrot", emoji: "🥕" },
    { name: "Potato", emoji: "🥔" },
    { name: "Tomato", emoji: "🍅" },
    { name: "Onion", emoji: "🧅" },
    { name: "Spinach", emoji: "🌿" }
];
let selectedVegetables = {};

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

function addVegetable() {
    const vegInput = document.getElementById('vegInput').value;
    const vegPrice = document.getElementById('vegPrice').value;
    const quantityUnit = document.getElementById('quantityUnit').value;

    if (vegInput && vegPrice) {
        selectedVegetables[vegInput] = { price: vegPrice, unit: quantityUnit };
        updateVegList();
        saveVegetables();
        document.getElementById('vegInput').value = '';
        document.getElementById('vegPrice').value = '';
    }
}

function updateVegList() {
    const vegList = document.getElementById('vegList');
    const copyButton = document.getElementById('copyButton');
    vegList.innerHTML = '';

    const sortedVeggies = Object.keys(selectedVegetables).sort();
    sortedVeggies.forEach(veg => {
        const div = document.createElement('div');
        div.innerHTML = `${getEmoji(veg)} ${veg}: 
            <input type="number" value="${selectedVegetables[veg].price}" class="price-input" onchange="updatePrice('${veg}', this.value)" />
            <select class="quantity-dropdown" onchange="updateUnit('${veg}', this.value)">
                <option value="kg" ${selectedVegetables[veg].unit === 'kg' ? 'selected' : ''}>kg</option>
                <option value="ltr" ${selectedVegetables[veg].unit === 'ltr' ? 'selected' : ''}>ltr</option>
                <option value="bundle" ${selectedVegetables[veg].unit === 'bundle' ? 'selected' : ''}>bundle</option>
                <option value="dozen" ${selectedVegetables[veg].unit === 'dozen' ? 'selected' : ''}>dozen</option>
            </select>`;
        vegList.appendChild(div);
    });

    const hasVeggies = sortedVeggies.length > 0;
    document.getElementById('vegListContainer').classList.remove('hidden');
    copyButton.classList.toggle('hidden', !hasVeggies);
}

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

function getEmoji(vegName) {
    const veg = vegetableSuggestions.find(v => v.name.toLowerCase() === vegName.toLowerCase());
    return veg ? veg.emoji : '';
}

function saveVegetables() {
    localStorage.setItem('vegetableList', JSON.stringify(selectedVegetables));
}

function updatePrice(vegName, newPrice) {
    if (selectedVegetables.hasOwnProperty(vegName)) {
        selectedVegetables[vegName].price = newPrice;
        saveVegetables();
    }
}

function updateUnit(vegName, newUnit) {
    if (selectedVegetables.hasOwnProperty(vegName)) {
        selectedVegetables[vegName].unit = newUnit;
        saveVegetables();
    }
}

function generateAndCopyList() {
    const sortedVeggies = Object.keys(selectedVegetables).sort();
    const listWithEmojis = sortedVeggies.map(veg => `${getEmoji(veg)} ${veg}: ₹${selectedVegetables[veg].price} @ ${selectedVegetables[veg].unit}`).join('\n');

    document.getElementById('finalListDisplay').textContent = listWithEmojis;
    document.getElementById('resultPopup').style.display = 'block';

    navigator.clipboard.writeText(listWithEmojis).then(() => {
        alert('List copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

function copyFinalList() {
    const finalList = document.getElementById('finalListDisplay').textContent;
    navigator.clipboard.writeText(finalList).then(() => {
        alert('List copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

function closePopup() {
    document.getElementById('resultPopup').style.display = 'none';
}

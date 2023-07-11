if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('Service Worker зарегистрирован:', registration);
            })
            .catch((error) => {
                console.log('Ошибка регистрации Service Worker:', error);
            });
    });
}

function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function saveTrackers() {
    const trackers = [];

    trackersList.querySelectorAll('li').forEach(listItem => {
        const id = listItem.dataset.id;
        const title = listItem.querySelector('.tracker-text').textContent;
        const unit = listItem.querySelector('.tracker-unit').textContent.replace(/[()]/g, '');
        const count = Number(listItem.querySelector('label').textContent);

        trackers.push({ id, title, unit, count });
    });

    localStorage.setItem('trackers', JSON.stringify(trackers));
}

function loadTrackers() {
    const trackers = JSON.parse(localStorage.getItem('trackers'));

    if (Array.isArray(trackers)) {
        trackers.forEach(tracker => {
            const id = tracker.id || generateUniqueId();
            addTracker(id, tracker.title, tracker.unit, tracker.count);
        });
    }
}

function saveExecutionData(id, title, date, count) {
    const executionsKey = `${id}-${title}-executions`;
    const savedData = JSON.parse(localStorage.getItem(executionsKey)) || [];
    const formattedDate = date.toLocaleDateString('ru-RU');

    const existingData = savedData.find(item => item.date === formattedDate);

    if (existingData) {
        existingData.count += count;
    } else {
        savedData.push({ date: formattedDate, count });
    }

    localStorage.setItem(executionsKey, JSON.stringify(savedData));
}



function addTracker(id, title, unit, count = 0) {
    const listItem = document.createElement('li');
    listItem.dataset.id = id;

    const trackerText = document.createElement('span');
    trackerText.className = 'tracker-text';
    trackerText.textContent = title;
    listItem.appendChild(trackerText);

    const numberOfCompletions = document.createElement('label');
    numberOfCompletions.textContent = count;
    listItem.appendChild(numberOfCompletions);

    const trackerUnit = document.createElement('span');
    trackerUnit.className = 'tracker-unit';
    trackerUnit.textContent = unit;
    listItem.appendChild(trackerUnit);

    const addButton = document.createElement('button');
    addButton.textContent = '+';
    
    let intervalId;
    
    function incrementCount() {
        count++;
        numberOfCompletions.textContent = count;
        saveTrackers();
        saveExecutionData(id, title, new Date(), 1);
    }
    
    addButton.addEventListener('mousedown', () => {
        incrementCount();
        intervalId = setInterval(incrementCount, 200);
    });
    
    addButton.addEventListener('mouseup', () => {
        clearInterval(intervalId);
    });
    
    addButton.addEventListener('touchstart', (e) => {
        incrementCount();
        intervalId = setInterval(incrementCount, 200);
    });
    
    addButton.addEventListener('touchend', () => {
        clearInterval(intervalId);
    });
    
    listItem.appendChild(addButton);

    const statsButton = document.createElement('button');

    statsButton.style.border = 'none';
    statsButton.style.backgroundColor = 'transparent';
    statsButton.style.padding = '0';
    statsButton.style.cursor = 'pointer';

    const statsImage = document.createElement('img');
    statsImage.src = 'graph.png';
    statsImage.alt = 'Открыть статистику';
    statsImage.style.width = '24px';
    statsImage.style.height = '24px';
    statsButton.appendChild(statsImage);
    statsButton.addEventListener('click', () => {
        const countValue = count;
        window.location.href = `./stats.html?id=${id}&name=${title}&count=${countValue}`;
    });
    listItem.appendChild(statsButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Удалить';
    deleteButton.addEventListener('click', () => {
        const shouldDelete = confirm('Вы уверены, что хотите удалить этот элемент?');

        if (shouldDelete) {
            listItem.remove();
            saveTrackers();
        }
    });
    listItem.appendChild(deleteButton);

    trackersList.appendChild(listItem);
}

const trackersList = document.getElementById('trackers-list');

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-tracker-form');
    const trackerTitle = document.getElementById('tracker-title');

    loadTrackers();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = trackerTitle.value.trim();
        const unit = e.target.querySelector('select').value;

        if (title) {
            const id = generateUniqueId();
            addTracker(id, title, unit);
            saveTrackers();
            trackerTitle.value = '';
        }
    });
});
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

function saveTrackers() {
    const trackers = [];

    trackersList.querySelectorAll('li').forEach(listItem => {
        const title = listItem.querySelector('.tracker-text').textContent;
        const unit = listItem.querySelector('.tracker-unit').textContent.replace(/[()]/g, '');
        const count = Number(listItem.querySelector('label').textContent);

        trackers.push({ title, unit, count });
    });

    localStorage.setItem('trackers', JSON.stringify(trackers));
}

function loadTrackers() {
    const trackers = JSON.parse(localStorage.getItem('trackers'));

    if (Array.isArray(trackers)) {
        trackers.forEach(tracker => {
            addTracker(tracker.title, tracker.unit, tracker.count);
        });
    }
}

function saveExecutionData(title, date, count) {
    const executionsKey = `${title}-executions`;
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



function addTracker(title, unit, count = 0) {
    const listItem = document.createElement('li');

    const trackerText = document.createElement('span');
    trackerText.className = 'tracker-text';
    trackerText.textContent = title;
    listItem.appendChild(trackerText);

    const trackerUnit = document.createElement('span');
    trackerUnit.className = 'tracker-unit';
    trackerUnit.textContent = unit;
    listItem.appendChild(trackerUnit);

    const numberOfCompletions = document.createElement('label');
    numberOfCompletions.textContent = count;
    listItem.appendChild(numberOfCompletions);

    const addButton = document.createElement('button');
    addButton.textContent = '+';
    addButton.addEventListener('click', () => {
        count++;
        numberOfCompletions.textContent = count;
        saveTrackers();
        saveExecutionData(title, new Date(), 1);
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
        window.location.href = `./stats.html?name=${title}&count=${countValue}`;
    });
    listItem.appendChild(statsButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Удалить';
    deleteButton.addEventListener('click', () => {
        listItem.remove();
        saveTrackers();
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
            addTracker(title, unit);
            saveTrackers();
            trackerTitle.value = '';
        }
    });
});
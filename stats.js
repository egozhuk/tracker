function loadExecutionData(title) {
    const executionsKey = `${title}-executions`;
    const savedData = JSON.parse(localStorage.getItem(executionsKey)) || [];
    const lastSevenDays = getLastSevenDays();

    const chartData = lastSevenDays.map(day => {
        const dataForDay = savedData.find(item => item.date === day);
        return dataForDay ? dataForDay.count : 0;
    });

    return chartData;
}

function getLastSevenDays() {
    const dates = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        const formattedDate = date.toLocaleDateString('ru-RU');

        dates.unshift(formattedDate);
    }

    return dates;
}

function renderChart(data) {
    const ctx = document.getElementById('tracker-chart').getContext('2d');

    const labels = getLastSevenDays(); // Получаем метки с датами

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Количество выполнений',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name') || 'не указано';
    const count = urlParams.get('count') || 'не указано';

    const trackerNameElement = document.getElementById('tracker-name');
    trackerNameElement.textContent = name;

    const trackerCountElement = document.getElementById('tracker-count');
    trackerCountElement.textContent += count;

    const data = loadExecutionData(name);
    renderChart(data);
});
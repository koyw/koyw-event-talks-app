const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf-8'));
const template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf-8');
const style = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf-8');
const script = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf-8');

let scheduleHtml = '';
let currentTime = new Date();
currentTime.setHours(10, 0, 0, 0);

function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

data.forEach((talk, index) => {
    const startTime = new Date(currentTime);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    scheduleHtml += `
        <div class="talk" data-categories="${talk.categories.join(',').toLowerCase()}">
            <p class="time">${formatTime(startTime)} - ${formatTime(endTime)}</p>
            <h2>${talk.title}</h2>
            <p class="speakers">By: ${talk.speakers.join(', ')}</p>
            <p>${talk.description}</p>
            <div class="categories">
                ${talk.categories.map(cat => `<span class="category">${cat}</span>`).join('')}
            </div>
        </div>
    `;

    currentTime = endTime;

    if (index === 2) { // Lunch break after the 3rd talk
        const lunchStartTime = new Date(currentTime);
        const lunchEndTime = new Date(lunchStartTime.getTime() + 60 * 60 * 1000);
        scheduleHtml += `<div class="break">${formatTime(lunchStartTime)} - ${formatTime(lunchEndTime)}: Lunch Break</div>`;
        currentTime = lunchEndTime;
    } else if (index < data.length - 1) { // 10-minute break
        const breakStartTime = new Date(currentTime);
        const breakEndTime = new Date(breakStartTime.getTime() + 10 * 60 * 1000);
        scheduleHtml += `<div class="break">${formatTime(breakStartTime)} - ${formatTime(breakEndTime)}: Break</div>`;
        currentTime = breakEndTime;
    }
});

const finalHtml = template
    .replace('<!-- SCHEDULE -->', scheduleHtml)
    .replace('<!-- STYLES -->', `<style>${style}</style>`)
    .replace('<!-- SCRIPT -->', `<script>${script}</script>`);

fs.writeFileSync(path.join(__dirname, 'index.html'), finalHtml);

console.log('Successfully generated index.html');

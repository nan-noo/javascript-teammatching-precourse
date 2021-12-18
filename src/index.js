import { fetchHtmlView } from './fetch.js';
import { CONFIRM_MESSAGE, INCORRECT_CREW_NAME } from './constants/alert-messages.js';

import Crew from './model/crew.js';

let crewList = [];
let selectedCourse = 'frontend';

function onCourseRadioClick(e) {
    selectedCourse = e.target.value;
}

function onAddCrewClick() {
    const newCrewName = document.querySelector("#crew-name-input").value;
    if(checkCrewInput(newCrewName)) {
        crewList.push(new Crew(newCrewName, selectedCourse));
        renderCrewList(crewList);

    }
    else alert(INCORRECT_CREW_NAME);
}

function renderCrewList(crews) {
    const tableBody = document.querySelector("#crew-table > tbody");
    tableBody.innerHTML = '';
    
    crews.forEach((crew, index) => {
        const newCrew = document.createElement('tr');
        newCrew.innerHTML = renderNewCrewInnerHtml(index, crew.name);
        tableBody.appendChild(newCrew);
    });
}

function renderNewCrewInnerHtml(index, name) {
    return `
        <td>${index + 1}</td>
        <td>${name}</td>
        <td>
            <button class="delete-crew-buttton">삭제</button>
        </td>
    `;
}

function checkCrewInput(name) {
    return !isSameName(name.trim()) && name.trim().length <= 5 && name.trim().length >= 1; 
}

function isSameName(name) {
    return crewList.filter(crew => crew.name === name).length;
}

function onDeleteCrewClick(target) {
    if(confirm(CONFIRM_MESSAGE)) {
        deleteFromCrewList(crewList, target);
        renderCrewList(crewList);
    }
}

function deleteFromCrewList(crews, target) {
    const index = target.parentElement.parentElement.rowIndex - 1;
    crews.splice(index, 1);
}

//
async function renderView(fileName) {
    const view = await fetchHtmlView(fileName);
    app.innerHTML = view;
}

function onCrewTabClick() {
    renderView('crew-manage.html')
        .then(_ => renderCrewList(crewList));
}

function onTeamTabClick() {
    renderView('team-manage.html');
}

function eventHandler(e) {
    e.preventDefault();

    const handlers = {
        "crew-tab"() { onCrewTabClick(); },
        "team-tab"() { onTeamTabClick(); },
        "frontend-course"() { onCourseRadioClick(e) },
        "backend-course"() { onCourseRadioClick(e) },
        "add-crew-buttton"() { onAddCrewClick(); },
        "delete-crew-buttton"() { onDeleteCrewClick(e.target); },
    };
    const handlerKeys = Object.keys(handlers);
    if(handlerKeys.includes(e.target.id)) handlers[e.target.id]();
    else if(handlerKeys.includes(e.target.className)) handlers[e.target.className]();
}

const app = document.querySelector("#app");

renderView('tab.html');
app.addEventListener('click', eventHandler);
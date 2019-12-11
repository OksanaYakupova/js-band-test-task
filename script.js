function openCreateTaskForm() {
    createTaskFormTitle.value = '';
    createTaskFormDescription.value = '';
    createTaskFormPriority.value = 'high';
    editedCard = undefined;

    openTaskForm();
}

function openEditTaskForm(card) {
    createTaskFormTitle.value = card.querySelector(".js-create-task-title").textContent;
    createTaskFormDescription.value = card.querySelector(".js-create-task-description").textContent;
    createTaskFormPriority.value = card.querySelector(".js-create-task-priority").textContent;
    editedCard = card;

    openTaskForm();
}

function openTaskForm() {
    document.querySelector(".js-create-task").style.display = "block";
    document.querySelector(".js-main-overlay").style.display = "block";
}

function closeTaskForm() {
    document.querySelector(".js-create-task").style.display = "none";
    document.querySelector(".js-main-overlay").style.display = "none";
}

//New task card
function createNewTaskElement(title, description, priority) {
    let newCard = document.createElement("div"); //card body
    let cardTitle = document.createElement("div"); //input title
    let cardDescription = document.createElement("div"); //input description
    let cardSettings = document.createElement("div"); //priority&status
    let cardPriority = document.createElement("div"); //select priority
    let cardStatus = document.createElement("div"); //card status area
    let cardSelect = document.createElement("select");//choose card status
    let disabledOption = document.createElement("option"); //disabled selected
    let doneOption = document.createElement("option");//done option
    let editOption = document.createElement("option");//edit option
    let deleteOption = document.createElement("option");//delete option

    newCard.className = "task-card js-task-card";

    cardTitle.innerText = title;
    cardTitle.type = "text";
    cardTitle.className = "card-title js-create-task-title";

    cardDescription.innerText = description;
    cardDescription.type = "text";
    cardDescription.className = "card-description js-create-task-description";

    cardSettings.className = "card-settings";

    cardPriority.innerText = priority;
    cardPriority.type = "text";
    cardPriority.className = "card-priority js-create-task-priority";

    cardStatus.className = "card-status-select";

    cardSelect.className = "card-select-area";
    cardSelect.addEventListener("change", function (event) {
        if (cardSelect.value === 'done') {
            cardStatusDone(newCard);
        } else if (cardSelect.value === 'edit') {
            openEditTaskForm(newCard);

        } else if (cardSelect.value === 'delete') {
            newCard.remove();
        }

        cardSelect.value = "";
    });

    disabledOption.innerText = "";
    doneOption.innerText = "done";
    editOption.innerText = "edit";
    deleteOption.innerText = "delete";

    newCard.appendChild(cardTitle);
    newCard.appendChild(cardDescription);
    newCard.appendChild(cardSettings);
    cardSettings.appendChild(cardPriority);
    cardSettings.appendChild(cardStatus);
    cardStatus.appendChild(cardSelect);

    cardSelect.appendChild(disabledOption);
    cardSelect.appendChild(doneOption);
    cardSelect.appendChild(editOption);
    cardSelect.appendChild(deleteOption);
    return newCard;
}

function submitCard(event) {
    if (editedCard) {
        updateCard(editedCard);
    } else {
        addCard();
    }
    event.preventDefault();
}

function addCard() {
    let newCard = createNewTaskElement(
        createTaskFormTitle.value,
        createTaskFormDescription.value,
        createTaskFormPriority.value);

    taskList.appendChild(newCard);

    console.log('CREATE CARD', newCard);

    closeTaskForm();
    filterCards();
}

function updateCard(card) {
    console.log('UPDATE CARD', card);
    card.querySelector(".js-create-task-title").textContent = createTaskFormTitle.value;
    card.querySelector(".js-create-task-description").textContent = createTaskFormDescription.value;
    card.querySelector(".js-create-task-priority").textContent = createTaskFormPriority.value;

    card.classList.remove("done-card");
    card.querySelector(".card-select-area").classList.remove("card-status-done");

    closeTaskForm();
    filterCards();
}

function cardStatusDone(card) {
    card.classList.add("done-card");
    card.querySelector(".card-select-area").classList.add("card-status-done");
    filterCards();
}

function filterCards() {
    function checkFilterStatus(card) {
        let isAccepted;

        const isCardDone = card.classList.contains("done-card");
        const isCardOpen = !isCardDone;

        if (filterStatus.value === 'all') {
            isAccepted = true;
        } else if (filterStatus.value === 'open') {
            isAccepted = isCardOpen;
        } else if (filterStatus.value === 'done') {
            isAccepted = isCardDone;
        } else {
            isAccepted = false;
        }

        return isAccepted;
    }

    function checkFilterPriority(card) {
        let isAccepted;

        console.log(filterPriority.value, card.querySelector(".js-create-task-priority").textContent);
        const cardPriority = card.querySelector(".js-create-task-priority").textContent;

        if (filterPriority.value === 'all') {
            isAccepted = true;
        } else {
            isAccepted = filterPriority.value === cardPriority;
        }


        return isAccepted;
    }

    function checkFilterSearch(card) {
        return true;
    }

    const cards = document.querySelectorAll(".js-task-card");
    cards.forEach(function (card) {
        const isAccepted = checkFilterSearch(card) && checkFilterStatus(card) && checkFilterPriority(card);
        if (isAccepted) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    })

}

let filterSearch = document.querySelector(".js-search-input");
let filterStatus = document.querySelector(".js-card-status-filter");
let filterPriority = document.querySelector(".js-card-status-priority-filter");

filterSearch.addEventListener("input", filterCards);
filterStatus.addEventListener("change", filterCards);
filterPriority.addEventListener("change", filterCards);

let editedCard = undefined;
let createTaskForm = document.querySelector(".js-create-task-form");//Create form
let createTaskFormTitle = document.querySelector(".js-create-task-title");//Add a title
let createTaskFormDescription = document.querySelector(".js-create-task-description");//Add a description
let createTaskFormPriority = document.querySelector(".js-create-task-priority");//Select a priority
let createTaskFormCancelButton = document.querySelector(".js-create-task-cancel");//Cancel button
let taskList = document.querySelector(".js-task-list");//tasks section

createTaskForm.addEventListener("submit", submitCard);
createTaskFormCancelButton.addEventListener("click", closeTaskForm);
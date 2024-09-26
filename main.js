// Function to load lists from localStorage
function loadLists() {
    const storedLists = JSON.parse(localStorage.getItem('todolists')) || [];
    storedLists.forEach(list => createNewList(list.title, list.tasks));
}

// Function to save lists to localStorage
function saveLists() {
    const lists = [];
    document.querySelectorAll('.list').forEach(listDiv => {
        const title = listDiv.querySelector('.name').textContent;
        const tasks = [];
        listDiv.querySelectorAll('.list-group-item label').forEach(label => {
            tasks.push(label.textContent);
        });
        lists.push({ title, tasks });
    });
    localStorage.setItem('todolists', JSON.stringify(lists));
}

// Function to create a new list
function createNewList(listTitle = '', tasks = []) {
    // If no title is provided, ask the user for the title and first task
    if (!listTitle) {
        listTitle = prompt('Enter a name for your new list:');
        if (!listTitle) return; // Exit if title is empty
    }

    // Create a new div element for the list
    const newListDiv = document.createElement('div');
    newListDiv.classList.add('list', 'mb-3'); // Add classes for styling

    // Create the list name element
    const listName = document.createElement('div');
    listName.classList.add('name', 'fw-bold');
    listName.textContent = listTitle;

    // Create the ul element for tasks
    const listGroup = document.createElement('ul');
    listGroup.classList.add('list-group');

    // Function to add a task to the list
    function addTask(taskText) {
        if (!taskText.trim()) return;

        // Create a new list item
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

        const taskContent = document.createElement('div');

        const checkbox = document.createElement('input');
        checkbox.classList.add('form-check-input', 'me-1');
        checkbox.type = 'checkbox';

        const label = document.createElement('label');
        label.classList.add('form-check-label');
        label.textContent = taskText;

        taskContent.appendChild(checkbox);
        taskContent.appendChild(label);

        // Settings button to toggle task delete option
        const settingsBtn = document.createElement('button');
        settingsBtn.classList.add('btn', 'btn-secondary', 'btn-sm', 'ms-2');
        settingsBtn.textContent = '⚙';

        // Delete button, initially hidden
        const deleteTaskBtn = document.createElement('button');
        deleteTaskBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'ms-2');
        deleteTaskBtn.textContent = 'Delete';
        deleteTaskBtn.style.display = 'none'; // Hide by default

        // Show/hide the delete button when settings is clicked
        settingsBtn.addEventListener('click', function () {
            deleteTaskBtn.style.display = deleteTaskBtn.style.display === 'none' ? 'inline-block' : 'none';
        });

        // Add functionality to delete the task when delete button is clicked
        deleteTaskBtn.addEventListener('click', function () {
            listItem.remove();  // Remove the specific task from the list
            saveLists();        // Update the saved lists
        });

        // Append task content and buttons to list item
        listItem.appendChild(taskContent);
        listItem.appendChild(settingsBtn);
        listItem.appendChild(deleteTaskBtn);

        // Add the task to the list group
        listGroup.appendChild(listItem);
    }

    // Add the provided tasks (or prompt the user for the first task)
    if (tasks.length === 0) {
        const firstTask = prompt('Enter the first task for your new list:');
        if (firstTask) addTask(firstTask);
    } else {
        tasks.forEach(task => addTask(task));
    }

    // Input field and button to add more tasks dynamically
    const taskInputDiv = document.createElement('div');
    taskInputDiv.classList.add('mb-3');

    const taskInput = document.createElement('input');
    taskInput.type = 'text';
    taskInput.classList.add('form-control');
    taskInput.placeholder = 'Add a task';

    const addTaskBtn = document.createElement('button');
    addTaskBtn.classList.add('btn', 'btn-primary', 'mt-2');
    addTaskBtn.textContent = 'Add Task';

    // Add task functionality when button is clicked
    addTaskBtn.addEventListener('click', function () {
        const taskText = taskInput.value.trim();
        addTask(taskText);
        taskInput.value = ''; // Clear input after adding the task
        saveLists();          // Save the lists to localStorage
    });

    // Create a delete button for the entire list
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn', 'btn-danger', 'mt-2', 'ms-2');
    deleteBtn.textContent = 'Delete List';

    // Add functionality to delete the entire list when the button is clicked
    deleteBtn.addEventListener('click', function () {
        newListDiv.remove();  // Remove the entire list from the DOM
        saveLists();          // Update the saved lists
    });

    // Append elements to the task input div
    taskInputDiv.appendChild(taskInput);
    taskInputDiv.appendChild(addTaskBtn);

    // Append the list name, task input, list group, and delete button to the new div
    newListDiv.appendChild(listName);
    newListDiv.appendChild(taskInputDiv);
    newListDiv.appendChild(listGroup);
    newListDiv.appendChild(deleteBtn);  // Add the delete button for the list

    // Append the new list div to the todolists container
    document.querySelector('.todolists').appendChild(newListDiv);

    // Save the lists to localStorage
    saveLists();
}

// Event listener for the 'Create new list' button
document.getElementById('createNewList').addEventListener('click', function (e) {
    e.preventDefault();  // Prevent default action
    createNewList();     // Call the function to create a new list
});

// Load the saved lists from localStorage when the page loads
document.addEventListener('DOMContentLoaded', loadLists);

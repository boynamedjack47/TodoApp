// Function to create a new list
function createNewList() {
    // Prompt the user to enter the list name and first task
    const listTitle = prompt('Enter a name for your new list:');
    const firstTask = prompt('Enter the first task for your new list:');

    if (!listTitle || !firstTask) return; // Exit if any input is empty or canceled

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

    // Function to add a task to the list with a settings button
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
        settingsBtn.textContent = '⚙'; // A gear icon for settings
        
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
        });

        // Append task content and buttons to list item
        listItem.appendChild(taskContent);
        listItem.appendChild(settingsBtn);
        listItem.appendChild(deleteTaskBtn);

        // Add the task to the list group
        listGroup.appendChild(listItem);
    }

    // Add the first task provided by the user
    addTask(firstTask);

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
    });

    // Create a delete button for the entire list
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn', 'btn-danger', 'mt-2', 'ms-2');
    deleteBtn.textContent = 'Delete List';

    // Add functionality to delete the entire list when the button is clicked
    deleteBtn.addEventListener('click', function () {
        newListDiv.remove();  // Remove the entire list from the DOM
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
}

// Event listener for the 'Create new list' button
document.getElementById('createNewList').addEventListener('click', function (e) {
    e.preventDefault();  // Prevent default action
    createNewList();     // Call the function to create a new list
});

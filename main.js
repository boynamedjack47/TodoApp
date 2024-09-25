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
    listName.classList.add('name');
    listName.textContent = listTitle;

    // Create the ul element for tasks
    const listGroup = document.createElement('ul');
    listGroup.classList.add('list-group');

    // Function to add a task to the list
    function addTask(taskText) {
        if (!taskText.trim()) return;

        // Create a new list item
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        
        const checkbox = document.createElement('input');
        checkbox.classList.add('form-check-input', 'me-1');
        checkbox.type = 'checkbox';
        
        const label = document.createElement('label');
        label.classList.add('form-check-label');
        label.textContent = taskText;

        listItem.appendChild(checkbox);
        listItem.appendChild(label);
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

    // Append elements to the task input div
    taskInputDiv.appendChild(taskInput);
    taskInputDiv.appendChild(addTaskBtn);

    // Append the list name, task input, and list group to the new div
    newListDiv.appendChild(listName);
    newListDiv.appendChild(taskInputDiv);
    newListDiv.appendChild(listGroup);

    // Append the new list div to the todolists container
    document.querySelector('.todolists').appendChild(newListDiv);
}

// Event listener for the 'Create new list' button
document.getElementById('createNewList').addEventListener('click', function (e) {
    e.preventDefault();  // Prevent default action
    createNewList();     // Call the function to create a new list
});

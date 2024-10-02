export function loadLists() {
    const storedLists = JSON.parse(localStorage.getItem('todolists')) || [];
    storedLists.forEach(list => createNewList(list.title, list.tasks, list.isArchived));
  }
  
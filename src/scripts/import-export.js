function exportTasks() {
    const tasksData = JSON.parse(localStorage.getItem('tasksData')) || {
        todo: [],
        inProgress: [],
        done: [],
        comments: {}
    };
    
    let csvContent = '\ufeff' + 'Задача,Статус\n';
    
    // Экспортируем задачи из всех колонок
    tasksData.todo.forEach(task => {
        const escapedTask = task.replace(/"/g, '""');
        csvContent += `"${escapedTask}","todo"\n`;
    });
    
    tasksData.inProgress.forEach(task => {
        const escapedTask = task.replace(/"/g, '""');
        csvContent += `"${escapedTask}","inProgress"\n`;
    });
    
    tasksData.done.forEach(task => {
        const escapedTask = task.replace(/"/g, '""');
        csvContent += `"${escapedTask}","done"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().slice(0, 10);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `tasks_${date}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function importTasks(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const text = e.target.result;
        const rows = text.split('\n');
        const tasksData = {
            todo: [],
            inProgress: [],
            done: [],
            comments: {}
        };
        
        // Пропускаем заголовок и обрабатываем каждую строку
        for(let i = 1; i < rows.length; i++) {
            if(rows[i].trim() === '') continue;
            
            // Разбиваем строку на части, учитывая кавычки
            const match = rows[i].match(/"([^"]*)","([^"]*)"/);
            if (match) {
                const [, task, status] = match;
                tasksData[status].push(task);
                tasksData.comments[task] = []; // Инициализируем пустой массив комментариев
            }
        }
        
        localStorage.setItem('tasksData', JSON.stringify(tasksData));
        window.dispatchEvent(new Event('tasksUpdated'));
        alert('Задачи успешно импортированы!');
        // Добавляем автообновление страницы после алерта
        window.location.reload();
    };
    
    reader.readAsText(file);
} 
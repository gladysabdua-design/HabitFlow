
const habitInput = document.getElementById('habitInput');
const addBtn = document.getElementById('addBtn');
const habitList = document.getElementById('habitList');

// Load habits + today's date
let habits = JSON.parse(localStorage.getItem('habits')) || [];
const today = new Date().toISOString().split('T')[0]; // Format: 2026-04-08

function displayHabits() {
  habitList.innerHTML = '';
  const last7Days = getLast7Days();

  habits.forEach((habit, index) => {
    const li = document.createElement('li');
    li.style.marginBottom = '20px';
    li.style.padding = '15px';
    li.style.background = '#f9f9f9';
    li.style.borderRadius = '8px';

    const streak = calculateStreak(habit.completedDates || []);
    const isDoneToday = habit.completedDates && habit.completedDates.includes(today);

    // Top row
    const topRow = document.createElement('div');
    topRow.style.display = 'flex';
    topRow.style.justifyContent = 'space-between';
    topRow.style.marginBottom = '10px';
    topRow.innerHTML = `<strong>${habit.name}</strong> - 🔥 ${streak}`;

    const btnDiv = document.createElement('div');
    const doneBtn = document.createElement('button');
    doneBtn.textContent = isDoneToday? '✓ Done' : 'Mark Done';
    doneBtn.style.background = isDoneToday? '#4CAF50' : '#2196F3';
    doneBtn.style.color = 'white';
    doneBtn.style.border = 'none';
    doneBtn.style.padding = '5px 10px';
    doneBtn.style.borderRadius = '4px';
    doneBtn.onclick = () => toggleHabit(index);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.style.background = '#f44336';
    deleteBtn.style.color = 'white';
    deleteBtn.style.border = 'none';
    deleteBtn.style.padding = '5px 10px';
    deleteBtn.style.marginLeft = '5px';
    deleteBtn.style.borderRadius = '4px';
    deleteBtn.onclick = () => deleteHabit(index);

    btnDiv.appendChild(doneBtn);
    btnDiv.appendChild(deleteBtn);
    topRow.appendChild(btnDiv);
    li.appendChild(topRow);

    // Weekly calendar
    const weekRow = document.createElement('div');
    weekRow.style.display = 'flex';
    weekRow.style.gap = '5px';
    weekRow.style.justifyContent = 'center';

    const days = ['M','T','W','T','F','S','S'];
    last7Days.forEach((date, i) => {
      const dayBox = document.createElement('div');
      dayBox.textContent = days[i];
      dayBox.style.width = '30px';
      dayBox.style.height = '30px';
      dayBox.style.display = 'flex';
      dayBox.style.alignItems = 'center';
      dayBox.style.justifyContent = 'center';
      dayBox.style.borderRadius = '4px';
      dayBox.style.fontSize = '12px';
      
      if (habit.completedDates && habit.completedDates.includes(date)) {
        dayBox.style.background = '#4CAF50';
        dayBox.style.color = 'white';
      } else {
        dayBox.style.background = '#ddd';
        dayBox.style.color = '#666';
      }
      weekRow.appendChild(dayBox);
    });

    li.appendChild(weekRow);
    habitList.appendChild(li);
  });
}

function getLast7Days() {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

function addHabit() {
	const habitText = habitInput.value.trim();
	if (habitText === '') {
		alert('Please type a habit first!');
		return;
	}

	// New format: object instead of just text
	habits.push({
		name: habitText,
		completedDates: []
	});

	saveAndRefresh();
	habitInput.value = '';
}

function toggleHabit(index) {
	const habit = habits[index];
	if (!habit.completedDates) habit.completedDates = [];

	if (habit.completedDates.includes(today)) {
		// Remove today = unmark
		habit.completedDates = habit.completedDates.filter(date => date!== today);
	} else {
		// Add today = mark done
		habit.completedDates.push(today);
	}

	saveAndRefresh();
}

function deleteHabit(index) {
	habits.splice(index, 1);
	saveAndRefresh();
}

function calculateStreak(dates) {
	if (!dates || dates.length === 0) return 0;

	let streak = 0;
	let currentDate = new Date();

	while (true) {
		const dateStr = currentDate.toISOString().split('T')[0];
		if (dates.includes(dateStr)) {
			streak++;
			currentDate.setDate(currentDate.getDate() - 1);
		} else {
			break;
		}
	}
	return streak;
}

function saveAndRefresh() {
	localStorage.setItem('habits', JSON.stringify(habits));
	displayHabits();
}

addBtn.addEventListener('click', addHabit);
habitInput.addEventListener('keypress', (e) => {
	if (e.key === 'Enter') addHabit();
});

displayHabits();

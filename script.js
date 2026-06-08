
const habitInput = document.getElementById('habitInput');
const addBtn = document.getElementById('addBtn');
const habitList = document.getElementById('habitList');

// Load habits + today's date
let habits = JSON.parse(localStorage.getItem('habits')) || [];
const today = new Date().toISOString().split('T')[0]; // Format: 2026-04-08

function displayHabits() {
	habitList.innerHTML = '';

	habits.forEach((habit, index) => {
		const li = document.createElement('li');

		// Check if done today
		const isDoneToday = habit.completedDates && habit.completedDates.includes(today);

		// Calculate streak
		const streak = calculateStreak(habit.completedDates || []);

		li.innerHTML = `
			<span style="text-decoration: ${isDoneToday? 'line-through' : 'none'}">
				${habit.name} - <img src="https://fonts.gstatic.com/s/e/notoemoji/17.0/1f525/72.png" alt="fire" style="width:16px;height:16px;vertical-align:middle;"/> ${streak} day streak
			</span>
		`;

		// Mark Done button
		const doneBtn = document.createElement('button');
		doneBtn.textContent = isDoneToday? '✓ Done' : 'Mark Done';
		doneBtn.style.margin = '0 5px';
		doneBtn.style.background = isDoneToday? '#4CAF50' : '#2196F3';
		doneBtn.onclick = () => toggleHabit(index);

		// Delete button
		const deleteBtn = document.createElement('button');
		deleteBtn.textContent = 'X';
		deleteBtn.onclick = () => deleteHabit(index);

		li.appendChild(doneBtn);
		li.appendChild(deleteBtn);
		habitList.appendChild(li);
	});
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

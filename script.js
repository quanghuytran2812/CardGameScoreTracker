let members = [];
let rounds = [];
let currentRound = 0;

function setupMembers() {
    const memberCount = document.getElementById('memberCount').value;
    if (memberCount < 1) return;

    const nameInputs = document.getElementById('nameInputs');
    nameInputs.innerHTML = '';

    for (let i = 0; i < memberCount; i++) {
        nameInputs.innerHTML += `<input type="text" placeholder="Member ${i + 1} Name">`;
    }

    document.getElementById('setup').style.display = 'none';
    document.getElementById('nameEntry').style.display = 'block';
}

function createScoreTable() {
    const nameInputs = document.querySelectorAll('#nameInputs input');
    members = Array.from(nameInputs).map(input => input.value);

    const headerRow = document.getElementById('headerRow');
    headerRow.innerHTML = '<th>Round</th>';
    members.forEach(member => {
        headerRow.innerHTML += `<th>${member}</th>`;
    });

    document.getElementById('nameEntry').style.display = 'none';
    document.getElementById('scoreTable').style.display = 'block';
}

function addRound() {
    currentRound++;
    const scoreDialog = document.getElementById('scoreDialog');
    const scoreInputs = document.getElementById('scoreInputs');
    scoreInputs.innerHTML = '';

    members.forEach(member => {
        scoreInputs.innerHTML += `<label>${member}:</label><input type="number" id="${member}">`;
    });

    scoreDialog.style.display = 'flex';
}

function submitScores() {
    const scores = {};
    members.forEach(member => {
        scores[member] = parseInt(document.getElementById(member).value) || 0;
    });

    rounds.push(scores);
    updateTable();
    closeDialog();
}

function updateTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    rounds.forEach((round, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>Round ${index + 1}</td>`;
        members.forEach(member => {
            row.innerHTML += `<td>${round[member]}</td>`;
        });
        row.onclick = () => editRound(index);
        tableBody.appendChild(row);
    });

    updateTotalRow();
}

function updateTotalRow() {
    const totalRow = document.getElementById('totalRow');
    totalRow.innerHTML = '<td>Total</td>';
    members.forEach(member => {
        const total = rounds.reduce((sum, round) => sum + (round[member] || 0), 0);
        const color = total >= 0 ? 'green' : 'red';
        totalRow.innerHTML += `<td style="color: ${color}">${total}</td>`;
    });
}

function closeDialog() {
    document.getElementById('scoreDialog').style.display = 'none';
}

function editRound(index) {
    const editDialog = document.getElementById('editDialog');
    const editInputs = document.getElementById('editInputs');
    editInputs.innerHTML = '';

    members.forEach(member => {
        editInputs.innerHTML += `<label>${member}:</label><input type="number" id="edit${member}" value="${rounds[index][member]}">`;
    });

    editDialog.style.display = 'flex';
    editDialog.dataset.index = index;
}

function updateScores() {
    const index = document.getElementById('editDialog').dataset.index;
    const scores = {};

    members.forEach(member => {
        scores[member] = parseInt(document.getElementById(`edit${member}`).value) || 0;
    });

    rounds[index] = scores;
    updateTable();
    closeEditDialog();
}

function closeEditDialog() {
    document.getElementById('editDialog').style.display = 'none';
}

function finishGame() {
    document.getElementById('scoreTable').style.display = 'none';
    document.getElementById('moneyTable').style.display = 'block';
}

function calculateMoney() {
    const amount = parseInt(document.getElementById('amount').value) || 0;
    const moneyTableBody = document.getElementById('moneyTableBody');
    moneyTableBody.innerHTML = '';

    members.forEach(member => {
        const totalPoints = rounds.reduce((sum, round) => sum + (round[member] || 0), 0);
        const totalMoney = totalPoints * amount;
        const formattedMoney = CurrencyFormatVND(totalMoney);
        const row = document.createElement('tr');
        row.innerHTML = `<td>${member}</td><td class="${totalMoney < 0 ? 'negative' : 'positive'}">${formattedMoney}</td>`;
        moneyTableBody.appendChild(row);
    });
}

function CurrencyFormatVND(value) {
    // Format the number with dots as thousand separators
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫';
}
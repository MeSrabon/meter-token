let tokens;
let currentIndex = -1;
let doneTokens = new Set();

function displayToken(index) {
    const tokenNumberBox = document.getElementById('tokenNumberBox');

    if (tokens && index < tokens.length && index >= 0) {
        const formattedToken = tokens[index].split('-').join(' - ');
        tokenNumberBox.textContent = formattedToken;
        document.getElementById('tokenDisplay').style.display = 'flex';
        document.querySelector('.navigation').style.display = 'flex';

        document.getElementById('prevToken').disabled = index === 0;
        document.getElementById('nextToken').disabled = index === tokens.length - 1;
    }
}

function createTable(startingSequence) {
    const tableContainer = document.getElementById('tokenTableContainer');
    let tableHTML = '<table>';
    tableHTML += '<thead><tr><th>Token</th><th>Sequence</th></tr></thead>';
    tableHTML += '<tbody>';
    tokens.forEach((token, index) => {
        tableHTML += `<tr id="tokenRow-${index}"><td>${token}</td><td>${index + startingSequence}</td></tr>`;
    });
    tableHTML += '</tbody></table>';
    tableContainer.innerHTML = tableHTML;
}

function updateTable(currentIndex, startingSequence) {
    const tableRows = document.querySelectorAll('#tokenTableContainer table tbody tr');

    tableRows.forEach((row, index) => {
        row.classList.remove('current-token', 'done-token');
    });

    tableRows.forEach((row, index) => {
        if (doneTokens.has(index)) {
            row.classList.add('done-token');
        }
    });

    if (currentIndex >= 0 && currentIndex < tokens.length) {
        tableRows[currentIndex].classList.add('current-token');
    }
}

document.getElementById('startButton').addEventListener('click', function() {
    const input = document.getElementById('tokenInput').value.trim();
    const sequenceRegex = /\b(\d{4}-\d{4}-\d{4}-\d{4}-\d{4})\b/g;
    tokens = input.match(sequenceRegex);
    const warningDiv = document.getElementById('warning');
    const tokenDisplay = document.getElementById('tokenDisplay');
    const navigation = document.querySelector('.navigation');

    warningDiv.style.display = 'none';
    tokenDisplay.style.display = 'none';
    navigation.style.display = 'none';

    if (!tokens || tokens.length === 0) {
        warningDiv.textContent = 'Please enter a valid token message.';
        warningDiv.style.display = 'block';
    } else {
        const sequenceInfoRegex = /SeqNo:(-?\d+)=(-?\d+)/;
        const match = input.match(sequenceInfoRegex);

        if (match) {
            const startSequence = parseInt(match[1], 10);
            const numTokens = parseInt(match[2], 10) + 1;
            createTable(startSequence);
            currentIndex = 0;
            displayToken(currentIndex);
            updateTable(currentIndex, startSequence);
            this.style.display = 'none';
            setTimeout(() => {
                const contentAboveFooter = document.getElementById('tokenTableContainer');
                const footer = document.querySelector('footer');

                const contentRect = contentAboveFooter.getBoundingClientRect();
                const footerRect = footer.getBoundingClientRect();

                const scrollToPosition = window.scrollY + contentRect.bottom - window.innerHeight + footerRect.height;

                window.scrollTo({
                    top: scrollToPosition,
                    behavior: 'smooth'
                });
            }, 100);
            document.getElementById('tokenInput').style.display = 'none';
            document.getElementById('newToken').style.display = 'inline-block';
        } else {
            createTable(0);
            currentIndex = 0;
            displayToken(currentIndex);
            updateTable(currentIndex, 0);
            this.style.display = 'none';
            setTimeout(() => {
                const contentAboveFooter = document.getElementById('tokenTableContainer');
                const footer = document.querySelector('footer');

                const contentRect = contentAboveFooter.getBoundingClientRect();
                const footerRect = footer.getBoundingClientRect();

                const scrollToPosition = window.scrollY + contentRect.bottom - window.innerHeight + footerRect.height;

                window.scrollTo({
                    top: scrollToPosition,
                    behavior: 'smooth'
                });
            }, 100);
            document.getElementById('tokenInput').style.display = 'none';
            document.getElementById('newToken').style.display = 'inline-block';
        }
    }
});

document.getElementById('newToken').addEventListener('click', function() {
    window.location.reload();
});

document.getElementById('nextToken').addEventListener('click', function() {
    if (currentIndex < tokens.length - 1) {
        doneTokens.add(currentIndex);
        currentIndex++;
        displayToken(currentIndex);
        updateTable(currentIndex);
    }
});

document.getElementById('prevToken').addEventListener('click', function() {
    if (currentIndex > 0) {
        if (doneTokens.has(currentIndex)) {
            doneTokens.delete(currentIndex);
        }
        currentIndex--;
        displayToken(currentIndex);
        updateTable(currentIndex);
    }
});

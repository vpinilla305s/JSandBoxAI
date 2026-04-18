function customizeEditor(id, mode) {
    const editor = ace.edit(id);
    editor.setTheme('ace/theme/monokai');
    editor.session.setMode(mode);
    editor.setOptions({
        fontSize: '14px',
        showPrintMargin: false,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        scrollPastEnd: 0.1
    });
    return editor;
}

const htmlEditor = customizeEditor('html-editor', 'ace/mode/html');
const cssEditor = customizeEditor('css-editor', 'ace/mode/css');
const jsEditor = customizeEditor('js-editor', 'ace/mode/javascript');


Promise.all([
    fetch('templates/default.html').then(r => r.text()),
    fetch('templates/default.css').then(r => r.text()),
    fetch('templates/default.js').then(r => r.text())
]).then(([html, css, js]) => {
    htmlEditor.setValue(html, -1);
    cssEditor.setValue(css, -1);
    jsEditor.setValue(js, -1);
    runCode();
}).catch(err => {
    console.error('Error loading templates:', err);
});


function switchTab(tab) {
    const tabs = document.querySelectorAll('.tab');
    const editors = document.querySelectorAll('.editor');
    const exercisePanel = document.getElementById('exercise-panel');

    tabs.forEach(t => t.classList.remove('active'));
    editors.forEach(e => e.classList.remove('active'));
    exercisePanel.classList.remove('active');

    if (tab === 'exercise') {
        document.querySelector('.tab:nth-child(4)').classList.add('active');
        exercisePanel.classList.add('active');
    } else {
        const tabIndex = tab === 'html' ? 1 : tab === 'css' ? 2 : 3;
        document.querySelector(`.tab:nth-child(${tabIndex})`).classList.add('active');
        document.getElementById(`${tab}-editor`).classList.add('active');

        // Forzar el redibujado de Ace Editor cuando el contenedor vuelve a ser visible
        if (tab === 'html') { htmlEditor.resize(); htmlEditor.focus(); }
        if (tab === 'css') { cssEditor.resize(); cssEditor.focus(); }
        if (tab === 'js') { jsEditor.resize(); jsEditor.focus(); }
    }
}


function runCode() {
    const html = htmlEditor.getValue();
    const css  = cssEditor.getValue();
    const js   = jsEditor.getValue();

    const iframe    = document.getElementById('preview');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    const output = `<!DOCTYPE html>
<html>
<head>
    <style>${css}</style>
</head>
<body>
    ${html}
    <script>${js}<\/script>
</body>
</html>`;

    iframeDoc.open();
    iframeDoc.write(output);
    iframeDoc.close();
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

document.getElementById('modalOverlay').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
});


// Event listener for hint modal click
document.getElementById('modalHints').addEventListener('click', function (e) {
    if (e.target === this) closeHints();
});


const resizer = document.getElementById('resizer');
const editorsPanel = document.querySelector('.editors-panel');
const previewPanel = document.querySelector('.preview-panel');
const container = document.querySelector('.container');

let isResizing = false;

resizer.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isResizing = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.body.style.pointerEvents = 'none';
});

document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;

    const containerRect   = container.getBoundingClientRect();
    const newWidth        = e.clientX - containerRect.left;
    const percentage      = (newWidth / containerRect.width) * 100;
    const minWidthPercent = 20;
    const maxWidthPercent = 80;

    if (percentage >= minWidthPercent && percentage <= maxWidthPercent) {
        editorsPanel.style.width = percentage + '%';
        previewPanel.style.width = (100 - percentage) + '%';
    }
});

document.addEventListener('mouseup', () => {
    if (!isResizing) return;
    isResizing = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
    document.body.style.pointerEvents = 'auto';

    htmlEditor.resize();
    cssEditor.resize();
    jsEditor.resize();
});

htmlEditor.session.on('change', runCode);
cssEditor.session.on('change', runCode);
jsEditor.session.on('change', runCode);


document.getElementById('exerciseForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const level   = document.getElementById('level').value;

    document.getElementById('exerciseForm').style.display = 'none';
    document.getElementById('loading').style.display = 'block';

    try {
        const response = await fetch('/api/create-exercise', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description, level })
        });

        const data = await response.json();

        document.getElementById('exercise-title').textContent = data.title;
        document.getElementById('exercise-statement').textContent = data.statement;

        document.getElementById('modalPreview').dataset.title = data.title;
        document.getElementById('modalPreview').dataset.statement = data.statement;
        
        currentHints = data.hints || [];
        currentRequirements = data.requirements || [];
        currentExerciseStatement = data.statement;

        closeModal();
        document.getElementById('modalPreview').classList.add('active');

    } catch (error) {
        document.getElementById('exercise-panel').innerHTML = `<p style="color:red">Error al conectar con el servidor: ${error.message}</p>`;
        closeModal();
        switchTab('exercise');
    } finally {
        // Restore the modal for next time
        document.getElementById('exerciseForm').style.display = 'block';
        document.getElementById('loading').style.display = 'none';
    }
});


function closePreview() {
    document.getElementById('modalPreview').classList.remove('active');
}

function newExercise(description = '', level = '') {
    document.getElementById('description').value = description;
    document.getElementById('level').value = level;
    document.getElementById('modalOverlay').classList.add('active');
}

function createExercise() {
    const modal = document.getElementById('modalPreview');
    const title = modal.dataset.title;
    const statement = modal.dataset.statement;

    document.getElementById('exercise-panel-title').textContent = title;
    document.getElementById('exercise-panel-statement').textContent = statement;

    // Vaciar los contenedores de código
    htmlEditor.setValue('', -1);
    cssEditor.setValue('', -1);
    jsEditor.setValue('', -1);
    runCode();

    document.getElementById('btn-correct').disabled = false;
    document.getElementById('btn-hints').disabled = false;

    closePreview();
    switchTab('exercise');
}

function regenerateExercise() {
    closePreview();

    description = document.getElementById('description').value;
    level = document.getElementById('level').value;
    newExercise(description, level);
}

function correctSolution() {
    alert('La corrección automática se implementará próximamente.');
}

// Lógica de Pistas
let currentHints = [];
let currentHintIndex = 0;
let currentExerciseStatement = '';
let currentRequirements = [];

function showHints() {
    if (currentHints.length === 0) {
        alert('No hay pistas disponibles para este ejercicio.');
        return;
    }
    currentHintIndex = 0;
    updateHintModal();
    document.getElementById('modalHints').classList.add('active');
}

function closeHints() {
    document.getElementById('modalHints').classList.remove('active');
}

function updateHintModal() {
    const title = document.getElementById('hint-modal-title');
    const description = document.getElementById('hint-modal-description');
    const btnPrev = document.getElementById('btn-prev-hint');
    const btnNext = document.getElementById('btn-next-hint');

    title.innerHTML = `<i class="fa-solid fa-lightbulb"></i> Pista ${currentHintIndex + 1}`;
    description.textContent = currentHints[currentHintIndex];

    btnPrev.disabled = currentHintIndex === 0;
    btnNext.disabled = currentHintIndex === currentHints.length - 1;
}

function changeHint(direction) {
    currentHintIndex += direction;
    if (currentHintIndex < 0) currentHintIndex = 0;
    if (currentHintIndex >= currentHints.length) currentHintIndex = currentHints.length - 1;
    updateHintModal();
}

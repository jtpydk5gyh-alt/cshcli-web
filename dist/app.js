const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const english = document.documentElement.lang === 'en';
const text = english ? {
  paused: '▷ Enable animations', playing: 'Ⅱ Pause animations', copied: 'Command copied. Your terminal is ready.',
  selected: 'Command selected. Press Ctrl+C or ⌘C to copy.', next: 'For the next steps, use', instead: 'instead of cshcli.'
} : {
  paused: '▷ Activar animaciones', playing: 'Ⅱ Pausar animaciones', copied: 'Comando copiado. Tu terminal te espera.',
  selected: 'Comando seleccionado. Pulsa Ctrl+C o ⌘C para copiar.', next: 'Para los siguientes pasos usa', instead: 'en lugar de cshcli.'
};
const platforms = {
  windows: { python: 'py', shell: 'PowerShell', venv: 'py -m venv .venv', envPython: '.venv\\Scripts\\python', envCli: '.venv\\Scripts\\cshcli', note: 'Necesitas Python 3.11+ con pip y el lanzador py. Se descarga la rama main.', environment: 'Si ya usas un entorno virtual, sustituye py por python.' },
  macos: { python: 'python3', shell: 'Terminal', venv: 'python3 -m venv .venv', envPython: '.venv/bin/python', envCli: '.venv/bin/cshcli', note: 'Necesitas Python 3.11+ con pip. Se descarga main. macOS no está cubierto por la CI.', environment: 'Si tu Python está gestionado por el sistema, usa un entorno virtual.' },
  linux: { python: 'python3', shell: 'Bash / Zsh', venv: 'python3 -m venv .venv', envPython: '.venv/bin/python', envCli: '.venv/bin/cshcli', note: 'Necesitas Python 3.11+ con pip. Se descarga main. Linux y Windows tienen CI.', environment: 'Si tu distribución bloquea pip global, usa un entorno virtual.' }
};
const packageUrl = 'https://github.com/jtpydk5gyh-alt/cshcli/archive/refs/heads/main.zip';
if (english) {
  Object.assign(platforms.windows, { note: 'Requires Python 3.11+ with pip and the py launcher. Downloads the main branch.', environment: 'If you already use a virtual environment, replace py with python.' });
  Object.assign(platforms.macos, { note: 'Requires Python 3.11+ with pip. Downloads main. macOS is not covered by CLI CI.', environment: 'If your Python is managed by the system, use a virtual environment.' });
  Object.assign(platforms.linux, { note: 'Requires Python 3.11+ with pip. Downloads main. Linux and Windows have CI.', environment: 'If your distribution blocks global pip installs, use a virtual environment.' });
}
const scenes = english ? [
  { label: 'One project. A place to start.', lines: [['command', 'cshcli project create my-project'], ['success', '✓ Project created'], ['output', '  name      my-project\n  role      owner\n  status    ready to work']] },
  { label: 'Your providers. Your credentials.', lines: [['command', 'cshcli provider status'], ['output', '  openai        api-key\n  anthropic     api-key\n  google        api-key\n  minimax       api-key'], ['output', '  codex         official-cli\n  claude-code   official-cli\n  gemini-cli    detected · no chat'], ['muted', '  Example · configure your own accounts']] },
  { label: 'Decisions have a memory, too.', lines: [['command', 'cshcli memory list <project>'], ['output', '  architecture  ·  v1\n  One worktree per task.\n\n  Every decision keeps its version.'], ['success', '✓ Shared context, without losing the thread']] }
] : [
  { label: 'Un proyecto. Un punto de partida.', lines: [['command', 'cshcli project create mi-proyecto'], ['success', '✓ Proyecto creado'], ['output', '  nombre    mi-proyecto\n  rol       owner\n  estado    listo para trabajar']] },
  { label: 'Tus proveedores. Tus credenciales.', lines: [['command', 'cshcli provider status'], ['output', '  openai        api-key\n  anthropic     api-key\n  google        api-key\n  minimax       api-key'], ['output', '  codex         official-cli\n  claude-code   official-cli\n  gemini-cli    detectado · sin chat'], ['muted', '  Ejemplo · configura tus propias cuentas']] },
  { label: 'Las decisiones también tienen memoria.', lines: [['command', 'cshcli memory list <proyecto>'], ['output', '  architecture  ·  v1\n  Un worktree por tarea.\n\n  Cada decisión conserva su versión.'], ['success', '✓ Contexto compartido, sin perder el hilo']] }
];
let animationId = 0;
let currentScene = 0;
let motionPaused = true;
const output = document.querySelector('#demo-output');
const motionButton = document.querySelector('#motion-toggle');
function selectPlatform(name) {
  const platform = platforms[name];
  document.querySelectorAll('.platform').forEach(button => {
    const active = button.dataset.platform === name;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelector('#install-command').textContent = `${platform.python} -m pip install "${packageUrl}"`;
  document.querySelector('#shell-label').textContent = platform.shell;
  document.querySelector('#install-note').textContent = platform.note;
  document.querySelector('#environment-note').textContent = platform.environment;
  document.querySelector('#venv-command').textContent = `${platform.venv}\n${platform.envPython} -m pip install "${packageUrl}"\n${platform.envCli} --version`;
  document.querySelector('#venv-note').textContent = `${text.next} ${platform.envCli} ${text.instead}`;
}
function showScene(index, animate = true) {
  const runId = ++animationId;
  currentScene = index;
  const scene = scenes[index];
  document.querySelector('#scene-label').textContent = scene.label;
  document.querySelectorAll('.demo-tab').forEach(button => {
    const active = Number(button.dataset.scene) === index;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  output.replaceChildren();
  const lines = scene.lines.map(([kind, text]) => {
    const line = document.createElement('span');
    line.className = `demo-line ${kind}`;
    line.textContent = kind === 'command' ? `❯ ${text}` : text;
    output.append(line);
    return line;
  });
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  cursor.textContent = '❯ ▌';
  output.append(cursor);
  if (animate && !motionPaused) {
    lines.forEach(line => line.classList.add('pending'));
    cursor.classList.add('pending');
    lines.forEach((line, step) => setTimeout(() => {
      if (runId !== animationId) return;
      line.classList.remove('pending');
      if (step === lines.length - 1) cursor.classList.remove('pending');
    }, 150 + step * 600));
  }
}
function setMotion(paused) {
  motionPaused = paused;
  document.documentElement.classList.toggle('motion-paused', paused);
  motionButton.textContent = paused ? text.paused : text.playing;
  showScene(currentScene, false);
}
document.querySelectorAll('.platform').forEach(button => button.addEventListener('click', () => selectPlatform(button.dataset.platform)));
document.querySelectorAll('.demo-tab').forEach(button => button.addEventListener('click', () => showScene(Number(button.dataset.scene))));
document.querySelector('#replay').addEventListener('click', () => showScene(currentScene));
motionButton.addEventListener('click', () => setMotion(!motionPaused));
reducedMotion.addEventListener('change', event => {
  if (event.matches) setMotion(true);
});
document.querySelector('#copy-install').addEventListener('click', async () => {
  const command = document.querySelector('#install-command');
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(command.textContent);
    status.textContent = text.copied;
  } catch {
    const selection = getSelection();
    const range = document.createRange();
    range.selectNodeContents(command);
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = text.selected;
  }
  status.classList.add('visible');
  setTimeout(() => status.classList.remove('visible'), 4500);
});
setMotion(motionPaused);

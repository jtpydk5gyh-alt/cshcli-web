$ErrorActionPreference = 'Stop'
$packageUrl = 'https://github.com/jtpydk5gyh-alt/cshcli/archive/ce655314e44a2bedd949fd88143cb8a603fd18a8.zip'
$installRoot = if ($env:CSHCLI_INSTALL_DIR) { $env:CSHCLI_INSTALL_DIR } else { Join-Path $env:LOCALAPPDATA 'cshcli' }
$installRoot = [IO.Path]::GetFullPath($installRoot)
$python = Get-Command py -ErrorAction SilentlyContinue
if (-not $python) { $python = Get-Command python -ErrorAction SilentlyContinue }
if (-not $python) { throw 'Install Python 3.11 or later from https://www.python.org/downloads/ and run this command again.' }
& $python.Source -c 'import sys; sys.exit(0 if sys.version_info >= (3, 11) else 1)'
if ($LASTEXITCODE -ne 0) { throw 'Python 3.11 or later is required.' }
if (Test-Path -LiteralPath $installRoot) {
    if (-not (Test-Path -LiteralPath (Join-Path $installRoot 'pyvenv.cfg') -PathType Leaf)) {
        throw "The installation directory already exists and is not a virtual environment: $installRoot"
    }
} else {
    & $python.Source -m venv $installRoot
    if ($LASTEXITCODE -ne 0) { throw 'Could not create the virtual environment.' }
}
$bin = Join-Path $installRoot 'Scripts'
$envPython = Join-Path $bin 'python.exe'
& $envPython -m pip install --disable-pip-version-check $packageUrl
if ($LASTEXITCODE -ne 0) { throw 'Installation failed. Check the error above and run the command again.' }
& (Join-Path $bin 'cshcli.exe') --version
if ($LASTEXITCODE -ne 0) { throw 'The installed command failed its version check.' }
$env:Path = "$bin;$env:Path"
Write-Host 'CSHCLI 0.7.0 is ready in this terminal. Next: cshcli start'
Write-Host "In a new terminal, run: & '$(Join-Path $bin 'cshcli.exe')' --help"

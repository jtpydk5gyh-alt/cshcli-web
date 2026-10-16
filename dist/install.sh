set -eu
package_url='https://github.com/jtpydk5gyh-alt/cshcli/archive/ce655314e44a2bedd949fd88143cb8a603fd18a8.zip'
install_root="${CSHCLI_INSTALL_DIR:-$HOME/.local/share/cshcli}"
bin_dir="${CSHCLI_BIN_DIR:-$HOME/.local/bin}"
command -v python3 >/dev/null 2>&1 || { printf '%s\n' 'Install Python 3.11 or later, then run this command again.' >&2; exit 1; }
python3 -c 'import sys; sys.exit(0 if sys.version_info >= (3, 11) else 1)' || { printf '%s\n' 'Python 3.11 or later is required.' >&2; exit 1; }
install_root="$(python3 -c 'import os,sys; print(os.path.abspath(sys.argv[1]))' "$install_root")"
bin_dir="$(python3 -c 'import os,sys; print(os.path.abspath(sys.argv[1]))' "$bin_dir")"
if [ -e "$install_root" ]; then
    [ -f "$install_root/pyvenv.cfg" ] || { printf '%s\n' "Refusing to overwrite a directory without a virtual environment: $install_root" >&2; exit 1; }
else
    python3 -m venv "$install_root"
fi
"$install_root/bin/python" -m pip install --disable-pip-version-check "$package_url"
"$install_root/bin/cshcli" --version
mkdir -p "$bin_dir"
if [ -e "$bin_dir/cshcli" ] || [ -L "$bin_dir/cshcli" ]; then
    [ -L "$bin_dir/cshcli" ] && [ "$(readlink "$bin_dir/cshcli")" = "$install_root/bin/cshcli" ] || { printf '%s\n' "CSHCLI installed. Existing command preserved: $bin_dir/cshcli"; printf '%s\n' "Run: $install_root/bin/cshcli --help"; exit 0; }
else
    ln -s "$install_root/bin/cshcli" "$bin_dir/cshcli"
fi
printf '%s\n' 'CSHCLI 0.7.0 is installed. Next: cshcli start'
case ":$PATH:" in
    *":$bin_dir:"*) ;;
    *) printf '%s\n' "Add $bin_dir to your PATH, or run: $install_root/bin/cshcli start" ;;
esac

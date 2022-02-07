#!/bin/bash

set -euo pipefail

if ! grep -q "Fedora" /etc/os-release; then
  tput setaf 1; echo "This script is designed for fedora"; tput sgr0
fi

sudo yum install -y gcc-c++ make pkgconf-pkg-config webkit2gtk3-devel gtk3-devel nodejs
node -v &>/dev/null
npm version &>/dev/null
command -v go &>/dev/null
go install github.com/wailsapp/wails/cmd/wails@latest
"$(go env GOPATH)/bin/wails"

tput setaf 2; echo "All prerequisites have been installed!"; tput sgr0

# Notebase
A desktop application that let users store notes and have them properly indexed by their topics
	
# Required
- Electron.js
- Rust (nightly version)
	
# Installation of requirements
- ElectronJS:
  - npm i -D electron@latest

- Rust:
  - curl https://sh.rustup.rs -sSf | sh
  - source $HOME/.cargo/env
  - rustup toolchain install nightly
	
(I assume you can figure out the rest ?......)
	
# FYI
Setup rust on port 8000 since it's what the electron application is point at

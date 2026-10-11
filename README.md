# 🧊 Cubely — Rubik's Cube Solver

### Scan. Solve. Learn. — One Move at a Time.

**Cubely** is a web-based Rubik's Cube solver project designed to help users scan a cube, identify its colours, and receive step-by-step solving instructions.

The project combines a TypeScript-powered frontend with a Python backend, exploring interactive user interfaces, cube-state representation, colour recognition, and solving algorithms.

---

## ✨ Features

- 📷 **Cube Scanning Interface** — Designed to guide users through scanning all six sides of a Rubik's Cube.
- 🎨 **Colour Recognition** — Represents cube face colours and scanned sticker states.
- 🧊 **Cube State Representation** — Organises the cube's colours for solving.
- 🧩 **Solving Logic** — Connects the cube state to a solving algorithm.
- 🪜 **Step-by-Step Guidance** — Designed to present moves that help users solve their cube.
- ⚡ **Interactive Frontend** — Built with TypeScript, Vite, HTML, and CSS.
- 🐍 **Python Backend** — Handles backend cube-processing and solving functionality.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| TypeScript | Frontend application logic |
| HTML5 | Page structure |
| CSS3 | Styling and animations |
| Vite | Frontend development server and build tooling |
| Python | Backend logic and cube processing |
| Git & GitHub | Version control |

---

## 📂 Project Structure

The project is organised into separate frontend and backend components.

```text
Cubely/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── main.ts
│       └── style.css
│
├── backend/
│   ├── main.py
│   └── requirements.txt
│
├── .gitignore
└── README.md
```

*Note: This is an illustrative structure. Adjust the paths and filenames to match the actual files in your repository.*

---

## 🚀 Getting Started

Follow these steps to run Cubely locally.

### Prerequisites

Install the following tools:

- [Node.js](https://nodejs.org/)
- [Python](https://www.python.org/)
- [Git](https://git-scm.com/)

Check your installations:

```bash
node --version
npm --version
python --version
```

On some Windows installations, you may need to use `py --version` instead of `python --version`.

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd Cubely
```

Replace `YOUR_REPOSITORY_URL` with your GitHub repository URL.

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

This installs the packages declared in the frontend's `package.json`.

### 3. Start the frontend

From the `frontend` directory, run:

```bash
npm run dev
```

Open the local URL displayed by Vite in your terminal, commonly:

`http://localhost:5173/`

### 4. Set up the Python backend

Open a second terminal in the backend directory:

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment.

**Windows PowerShell:**

```powershell
.\.venv\Scripts\Activate.ps1
```

**Windows Command Prompt:**

```bat
.venv\Scripts\activate.bat
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

Start the backend using the entry point and command documented in your project. For example, if your application uses FastAPI and defines `app` in `main.py`:

```bash
uvicorn main:app --reload
```

The command above is only appropriate if Cubely actually uses FastAPI and has that application entry point. Otherwise, use the startup command configured for your backend.

---

## 🧠 How It Works

Cubely is designed around a typical cube-solving workflow:

1. **Scan the cube** — Capture or select the colours of each face.
2. **Build the cube state** — Organise the scanned colours into a representation of the cube.
3. **Validate the state** — Check whether the scanned configuration can represent a valid cube.
4. **Calculate a solution** — Pass the cube state to the solving logic.
5. **Display the solution** — Present the moves in an understandable sequence.
6. **Follow the instructions** — Use the displayed moves to work towards a solved cube.

The availability of each step depends on the features implemented in the current version of the project.

---

## 📦 Dependencies & Installation Notes

**`node_modules` is not included in this repository.**

This is intentional. The directory contains installed JavaScript packages and can be very large. Dependencies are installed locally from the project's package manifest.

To restore them after cloning the repository:

```bash
cd frontend
npm install
```

If the project uses `package-lock.json`, keep that file in GitHub so npm can reproduce the intended dependency versions more consistently.

Python dependencies are managed separately through `requirements.txt`. Create a virtual environment and install those packages as described above.

### Recommended `.gitignore`

```gitignore
# Node.js
node_modules/
frontend/node_modules/

# Build output
dist/
frontend/dist/

# Python
__pycache__/
*.py[cod]
.venv/
venv/

# Environment variables
.env
.env.*
!.env.example

# Operating system
.DS_Store
Thumbs.db

# IDE
.vscode/
```

Keep configuration files required to run the project, such as `package.json`, lockfiles, `requirements.txt`, and Vite configuration files, in the repository.

---

## ⚠️ Current Limitations

- Colour recognition depends on the scanning implementation and lighting conditions.
- The accuracy of the solution depends on correctly identifying all six faces.
- Backend startup requirements depend on the Python framework and solving library used.
- A complete end-to-end solving workflow requires the scanner, cube-state validation, solving algorithm, and instruction interface to work together.

---

## 🔮 Future Improvements

- 📷 Improve real-time camera-based colour detection.
- 🔍 Add cube-state validation and clearer scanning feedback.
- 🧊 Display a 3D Rubik's Cube model.
- 🔄 Animate the solving sequence move by move.
- 📱 Improve the mobile scanning experience.
- 🎯 Add move navigation, progress tracking, and solution replay.
- ☁️ Deploy the frontend and backend for public access.

---

## 🎯 What I Learned

Cubely gives me the opportunity to explore:

- TypeScript and frontend application development.
- Python backend integration.
- Representing and validating a Rubik's Cube state.
- Connecting a user interface to solving logic.
- Debugging frontend and backend integration issues.
- Managing JavaScript and Python dependencies.
- Structuring a project for version control and collaboration.

---

## 👨‍💻 Author

**Franco De Silva**

BSc Computer Science — University of Westminster

[GitHub](https://github.com/YOUR_USERNAME) · [LinkedIn](YOUR_LINKEDIN_URL)

---

<p align="center">
  <b>🧊 Cubely — Every scramble has a solution.</b>
</p>

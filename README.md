# Northstar GRC Dashboard

A local React dashboard for entering, reviewing, and tracking ISO 27001:2022 security findings and remediation progress.

## View the dashboard locally

### Before you start

Install Node.js and npm on your computer. Verify they are available in a terminal:

```text
node --version
npm --version
```

Clone the repository once, then open the project folder in VS Code:

```text
git clone https://github.com/Alex-Dabbs/risk-rating-dashboard.git
cd risk-rating-dashboard
```

If you already have the project folder, open that folder in VS Code and skip the clone step.

### Windows PC

In VS Code, choose **Terminal → New Terminal**. In PowerShell, install the project dependencies and start the local development server:

```powershell
npm.cmd install
npm.cmd run dev
```

Open the local address printed in the terminal, usually <http://localhost:5173/>. Use `npm.cmd` in PowerShell to avoid its script execution policy blocking `npm.ps1`. In Command Prompt, you can use `npm install` and `npm run dev` instead.

### Mac

Open the project folder in VS Code, then choose **Terminal → New Terminal**. Run:

```sh
npm install
npm run dev
```

Open the local address printed in the terminal, usually <http://localhost:5173/>.

### Stop the server

Return to the terminal running Vite and press **Ctrl+C**. To start the dashboard again later, open the project folder and run the same start command for your operating system.

## Notes

- Findings are stored in the browser's local storage on the device and browser where they are entered.
- New browser profiles start with the finding snapshot in `src/data/browser-findings.snapshot.json`. It includes the records and updates provided for this project.
- This project is an early dashboard prototype; it does not currently provide a shared server or authentication.

## Build

Windows PowerShell:

```powershell
npm.cmd run build
```

Mac or Windows Command Prompt:

```sh
npm run build
```

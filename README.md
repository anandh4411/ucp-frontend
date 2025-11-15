# 🎖️ Unit Communication Portal (UCP) - Student Guide

A military-themed communication platform for army units. This guide will help you set up and run the project on your computer.

---

## 📋 Table of Contents
1. [What You Need to Install](#what-you-need-to-install)
2. [Step-by-Step Setup (Windows)](#step-by-step-setup-windows)
3. [Step-by-Step Setup (Mac)](#step-by-step-setup-mac)
4. [Step-by-Step Setup (Linux)](#step-by-step-setup-linux)
5. [Running the Project](#running-the-project)
6. [Common Problems and Solutions](#common-problems-and-solutions)
7. [Understanding the Project](#understanding-the-project)

---

## 📦 What You Need to Install

Before you start, you need to install these programs on your computer:

1. **Node.js** - This allows you to run JavaScript code on your computer
2. **PNPM** - A tool to manage project files and packages
3. **Visual Studio Code (VS Code)** - A code editor to view and edit the project

Don't worry if you don't know what these are - just follow the steps below! 😊

---

## 💻 Step-by-Step Setup (Windows)

### Step 1: Install Node.js ⬇️

1. Open your web browser (Chrome, Edge, etc.)
2. Go to: **https://nodejs.org/**
3. You will see two green buttons. Click on the **LTS** button (it says something like "20.x.x LTS")
4. A file will download (it will be called something like `node-v20.x.x-x64.msi`)
5. Find the downloaded file (usually in your "Downloads" folder) 📁
6. Double-click the file to open it
7. Click "Next" on all the screens (keep all the default settings) ✅
8. Click "Install" and wait for it to finish ⏳
9. Click "Finish"

**✔️ Check if it worked:**
1. Press the Windows key on your keyboard ⊞
2. Type `cmd` and press Enter (this opens Command Prompt)
3. Type this command and press Enter:
   ```
   node --version
   ```
4. You should see something like `v20.x.x`
5. If you see this, Node.js is installed! 🎉 If not, see [Common Problems](#common-problems-and-solutions)

### Step 2: Install PNPM 📦

1. Open Command Prompt again (Windows key, type `cmd`, press Enter)
2. Copy this command and paste it (right-click in Command Prompt to paste):
   ```
   npm install -g pnpm
   ```
3. Press Enter and wait for it to finish (it might take 1-2 minutes) ⏳
4. When it's done, check if it worked by typing:
   ```
   pnpm --version
   ```
5. You should see a version number like `9.x.x` ✅

### Step 3: Install Visual Studio Code 📝

1. Go to: **https://code.visualstudio.com/**
2. Click the big blue "Download for Windows" button 🔵
3. A file will download (called something like `VSCodeUserSetup-x64-x.xx.x.exe`)
4. Find the file in your Downloads folder 📁
5. Double-click to open it
6. Click "Next" on all screens
7. **⚠️ Important:** On the "Select Additional Tasks" screen, check the box that says **"Add to PATH"**
8. Click "Install" and wait ⏳
9. Click "Finish"

### Step 4: Extract the Project Files 📂

1. Find the **ucp-frontend.zip** file your teacher gave you
2. Right-click on the zip file
3. Select **"Extract All..."**
4. Choose a location (we recommend creating a folder called `MyProjects` on your Desktop)
5. Click "Extract" and wait ⏳
6. You should now see a folder called `ucp-frontend`

### Step 5: Install Project Packages 📦

1. Open Command Prompt (Windows key, type `cmd`, press Enter)
2. Navigate to your project folder. Type these commands one by one (press Enter after each):
   ```
   cd Desktop\MyProjects\ucp-frontend
   ```
   (Change the path if you extracted it somewhere else)

3. Now install all the required packages by typing:
   ```
   pnpm install
   ```
4. Press Enter and wait (this will take 5-10 minutes - be patient!) ⏳☕
5. You'll see lots of text scrolling - this is normal ✅
6. When it stops and you see the prompt again, it's done! 🎉

---

## 🍎 Step-by-Step Setup (Mac)

### Step 1: Install Homebrew (Mac Package Manager) 🍺

1. Open **Terminal** (Press Cmd + Space, type "Terminal", press Enter)
2. Copy and paste this command:
   ```
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
3. Press Enter and follow the instructions
4. It might ask for your password - type it (you won't see anything as you type, this is normal) 🔒
5. Wait for it to finish ⏳

### Step 2: Install Node.js ⬇️

1. In Terminal, type:
   ```
   brew install node
   ```
2. Press Enter and wait ⏳
3. Check if it worked:
   ```
   node --version
   ```
4. You should see something like `v20.x.x` ✅

### Step 3: Install PNPM 📦

1. In Terminal, type:
   ```
   npm install -g pnpm
   ```
2. Wait for it to finish ⏳
3. Check if it worked:
   ```
   pnpm --version
   ```
4. You should see a version number ✅

### Step 4: Install Visual Studio Code 📝

1. Go to: **https://code.visualstudio.com/**
2. Click "Download for Mac" 🔵
3. Open the downloaded file (VSCode-darwin-universal.zip)
4. Drag the Visual Studio Code app to your Applications folder 📁
5. Open it from Applications

### Step 5: Extract the Project Files 📂

1. Find the **ucp-frontend.zip** file your teacher gave you
2. Double-click the zip file to extract it
3. Move the extracted folder to a good location (like Desktop or Documents)
4. Remember where you put it!

### Step 6: Install Project Packages 📦

1. In Terminal, navigate to your project folder:
   ```
   cd ~/Desktop/ucp-frontend
   ```
   (Change the path if you put it somewhere else)

2. Install all packages:
   ```
   pnpm install
   ```
3. Wait for it to finish (5-10 minutes) ⏳☕
4. Done! 🎉

---

## 🐧 Step-by-Step Setup (Linux)

### Step 1: Install Node.js ⬇️

**For Ubuntu/Debian:**
1. Open Terminal (Ctrl + Alt + T)
2. Type these commands one by one:
   ```
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

**For Fedora:**
```
sudo dnf install nodejs
```

### Step 2: Install PNPM 📦

```
npm install -g pnpm
```

### Step 3: Install Visual Studio Code 📝

**Ubuntu/Debian:**
1. Go to: **https://code.visualstudio.com/**
2. Click "Download .deb" 🔵
3. Open the downloaded file and click "Install"

**Fedora:**
1. Download the .rpm file
2. Install using: `sudo dnf install ./code-*.rpm`

### Step 4: Extract the Project Files 📂

1. Find the **ucp-frontend.zip** file
2. Right-click and select "Extract Here" or "Extract to..."
3. Move the folder to your preferred location

### Step 5: Install Project Packages 📦

```
cd ~/Desktop/ucp-frontend
pnpm install
```
(Change the path to where you extracted the project)

Wait for it to finish (5-10 minutes) ⏳☕

---

## 🚀 Running the Project

### Starting the Development Server

1. **🎯 Open the project in VS Code:**
   - Open VS Code
   - Click "File" → "Open Folder"
   - Navigate to where you extracted the project (e.g., Desktop → MyProjects → ucp-frontend)
   - Click "Select Folder"

2. **💻 Open Terminal in VS Code:**
   - At the top of VS Code, click "Terminal" → "New Terminal"
   - A terminal window will open at the bottom

3. **▶️ Start the project:**
   - In the terminal, type:
     ```
     pnpm dev
     ```
   - Press Enter
   - Wait for it to start (you'll see some messages) ⏳
   - Look for a line that says something like:
     ```
     ➜  Local:   http://localhost:5174/
     ```
   - You should see "ready in X ms" - that means it's working! ✅

4. **🌐 Open in your browser:**
   - Hold Ctrl (or Cmd on Mac) and click on the link `http://localhost:5174/`
   - OR manually type `http://localhost:5174/` in your browser (Chrome, Firefox, etc.)
   - The website should open! 🎉

### 🛑 Stopping the Server

- In the VS Code terminal, press **Ctrl + C** (this stops the server)
- Type `y` if it asks "Terminate batch job?"
- The server is now stopped ✅

---

## 🔧 Common Problems and Solutions

### ❌ Problem 1: "node is not recognized" (Windows)

**Solution:**
1. Close all Command Prompt windows
2. Restart your computer 🔄
3. Try again
4. If still not working:
   - Press Windows key + R
   - Type `sysdm.cpl` and press Enter
   - Click "Advanced" tab → "Environment Variables"
   - Under "System variables", find "Path"
   - Click "Edit"
   - Click "New"
   - Add: `C:\Program Files\nodejs\`
   - Click OK on everything
   - Restart computer 🔄

### ❌ Problem 2: "Permission denied" (Mac/Linux)

**Solution:**
Add `sudo` before the command:
```
sudo pnpm install
```
It will ask for your password 🔒

### ❌ Problem 3: pnpm install takes forever or gets stuck

**Solution:**
1. Press Ctrl + C to stop it 🛑
2. Delete the `node_modules` folder (if it exists)
3. Try again:
   ```
   pnpm install --force
   ```

### ❌ Problem 4: Port 5174 is already in use

**Solution:**
1. Either close the other program using that port
2. Or change the port by adding this to your command:
   ```
   pnpm dev --port 3000
   ```
   Then open `http://localhost:3000/` instead

### ❌ Problem 5: Cannot find module or package

**Solution:**
1. Make sure you ran `pnpm install` completely
2. Delete `node_modules` folder and `pnpm-lock.yaml` file
3. Run `pnpm install` again

### ❌ Problem 6: Browser shows "Cannot GET /"

**Solution:**
- Make sure the terminal shows "ready in X ms" ✅
- Check the exact URL - it should be `http://localhost:5174/`
- Try refreshing the page (F5) 🔄

### ❌ Problem 7: Code changes don't show up

**Solution:**
1. Save the file (Ctrl + S or Cmd + S) 💾
2. The page should auto-refresh
3. If not, manually refresh the browser (F5) 🔄
4. Check the terminal for errors

### ❌ Problem 8: "ENOENT: no such file or directory"

**Solution:**
- You're in the wrong folder!
- Make sure you're in the `ucp-frontend` folder
- Use `cd` command to navigate to the correct folder
- Example: `cd Desktop\MyProjects\ucp-frontend`

---

## 📚 Understanding the Project

### 📁 Project Structure

```
ucp-frontend/
├── src/                    # 💻 All your code goes here
│   ├── features/          # 📄 Different pages (dashboard, messages, etc.)
│   ├── components/        # 🧩 Reusable parts (buttons, cards, etc.)
│   ├── api/              # 🔌 Code to connect to backend
│   └── index.css         # 🎨 Color theme (change colors here!)
├── public/               # 🖼️ Images and static files
├── package.json          # 📦 List of tools/packages used
└── README.md            # 📖 This file!
```

### 📌 Important Files

- **`src/index.css`** - 🎨 Change website colors here (lines 48-116)
- **`src/features/auth/sign-in/index.tsx`** - 🔐 Login page
- **`src/features/dashboard/index.tsx`** - 📊 Main dashboard
- **`src/features/messages/index.tsx`** - 💬 Messages page
- **`src/features/announcements/index.tsx`** - 📢 Announcements page

### ⚡ Available Commands

```bash
pnpm dev          # ▶️ Start development server
pnpm build        # 📦 Create production version
pnpm preview      # 👀 Preview production build
pnpm lint         # 🔍 Check code for errors
```

### 🔑 Default Login Credentials

Use these to test the website:

**Adjutant (Admin):**
- 📧 Email: `adjt@unit.mil`
- 🔒 Password: `Adjt@2025`

**IT JCO (Manager):**
- 📧 Email: `itjco@unit.mil`
- 🔒 Password: `ItJco@2025`

**User:**
- 📧 Email: `user@unit.mil`
- 🔒 Password: `User@2025`

---

## 🆘 Getting Help

If you're stuck:

1. **📖 Read the error message** - It usually tells you what's wrong
2. **🔍 Google the error** - Copy the error message and search it
3. **👨‍🏫 Ask your teacher** - Bring your laptop and show them the error
4. **💻 Check the terminal** - Errors often show up there first

---

## 💡 Tips for Success

✅ **Always run `pnpm install` after extracting the project**
✅ **Keep the terminal open while working**
✅ **Save your files before checking the browser (Ctrl + S)**
✅ **Don't edit `node_modules` or `pnpm-lock.yaml`**
✅ **Use Ctrl + C to stop the server properly**
✅ **Check the terminal for errors if something breaks**
✅ **The first `pnpm install` takes a long time - be patient!**

---

## 📖 About This Project

This is a **Unit Communication Portal** built for military units to:
- 💬 Send and receive messages
- 📢 Post announcements
- 📁 Share resources
- 📅 Manage events and calendars
- 📊 Track user activity

**🛠️ Built with:**
- React 19 (JavaScript library)
- TypeScript (Better JavaScript)
- Vite (Fast development tool)
- Tailwind CSS (Styling)
- Firebase (Database and authentication)

**🎨 Theme:** American Army olive drab green with military-inspired design

---

## 📝 Quick Start Summary

1. ✅ Install Node.js from https://nodejs.org/
2. ✅ Install PNPM: `npm install -g pnpm`
3. ✅ Install VS Code from https://code.visualstudio.com/
4. ✅ Extract the ucp-frontend.zip file
5. ✅ Open terminal and go to the project folder
6. ✅ Run: `pnpm install` (wait 5-10 minutes)
7. ✅ Run: `pnpm dev`
8. ✅ Open browser: http://localhost:5174/
9. 🎉 Done! Start coding!

---

**Good luck with your project! 🎖️**


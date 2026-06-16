# Dev Command Line

<p align="center">
  <img src="resources/command.svg" width="120" />
</p>

<p align="center">
  Manage, organize, and run reusable development commands directly inside VS Code.
</p>

---

## Overview

**Dev Command Line** is a VS Code extension that helps developers save, organize, and execute frequently used terminal commands.

Instead of repeatedly typing the same commands, you can store your commands once, group them, and run them anytime from the VS Code sidebar.

Suitable for:

- Development workflows
- Project setup commands
- Build commands
- Deployment commands
- Database migration commands
- Docker commands

---

# Features

## Command Management

Create and manage reusable commands.

Available actions:

- Add command
- Edit command
- Delete command
- Run command directly from sidebar

Example:

```bash
npm install
npm run dev
php artisan migrate
docker compose up
```

---

## Command Grouping

Organize commands into groups.

Example:

```
Frontend
 ├── npm install
 ├── npm run dev

Backend
 ├── php artisan migrate
 ├── php artisan serve
```

Features:

- Create group
- Edit group
- Delete group
- Move commands between groups

---

## Favorite Commands

Mark frequently used commands as favorites for easier access.

---

## Command Parameters

Use dynamic parameters inside commands.

Example:

```
docker logs {container}
```

When executed, Dev Command Line will ask:

```
Value for container:
```

Input:

```
my-app
```

Result:

```
docker logs my-app
```

---

# Import & Export

Backup and restore your command collection using JSON.

## Export

Export all commands and groups into a JSON file.

## Import

Restore commands from JSON backup.

Useful for:

- Moving to another laptop
- Sharing command templates
- Backup purposes

---

# GitHub Sync

Sync your commands with your private GitHub repository.

Features:

- Connect GitHub account
- Automatically create private repository
- Upload command backup
- Automatic synchronization after changes
- Restore commands on another device

Repository example:

```
dev-command-sync

└── commands.json
```

Your data remains in your own private GitHub account.

---

# How To Use

## Create Group

1. Open Dev Command Line sidebar
2. Click **Create Group**
3. Enter group name

Example:

```
Laravel Project
```

---

## Add Command

1. Click **Add Command**
2. Enter command name
3. Enter terminal command
4. Select group

Example:

Name:

```
Run Migration
```

Command:

```bash
php artisan migrate
```

---

## Run Command

Click the play icon beside a command.

The command will execute automatically in the VS Code terminal.

---

# Sidebar Menu

| Menu | Description |
|---|---|
| Create Group | Create command group |
| Add Command | Add reusable command |
| Run | Execute command |
| Edit | Update command |
| Delete | Remove command |
| Favorite | Mark favorite command |
| Import | Restore JSON backup |
| Export | Create JSON backup |
| GitHub | Manage GitHub synchronization |

---

# Installation

Install from VS Code Marketplace:

Search:

```
Dev Command Line
```

Or install manually:

1. Download `.vsix`
2. Open VS Code
3. Open Command Palette

```
Extensions: Install from VSIX
```

4. Select the file

---

# Development

Install dependencies:

```bash
npm install
```

Compile:

```bash
npm run compile
```

Run extension:

```
Press F5 in VS Code
```

---

# Roadmap

Future improvements:

- Team command sharing
- Workflow templates
- Execution history
- Command logs
- JetBrains plugin support

---

# Support Development

If this extension helps your daily workflow, you can support development:

☕ Trakteer Kopi:

https://trakteer.id/ahmadsalafudin

Thank you for supporting open-source development ❤️

---

# License

MIT License

# iverson.bet 🏀

Purely frontend for [iverson.bet](https://www.iverson.bet), a betting analytics platform that visualizes edges, optimal bankroll wagers, and other sharp metrics across sportsbooks.

> ‼️ This project is 100% frontend. It can optionally integrate with a MongoDB backend for extended functionality.  

## Features

- Updated daily game schedules
- Deep analytical insights behind win probabilties
- Mobile-friendly user interface

---

## Tech Stack

- **Framework:** React / Next.js  
- **Styling:** Tailwind CSS

<br/>

<details>
<summary><strong>Click for additional details on the tech stack primarily used & referenced in the frontend</strong></summary>
<br/>

- **Frontend**
  - **Icons/Tooltips:** [Lucide](https://lucide.dev) and [shadcn/ui](https://ui.shadcn.com)  
  - **State Management:** React Hooks  
  - **Caching:** In-memory caching for fast game data lookup, later will look into Redis

- **Backend**
  - **Database:** MongoDB for real-time and historical odds data  

</details>




---

## 🛠️ Setup

### 1. Clone the Repository

```bash
git clone https://github.com/DevT02/nba-betting.git
cd nba-betting
```
### 2. Install Dependencies
```python
npm install # or npm i
```
### 3. Start the Dev Server
```python
npm run dev
```

## Setup Locally (with MongoDB)
#### 1. In the root of the project, create a .env.local file.
```env
MONGODB_URI=your-mongodb-connection-uri
MONGODB_DB=your-database-name
```

#### 2. Start the dev server again:

```bash
npm run dev
```

#### Or.. if you know what you're doing
Start the production server enviornment
```bash
npm run build
npm run start
```

# AURORA — Advanced Universal Recruitment and Opportunity AI

An AI-powered recruitment platform that intelligently connects job seekers and employers through advanced matching, smart automation, and intuitive dashboards.

## ✨ Features

### 🔍 AI-Powered Job Recommendations

Automatically analyzes resumes and job descriptions using advanced NLP techniques to recommend the most relevant job postings to candidates — improving matching accuracy and saving time for both recruiters and job seekers.

### 📝 Resume Parsing & Keyword Extraction

Uses a custom spaCy PhraseMatcher to extract key skills, technologies, and roles from resumes and profiles. This helps:

* Employers quickly assess applicant qualifications
* Job seekers auto-complete profiles with extracted skills

### 🔑 AI Keyword & Name-Based Job Search

Allows job seekers to search for jobs not only by traditional titles but also by specific **skills, technologies, or company names** extracted intelligently via AI — enabling more flexible and precise job discovery.

### 🌐 Comprehensive Recruitment Portal

A full-featured platform with dedicated dashboards for different users:

* **Job Seekers:**

  * Profile management
  * Resume uploads
  * Apply to jobs directly
  * Track application status

* **Employers:**

  * Post and manage job listings
  * View and filter applicant profiles
  * Track applications in an ATS-style dashboard

* **Admin:**

  * Manage users, jobs, and platform data
  * Insights and analytics dashboard

### 🛡️ Secure & Scalable Architecture

* JWT-based user authentication
* Passwords securely hashed with bcrypt
* Modular backend with PostgreSQL and Sequelize ORM
* Fully local AI (No paid APIs — all processing is in-house)

### 📊 Interactive Dashboards

Clean and responsive dashboards (built with Mantine UI) offer clear overviews of job postings, applications, and user interactions — enhancing the experience for both employers and candidates.

---

## 🛠️ Tech Stack

### Frontend

* [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
* [Mantine UI](https://mantine.dev/) (Components, Forms, Notifications)
* React Router
* Axios

### Backend

* [Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/)
* [PostgreSQL](https://www.postgresql.org/) + [Sequelize ORM](https://sequelize.org/)
* JWT (Authentication)
* bcrypt (Password Hashing)
* dotenv (Environment Config)

### AI Module (NLP Microservice)

* Python + Flask
* spaCy (`en_core_web_md`)
* Custom Keyword Matcher with PhraseMatcher

## 📂 Project Structure

```bash
aurora/
├── backend/                # Node.js + Express backend API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── frontend/               # React + Vite frontend app
│   ├── src/
│   ├── public/
│   ├── .env.example
│   └── package.json
│
├── job-portal/          # Python Flask AI microservice (NLP)
│   ├── nlp_service/
│
├── assets/                 # Diagrams, images, screenshots
│   └── architecture.svg
│
├── .gitignore
├── LICENSE
├── README.md
└── package.json            # Optional (root-level scripts/configs)
```

## 🚀 Installation & Running the Project

### Prerequisites

* Node.js (>= 18.x)
* Python (>= 3.8)
* PostgreSQL
* Git

### 1️⃣ Backend Setup

```bash
cd backend
npm install
# Create a .env file and configure PostgreSQL DB credentials
node server.js
```

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3️⃣ AI Microservice Setup (Keyword Extractor)

```bash
cd job-portal
cd nlp_service
.\venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_md
python app.py
```

> 📝 By default, the AI microservice runs on **port 5002**

## ⚙️ .env Example (Backend)

```bash
DB_HOST=localhost
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_PORT=5432
JWT_SECRET=your_jwt_secret
```

## 📸 Screenshots

> *Coming Soon

## 🌱 Future Improvements

* **AI Resume Scoring:** Automatically rank resumes based on job fit using semantic similarity algorithms.

* **AI Interview Feedback:** Integrate a speech-to-text module to transcribe mock interviews and provide feedback.

* **Job Market Insights Dashboard:** Visualize in-demand skills, trending job titles, and location-based job opportunities using aggregated platform data.

* **Video Interview Scheduling:** Integrate real-time video interviews with calendar sync and reminders.

* **Enhanced Search Algorithms:** Implement semantic search (using embeddings) to improve job and candidate search accuracy.

* **Docker Support:** Containerize the project for easier deployment across environments.

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repository and submit a pull request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

* [spaCy](https://spacy.io/)
* [Mantine UI](https://mantine.dev/)
* [Sequelize ORM](https://sequelize.org/)

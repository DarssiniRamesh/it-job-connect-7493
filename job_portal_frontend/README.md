# IT Job Portal Frontend

A modern, minimal React single-page application for an IT-focused job portal. It connects to the FastAPI backend for user registration/login, job browsing, posting, application management, and personalized dashboards for both job seekers and employers.

## Features

- **Registration/Login** (job seeker, employer; with role selection)
- **Job search & filtering** by title and location
- **Detailed job views** with "Apply" for seekers
- **Employer dashboard** for posting jobs and managing applicants
- **Applicant dashboard** for seekers to track their applications
- **Profile management** (update bio, skills, company)
- **JWT-based secure backend interaction**
- **Role-based routes (protected pages for logged-in users)**
- **Responsive, modern UI using only React and vanilla CSS**

## Setup Instructions

1. **Install Node.js** (version 16+)
2. **Clone the repository**
   ```sh
   git clone <repo_url>
   cd it-job-connect-7493/job_portal_frontend
   ```

3. **Install dependencies**
   ```sh
   npm install
   ```

4. **Configure backend API URL**

   By default, the frontend expects the backend to run on `http://localhost:8000`.  
   To use a different URL, set the env variable in a `.env` file at the project root:

   ```
   REACT_APP_API_URL=http://localhost:8000
   ```

## How to Run Locally

- **Development server:**
  ```sh
  npm start
  ```
  Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Tests:**
  ```sh
  npm test
  ```

- **Production build:**
  ```sh
  npm run build
  ```

## Main Pages & Routing

- `/` - Home page (welcome/overview)
- `/jobs` - Browse/search IT jobs
- `/jobs/:id` - Job details (+ apply if seeker)
- `/login` - Login page (with email/password)
- `/register` - Register as job seeker or employer
- `/dashboard/seeker` - Seeker dashboard (applied jobs)
- `/dashboard/employer` - Employer dashboard (job postings & applicants)
- `/profile` - User profile (view & edit)
- (Role-protected via `PrivateRoute`)

## API Integration

- All data and authentication are via REST API calls to the FastAPI backend.
- The file `src/api.js` manages HTTP requests, JWT storage/attach, and error handling.
- Endpoints used:
    - `/auth/register`, `/auth/login`
    - `/profile` (get/update)
    - `/jobs` (search/list, create, update, delete)
    - `/applications` (create, list, update status)
- JWT tokens are stored in localStorage and auto-attached to API requests.

## Integration with Backend

- Works with the [IT Job Portal Backend](../../it-job-connect-7494/job_portal_backend/README.md)
- Expects both containers to be running:
    - Frontend: `npm start` (port 3000)
    - Backend: `uvicorn src.api.main:app --reload --port 8000`
- Make sure `REACT_APP_API_URL` points to the backend base URL.

## Customization

- Edit styles in `src/App.css` (uses CSS variables for themes/colors)
- To change branding, edit logo and color variables.

## License

MIT (or as provided by this repository)

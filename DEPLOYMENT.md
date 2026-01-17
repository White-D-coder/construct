# StudySphere Deployment Guide

This guide explains how to deploy the StudySphere application. Because the project consists of a separate frontend and backend, they must be deployed as two distinct services.

## 1. Backend Deployment (Render)

The backend is a Node.js/Express application. We recommend using **Render** because the project already includes a `render.yaml` configuration.

### Steps:
1.  **Push to GitHub**: Ensure your latest code (including the `backend` folder) is pushed to your GitHub repository.
2.  **Create Render Account**: Go to [render.com](https://render.com) and sign up/login.
3.  **Connect GitHub**: Connect your GitHub account to Render.
4.  **Create Web Service**:
    *   Click "New +" and select "Web Service".
    *   Select your `construct` repository.
    *   **Root Directory**: `backend` (Important!)
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
    *   **Environment Variables**: Add the following keys (you can copy values from your local `.env`):
        *   `SUPABASE_URL`
        *   `SUPABASE_KEY`
        *   `GEMINI_API_KEY`
        *   `JWT_SECRET`
5.  **Deploy**: Click "Create Web Service". Render will build and deploy your backend.
6.  **Get URL**: Once deployed, copy the service URL (e.g., `https://studysphere-backend.onrender.com`).

## 2. Frontend Deployment (Vercel)

The frontend is a React application built with Vite.

### Steps:
1.  **Create Vercel Account**: Go to [vercel.com](https://vercel.com) and sign up/login.
2.  **Import Project**:
    *   Click "Add New..." -> "Project".
    *   Import your `construct` repository.
3.  **Configure Project**:
    *   **Framework Preset**: Vite
    *   **Root Directory**: `frontend` (Important: Click "Edit" next to Root Directory and select `frontend`).
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
4.  **Environment Variables**:
    *   Add `VITE_API_URL` and set its value to: `https://studysphere-backend-in85.onrender.com/api`
    *   **Important**: You MUST include `/api` at the end because your `axios.js` file uses this variable directly as the Base URL.
5.  **Deploy**: Click "Deploy".

## Troubleshooting

-   **CORS Issues**: If the frontend cannot talk to the backend, check the `cors` configuration in `backend/server.js`. Ensure it allows the domain of your deployed frontend.
-   **Environment Variables**: Double-check that all required `.env` variables are set in the deployment dashboard (Render/Vercel). They are **not** read from your local `.env` file in production.

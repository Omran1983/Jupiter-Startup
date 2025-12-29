# 🪐 Jupiter Startup (TITAN-BIZ)

This is a monorepo containing the **AION Sovereign Fund** ventures.

## 📂 Structure
- `apps/customs_tracker`: The Customs Tracker MVP (Next.js 15).
- `packages/core`: Shared logic, types, and database schemas.

## 🚀 Deployment Instructions (Vercel)

> [!IMPORTANT]
> **You MUST configure the Root Directory.**
> Since this is a monorepo, Vercel needs to know which folder to build.

1.  **Import Project:** Select this repository.
2.  **Configure Project:**
    *   **Root Directory:** Click "Edit" and select `apps/customs_tracker`.
    *   **Framework Preset:** Ensure "Next.js" is selected.
3.  **Environment Variables:**
    *   `NEXT_PUBLIC_SUPABASE_URL`: [Your Supabase URL]
    *   `SUPABASE_SERVICE_ROLE_KEY`: [Your Service Role Key]
4.  **Deploy:** Click "Deploy".

## 🛠️ Local Development

1.  **Install Dependencies:**
    ```bash
    cd apps/customs_tracker
    npm install --legacy-peer-deps
    ```

2.  **Run Dev Server:**
    ```bash
    npm run dev
    ```

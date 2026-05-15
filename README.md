# Material Hub IITM

A clean, modern, fast personal study-material management platform for the
**IITM BS Data Science** program. Works like a custom Google Drive frontend
— course-organized folders, embedded previews, fuzzy search, favorites and
recents — all powered by a single editable JSON file.

> **Organize IITM BS Data Science study resources beautifully.**

---

## Features

- Beautiful dark-mode UI with glassmorphism, gradients and Framer Motion animations
- Course-based organization (12 IITM courses pre-seeded)
- Folder system inside each course (Notes / Assignments / PYQs / YouTube / PDFs / …)
- Material cards for PDFs, Google Drive links, YouTube videos and websites
- Embedded preview for Drive, YouTube and PDF (in-app iframe)
- Global fuzzy search across courses, folders and materials (`⌘K` / `Ctrl+K`)
- Favorites with localStorage persistence
- Recently opened (last 20, stored locally)
- Collapsible sidebar (Home / Courses / Favorites / Recent / About)
- Skeleton loading states, toast notifications, smooth page transitions
- Fully responsive — mobile, tablet, desktop
- 100% static — deployable on Vercel free tier with **zero config**

## Screenshots

> _Add your own screenshots here once deployed:_

- `docs/screenshot-home.png`
- `docs/screenshot-course.png`
- `docs/screenshot-search.png`

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** + `tailwindcss-animate`
- **Framer Motion** for animations
- **Lucide React** for icons
- **Sonner** for toast notifications
- **shadcn/ui**-style minimal components (Card, Button, Input, Dialog, Skeleton)
- **Local JSON** for data (no database)

## Project Structure

```
.
├── app/                    # Next.js App Router pages
│   ├── about/
│   ├── courses/
│   │   └── [id]/           # Course detail page
│   ├── favorites/
│   ├── recent/
│   ├── layout.tsx
│   ├── page.tsx            # Landing page
│   └── globals.css
├── components/             # React components
│   ├── ui/                 # Reusable primitives
│   └── ...
├── data/
│   └── courses.json        # ← Edit this to manage content
├── lib/                    # Utilities, types, helpers
└── public/
```

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev

# Open http://localhost:3000
```

### Other scripts

```bash
npm run build       # Production build
npm run start       # Run production build
npm run lint        # Lint with next/core-web-vitals
```

> **Note:** You need Node.js 18.17+ installed. If `node`/`npm` aren't
> available, install Node from <https://nodejs.org> first.

## Editing course data

All content lives in [`data/courses.json`](data/courses.json). Add a course
by appending an entry to the `courses` array:

```json
{
  "id": "mlf",
  "name": "Machine Learning Foundations",
  "code": "MLF",
  "icon": "Brain",
  "accent": "from-pink-500 to-rose-500",
  "description": "Short description used on the card.",
  "folders": [
    {
      "name": "Week 1",
      "materials": [
        {
          "title": "Lecture Notes",
          "description": "Optional one-liner",
          "type": "drive",
          "url": "https://drive.google.com/file/d/XXX/view"
        }
      ]
    }
  ]
}
```

### Field reference

| Field         | Type     | Notes                                                  |
| ------------- | -------- | ------------------------------------------------------ |
| `id`          | string   | URL slug — must be unique                              |
| `name`        | string   | Display name                                           |
| `code`        | string   | Short code shown as a chip (e.g. `MLF`)                |
| `icon`        | string   | Lucide icon name (see `lib/icons.tsx`)                 |
| `accent`      | string   | Tailwind gradient classes, e.g. `from-pink-500 to-rose-500` |
| `description` | string   | Short description                                      |
| `folders[]`   | array    | Folders inside the course                              |
| `material.type` | enum   | `pdf` \| `drive` \| `video` \| `website`               |
| `material.url`  | string | Direct link — Drive/YouTube/PDF links are auto-embedded |

Supported `icon` values: `Sigma`, `BarChart3`, `Cpu`, `Code2`, `Database`,
`Brain`, `Briefcase`, `Coffee`, `Terminal`, `BookOpen`, `Layout`, `Layers`,
`FileText`, `Folder`. To add more, edit [`lib/icons.tsx`](lib/icons.tsx).

No frontend changes are needed when adding/editing data.

## Deploy on Vercel

1. Push this repo to GitHub.
2. Go to <https://vercel.com/new>.
3. Click **Import** on this repository.
4. Leave all defaults — framework auto-detected as Next.js.
5. Click **Deploy** and wait ~1 minute.

**No environment variables, no database, no backend** — everything works on
the Vercel free tier.

After deployment, every time you `git push` to `main`, Vercel automatically
rebuilds the site with your new course data.

## License

MIT — do whatever you'd like with it.

## Fortune Telling Website

This project is a fortune-telling web app built with a **React frontend**, **Python (FastAPI) backend**, **PostgreSQL**, and **AWS OCR**.

It is designed to support multiple traditions:

- **Western astrology**: quick zodiac/Sun sign lookup.
- **Chinese Bazi / Ziwei**: placeholder module ready for full charting logic later.
- **Tarot**: one-card Tarot draw.
- **Palmistry & Face Reading**: image upload endpoints using AWS OCR to extract text, ready for your own rules.
- **Numerology**: Life Path number calculator.
- **I Ching (Book of Changes)**: simple random hexagram prototype.

### 1. Run the backend (Python + FastAPI + PostgreSQL)

1. Create and activate a virtualenv (optional):

   ```bash
   cd /Users/zhangxiaoyu/GitHub/fortune-telling
   cd backend
   pip install -r requirements.txt
   ```

2. Make sure PostgreSQL is installed and create a database, for example:

   ```bash
   createdb fortune_telling
   ```

3. Configure environment variables (via `.env` or your shell):

   ```bash
   export DATABASE_URL="postgresql+psycopg2://postgres:postgres@localhost:5432/fortune_telling"
   export AWS_ACCESS_KEY_ID="YOUR_AWS_ACCESS_KEY_ID"
   export AWS_SECRET_ACCESS_KEY="YOUR_AWS_SECRET_ACCESS_KEY"
   export AWS_REGION="ap-east-1"  # or any region you prefer
   ```

4. Start the FastAPI server:

   ```bash
   uvicorn backend.main:app --reload
   ```

   Default base URL: `http://127.0.0.1:8000`, health endpoint: `/health`.

### 2. Run the frontend (React)

The current frontend uses React UMD + Babel CDN so you can open it directly without a build step.

1. Open:

   - `frontend/index.html`

   Open it in your browser (double-click or use “Open with Live Server” in your editor).

2. Features on the page:

   - Astrology / numerology / Tarot / I Ching: computed in the browser and displayed immediately.
   - Palmistry / face reading: send `POST /ocr/palm` and `POST /ocr/face` with an image; the backend uses AWS Textract OCR.

### 3. Possible next steps

- Implement full **Bazi / Ziwei** chart calculation and interpretation on the backend with clean APIs.
- Move frontend-only logic (astrology, numerology, Tarot, I Ching) into backend endpoints and store every result in the `readings` table.
- Use AWS Rekognition or your own models to map OCR + image information into real palm/face-reading rules.
- Migrate the simple React setup to Vite / Next.js for a more production-ready frontend stack if needed.


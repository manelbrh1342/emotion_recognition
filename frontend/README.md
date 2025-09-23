

# Frontend: Emotion Recognition Web App

This folder contains the source code for the React-based frontend of the Emotion Recognition project. It provides an interactive user interface for recording or uploading audio and visualizing emotion predictions.

## Usage

1. **Install dependencies:**
	```bash
	npm install
	# or
	yarn install
	```

2. **Start the development server:**
	```bash
	npm run dev
	# or
	yarn dev
	```
	The app will be available at [http://localhost:5173](http://localhost:5173).

3. **Build for production:**
	```bash
	npm run build
	# or
	yarn build
	```

## Folder Structure

- `src/` — Main source code
  - `components/` — React UI components
  - `api.js` — API integration for backend requests
  - `index.css` — Global and Tailwind CSS styles
- `public/` — Static assets (logos)
- `index.html` — Main HTML template

## Notes

- The frontend communicates with the backend API for emotion prediction.
- Audio is processed in-browser and sent to the backend for analysis.
- For backend/API details, see the main project README.



# Build the React app and serve it with Vite preview.
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# API base URL can be overridden at build time.
ARG VITE_API_BASE_URL=http://localhost:8000/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

EXPOSE 5173

# Serve the production build, listening on all interfaces.
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]

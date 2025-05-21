FROM node:20.9.0 as builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine 
COPY --from=builder /app/dist /usr/share/nginx/html
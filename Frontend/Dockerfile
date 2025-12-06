# Use a lightweight Nginx image
FROM nginx:alpine

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration to proxy API requests to the backend container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy your frontend code to the Nginx public directory
COPY . /usr/share/nginx/html

# Nginx runs on port 80 by default
EXPOSE 80

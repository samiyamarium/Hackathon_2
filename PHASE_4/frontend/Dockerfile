# Use an official Nginx image as a parent image
FROM nginx:alpine

# Copy the frontend static files into the Nginx default public directory
COPY . /usr/share/nginx/html

# Expose port 80

EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

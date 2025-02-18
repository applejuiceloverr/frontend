# Use an official Nginx runtime as a parent image
FROM nginx:alpine

# Copy the frontend files into the container
COPY . /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

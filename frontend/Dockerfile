# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files into the container at /app
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the frontend application code into the container at /app
COPY . .

# Expose the port that the React development server will run on (usually 3000)
EXPOSE 3000

# Command to run the React development server
CMD ["npm", "start"]

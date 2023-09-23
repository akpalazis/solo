# Use the official Python image as the base image
FROM python:3.8

# Set the working directory inside the container
WORKDIR /backend

# Copy the requirements file into the container
COPY ./requirements.txt .

# Install Python dependencies
RUN pip install -r requirements.txt

# Copy the Flask application code into the container
COPY . ./backend
COPY app.py .

# Expose the port that Flask will run on
EXPOSE 5000

# Command to run the Flask application
CMD ["python", "app.py"]

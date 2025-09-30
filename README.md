# RaikoMusics: Self-Hosted Music Streaming Platform

RaikoMusics is a comprehensive, self-hosted music streaming service designed for users who wish to maintain control over their personal music library. The platform provides a seamless and user-friendly experience for managing and streaming music across various devices, including a web interface and a dedicated desktop application. The entire ecosystem is containerized with Docker, ensuring portability and ease of deployment.

## Key Features

  * **Centralized Music Library**: Host your entire music collection on your own server.
  * **Web and Desktop Clients**: Access your music through a feature-rich web player or a native desktop application built with Electron.
  * **Intuitive Music Management**: A dedicated management interface for uploading, editing metadata, and organizing your music library.
  * **Dockerized Environment**: The application suite is fully containerized, simplifying setup, deployment, and scalability.
  * **Automated CI/CD**: A pre-configured GitHub Actions workflow automates the building and deployment of Docker images.

## Architecture Overview

RaikoMusics is built on a microservices architecture, which separates the core functionalities into independent, containerized services:

  * **`RaikoMusicsAPI`**: A Node.js and Express-based RESTful API that serves as the backbone of the application, handling all business logic and data management.
  * **`AudioStreamServer`**: A lightweight, high-performance server, optimized for efficient and reliable streaming of audio files.
  * **`raikoMusicsWeb`**: A static web server that delivers the frontend client for the music player and management dashboard.
  * **`raikomusics`**: The Electron-based desktop application that provides a native user experience.

These services are orchestrated using `docker-compose`, which manages the networking and lifecycle of the containers.

## Technology Stack

  * **Backend**: Node.js, Express, Nginx
  * **Frontend**: HTML5, CSS3, JavaScript
  * **Desktop App**: Electron
  * **Containerization**: Docker, Docker Compose
  * **CI/CD**: GitHub Actions

## Getting Started

To set up the RaikoMusics platform in a local environment, please ensure you have Docker and Docker Compose installed.

### Prerequisites

  * [Docker](https://docs.docker.com/get-docker/)
  * [Docker Compose](https://docs.docker.com/compose/install/)

### Installation and Execution

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/raikomusics/raikomusics.git
    cd raikomusics
    ```

2.  **Build and launch the services:**

    ```bash
    docker-compose up --build -d
    ```

    This command will build the Docker images for each service and start the containers in detached mode.

## Usage

Upon successful launch, the services will be accessible at the following endpoints:

  * **Web Application**: `http://localhost:8080`
  * **Management Interface**: `http://localhost:8080/manage.html`
  * **API Endpoint**: `http://localhost:3000`

You will have to change things inside of the  "./index.html", "./raikomusics/src/index.html" to make it fully works
Replace everything in the project which contains "https://35.79.6.219" with your local ip
## Deployment

The project includes a `deploy.sh` script to facilitate deployment to a production environment. This script, in conjunction with the GitHub Actions workflow, automates the process of pulling the latest Docker images and restarting the services.

## Contributing

We welcome contributions to the RaikoMusics project. If you wish to contribute, please adhere to the following guidelines:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix (`git checkout -b feature/your-feature-name`).
3.  Commit your changes with clear and descriptive messages (`git commit -m 'feat: Add new feature'`).
4.  Push your changes to your forked repository (`git push origin feature/your-feature-name`).
5.  Open a pull request to the `main` branch of the original repository.

## License

This project is licensed under the MIT License. See the [LICENSE](https://www.google.com/search?q=LICENSE) file for more details.
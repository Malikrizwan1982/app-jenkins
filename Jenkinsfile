pipeline {
    agent any

    // Define the deployment location on the EC2 server
    environment {
        DEPLOY_PATH = '/var/lib/jenkins/workspace/MyApp-Deployment'
    }

    stages {
        stage('Cleanup & Checkout') {
            steps {
                echo 'Cleaning up previous deployment directory...'
                // Clear the workspace and clone the code (Jenkins handles the clone)
                sh "rm -rf ${DEPLOY_PATH}/* || true" 
                
                // Copy the entire checked-out workspace content to the persistent deployment path
                sh "cp -R . ${DEPLOY_PATH}/"
            }
        }

        stage('Build & Deploy with Docker Compose') {
            steps {
                script {
                    echo 'Building and starting containers...'
                    // Change directory to the copied project root
                    sh "cd ${DEPLOY_PATH}"
                    
                    // Stop and remove old containers, then build and start new ones
                    sh """
                    /usr/local/bin/docker-compose -f docker-compose.yml down || true
                    /usr/local/bin/docker-compose -f docker-compose.yml up -d --build
                    """
                    
                    echo 'Deployment successful! App is running.'
                }
            }
        }
        
        stage('Verification') {
            steps {
                // Simple health check on the frontend container
                sh "docker ps | grep frontend"
                echo "Verification step complete. Check your EC2 IP."
            }
        }
    }
}

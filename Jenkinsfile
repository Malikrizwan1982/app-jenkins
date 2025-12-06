pipeline {
    agent any

    environment {
        // Define the path where the app will be deployed on the EC2 server
        // This is within the Jenkins user's home/workspace
        DEPLOY_PATH = '/var/lib/jenkins/workspace/MyApp-Deployment' 
    }

    stages {
        stage('Cleanup & Checkout') {
            steps {
                echo "Starting pipeline..."
                // Create the deployment directory if it doesn't exist
                sh "mkdir -p ${DEPLOY_PATH} || true"
                
                // Clear the contents of the deployment folder for a clean build
                sh "rm -rf ${DEPLOY_PATH}/* || true" 
                
                // Use rsync to copy all files from the current workspace, EXCLUDING the complex .git directory
                // NOTE: This assumes 'rsync' is installed on your EC2 instance (it usually is on Ubuntu)
                sh "sudo rsync -av --exclude='.git' . ${DEPLOY_PATH}/"
                echo "Code copied successfully to ${DEPLOY_PATH}"
            }
        }

        stage('Build & Deploy with Docker Compose') {
            steps {
                script {
                    echo 'Changing directory and executing Docker Compose...'
                    // Change directory to the copied project root
                    sh "cd ${DEPLOY_PATH}"
                    
                    // Stop and remove old containers, then build and start new ones
                    sh """
                    /usr/local/bin/docker-compose -f docker-compose.yml down --remove-orphans || true
                    /usr/local/bin/docker-compose -f docker-compose.yml up -d --build --force-recreate
                    """
                    
                    echo 'Deployment complete! Check your EC2 IP.'
                }
            }
        }
        
        stage('Verification') {
            steps {
                echo 'Verifying container status...'
                // Check if all necessary containers are running
                sh "/usr/local/bin/docker-compose -f ${DEPLOY_PATH}/docker-compose.yml ps"
                echo "Verification step complete."
            }
        }
    }
    
    post {
        always {
            echo "Pipeline finished."
        }
        failure {
            echo "Pipeline failed! Check console output for details."
        }
    }
}

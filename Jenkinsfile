pipeline {
    agent any

    // Define the deployment location on the EC2 server
    environment {
        DEPLOY_PATH = '/var/lib/jenkins/workspace/MyApp-Deployment'
    }

    stage('Cleanup & Checkout') {
    steps {
        echo 'Cleaning up previous deployment directory...'
        sh "rm -rf ${DEPLOY_PATH}/* || true" 
        
        // Copy only visible files (e.g., Frontend, Backend, docker-compose.yml, Jenkinsfile)
        sh "cp -R --no-preserve=mode,ownership * ${DEPLOY_PATH}/"
        echo "Code copied successfully to ${DEPLOY_PATH}"
    }
}
	stage('Build & Deploy with Docker Compose') {
            steps {
                 script {
            		echo 'Cleaning up and rebuilding containers...'
            		// Change directory to the copied project root
            		sh "cd ${DEPLOY_PATH}"

            		// Use a single command to down, remove, and build new containers
            		// NOTE: We rely on the PATH environment variable now, which is safer.
            		sh """
            		/usr/local/bin/docker-compose -f docker-compose.yml down --remove-orphans || true
            		/usr/local/bin/docker-compose -f docker-compose.yml up -d --build --force-recreate
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


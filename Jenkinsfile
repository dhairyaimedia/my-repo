def remote = [:]
remote.name = 'im0277'
remote.host = '172.16.1.88'
remote.user = 'im0277'
remote.password = 'iMedia@009'
remote.allowAnyHosts = true

pipeline {
    // agent any
    agent {
        kubernetes {
            label 'my-kubernetes-agent'
        }
    }
    tools {
        nodejs "my-nodejs"
        dockerTool 'my-docker'
    }

    environment {
        NEXTJS_DOCKER_IMAGE = "dhairyadockerhub/ad-next"
        NEXTJS_LATEST_VERSION = sh(script: "curl -s \"https://registry.hub.docker.com/v2/repositories/dhairyadockerhub/ad-next/tags/\" | jq -r '.results | map(.name) | sort | reverse | .[0]'", returnStdout: true).trim()
        NEXTJS_NEXT_VERSION = "${NEXTJS_LATEST_VERSION.toInteger() + 1}"
        NEXTJS_DOCKER_TAG = "${NEXTJS_DOCKER_IMAGE}:${NEXTJS_NEXT_VERSION}"

        NODEJS_DOCKER_IMAGE = "dhairyadockerhub/ad-node"
        NODEJS_LATEST_VERSION = sh(script: "curl -s \"https://registry.hub.docker.com/v2/repositories/dhairyadockerhub/ad-node/tags/\" | jq -r '.results | map(.name) | sort | reverse | .[0]'", returnStdout: true).trim()
        NODEJS_NEXT_VERSION = "${NODEJS_LATEST_VERSION.toInteger() + 1}"
        NODEJS_DOCKER_TAG = "${NODEJS_DOCKER_IMAGE}:${NODEJS_NEXT_VERSION}"

        MONGODB_DOCKER_IMAGE = "dhairyadockerhub/ad-mongo"
        MONGODB_LATEST_VERSION = sh(script: "curl -s \"https://registry.hub.docker.com/v2/repositories/dhairyadockerhub/ad-mongo/tags/\" | jq -r '.results | map(.name) | sort | reverse | .[0]'", returnStdout: true).trim()
        MONGODB_NEXT_VERSION = "${MONGODB_LATEST_VERSION.toInteger() + 1}"
        MONGODB_DOCKER_TAG = "${MONGODB_DOCKER_IMAGE}:${MONGODB_NEXT_VERSION}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out code from SCM...."
                checkout scm
            }
        }
        
        // stage('Test') {
        //     steps {                       
        //         script {
        //             echo 'Running SSH...'
        //             sshCommand(remote: remote, command: "ls -l")
        //         }
        //     }
        // }
        // stage('Build') {
        //     steps {
        //         script {
        //             echo 'Building the project...'
        //             sh 'npm install'
        //             sh 'npm run build'
        //         }
        //     }
        // }
        
        stage('Dockerize') {
            steps {
                echo 'Building Next image...'
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-credentials') {
                        def customImage = docker.build(NEXTJS_DOCKER_TAG,'./next-advance/')
                        customImage.push()
                    }
                }
                echo 'Building Node image...'
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-credentials') {
                        def customImage = docker.build(NODEJS_DOCKER_TAG,'./node-advance/')
                        customImage.push()
                    }
                }
                echo 'Building Mongo image...'
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-credentials') {
                        def customImage = docker.build(MONGODB_DOCKER_TAG,'./mongodb/')
                        customImage.push()
                    }
                }
                    
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                echo 'Deploying Nextjs'
                sh 'kubectl apply -f ad-next-kub.yml'
                echo 'Deploying Nextjs'
                sh 'kubectl apply -f ad-node-kub.yml'
                echo 'Deploying Nextjs'
                sh 'kubectl apply -f ad-mongo-kub.yml'
                // sshCommand remote: remote, command: "echo 'very well done'"
                // sshCommand remote: remote, command: "docker rm next-app -f | true"
                // sshCommand remote: remote, command: "docker rmi -f ${DOCKER_IMAGE}:${LATEST_VERSION} | true"
                // sshCommand remote: remote, command: "docker pull ${DOCKER_TAG}"
                // sshCommand remote: remote, command: "docker run -d -p 4000:3000 --name next-app ${DOCKER_TAG}"
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline executed successfully!'
            // Add any other success actions here
        }
        failure {
            echo 'Pipeline execution failed!'
            // Add any other failure actions here
        }
    }
}

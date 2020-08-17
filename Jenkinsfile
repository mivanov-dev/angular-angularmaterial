pipeline {
    agent any
    environment {
        // MONGODB
        MONGODB_URI='MONGODB_URI'
        // CLOUDINARY
        CLOUDINARY_SERVER='CLOUDINARY_SERVER'
        CLOUDINARY_UPLOAD_IMAGE_URL='CLOUDINARY_UPLOAD_IMAGE_URL'
        CLOUDINARY_CLOUDNAME='CLOUDINARY_CLOUDNAME'
        CLOUDINARY_PRESETS='CLOUDINARY_PRESETS'
        // SMTP
        SMTP_HOST='SMTP_HOST'
        SMTP_AUTH_USER='SMTP_AUTH_USER'
        SMTP_AUTH_PASS='SMTP_AUTH_PASS'
        // SEO
        // SEO_HOST='SEO_HOST'
        // SEO_PORT='SEO_PORT'
        // SEO_PROTOCOL='SEO_PROTOCOL'
    }
    options {
        ansiColor('xterm')
    }
    tools { nodejs "node" }
    stages {
        stage('Install') {
            steps {
                git branch: 'master', url: 'https://github.com/mivanov-dev/angular-angularmaterial.git'
                bat 'npm install'
            }
            post {
                success {
                    echo "✔ Install:success"
                }
                failure {
                    echo "✖ Install:failure"
                }
            }
        }
        stage('Tests') {
            parallel {
                stage('Test Headless') {
                    steps {
                        bat 'npm run test-headless'
                    }
                    post{
                        success{
                            echo "✔ Tests:Test Headless:success"
                        }
                        failure{
                            echo "✖ Tests:Test Headless:failure"
                        }
                    }
                }
                stage('E2E Headless') {
                    steps {
                        bat 'npm run e2e-headless'
                    }
                    post{
                        success{
                            echo "✔ Tests:E2E Headless:success"
                        }
                        failure{
                            echo "✖ Tests:E2E Headless:failure"
                        }
                    }
                }
            }
        }
        stage('Build') {
            steps {
                bat 'npm run build:ssr'
            }
            post{
                success{
                    echo "✔ Build:success"
                }
                failure{
                    echo "✖ Build:failure"
                }
            }
        }
    }
    post {
        success {
            echo "✔ success"
        }
        failure {
            echo "✖ failure"
        }
    }
}
#!/bin/bash

# This script helps you push your code to your GitHub repository.
#
# HOW TO USE:
# 1. Open your terminal or command prompt.
# 2. Make the script executable by running this command once:
#    chmod +x push-to-github.sh
# 3. Run the script with a commit message, like this:
#    ./push-to-github.sh "Your commit message here"
#
# Make sure you have initialized your repository and added the remote origin first.
# If you haven't, run these commands in your terminal:
# git init
# git remote add origin https://github.com/IBRAHIMawdall/gratis.git

# Check if a commit message was provided
if [ -z "$1" ]; then
  echo "Error: Please provide a commit message."
  echo "Usage: ./push-to-github.sh \"Your message\""
  exit 1
fi

# 1. Add all new and modified files to the staging area
echo "Adding all files..."
git add .

# 2. Commit the changes with the message you provide
echo "Committing changes..."
git commit -m "$1"

# 3. Push the changes to the 'master' branch on GitHub
echo "Pushing to GitHub..."
git push origin master

echo "✅ Code pushed to GitHub successfully!"

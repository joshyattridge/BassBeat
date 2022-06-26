#!/bin/bash
cd /Users/joshuaattridge/WebDevelopment/BaseBeat/backEnd; zip -r ../backEnd.zip *
aws lambda update-function-code --function-name baseBeat --zip-file fileb:///Users/joshuaattridge/WebDevelopment/BaseBeat/backEnd.zip
osascript -e 'display notification "Data Is Uploaded" with title "Back End Uploaded"'
aws s3 cp /Users/joshuaattridge/WebDevelopment/BaseBeat/frontEnd  s3://basebeat --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers --recursive
rm /Users/joshuaattridge/WebDevelopment/BaseBeat/backEnd.zip
osascript -e 'display notification "Data Is Uploaded" with title "Front End Uploaded"'
cd ..
git add . 
dt=$(date '+%d/%m/%Y %H:%M:%S');
git commit -m "$dt"
git push origin master -f
osascript -e 'display notification "Data Is Uploaded" with title "uploaded to github"'
#/bin/bash
a=`stat -c %Y package.json`
b=$(cat update_time.text)
echo $a
echo $b
if [ "$a" -gt "$b" ]
then
  npm i
  echo a > update_time.text

fi

npm run build:test


for i in {1..50}
do 
  CI=true yarn test src/tests/integration/apiCalls/user.test.ts --silent
  
  if [ $? -ne "0" ]
  then
    echo "FAILED"
    exit $?
  fi

done

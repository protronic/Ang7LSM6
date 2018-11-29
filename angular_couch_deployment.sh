# USAGE: place this script in projekt directory
# add "to-couch": "angular_couch_deployment.sh -d dist -b http://prot-subuntu:5984 -z ./zert.cert -o TestDocument -a angularhost"
# to the scripts dict (customize commandline parameters).
# call it via "npm run to-couch"

function upload_file(){
  if [ "${certPath}" = "" ]
   then
     answer=$(curl -X PUT {$baseUrl}/{$database}/{$document}/{$filename}?rev={$rev} -H "Content-Type: text/$1" -d @$f)
   else
     answer=$(curl --cacert $certPath -X PUT {$baseUrl}/{$database}/{$document}/{$filename}?rev={$rev} -H "Content-Type: text/$1" -d @$f)
  fi
  return $answer
}

while getopts ':z:d:b:o:a:' OPTION ; do
  case "$OPTION" in
    z)   certPath=$OPTARG;; # ./certfile.cert
    d)   deployDir=$OPTARG;; # ./dist or dist or dist/protapp or c:/projekt/dist
    b)   baseUrl=$OPTARG;; # http://prot-subuntu:5984
    o)   document=$OPTARG;; # TestDocument
    a)   database=$OPTARG;; # angularhost
    *)   echo "unknwon argument"
  esac
done

if [ "${deployDir:(-1)}" = "/" ]
then
	realDeployDir=${deployDir%?}
else
	realDeployDir=$deployDir
fi

for f in $realDeployDir/*; do
  if [ "${certPath}" = "" ]
	then
    rev=$(curl {$baseUrl}/{$database}/{$document}?revs=true -I | grep ETag | cut -d\" -f2)
	else
		rev=$(curl --cacert $certPath {$baseUrl}/{$database}/{$document}?revs=true -I | grep etag | cut -d\" -f2)
	fi
	echo $f
	count=$(grep -o "/" <<<"$f" | wc -l)
	let count=$count+1
	filename=$(echo $f | cut -d/ -f$count)
  type=$(echo $filename | grep -o '...$')
  if [ "${type}" = "css" ]
  then
    answer=$(upload_file css)
  else
    answer=$(upload_file html)
  fi
	echo $answer
done
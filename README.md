# mpec-videotracking


```shell
docker run --name vidtracking-server \
-v "$(pwd)"/ssl:/app/ssl \
-v "$(pwd)"/src:/app/src \
-p 3000:3000 \
--network host \ 
-d vidtracking-server 
```
import redis
rd = redis.Redis(host='localhost', port=6379, db=0)\

rd.subscribe('')
### create users

```bash
curl -d '{ "name": "Randell Kovalsky", "mail": "rk@foo.b", "pass": "asd123"}' localhost:8080/users -v
curl -d '{ "name": "Wanita Humerick", "mail": "wh@foo.b", "pass": "asd123"}' localhost:8080/users -v
curl -d '{ "name": "Norman Tuner", "mail": "nt@foo.b", "pass": "asd123"}' localhost:8080/users -v
```
### create session

```bash
curl -d '{ "mail": "wh@foo.b", "pass": "asd123"}' localhost:8080/sessions -v
```

### users list

```bash
curl -H "x-session: <session_uid>" localhost:8080/users -v
```

### users filter

```bash
# starts with name 'Rand'
curl -H "x-session: <session_uid>" localhost:8080/users?filter=name,sw,Rand -v
```


### edit user
```bash
curl -X PUT -H "x-session: <session_uid>" -d '{ "name": "Joana Dark"}' localhost:8080/users?uid=<target_user_uid> -v
```

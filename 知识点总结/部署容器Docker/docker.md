### 获取镜像
```
 1.docker pull  [Name]:[tag]
                [仓库地址]
 2.docker pull hub.c.163.com/public/ubuntu:14.04   
 
 pull命令包含 以下选项
 -a，--all-tags=true|false：是否获取仓库中的所有镜像，默认为否。
```

### 查看镜像信息

```
 docker images 
```
### Tag命令添加镜像标签

```
docker tag ubuntu:latest [yourName]:[tag]
```

###  查看详细信息 
```
docker inspect [Name]:[tag]
```

### history查看镜像历史

```
docker history [Name]:[tag]
```

### 搜寻镜像
用法为docker search TERM，支持的参数主要包括：

·--automated=true|false：仅显示自动创建的镜像，默认为否；

·--no-trunc=true|false：输出信息不截断显示，默认为否；

·-s，--stars=X：指定仅显示评价为指定星级以上的镜像，默认为0，即输出所有镜像。

```
docker search --automated -s 3 nginx
```

### 删除镜像
 当有通过此镜像创建的容器存在时无法删除 该镜像 ，可使用 -f命令来强制删除
```
1.docker rmi [Name]:[tag]
2.docker rmi [镜像ID]
```
### 删除容器

```
docker rm [容器ID]
```

### 创建镜像
  #### 1.基于已有的镜像的容器创建
      该方法主要是使用docker commit命令。命令格式为docker commit[OPTIONS]CONTAINER[REPOSITORY[：TAG]]，主要选项包括：

  ·-a，--author=""：作者信息；

  ·-c，--change=[]：提交的时候执行Dockerfile指令，包括CMD|ENTRYPOINT|ENV|EXPOSE|LABEL|ONBUILD|USER|VOLUME|WORKDIR等；

  ·-m，--message=""：提交消息；

  ·-p，--pause=true：提交时暂停容器运行。
    ```
      docker commit -m "Added a new file" -a "Docker Newbee" a925cb40b3f0 test:0.1
    ```
   #### 2.基于本地模版倒入
        主要使用docker import命令。命令格式为docker import[OPTIONS]file|URL|-[REPOSITORY[:TAG]]。
     ```
      docker import - ubuntu:14.04
     ```
### 导出镜像

```
 docker save -o ubuntu_14.04.tar ubuntu:14.04
```
### 导入镜像

```
1.docker load --input ubuntu_14.04.tar
2.docker load < ubuntu_14.04.tar
```
### 上传镜像
第一次上传时，会提示输入登录信息或进行注册。
```
docker push NAME[:TAG] | [REGISTRY_HOST[:REGISTRY_PORT]/]NAME[:TAG]
```

### 创建容器
使用docker create命令新建的容器处于停止状态，可以使用docker start命令来启动它。
```
docker create -it ubuntu:latest
```








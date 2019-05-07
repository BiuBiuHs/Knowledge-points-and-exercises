

server {
    listen 80; //端口
    server_name 10.0.0.1; // ip地址 可以写域名
    root /html/dist/;  //项目根路径   vue项目打包后 将dist文件夹 一般放到  nginx的html目录下

    location / {
        proxy_read_timeout 600;
        try_files $uri $uri/ /index.html;   //能够解决 vue-router history模式的问题
        index index.html  //制定主页 
    }

    location ^~/crm {
        proxy_pass http://10.0.0.1:8080/crm;
        proxy_set_header Host $host:$server_port;
    }
}
//定义变量 cluster
upstream cluster {
         #simple round-robin

         server 192.168.0.1:8080;

         server 192.168.0.2:8080;

     }
     
    上面的location可以改为
    
    location ^~crm{
    
        proxy_pass http://upstream_test;
         proxy_set_header Host $host:$server_port;
    }

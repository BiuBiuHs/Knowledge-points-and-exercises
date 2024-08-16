#### 1. npm install -g commitizen  
#### 2. npm i cs-conventional-changelog -D  
#### 3. package.json  
  ```
    "config": {
    "commitizen": {
      "path": "./node_modules/cs-conventional-changelog"
    }
  }
  ```
#### 4.npm install -g conventional-changelog-cli。 
#### 5.再配一条 package.json文件中配置一条 script ： 
   ```
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0"
   ```

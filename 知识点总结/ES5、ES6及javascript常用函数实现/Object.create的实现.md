    
### es5 实现Object.create().
    ```
        function object (p) {
            function F {}
            F.prototype = 0 
            return new F()
        }
    ```
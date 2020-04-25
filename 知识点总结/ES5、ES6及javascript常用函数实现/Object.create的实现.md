    
### es5 实现Object.create().
    ```
        function object (p) {
            function F {}
            F.prototype = p
            return new F()
        }
    ```
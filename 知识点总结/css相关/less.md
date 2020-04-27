### 1.变量

 ```
 输入：
    @nice-blue：#5b83AD
    @light-blue：@nice-blue +#111；

    #header {
    color:@light-blue;
    }
输出：
    #header {
    color: #6c94be;
    }
 ```
！！！请注意，变量实际上是“常量”，因为他们只能定义一次。！！！
变量是延迟加载的，不必在使用之前声明。！！！

    .lazy-eval {
    width: @var;
    }

    @var: @a;
    @a: 9%;
#### 1.1 可变插值

##### 1.1.1 选择
    // Variables
    @my-selector: banner;

    // Usage
    .@{my-selector} {
    font-weight: bold;
    line-height: 40px;
    margin: 0 auto;
    }
    输出：
    .banner {
    font-weight: bold;
    line-height: 40px;
    margin: 0 auto;
    }
##### 1.1.2网址
    // Variables
    @images: "../img";

    // Usage
    body {
    color: #444;
    background: url("@{images}/white-sand.png");
    }
##### 1.1.3导入语句
    // Variables
    @themes: "../../src/themes";

    // Usage
    @import "@{themes}/tidal-wave.less";
##### 1.1.4属性
    @property: color;

    .widget {
    @{property}: #0ee;
    background-@{property}: #999;
    }
    输出：
    .widget {
    color: #0ee;
    background-color: #999;
    }
### 2.混入
Mixins是一种将一组属性从一个规则集包含（‘混入’）到另一个规则集的方法。

```
    .bordered {
        border-top:dotted 1px black;
        border-bottom :solid 2px black;
    }
    我们希望在其他规则集中使用这些属性。只需要输入属性的类的名称

    #menu a {
        color:#111;
        .bordered;
    }
    .post a {
        color:red;
        .bordered;
    }
```
.bordered 改类的属性将出现在#menu a 和 .post a 中

### 3.嵌套规则

Less能够使用给嵌套代替或与级联结合使用。

    #header {
        color:black;
    }
    #header .navigation {
        font-size:12px;
    }
    #header .logo{
        width:300px;
    }
    在less中，可以这样写
    #header{
        color:black;
        .navigation{
            font-size:12px;
        }
        .logo{
            width:300px;
        }
    }
### 4.嵌套指令和冒泡
诸如media或者keyframe可以与选择器相同的方式嵌套指令。
指令置于顶部，相对于同一 规则集内其他元素的相对顺序保持不变。这样叫做冒泡。

    输入：
    .screen-color {
        @media screen {
            color:green;
            @media (min-width:768px){
                color:red;
            }
        }
        @media tv {
            color:black;
        }
    }
    输出：
    @media screen {
        .screen-color{
            color:green;
        }
    }
    @media screen and (min-width :768px){
        .screen-color{
            color:red;
        }
    }
    @media tv{
        .screen-color {
            color:black;
        }
    }
其余非条件指令，例如font-face或keyframes，被冒泡了。他们的本质没有改变

    输入：
    #a {
    color: blue;
    @font-face {
            src: made-up-url;
        }
        padding: 2 2 2 2;
    }
    输出：
    #a {
        color: blue;
    }
    @font-face {
        src: made-up-url;
    }
    #a {
        padding: 2 2 2 2;
    }

### 5.操作
算术运算+，-，*，/可以在任意数量，颜色或可变的操作。如果可能，数学运算会考虑单位并在添加，减去或比较数字之前转换数字。结果最左边是明确说明的单位类型。如果转换不可能或没有意义，则忽略单位。不可能转换的示例：px到cm或rad到％

    // numbers are converted into the same units
    @conversion-1: 5cm + 10mm; // result is 6cm
    @conversion-2: 2 - 3cm - 5mm; // result is 1.5cm

    // conversion is impossible
    @incompatible-units: 2 + 5px - 3cm; // result is 4px

    // example with variables
    @base: 5%;
    @filler: @base * 2; // result is 10%
    @other: @base + @filler; // result is 15%
乘法和除法不转换数字。在大多数情况下它没有意义 - 长度乘以长度给出一个区域，而css不支持指定区域。Less将按原样对数字进行操作，并将明确说明的单位类型分配给结果。

    @base: 2cm * 3mm; // result is 6cm
 对颜色的操作总是产生有效的颜色。如果结果的某些颜色尺寸最终大于ff或小于00，则尺寸将四舍五入为ff或00。如果alpha最终大于1.0或小于0.0，则alpha将舍入为1.0或者0.0。

    @color: #224488 / 2; //results in #112244
    background-color: #112244 + #111; // result is #223355

### 6.逃离
转义允许您使用任意字符串作为属性或变量值。内部的任何内容~"anything"或~'anything'按原样使用，除了插值外没有任何变化。

    .weird-element {
    content: ~"^//* some horrible but needed css hack";
    }
    结果是：
    .weird-element {
    content: ^//* some horrible but needed css hack;
    }
### 7.功能
Less提供了各种功能，可以转换颜色，操纵字符串和进行数学运算。使用它们非常简单。以下示例使用百分比将0.5％转换为50％，将基色的饱和度增加5％，然后将背景颜色设置为减轻25％并旋转8度的颜色：

    @base: #f04615;
    @width: 0.5;

    .class {
    width: percentage(@width); // returns `50%`
    color: saturate(@base, 5%);
    background-color: spin(lighten(@base, 25%), 8);
    }
### 8.命名空间和访问器
（不要与CSS@namespace或命名空间选择器混淆）。
有时，您可能希望将mixin分组，用于组织目的，或者仅提供一些封装。你可以在Less中非常直观地做到这一点，比如想要将一些mixins和变量捆绑在一起#bundle，以便以后重用或分发：

    #bundle {
    .button {
        display: block;
        border: 1px solid black;
        background-color: grey;
        &:hover {
        background-color: white
        }
    }
    .tab { ... }
    .citation { ... }
    }
在#header a 中混入.button 

    #header a {
    color: orange;
    #bundle > .button;
    }    
### 9.范围
首先在本地查找变量和mixin，如果找不到它们，编译器将查找父作用域，依此类推。

    @var: red;

    #page {
    @var: white;
    #header {
        color: @var; // white
    }
    }
变量和mixin在使用之前不必声明，因此以下Less代码与前面的示例相同
   
    @var: red;

    #page {
    #header {
        color: @var; // white
    }
    @var: white;
    }

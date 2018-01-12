
# 基于JavaScript快速生成网格布局工具Grid.js


## 写在前面

这两天了解了一下css的grid布局，发现确实很好用。看了几篇博客，了解了它的几个常用属性后，可以快速生成一个网格布局。相较于传统的float、定位等显得更成体系，更规范，不需要一些hack做法。

虽然grid布局已经很好，前端工程师中有一些更多是喜欢通过动态创建div，使用js给div加样式这种方式来完成自己的工作的。

同样是出于使用JavaScript动态生成grid布局的需要，诞生了Grid.js这个小工具。

## Grid简介

Grid.js是一个使用JavaScript动态创建**规则网格布局、非规则网格布局**的模块。FE可以通过new Grird(option)创建一个Grid实例, 该实例的UI就呈现为css grid布局。

## 效果图

先来几张使用Grid.js生成的效果图吧。
以下四张效果图父容器的大小都是600*600像素。

第一张是一个4X4的网格，其中有3个网格是非原子大小（1X1）的，即2X2, 2X2, 2X1。
![](https://user-gold-cdn.xitu.io/2018/1/13/160eb7bfa86664ac?w=762&h=759&f=png&s=6115)

第二张是一个5X5的规则网格，所谓规则网格就是所有子元素都是1X1的大小。
![](https://user-gold-cdn.xitu.io/2018/1/13/160eb7c2c6d5ccfb?w=763&h=759&f=png&s=9973)

第三张是一个6X5的网格，其中有5个非原子大小的网格。
![](https://user-gold-cdn.xitu.io/2018/1/13/160eb7c3ffc85aab?w=761&h=761&f=png&s=8403)

第四张是一个7X7的网格，其中有4个非原子大小的网格。
![](https://user-gold-cdn.xitu.io/2018/1/13/160eb7c5bd1157fd?w=763&h=761&f=png&s=12126)

## Grid.js使用

Grid.js使用es6 class语法完成，所以使用方式很简单。
通过new Grid(option)即可生成一个网格实例。就以效果图第二张图生成的5X5网格来说，它的代码就是：

```
let grid = new Grid({
            container:document.getElementsByClassName('grid')[0],// 必须项
            colCount:5,
            rowCount:5,
            width:600,
            height:600,
        });
```

如果你想给每个网格设置不同的样式，就是用对外API方法**setGridStyleByIndex()**; 同样拿效果图5X5网格来说，那五个对角线上网格就做了背景的样式设置，它们是通过如下代码完成的：

```
grid.setGridStyleByIndex(0, {"background": "red"});
grid.setGridStyleByIndex(6, {"background": "green"});
grid.setGridStyleByIndex(12, {"background": "yellow"});
grid.setGridStyleByIndex(18, {"background": "blue"});
grid.setGridStyleByIndex(24, {"background": "orange"});
```

还有一个问题是怎么拿每个子元素（小格子）的引用？通过对外API方法 **getGrid(n)**。
还有一个问题是怎么拿所有子元素（小格子）的引用？通过对外API方法 **getGrids()**。
```
let grids = grid.getGrids();
for(let i = 0; i < grids.length; i++){
    grids[i].innerHTML = i + 1;
}
```
上面这段代码就是拿了所有小网格的引用，然后给网格填充文本内容的。示例中每个小格子的文本内容就是每个小格子在div列表中的索引+1。


## Grid.js API

考虑到最核心的需求有两点，一个是较为简单地（至少和直接使用css同样方便）生成网格布局，第二是生成网格布局后拿到每个格子的引用，给格子添加内容。所以主要说这两方面。

### 传参生成网格实例

怎么生成不同的、规则的、不规则的网格实例，主要看new Grid(option)的时候你传的参数，提供可传的参数包括以下。

|名称|类型|简介|
|--|--|--|
|container|htmlDomElement|父容器，必须项|
|rowCount|number|网格行数|
|colCount|number|网格列数|
|width|number、%|父容器宽度|
|height|number、%|父容器高度|
|divCount|number|实际格子的多少|
|gridArea|Array|那些非1X1格子的占位表示|

**关于divCount和gridArea数组的说明**：
这两个参数用来生成不规则网格布局，所以是本模块的关键。否则，你就只能用本模块生成n*m的规则网格了。

我们拿第一张效果图4X4网格举例，本来如果不是1、2、3那三个网格有跨行、跨列的行为，就不需要传divCount，也不用传gridArea，模块会为你生成4X4=16个一模一样的格子。但是由于这三个较大网格存在，所以，这个父容器是容不下16个子元素的，所以，你传的divCount是什么呢，**是在存在非1X1子网格的情况下，父容器正好填满时，子网格的数量，因此就是9.**。一般在你拿到设计图的时候，你就知道这个布局了，子网格数目很好算（因为实际场景也不需要创建好几十乘以好几十那么琐碎的格子）。

针对这三个非1X1的子网格，我们需要为其每一个传一个数组，来表示这个子网格是在父网格的第几行开始、第几列开始、跨几行、跨几列。即每个非1X1的子网格，都要传一个length为4的数组。然后把这些数组再放到一个外包数组里面，这个外包数组就是gridArea。

对于效果图1，gridArea = [[1,1,2,2],[2,3,2,2],[4,1,1,2]]。
整个4X4网格共有3个非1X1大小的子网格。
其中[1,1,2,2]就说明这个4X4的网格中有一个从第一行第一列开始，跨行跨列都为2的子网格。


### API接口

目前暴露的API

|名称|参数类型|简介|
|--|--|--|
|setGridStyleByIndex(n,style)|number,obj|设置小格子样式，第一个参数是小格子索引;style是对象，举例style={"color":"red"}|
|getGrids()|无|获取所有子网格div引用|
|getGrid(n)|number|获取某个子网格|


## 最后

这个模块可能还不完善，希望大家能提出意见，包括但不限于代码风格、API暴露、新功能加入等等。

欢迎关注，GitHub地址，

[请戳这里](https://github.com/cunzaizhuyi/gridLayout)

另附： [作者博客](https://cunzaizhuyi.github.io)


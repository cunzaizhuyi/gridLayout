/**
 * Created by mypc1 on 2018/1/11.
 */

class Grid{
    constructor(option){

        // 属性：几行、几列、容器宽、容器高
        // 网格宽高通过容器宽高/行列数获得。规则网格下，网格总数 = 几列 * 几行
        this.colCount = option.colCount || 3;
        this.rowCount = option.rowCount || 3;
        this.gridCount = this.colCount * this.rowCount;

        // 容器宽高
        this.width = option.width || 400;
        this.height = option.height || 400;

        this.document = window.document;
        
        // 初始化容器
        this.initContainer(option);
        
        // 初始化容器内部子元素，注意区分this.gridCount和this.divCount
        this.divCount = option.divCount;
        if(!this.divCount){
            this.generateGrid();
        }else{
            this.generateGridByCount(this.divCount);
        }
        
        // 设置this.grids数组。this.grids存放grid div的引用
        this.grids = [];
        this.setGrids();
        
        // 设置容器的一些默认的基础样式
        this._setContainerStyle();
        
        // 重要，排好每个网格的占位，从而css自动生成布局
        if(this.divCount){ //设置了divCount才能排占位，没有它意味着是n*m的规则网格
            this.gridArea = option.gridArea;
            this.setGridArea(this.gridArea);
        }
        
        this._setGridBorder();
    }

    initContainer(option){
        this.container = option.container;
        if(!this.container){
            console.log("initContainer: ", 'container不正确');
        }
    }
    
    /**
     * 在container内部生成this.gridCount个 网格div节点（DOM元素）
     */
    generateGrid(){
        
        if(!this.document){
            console.log("generateGrid：没能获取window.document");
            return;
        }
        
        let gridCount = this.gridCount;
        for(let i = 0 ; i< gridCount; i++){
            let div = this.document.createElement('div');
            this.container.appendChild(div);
        }
    }
    
    /**
     * 生成用户指定数量的网格节点（DOM元素）
     * @param n
     */
    generateGridByCount(n){
        if(!this.document){
            console.log("generateGridByCount：没能获取window.document");
            return;
        }
    
        for(let i = 0 ; i< n; i++){
            let div = this.document.createElement('div');
            this.container.appendChild(div);
        }
    }
    
    /**
     * 设置容器基础样式
     */
    _setContainerStyle(){
        this.container.style.width = this.width + "px";
        this.container.style.height = this.height + "px";
        this.container.style.border = '1px solid black';
        this.container.style.display = 'grid';
        this.container.style.gridTemplateColumns = this._generateFlStr(this.colCount);
        this.container.style.gridTemplateRows = this._generateFlStr(this.rowCount);

    }
    
    /**
     * 设置网格默认边框
     */
    _setGridBorder(){
        let items = this.getGrids();
        for(let i = 0 ; i< items.length; i++){
            items[i].style.border = '1px solid black';
        }
    }
    
    /**
     * 不推荐。根据行、列数及网格宽高生成gridTemplateColumns、gridTemplateRows样式的取值字符串
     * 字符串中宽高单位是px，而由于网格宽高是取整得来，导致有可能出现容器有右边距和下边距，
     * 所以，优先推荐使用_generateFlStr方法。
     * @param num
     * @param length
     * @returns {string}
     */
    _repeat(num, length){
        let str = '';
        for(let i = 0 ; i< num; i++){
            str += length +"px ";
        }
        return str;
    }
    
    /**
     * 推荐。根据行、列数及网格宽高生成gridTemplateColumns、gridTemplateRows样式的取值字符串
     * 字符串中宽高单位是fr
     * @param num
     * @returns {string}
     * @private
     */
    _generateFlStr(num){
        let str = '';
        for(let i = 0 ; i< num; i++){
            str += "1fr ";
        }
        return str;
    }
    
    /**
     * 给this.children填充网格节点
     */
    setGrids(){
        this.grids = this.container.children;
    }
    
    getGrids(){
        return this.grids;
    }
    
    getGrid(n){
        return this.grids[n];
    }
    
    /**
     * 给某个网格设置样式
     * @param n
     * @param style
     */
    setGridStyleByIndex(n, style){
        if(n < 0 || n > this.divCount){
            console.log("没有这个网格！");
            return;
        }
        let gridDiv = this.getGrid(n);
        for(let oneStyle in style){
            if(style.hasOwnProperty(oneStyle)){
                gridDiv.style[oneStyle] = style[oneStyle];
            }
        }
    }
    
    /**
     * 转化gridArea数组元素为css接收的格式
     * @param gridArea
     */
    convertGridArea(gridArea){
        for(let i = 0; i < gridArea.length; i++){
            gridArea[i][2] = gridArea[i][0] + gridArea[i][2];
            gridArea[i][3] = gridArea[i][1] + gridArea[i][3];
        }
    }
    
    /**
     * 给子元素（网格）设置占位区域gridArea
     * @param gridArea
     */
    setGridArea(gridArea){
        if(!gridArea){
            return;
        }
        this.convertGridArea(gridArea);
        for(let i = 0; i < gridArea.length; i++){
            this.getGrid(i).style.gridArea = `${gridArea[i][0]}/${gridArea[i][1]}/${gridArea[i][2]}/${gridArea[i][3]}`;
        }
    }
}
//-------- Config -----------//

var cfg = {
    dataFile : './data/data.json',
    column : ['id','manufacturer','model','price','acceleration','topSpeed']
}

//------- Globals ----------//

var fileReader = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
var data;
var columnDataType = {
    id : 'number',
    manufacturer : 'string',
    model : 'string',
    price : 'number',
    acceleration : 'number',
    topSpeed : 'number'
}
var dataFilter = {
    id : [],
    manufacturer : [],
    model : [],
    price : [],
    acceleration : [],
    topSpeed : []
}
var state = {
    data : '',
    page : 1,
    rows : 5,
    search: false,
    sort : {
        id : true,
        manufacturer : true,
        model : true,
        price : true,
        acceleration : true,
        topSpeed : true
    },
    filter : {
        id : true,
        manufacturer : true,
        model : true,
        price : true,
        acceleration : true,
        topSpeed : true
    }
}

//-------- Utils ------------//

function init() {
    loadFile(cfg.dataFile);

    document.getElementById('car-data-id').addEventListener('click', function(){sortCtrl('id')}, false);
    document.getElementById('car-data-manufacturer').addEventListener('click', function(){sortCtrl('manufacturer')}, false);
    document.getElementById('car-data-model').addEventListener('click', function(){sortCtrl('model')}, false);
    document.getElementById('car-data-price').addEventListener('click', function(){sortCtrl('price')}, false);
    document.getElementById('car-data-acceleration').addEventListener('click', function(){sortCtrl('acceleration')}, false);
    document.getElementById('car-data-topspeed').addEventListener('click', function(){sortCtrl('topSpeed')}, false);

    document.getElementById('car-data-search').addEventListener('click', function(){searchCtrl(document.getElementById('car-data-search-value').value)}, false);

    document.getElementById('car-data-filter-id').addEventListener('change', function(){
        filterCtrl(this.options[this.selectedIndex].value, 'id')}, false);
    document.getElementById('car-data-filter-manufacturer').addEventListener('change', function(){
        filterCtrl(this.options[this.selectedIndex].value,'manufacturer')}, false);
    document.getElementById('car-data-filter-model').addEventListener('change', function(){
        filterCtrl(this.options[this.selectedIndex].value,'model')}, false);
    document.getElementById('car-data-filter-price').addEventListener('change', function(){
        filterCtrl(this.options[this.selectedIndex].value,'price')}, false);
    document.getElementById('car-data-filter-acceleration').addEventListener('change', function(){
        filterCtrl(this.options[this.selectedIndex].value,'acceleration')}, false);
    document.getElementById('car-data-filter-topspeed').addEventListener('change', function(){
        filterCtrl(this.options[this.selectedIndex].value,'topSpeed')}, false);
}

function init2() {
    state.data = data;
    filterCreate();
    filterDomCreate();
    tableView(state.data);
}

function filterCreate() {
    for(var column in dataFilter) {
        var filterKeys = data.reduce(function(a,v){a[v[column]] = 1; return a},{});
        dataFilter[column] = Object.keys(filterKeys);
    }
}

function filterDomCreate() {
    var prefix = "car-data-filter-";

    for (var key in dataFilter) {
        console.log(prefix + key);
        var select = document.getElementById(prefix + key);
        for (var i=0; i < dataFilter[key].length; i++) {
            var opt = document.createElement('option');
            opt.value = key;
            opt.appendChild(document.createTextNode(dataFilter[key][i]));
            select.appendChild(opt);
        }
    }
}

function loadFile(addr) {
    fileReader.open('get', addr, true);
    fileReader.onreadystatechange = loadData;
    fileReader.send(null); 
}

function loadData() {
    if(fileReader.readyState==4) {
        data = JSON.parse(fileReader.responseText);        
        init2();
    }
}


//-------- Models -----------//

function sort(column) {
    var d = state.data.sort(function(a,b){ 
        var a = a[column];
        var b = b[column];
        if (columnDataType[column] === 'string') {
            a = a.toUpperCase();
            b = b.toUpperCase();
        } else {
            a = +a;
            b = +b;
        }

        if (a < b) {
            return (state.sort[column])? -1 : 1;
        } else if (a > b) {
            return (state.sort[column])? 1 : -1;
        } else {
            return 0;
        }
    });
    
    state.sort[column] = (state.sort[column])? false : true;
    state.data = d;
    return d;
}

function filter(search, column) {
    var d = [];
    state.filter[column] = search;

    for (var i=0; i<data.length; i++) {
        var tmpState = 1
        for(var col in state.filter) {
            if (data[i][col] != state.filter[col] && state.filter[col] !== true ) {
                tmpState *=0;
            }
        }
        if (tmpState) {
            d.push(data[i]);
        }
    }

    state.data = d;
    return d;
}

function paginate(page, rows) {
    state.page = +page;
    state.rows = +rows;
    var d = [];
    
    if (state.page * state.rows <= state.data.length) {
       d = state.data.slice((state.page-1) * state.rows, state.page * state.rows); 
    } else {
       d = state.data.slice((state.page-1) * state.rows); 
    }

    state.data = d;
    return d;
}

function search(search) {
    var d = [];
    state.search = search;
    var reg = new RegExp(search, 'i');

    for (var i=0; i<data.length; i++) {
        var tmpState = 0;
        for(var col in state.filter) {
            if (data[i][col].toString().match(reg) ) {
                tmpState +=1;
            }
        }
        if (tmpState) {
            d.push(data[i]);
        }
    }

    state.data = d;
    return d;
}

//---------- Views -----------//

function consoleView(json) { 
    console.table(json, ['id','manufacturer','model','price','acceleration','topSpeed']);
}

function tableView(json) {
    var tbody = document.getElementById('car-data-body');
    var rows = json.length;

    while(tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    
    for ( var i=0; i<rows; i++) {
        var trow = document.createElement('tr');
        tbody.appendChild(trow);
        for ( var j=0; j < cfg.column.length; j++) {
            var tcell = document.createElement('td');
            trow.appendChild(tcell);
            tcell.appendChild(document.createTextNode( json [i][cfg.column[j]]));
        }
    } 

}

//---------- Controllers -----------//

init();

function consCtrl(){
   consoleView(state.data); 
}

function tableCtrl() {
    tableView(state.data);
}

function sortCtrl(column) {
    sort(column);
    tableView(state.data);
}

function searchCtrl(str) {
    search(str);
    tableView(state.data);
}

function filterCtrl(str, column) {
    filter(str, column);
    tableView(state.data);
}

//(function(){

    //------------- Helpers -----------

    var createComponents = function(type, num) {
        var compArray = [];
        for (var i=0; i<num; i++) {
            compArray.push(document.createElement(type));
        }
        return compArray;
    }
    
    var getData = function (url, success) {
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        xhr.open('GET', url);
        xhr.onreadystatechange = function() {
            if (xhr.readyState>3 && xhr.status==200) success(xhr.responseText);
        };
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send();
        return xhr;
    }
    

    //------------- Datasorces --------
    
    var posterListUrl = './posterListUrl';

    var posterList = [];
    var posterCashe = {};
    var venueCashe = {};
    var scheduleCashe = [
        {
            post_id: 1,
            post_src: './test1.jpg',
            venues: [
                {
                    venue_id: 1012,
                    venue_name: 'London',
                    display_date: [
                        {
                            date_from: '12.06.2017',
                            date_to: '14.06.2017',
                            time_from: '10:50',
                            time_to: '13:25'
                        }
                    ]
                }
            ]    
        }
    ];

    //-------------- Models -----------
    
    var preloadPosters = function () {
        setTimeout(function() {
            getData(posterListUrl, function(data) {
                var d = JSON.parse(data);
                var posterHash = {};
                for(var i=0; i<d.length; i++) {
                    posterHash[d[i].id] = d[i].url;
                    posterList.push(d[i].id);
                }
                for(var j in posterHash) {
                    if( !posterCashe[j]) {
                        var img = new Image()
                        img.src = posterHash[j];
                        posterCashe[j] = img;
                    }
                }
            }); 
        });
    }

    //-------------- Views ------------
    
    var appView = function(element) {
        

        var topPane = document.createElement('div');
        topPane.appendChild(posterCmp.create());
        topPane.appendChild(calendarComponent());
        element.appendChild(topPane);
       
        var bottomPane = document.createElement('div');
        bottomPane.appendChild(timelineComponent());
        element.appendChild(bottomPane);
    };
    
    var calendarComponent = function() {
        var c = document.createElement('div');
        c.setAttribute('class','inline calendar');
        c.appendChild(document.createTextNode('calendar'));
        return c;
    }
    
    var timelineComponent = function() {
        var t = document.createElement('div');
        t.setAttribute('class','inline');
        t.appendChild(document.createTextNode('timeline'));
        return t;
    }
    
    var venueComponent = function() {
        var v = document.createElement('div');
        v.setAttribute('class','inline');
        v.appendChild(document.createTextNode('venue'));
        return v;
    }
    
    var posterCmp = {
        component : {},
        state : {
            poster_left_button : {
                element: undefined,
                value: undefined
            },
            poster_right_button : {
                element: undefined,
                value: undefined
            },
            poster_time_input : {
                element: undefined,
                value: undefined
            },
            poster_img : {
                element: undefined,
                value: undefined
            }
        },
        create: function () {
            var div = createComponents('div',5);
            var inp = createComponents('input',1);
            var label = createComponents('label',1);
            var control = createComponents('a',4);
            

            div[0].setAttribute('class', 'poster');
            div[1].setAttribute('class', 'poster-left');
            div[2].setAttribute('class', 'poster-center');
            div[3].setAttribute('class', 'poster-right');
            div[4].setAttribute('class', 'poster-time clearfix');
           
            control[0].setAttribute('class', 'poster-left-button');
            control[1].setAttribute('class', 'poster-right-button');
            control[2].setAttribute('class', 'poster-add-button');
            control[3].setAttribute('class', 'poster-remove-button');

            control[0].appendChild(document.createTextNode('<'));
            control[1].appendChild(document.createTextNode('>'));
            control[2].appendChild(document.createTextNode('+'));
            control[3].appendChild(document.createTextNode('x'));
           
            this.state.poster_right_button.element = control[1].style.display;

            div[1].appendChild(control[3]);
            div[1].appendChild(control[0]);
            div[3].appendChild(control[2]);
            div[3].appendChild(control[1]);
            

            inp[0].setAttribute('id', 'poster-time-input');
            inp[0].setAttribute('name', 'poster-time-input');
            inp[0].setAttribute('type', 'number');
            label[0].setAttribute('for','poster-time-input');
            label[0].appendChild(document.createTextNode('Duration: '));
            
            div[4].appendChild(label[0]);
            div[4].appendChild(inp[0]);

            div[0].appendChild(div[1]);
            div[0].appendChild(div[2]);
            div[0].appendChild(div[3]);
            div[0].appendChild(div[4]);

            this.state.poster_img.element = div[2];
            return div[0];
        },
        update: function (stateElement, value) {
            this.state[stateElement].element = value;
        }
    }
    //-------------- Controllers ------

    var posterCtr = {
        next: function() {

        },
        prev: function() {

        },
        add: function() {

        },
        remove: function() {
            
        },
        setDuration: function() {

        }
    }
    //---------- App init ---------------
    var app = document.getElementById('content');
    appView(app); 

//}())

/*javascript: 6*/
this.onload = function() {

    keyboardEvent();
    mouseEvent();

    showTime('calculator');


    setInterval(function() {
        showTime('calculator');
    }, 1000);
};



var date = document.getElementById('date'),
    clock = document.getElementById('time'),
    topCalculation = document.getElementById('top-calculation'),
    bottomCalculation = document.getElementById('bottom-calculation'),
    buttons = document.querySelectorAll('button'),
    number = '',
    calculation = '';

function mouseEvent() {
    buttons.forEach(function(button) {
        button.addEventListener('click', mouseClick);
    });
}


function keyboardEvent() {
    window.addEventListener('keydown', keyboardKeys);
}

function showTime(place) {
    var currentTime = new Date();

    if(place === 'history')
    {
        return function() {
            //something
        }.call(currentTime);
    }
    else if(place === 'calculator')
    {
        return function() {
            var re = /^(\w+)\s(\w+\s\d+)\s\d+$/;
            clock.innerHTML = '<p>' + this.toLocaleTimeString() + '</p>';
            date.innerHTML = '<p>' + this.toDateString().replace(re, '$1, $2') + '</p>';
        }.call(currentTime);
    }
}

var calculationsArray = [];


// Calculator Methods ...
var calculatorMethods = {

    clearAll: function() {

    },

    deleteOne: function() {
        
    },

    negate: function() {
        
    },

    sinus: function() {
       
    },

    cosinus: function() {
        
    },

    squareRoot: function() {
        
    },

    dot: function(value) {
       
    },

    brackets: function() {

        

    },

    basicOperations: function(value) {
       
    },

    numbers: function(value) {
        
    },
    // Equal operator
    equal: function(value) {
       
    }
};


function keyboardKeys(ev) {

    var button = document.querySelector('button[data-key="' + ev.key + '"]');
    var buttons = document.querySelectorAll('button');

    if (button !== null) {
        // Add css class with transition
        button.classList.add('keypress');
        button = button.innerHTML;
    }

    // Event listener for removing class with transition with 'transitionend' event
    buttons.forEach(function(button) {
        button.addEventListener('transitionend', function(event) {
            this.classList.remove('keypress');
        });
    });

    switch (button) {

        case 'AC':
            calculatorMethods.clearAll();
            break;

        case '<span class="ion-backspace"></span>':
            calculatorMethods.deleteOne();
            break;

        case '+':
            calculatorMethods.basicOperations('+');
            break;

        case '-':
            calculatorMethods.basicOperations('-');
            break;

        case '×':
            calculatorMethods.basicOperations('*');
            break;

        case '÷':
            calculatorMethods.basicOperations('/');
            break;

        case '=':
            calculatorMethods.equal('=');
            break;

        case 'sin':
            calculatorMethods.sinus();
            break;

        case 'cos':
            calculatorMethods.cosinus();
            break;

        case '=':
            calculatorMethods.equal('=');
            break;

        case '1':
            calculatorMethods.numbers(button);
            break;

        case '2':
            calculatorMethods.numbers(button);
            break;

        case '3':
            calculatorMethods.numbers(button);
            break;

        case '4':
            calculatorMethods.numbers(button);
            break;

        case '5':
            calculatorMethods.numbers(button);
            break;

        case '6':
            calculatorMethods.numbers(button);
            break;

        case '7':
            calculatorMethods.numbers(button);
            break;

        case '8':
            calculatorMethods.numbers(button);
            break;

        case '9':
            calculatorMethods.numbers(button);
            break;

    }

    topCalculation.innerHTML = topScreen;
    bottomCalculation.innerHTML = bottomScreen;
}

function mouseClick() {

    var value = this.innerHTML;

    switch (value) {

        case 'AC':
            calculatorMethods.clearAll();
            break;

        case '<span class="ion-backspace"></span>':
            calculatorMethods.deleteOne();
            break;

        case '+/-':
            calculatorMethods.negate();
            break;

        case 'sin':
            calculatorMethods.sinus();
            break;

        case 'cos':
            calculatorMethods.cosinus();
            break;

        case '√':
            calculatorMethods.squareRoot();
            break;

        case 'x<sup>n</sup>':
            calculatorMethods.basicOperations('^');
            break;

        case '(...)':
            calculatorMethods.brackets();
            break;

        case '=':
            calculatorMethods.equal('=');
            break;

        case '.':
            calculatorMethods.dot(value);
            break;

        case '+':
            calculatorMethods.basicOperations('+');
            break;

        case '-':
            calculatorMethods.basicOperations('-');
            break;

        case '÷':
            calculatorMethods.basicOperations('/');
            break;

        case '×':
            calculatorMethods.basicOperations('*');
            break;

        default:
            calculatorMethods.numbers(value);
    }

    topCalculation.innerHTML = topScreen;
    bottomCalculation.innerHTML = bottomScreen;
}
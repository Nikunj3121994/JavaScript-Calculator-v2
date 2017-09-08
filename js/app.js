/*esversion:6'*/
this.onload = function() {

    displayTime('calculator');
    events();

    setInterval(function() {
        displayTime('calculator');
    }, 1000);
};


function displayTime(where)
{
    var date = document.getElementById('date'),
        clock = document.getElementById('time'),
        currentTime = new Date();

    if(where === 'history')
    {
        return function() {
            var hour = this.getHours().toString(),
                minutes = this.getMinutes().toString();
           return hour + ':' + (minutes.length === 1 ? '0' + minutes : minutes);
        }.call(currentTime);
    }
    else if(where === 'calculator')
    {
        return function() {
            var re = /^(\w+)\s(\w+\s\d+)\s\d+$/;
            clock.innerHTML = '<p>' + this.toLocaleTimeString() + '</p>';
            date.innerHTML = '<p>' + this.toDateString().replace(re, '$1, $2') + '</p>';
        }.call(currentTime);
    }
}




// Object with data & methods for presenting calculation history
var historyData =
{
    history: [],
    addHistory: function(calculation, time)
    {
        this.history.push({
            calculation: calculation,
            time: time
        });
    },
    removeOne: function(position) {
        this.history.splice(position, 1);
    },
    removeAll: function() {
        this.history = [];
    },
    displayHistory: function()
    {
        var historyUl = document.querySelector('ul');
        historyUl.innerHTML = '';
        this.history.forEach(function(history, position)
        {
            var historyLi = document.createElement('li');
            historyLi.id = position;
            historyLi.textContent = history.time + ' | ' + history.calculation;
            historyUl.appendChild(historyLi);
        }, this);
    },
    deleteButton: function()
    {
        var button = document.createElement('button');
    }
};

function events()
{
    // Array of buttons
    var buttons = document.querySelectorAll('button');

    // IIFE for keyboard press
    (function (buttons)
    {
        document.addEventListener('keydown', function(e)
        {
            var button = document.querySelector('button[data-key="' + e.key + '"]'),
                value;
            if(button) {
                // Add class for transition effect
                button.classList.add('keypress');
                value = button.innerHTML;
                // Call buttonHandlers function to 'deal' with button value
                buttonValueHandler(value);
            }
            buttons.forEach(function(button)
            {
                // Remove keypress class after transition ends
                button.addEventListener('transitionend', function(e) {
                    this.classList.remove('keypress');
                });
            });
        });
    })(buttons);

    // IIFE for mouse click handling
    (function (buttons)
    {
        buttons.forEach(function(button)
        {
            button.addEventListener('click', function(e)
            {
                var value = this.innerHTML;
                // Call buttonHandlers function to 'deal' with button value
                buttonValueHandler(value);
            });
        });
    })(buttons);
}

// Global variables
var number = '',
    display = '',
    calculation = '',
    resetAll = false,
    resetNumber = false;
const DEFAULT_VALUE = '0';

// To set zero at starting point
document.getElementById('bottom-calculation').innerHTML = DEFAULT_VALUE;


function buttonValueHandler(value)
{
    var topScreen = document.getElementById('top-calculation'),
        bottomScreen = document.getElementById('bottom-calculation');

    function basicOperations(operator)
    {
        if(number !== '')
        {
            if(calculation.match(/([-+/*])$/) !== null)
            {
                display = display.replace(/\s[-+÷×]\s$/, ' ' + value + ' ');
                calculation = calculation.replace(/[-+/*]$/, operator);
            }
            else
            {
                display = display +  ' ' + value + ' ';
                calculation += operator;
            }
            topScreen.innerHTML = display;
            resetNumber = true;
        }
    }
    doMath('2+3+4-2-9*2');
    function doMath(string)
    {
        var operators =
            {
                '*': function(a, b) { return a * b; },
                '/': function(a, b) { return a / b; },
                '+': function(a, b) { return a + b; },
                '-': function(a, b) { return a - b; }
            },
            operatorRegex = /[-+/*]/g,
            numbersRegex = /\d+/g,
            operatorsArray = string.match(operatorRegex),
            numbersArray = string.match(numbersRegex);

            console.log(numbersArray, operatorsArray);

    }

    switch(value)
    {
        case 'CA':
            calculation = '';
            display = '';
            number = '';
            bottomScreen.innerHTML = DEFAULT_VALUE;
            topScreen.innerHTML = '';
            break;
        case '<span class="ion-backspace"></span>':

            break;
        case '+/-':

            break;
        case 'x<sup>y</sup>':
            
            break;
        case '√':

            break;
        case 'sin':
            
            break;
        case 'cos':
            
            break;
        case '(...)':

            break;
        case '.':

            break;
        case '÷':
            basicOperations('/');
            break;
        case '×':
            basicOperations('*');
            break;
        case '+':
            basicOperations('+');
            break;
        case '-':
            basicOperations('-');
            break;

        case '=':
            calculation = eval(calculation);

            break;
        default:
            if(resetAll)
            {
                calculation = '';
                display = '';
                number = '';
                operation = false;
            }
            if(resetNumber)
            {
                number = '';
                resetNumber = false;
            }
            calculation += value;
            display += value;
            number += value;
    }
    bottomScreen.innerHTML = number;
}





